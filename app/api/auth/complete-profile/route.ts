import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { email, role, name, mobile, domain, gender, dob } = await req.json();

    if (!email || !role || !name || !mobile || !domain || !gender || !dob) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Update user profile in MongoDB
    const result = await db.collection("users").updateOne(
      { email: email },
      {
        $set: {
          name,
          role,
          profile: {
            mobile,
            domain,
            gender,
            dateOfBirth: new Date(dob),
            updatedAt: new Date()
          },
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    if (result.acknowledged) {
      // Fetch the updated user data
      const updatedUser = await db.collection("users").findOne({ email: email });
      return NextResponse.json(updatedUser);
    } else {
      throw new Error("Failed to update user profile");
    }

  } catch (error) {
    console.error("Error saving profile:", error);
    return NextResponse.json(
      { message: "Failed to save profile" },
      { status: 500 }
    );
  }
} 