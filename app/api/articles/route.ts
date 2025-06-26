import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Article } from "@/models/Article";
import { Comment } from "@/models/Comment";
import mongoose from "mongoose";

// GET /api/articles - Get all articles or user-specific articles
export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const limit = searchParams.get("limit");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");

    let query: any = {};
    if (userId) {
      query.authorId = userId;
    }
    if (tag) {
      query.tags = { $in: [tag.toLowerCase()] };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    let articlesQuery = Article.find(query).sort({ createdAt: -1 });

    if (limit) {
      articlesQuery = articlesQuery.limit(parseInt(limit));
    }

    const articles = await articlesQuery.exec();

    const articlesWithCommentCounts = await Promise.all(
      articles.map(async (article) => {
        const commentCount = await Comment.countDocuments({
          articleId: article._id,
        });
        return {
          ...article.toObject(),
          comments: commentCount,
        };
      })
    );

    return NextResponse.json(articlesWithCommentCounts);
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

    const { title, content, tags } = await req.json();

    // Validate input
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Process tags
    let processedTags: string[] = [];
    if (tags && Array.isArray(tags)) {
      processedTags = tags
        .map((tag: string) => tag.trim().toLowerCase())
        .filter((tag: string) => tag.length > 0)
        .slice(0, 10); // Limit to 10 tags
    }

    await connectToDatabase();

    const article = await Article.create({
      title,
      content,
      author: session.user.name || "Anonymous",
      authorId: session.user.id,
      tags: processedTags,
      createdAt: new Date(),
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Failed to create article:", error);

    // Handle mongoose validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
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
