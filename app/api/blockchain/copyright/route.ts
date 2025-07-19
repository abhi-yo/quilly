import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { CopyrightRecord } from "@/models/CopyrightRecord";
import { Article } from "@/models/Article";
import crypto from "crypto";
import { ethers } from "ethers";

const POLYGON_RPC_URL =
  process.env.POLYGON_RPC_URL || "https://rpc-amoy.polygon.technology/";
const COPYRIGHT_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_COPYRIGHT_PROTECTION_ADDRESS;

function generateContentHash(content: string): string {
  return crypto.createHash("sha256").update(content.trim()).digest("hex");
}

async function verifyTransactionOnBlockchain(txHash: string): Promise<boolean> {
  if (!COPYRIGHT_CONTRACT_ADDRESS) {
    console.warn(
      "Copyright contract not deployed, skipping blockchain verification"
    );
    return true;
  }

  try {
    const provider = new ethers.JsonRpcProvider(POLYGON_RPC_URL);
    const receipt = await provider.getTransactionReceipt(txHash);

    if (!receipt) {
      return false;
    }

    return (
      receipt.status === 1 &&
      receipt.to?.toLowerCase() === COPYRIGHT_CONTRACT_ADDRESS.toLowerCase()
    );
  } catch (error) {
    console.error("Blockchain verification failed:", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();
    const { title, content, action, contentHash, txHash, articleId } = body;

    switch (action) {
      case "generate-hash": {
        if (!title || !content) {
          return NextResponse.json(
            {
              error: "Title and content are required",
            },
            { status: 400 }
          );
        }

        const hash = generateContentHash(content);

        return NextResponse.json({
          contentHash: hash,
          timestamp: Date.now(),
        });
      }

      case "register": {
        if (!contentHash || !txHash || !title) {
          return NextResponse.json(
            {
              error: "Missing required fields: contentHash, txHash, title",
            },
            { status: 400 }
          );
        }

        // Validate transaction hash format
        if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
          return NextResponse.json(
            {
              error: "Invalid transaction hash format",
            },
            { status: 400 }
          );
        }

        // Validate articleId if provided
        if (articleId && !/^[0-9a-fA-F]{24}$/.test(articleId)) {
          return NextResponse.json(
            {
              error: "Invalid article ID format",
            },
            { status: 400 }
          );
        }

        const existingRecord = await CopyrightRecord.findOne({
          $or: [{ contentHash }, { txHash }],
        });

        if (existingRecord) {
          return NextResponse.json(
            {
              error: "Content or transaction already registered",
            },
            { status: 409 }
          );
        }

        const isValidTx = await verifyTransactionOnBlockchain(txHash);

        const record = new CopyrightRecord({
          authorId: session.user.id,
          articleId,
          title,
          contentHash,
          txHash,
          registrationFee: 0.001,
          status: isValidTx ? "confirmed" : "pending",
          blockchain: "polygon-amoy",
          confirmedAt: isValidTx ? new Date() : undefined,
        });

        await record.save();

        if (articleId) {
          try {
            await Article.findByIdAndUpdate(articleId, {
              $set: {
                copyrightProtected: true,
                copyrightTxHash: txHash,
              },
            });
          } catch (articleError) {
            console.error("Error updating article:", articleError);
            // Continue even if article update fails
          }
        }

        return NextResponse.json({
          success: true,
          message: "Copyright registration recorded successfully",
          recordId: record._id,
          status: record.status,
          txHash,
        });
      }

      case "verify": {
        if (!contentHash) {
          return NextResponse.json(
            {
              error: "Content hash is required",
            },
            { status: 400 }
          );
        }

        const record = await CopyrightRecord.findOne({
          contentHash,
          status: "confirmed",
        });

        if (record) {
          return NextResponse.json({
            exists: true,
            author: record.authorId,
            timestamp: Math.floor(
              record.confirmedAt?.getTime() || record.createdAt.getTime() / 1000
            ),
            title: record.title,
            txHash: record.txHash,
            blockchain: record.blockchain,
          });
        }

        return NextResponse.json({
          exists: false,
          author: null,
          timestamp: 0,
          title: "",
          txHash: "",
          blockchain: "",
        });
      }

      case "get-user-records": {
        const records = await CopyrightRecord.find({
          authorId: session.user.id,
        })
          .sort({ createdAt: -1 })
          .limit(50);

        return NextResponse.json({ records });
      }

      case "check-plagiarism": {
        if (!contentHash) {
          return NextResponse.json(
            {
              error: "Content hash is required",
            },
            { status: 400 }
          );
        }

        const existingRecord = await CopyrightRecord.findOne({
          contentHash,
          status: "confirmed",
          authorId: { $ne: session.user.id },
        });

        if (existingRecord) {
          return NextResponse.json({
            isPlagiarism: true,
            originalAuthor: existingRecord.authorId,
            originalTitle: existingRecord.title,
            registrationDate:
              existingRecord.confirmedAt || existingRecord.createdAt,
            txHash: existingRecord.txHash,
          });
        }

        return NextResponse.json({
          isPlagiarism: false,
        });
      }

      default:
        return NextResponse.json(
          {
            error:
              "Invalid action. Supported actions: generate-hash, register, verify, get-user-records, check-plagiarism",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Copyright API error:", error);
    return NextResponse.json(
      {
        error: "Failed to process copyright request",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get("articleId");
    const contentHash = searchParams.get("contentHash");

    if (articleId) {
      // Validate articleId format
      if (!/^[0-9a-fA-F]{24}$/.test(articleId)) {
        return NextResponse.json(
          { error: "Invalid article ID format" },
          { status: 400 }
        );
      }

      const record = await CopyrightRecord.findOne({
        articleId,
        authorId: session.user.id,
      });

      return NextResponse.json({ record });
    }

    if (contentHash) {
      const record = await CopyrightRecord.findOne({
        contentHash,
        status: "confirmed",
      });

      return NextResponse.json({
        exists: !!record,
        record: record || null,
      });
    }

    const records = await CopyrightRecord.find({
      authorId: session.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({ records });
  } catch (error) {
    console.error("Copyright GET API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch copyright records",
      },
      { status: 500 }
    );
  }
}
