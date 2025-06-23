import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, action } = await request.json();

    if (action === 'generate-hash') {
      const contentHash = crypto.createHash('sha256')
        .update(content + title + session.user.id)
        .digest('hex');
      
      return NextResponse.json({ 
        contentHash,
        timestamp: Date.now()
      });
    }

    if (action === 'register') {
      const { contentHash, txHash } = await request.json();
      
      if (!contentHash || !txHash) {
        return NextResponse.json({ 
          error: 'Missing contentHash or txHash' 
        }, { status: 400 });
      }

      const copyrightRecord = {
        authorId: session.user.id,
        title,
        contentHash,
        txHash,
        timestamp: new Date(),
        status: 'registered'
      };

      console.log('Copyright registered:', copyrightRecord);

      return NextResponse.json({ 
        success: true, 
        message: 'Copyright registered successfully',
        recordId: txHash
      });
    }

    if (action === 'verify') {
      const { contentHash } = await request.json();
      
      if (!contentHash) {
        return NextResponse.json({ 
          error: 'Missing contentHash' 
        }, { status: 400 });
      }

      const mockVerification = {
        exists: true,
        author: session.user.id,
        timestamp: Date.now(),
        title: title || 'Unknown Title'
      };

      return NextResponse.json(mockVerification);
    }

    return NextResponse.json({ 
      error: 'Invalid action' 
    }, { status: 400 });

  } catch (error) {
    console.error('Error processing copyright action:', error);
    return NextResponse.json({ 
      error: 'Failed to process copyright action' 
    }, { status: 500 });
  }
} 