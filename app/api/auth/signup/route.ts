import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hash } from "bcryptjs";
import crypto from "crypto";
import { headers } from "next/headers";
import { EmailService } from "@/lib/email";

const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const MAX_SIGNUP_ATTEMPTS = 5;
const requestCounts = new Map<string, { count: number; timestamp: number }>();

function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  if (/(.)\1{2,}/.test(password)) {
    errors.push("Password cannot contain repeating characters");
  }
  
  return { isValid: errors.length === 0, errors };
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>'"]/g, '');
}

function generateSecureOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userRequests = requestCounts.get(ip);
  
  if (!userRequests || now - userRequests.timestamp > RATE_LIMIT_WINDOW) {
    requestCounts.set(ip, { count: 1, timestamp: now });
    return true;
  }
  
  if (userRequests.count >= MAX_SIGNUP_ATTEMPTS) {
    return false;
  }
  
  userRequests.count++;
  return true;
}

export async function POST(req: Request) {
  try {
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { message: "Too many signup attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password, name, role } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "Please provide email, password, and name" },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          message: "Password does not meet security requirements",
          errors: passwordValidation.errors
        },
        { status: 400 }
      );
    }

    const sanitizedEmail = sanitizeInput(email.toLowerCase());
    const sanitizedName = sanitizeInput(name);
    const sanitizedRole = sanitizeInput(role || "reader");

    if (sanitizedName.length < 2 || sanitizedName.length > 50) {
      return NextResponse.json(
        { message: "Name must be between 2 and 50 characters" },
        { status: 400 }
      );
    }

    if (!["reader", "writer"].includes(sanitizedRole)) {
      return NextResponse.json(
        { message: "Invalid role specified" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const existingUser = await db.collection("users").findOne({ 
      email: sanitizedEmail 
    });
    
    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 14);

    const user = {
      email: sanitizedEmail,
      password: hashedPassword,
      name: sanitizedName,
      role: sanitizedRole,
      emailVerified: false,
      createdAt: new Date(),
      lastLoginAt: null,
      loginAttempts: 0,
      lockedUntil: null,
      ipAddress: ip,
    };

    const result = await db.collection("users").insertOne(user);

    const otp = generateSecureOTP();
    const otpHash = await hash(otp, 12);
    
    await db.collection("otps").insertOne({
      userId: result.insertedId,
      otp: otpHash,
      attempts: 0,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      ipAddress: ip,
    });

    await EmailService.sendOTP(sanitizedEmail, otp, sanitizedName);

    return NextResponse.json({
      success: true,
      message: "Account created successfully. Please verify your email with the OTP sent.",
      userId: result.insertedId.toString(),
    });

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "An error occurred during signup. Please try again." },
      { status: 500 }
    );
  }
} 