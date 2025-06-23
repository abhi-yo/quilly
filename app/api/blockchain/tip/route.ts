import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { writerAddress, amount, articleId, txHash } = await request.json();

    if (!writerAddress || !amount || !articleId || !txHash) {
      return NextResponse.json({ 
        error: 'Missing required fields: writerAddress, amount, articleId, txHash' 
      }, { status: 400 });
    }

    const tipRecord = {
      from: session.user.id,
      fromAddress: session.user.walletAddress,
      toAddress: writerAddress,
      amount: parseFloat(amount),
      articleId,
      txHash,
      timestamp: new Date(),
      status: 'pending'
    };

    console.log('Tip recorded:', tipRecord);

    return NextResponse.json({ 
      success: true, 
      message: 'Tip recorded successfully',
      tipId: tipRecord.txHash
    });

  } catch (error) {
    console.error('Error processing tip:', error);
    return NextResponse.json({ 
      error: 'Failed to process tip' 
    }, { status: 500 });
  }
} 