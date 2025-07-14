import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Article } from "@/models/Article";
import { Comment } from "@/models/Comment";

export const dynamic = "force-dynamic";

// Helper function to format date as 'YYYY-MM-DD'
const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

// Helper function to get day name abbreviation
const getDayName = (date: Date): string => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
};

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const articles = await Article.find(
      { authorId: session.user.id },
      "content createdAt views reads"
    ).lean();
    const articleCount = articles.length;

    let totalWordCount = 0;
    let totalViews = 0;
    let totalReads = 0;

    articles.forEach((article) => {
      if (article.content && typeof article.content === "string") {
        const words = article.content.trim().split(/\s+/);
        totalWordCount +=
          words.length > 0 && words[0] !== "" ? words.length : 0;
      }
      totalViews += article.views || 0;
      totalReads += article.reads || 0;
    });

    const trendsData: { [key: string]: { name: string; value: number } } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = formatDate(date);
      trendsData[dateString] = { name: getDayName(date), value: 0 };
    }

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    articles.forEach((article) => {
      if (article.createdAt) {
        const createdAtDate = new Date(article.createdAt);
        createdAtDate.setHours(0, 0, 0, 0);

        if (createdAtDate >= sevenDaysAgo && createdAtDate <= today) {
          const dateString = formatDate(createdAtDate);
          if (trendsData[dateString]) {
            trendsData[dateString].value += 1;
          }
        }
      }
    });

    const trendsArray = Object.keys(trendsData)
      .sort()
      .map((key) => trendsData[key]);

    const userArticleIds = articles.map((article) => article._id);

    const totalComments = await Comment.countDocuments({
      articleId: { $in: userArticleIds },
    });

    const averageComments = articleCount > 0 ? totalComments / articleCount : 0;

    const ratingAggregation = await Comment.aggregate([
      { $match: { articleId: { $in: userArticleIds } } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);

    const averageRating =
      ratingAggregation.length > 0 && ratingAggregation[0].avgRating
        ? ratingAggregation[0].avgRating
        : 0;

    const engagement = totalViews > 0 ? (totalReads / totalViews) * 100 : 0;

    const commentsPerArticle = averageComments;

    const totalPaymentsValue = 0;

    return NextResponse.json({
      articles: { value: articleCount },
      words: { value: totalWordCount },
      views: { value: totalViews },
      reads: { value: totalReads },
      engagement: { value: Math.round(engagement * 100) / 100 },
      comments: { value: totalComments },
      rating: { value: Math.round(averageRating * 100) / 100 },
      commentsPerArticle: { value: Math.round(commentsPerArticle * 100) / 100 },
      payments: { value: Math.round(totalPaymentsValue * 100) / 100 },
      trends: trendsArray,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
