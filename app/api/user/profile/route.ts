import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import mongoose from 'mongoose';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Fetch user profile from MongoDB
    const userProfile = await db.collection("users").findOne(
      { email: session.user.email },
      {
        projection: {
          _id: 0,
          name: 1,
          email: 1,
          role: 1,
          profile: 1
        }
      }
    );

    if (!userProfile) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { message: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name } = await req.json();
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // First check if user exists
    const existingUser = await db.collection("users").findOne({ email: session.user.email });
    if (!existingUser) {
      console.error("User not found in database:", session.user.email);
      return new NextResponse("User not found", { status: 404 });
    }

    console.log("Updating user profile:", { email: session.user.email, name });
    
    // Update user in MongoDB using the correct options format
    const result = await db.collection("users").findOneAndUpdate(
      { email: session.user.email },
      { $set: { name } },
      { returnDocument: "after" }
    );

    console.log("MongoDB update result:", result);

    if (!result?.value) {
      // Try a direct update and fetch approach if findOneAndUpdate fails
      const updateResult = await db.collection("users").updateOne(
        { email: session.user.email },
        { $set: { name } }
      );

      if (updateResult.matchedCount === 0) {
        console.error("Update failed - no document matched");
        return new NextResponse("Failed to update profile - user not found", { status: 404 });
      }

      // Fetch the updated document
      const updatedUser = await db.collection("users").findOne({ email: session.user.email });
      if (!updatedUser) {
        console.error("Failed to fetch updated user");
        return new NextResponse("Failed to verify profile update", { status: 500 });
      }

      // Return the updated user data
      return NextResponse.json({
        message: "Profile updated successfully",
        user: {
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role
        }
      });
    }

    const updatedUser = result.value;
    console.log("Profile updated successfully:", updatedUser);

    // Return the updated user data
    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error", 
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name } = body;

    if (typeof name !== 'string' || name.trim().length < 1) {
      return NextResponse.json(
        { error: "Name is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const userId = new mongoose.Types.ObjectId(session.user.id);

    const result = await User.updateOne(
      { _id: userId },
      { $set: { name: name.trim() } }
    );

    if (result.matchedCount === 0) {
       return NextResponse.json(
         { error: "User not found" },
         { status: 404 }
       );
    }
    
    if (result.modifiedCount === 0 && result.matchedCount === 1) {
      // No actual change was made (e.g., submitted the same name)
      // Still return success, maybe fetch user to return current data
       const updatedUser = await User.findById(userId).select('name email role'); // Select fields to return
       return NextResponse.json({ message: "Name already up to date", user: updatedUser });
    }

    // Fetch the updated user data to return (optional, but good practice)
    const updatedUser = await User.findById(userId).select('name email role');

    return NextResponse.json({ message: "Name updated successfully", user: updatedUser });

  } catch (error) {
    console.error("Failed to update name:", error);
    if (error instanceof mongoose.Error.CastError) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update name" },
      { status: 500 }
    );
  }
} 