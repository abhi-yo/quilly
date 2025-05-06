import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Article } from "@/models/Article";
import mongoose from "mongoose";

// GET /api/articles - Get all articles
export async function GET() {
  try {
    await connectToDatabase();
    const articles = await Article.find().sort({ createdAt: -1 });
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

// POST /api/articles - Create a new article
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and has writer role
    if (!session?.user || session.user.role !== "writer") {
      return NextResponse.json(
        { error: "Unauthorized: Only writers can create articles" },
        { status: 403 }
      );
    }

    const { title, content } = await req.json();

    // Validate input
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    const article = await Article.create({
      title,
      content,
      author: session.user.name || "Anonymous",
      authorId: session.user.id,
      createdAt: new Date(),
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Failed to create article:", error);
    
    // Handle mongoose validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: validationErrors.join(", ") },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
} 