import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(userId).select("name bio email");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Delete user's articles first
    await db.collection("articles").deleteMany({
      authorEmail: session.user.email,
    });

    // Delete the user account
    const result = await db.collection("users").deleteOne({
      email: session.user.email,
    });

    if (result.deletedCount === 0) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
