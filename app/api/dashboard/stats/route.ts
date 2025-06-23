import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path if needed
import { connectToDatabase } from "@/lib/db";
import { Article } from "@/models/Article";
import { Comment } from "@/models/Comment"; // Import Comment model
import { Payment } from "@/models/Payment"; // Import Payment model
import mongoose from 'mongoose'; // Import mongoose for ObjectId check

// Helper function to format date as 'YYYY-MM-DD'
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Helper function to get day name abbreviation
const getDayName = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., 'Mon', 'Tue'
};

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Fetch user-specific articles
    const articles = await Article.find({ authorId: session.user.id }, 'content createdAt').lean();
    const articleCount = articles.length;

    // Calculate Word Count
    let totalWordCount = 0;
    articles.forEach(article => {
      if (article.content && typeof article.content === 'string') {
        const words = article.content.trim().split(/\s+/);
        totalWordCount += words.length > 0 && words[0] !== '' ? words.length : 0;
      }
    });

    // Calculate Article Trends (Last 7 Days)
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

    articles.forEach(article => {
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

    const trendsArray = Object.keys(trendsData).sort().map(key => trendsData[key]);

    // Calculate Engagement (Average Comments for user's articles)
    let averageComments = 0;
    let totalComments = 0;
    if (articleCount > 0) {
      // Get user's article IDs
      const userArticleIds = articles.map(article => article._id);
      totalComments = await Comment.countDocuments({ articleId: { $in: userArticleIds } });
      averageComments = totalComments / articleCount;
    }

    // Calculate Overall Rating (Average Comment Rating for user's articles)
    let averageRating = 0;
    if (articleCount > 0) {
      const userArticleIds = articles.map(article => article._id);
      const ratingAggregation = await Comment.aggregate([
        { $match: { articleId: { $in: userArticleIds } } },
        { $group: { _id: null, avgRating: { $avg: "$rating" } } }
      ]);
      if (ratingAggregation.length > 0 && ratingAggregation[0].avgRating) {
        averageRating = ratingAggregation[0].avgRating;
      }
    }

    // Calculate Total Payments Received
    let totalPaymentsValue = 0;
    // Use aggregation pipeline to sum amounts of paid transactions
    const paymentAggregation = await Payment.aggregate([
      { $match: { status: 'paid' /* , userId: userId */ } }, // Add userId match if needed
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
    ]);
    if (paymentAggregation.length > 0) {
      totalPaymentsValue = paymentAggregation[0].totalAmount;
    }

    // Return Combined Stats
    return NextResponse.json({ 
      totalArticles: articleCount,
      totalViews: articleCount * 150, // Estimated views per article
      totalReads: Math.floor(articleCount * 120), // Estimated reads (80% of views)
      engagementRate: Math.round((totalComments / Math.max(articleCount, 1)) * 100),
      words: { value: totalWordCount },
      trends: trendsArray,
      engagement: { value: averageComments },
      overallRating: { value: averageRating },
      performance: { feedbacks: totalComments },
      payments: { value: totalPaymentsValue / 100 } // Convert paisa to rupees
    });

  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
} 