import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcryptjs";
import { headers } from "next/headers";
import { EmailService } from "@/lib/email";

const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const MAX_VERIFY_ATTEMPTS = 3;
const MAX_OTP_ATTEMPTS = 3;
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
  
  if (userRequests.count >= MAX_VERIFY_ATTEMPTS) {
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
        { error: "Too many verification attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, otp } = body;
    
    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: "Invalid OTP format" },
        { status: 400 }
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
        { error: "Invalid verification request" },
        { status: 400 }
      );
    }
    
    const otpRecord = await db.collection("otps").findOne({
      userId: user._id,
      expiresAt: { $gt: new Date() }
    });
    
    if (!otpRecord) {
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
      await db.collection("otps").deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { error: "Too many failed attempts. Please request a new OTP." },
        { status: 400 }
      );
    }

    const isOtpValid = await compare(otp, otpRecord.otp);
    
    if (!isOtpValid) {
      await db.collection("otps").updateOne(
        { _id: otpRecord._id },
        { $inc: { attempts: 1 } }
      );
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }
    
    await db.collection("users").updateOne(
      { _id: user._id },
      { 
        $set: { 
          emailVerified: new Date(),
          status: "active",
          lastVerifiedAt: new Date()
        },
        $unset: { loginAttempts: 1, lockedUntil: 1 }
      }
    );
    
    await db.collection("otps").deleteMany({ userId: user._id });
    
    await EmailService.sendWelcomeEmail(user.email, user.name);
    
    return NextResponse.json({ 
      success: true,
      message: "Email verified successfully"
    });
    
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}