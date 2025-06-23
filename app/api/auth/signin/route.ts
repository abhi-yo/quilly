import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcryptjs";
import { headers } from "next/headers";
import { EmailService } from "@/lib/email";

const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const ACCOUNT_LOCK_DURATION = 30 * 60 * 1000;
const requestCounts = new Map<string, { count: number; timestamp: number }>();

function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>'"]/g, '');
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userRequests = requestCounts.get(ip);
  
  if (!userRequests || now - userRequests.timestamp > RATE_LIMIT_WINDOW) {
    requestCounts.set(ip, { count: 1, timestamp: now });
    return true;
  }
  
  if (userRequests.count >= MAX_LOGIN_ATTEMPTS) {
    return false;
  }
  
  userRequests.count++;
  return true;
}

function isAccountLocked(user: any): boolean {
  return user.lockedUntil && user.lockedUntil > new Date();
}

async function incrementLoginAttempts(db: any, userId: any): Promise<void> {
  const update: any = { $inc: { loginAttempts: 1 } };
  
  const user = await db.collection("users").findOne({ _id: userId });
  const attempts = (user?.loginAttempts || 0) + 1;
  
  if (attempts >= MAX_LOGIN_ATTEMPTS) {
    update.$set = {
      lockedUntil: new Date(Date.now() + ACCOUNT_LOCK_DURATION)
    };
  }
  
  await db.collection("users").updateOne({ _id: userId }, update);
}

async function resetLoginAttempts(db: any, userId: any): Promise<void> {
  await db.collection("users").updateOne(
    { _id: userId },
    {
      $unset: { loginAttempts: 1, lockedUntil: 1 },
      $set: { lastLoginAt: new Date() }
    }
  );
}

export async function POST(req: Request) {
  try {
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please provide both email and password" },
        { status: 400 }
      );
    }

    if (password.length > 128) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const sanitizedEmail = sanitizeInput(email.toLowerCase());

    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection("users").findOne({ 
      email: sanitizedEmail 
    });

    if (!user) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (isAccountLocked(user)) {
      return NextResponse.json(
        { 
          error: "Account temporarily locked due to multiple failed login attempts. Please try again later.",
          lockedUntil: user.lockedUntil
        },
        { status: 423 }
      );
    }

    const isPasswordValid = await compare(password, user.password);
    
    if (!isPasswordValid) {
      await incrementLoginAttempts(db, user._id);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    await resetLoginAttempts(db, user._id);

    if (!user.emailVerified) {
      const crypto = require('crypto');
      const otp = crypto.randomInt(100000, 999999).toString();
      const { hash } = require('bcryptjs');
      const otpHash = await hash(otp, 12);
      
      await db.collection("otps").deleteMany({ userId: user._id });
      
      await db.collection("otps").insertOne({
        userId: user._id,
        otp: otpHash,
        attempts: 0,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        ipAddress: ip,
      });

      await EmailService.sendOTP(user.email, otp, user.name);

      return NextResponse.json({
        requiresVerification: true,
        message: "Please verify your email with the OTP sent."
      });
    }

    return NextResponse.json({ 
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Sign in error:", error);
    return NextResponse.json(
      { error: "Authentication failed. Please try again." },
      { status: 500 }
    );
  }
}