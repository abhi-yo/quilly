import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();
    
    const client = await clientPromise;
    const db = client.db();
    
    // Find the user by email
    const user = await db.collection("users").findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Find and validate OTP
    const otpRecord = await db.collection("otps").findOne({
      userId: user._id,
      otp,
      expiresAt: { $gt: new Date() }
    });
    
    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }
    
    // Mark user as verified
    await db.collection("users").updateOne(
      { _id: user._id },
      { 
        $set: { 
          emailVerified: new Date(),
          status: "active"
        } 
      }
    );
    
    // Delete used OTP
    await db.collection("otps").deleteOne({ _id: otpRecord._id });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}