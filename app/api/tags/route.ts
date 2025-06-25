import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Article } from "@/models/Article";

export async function GET() {
  try {
    await connectToDatabase();

    const tagAggregation = await Article.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
      { $project: { tag: "$_id", count: 1, _id: 0 } },
    ]);

    return NextResponse.json(tagAggregation);
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}
