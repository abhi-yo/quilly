import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

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
      authorEmail: session.user.email
    });

    // Delete the user account
    const result = await db.collection("users").deleteOne({
      email: session.user.email
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