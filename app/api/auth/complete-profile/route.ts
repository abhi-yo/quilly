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

    const body = await req.json();
    const { email, role, name, mobile, domain, gender, dob } = body;

    if (!email || !role) {
      return NextResponse.json(
        { message: "Email and role are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    if (name && mobile && domain && gender && dob) {
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
        const updatedUser = await db.collection("users").findOne({ email: email });
        return NextResponse.json(updatedUser);
      } else {
        throw new Error("Failed to update user profile");
      }
    } else {
      const result = await db.collection("users").updateOne(
        { email: email },
        {
          $set: {
            role,
            needsRoleSelection: false,
            updatedAt: new Date()
          }
        }
      );

      if (result.acknowledged) {
        const updatedUser = await db.collection("users").findOne({ email: email });
        return NextResponse.json({ success: true, user: updatedUser });
      } else {
        throw new Error("Failed to update user role");
      }
    }

  } catch (error) {
    console.error("Error saving profile:", error);
    return NextResponse.json(
      { message: "Failed to save profile" },
      { status: 500 }
    );
  }
} 