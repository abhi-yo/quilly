import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Article } from "@/models/Article";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const article = await Article.findByIdAndUpdate(
      params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Failed to fetch article:", error);
    if (error instanceof Error && error.name === "CastError") {
      return NextResponse.json(
        { error: "Invalid article ID format" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = await req.json();

    if (action !== "track_read") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await connectToDatabase();

    const article = await Article.findByIdAndUpdate(
      params.id,
      { $inc: { reads: 1 } },
      { new: true }
    );

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Read tracked successfully" });
  } catch (error) {
    console.error("Failed to track read:", error);
    if (error instanceof Error && error.name === "CastError") {
      return NextResponse.json(
        { error: "Invalid article ID format" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to track read" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Find the article first to check ownership
    const article = await Article.findById(params.id);

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Check if the user is the author or an admin
    if (article.authorId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json(
        { error: "You can only delete your own articles" },
        { status: 403 }
      );
    }

    // Delete the article
    await Article.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Failed to delete article:", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
