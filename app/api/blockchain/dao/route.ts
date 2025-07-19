import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action } = await request.json();

    if (action === "create-proposal") {
      const { title, description, category, txHash } = await request.json();

      if (!title || !description || !category) {
        return NextResponse.json(
          {
            error: "Missing required fields: title, description, category",
          },
          { status: 400 }
        );
      }

      const proposal = {
        proposer: session.user.id,
        title,
        description,
        category,
        txHash,
        status: "active",
        createdAt: new Date(),
      };

      return NextResponse.json({
        success: true,
        message: "Proposal created successfully",
        proposalId: txHash,
      });
    }

    if (action === "vote") {
      const { proposalId, support, txHash } = await request.json();

      if (!proposalId || support === undefined || !txHash) {
        return NextResponse.json(
          {
            error: "Missing required fields: proposalId, support, txHash",
          },
          { status: 400 }
        );
      }

      const vote = {
        voter: session.user.id,
        proposalId,
        support,
        txHash,
        timestamp: new Date(),
      };

      return NextResponse.json({
        success: true,
        message: "Vote cast successfully",
        voteId: txHash,
      });
    }

    return NextResponse.json(
      {
        error: "Invalid action",
      },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to process DAO action",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const mockProposals = [
      {
        id: 1,
        proposer: "user1",
        title: "Implement Dark Mode Toggle",
        description: "Add a dark mode toggle to improve user experience",
        category: "FEATURE_REQUEST",
        forVotes: "1250",
        againstVotes: "350",
        startTime: Date.now() - 86400000,
        endTime: Date.now() + 518400000,
        executed: false,
      },
      {
        id: 2,
        proposer: "user2",
        title: "Reduce Tipping Fees",
        description: "Lower the gas fees for tipping transactions",
        category: "TOKEN_ECONOMICS",
        forVotes: "2100",
        againstVotes: "890",
        startTime: Date.now() - 172800000,
        endTime: Date.now() + 432000000,
        executed: false,
      },
    ];

    return NextResponse.json({ proposals: mockProposals });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch proposals",
      },
      { status: 500 }
    );
  }
}
