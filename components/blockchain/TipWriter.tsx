"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Send, Loader2 } from 'lucide-react';
import { web3Service } from '@/lib/web3';
import { useToast } from '@/hooks/use-toast';

interface TipWriterProps {
  writerAddress?: string;
  articleId: string;
  authorName: string;
  onTipSent?: (amount: string, txHash: string) => void;
}

export default function TipWriter({ 
  writerAddress = '0x1234567890123456789012345678901234567890', 
  articleId, 
  authorName,
  onTipSent 
}: TipWriterProps) {
  const [tipAmount, setTipAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const predefinedAmounts = ['1', '5', '10', '25'];

  const handleTip = async () => {
    if (!tipAmount || parseFloat(tipAmount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid tip amount',
        variant: 'destructive'
      });
      return;
    }

    if (!web3Service.isConnected()) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet first',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const txHash = await web3Service.tipWriter(writerAddress, tipAmount, articleId);
      
      await fetch('/api/blockchain/tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          writerAddress,
          amount: tipAmount,
          articleId,
          txHash
        })
      });

      toast({
        title: 'Tip Sent!',
        description: `Successfully tipped ${tipAmount} QUILL to ${authorName}`,
      });

      onTipSent?.(tipAmount, txHash);
      setTipAmount('');
      
    } catch (error: any) {
      toast({
        title: 'Tip Failed',
        description: error.message || 'Failed to send tip',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Coins className="w-5 h-5 text-yellow-500" />
          Tip {authorName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-400 text-sm">
          Show your appreciation by sending QUILL tokens to the author.
        </p>

        <div className="flex gap-2 flex-wrap">
          {predefinedAmounts.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              size="sm"
              onClick={() => setTipAmount(amount)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              {amount} QUILL
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Custom amount"
            value={tipAmount}
            onChange={(e) => setTipAmount(e.target.value)}
            type="number"
            min="0"
            step="0.1"
            className="bg-gray-800 border-gray-700 text-white"
          />
          <Button
            onClick={handleTip}
            disabled={isLoading || !tipAmount}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Tip
              </>
            )}
          </Button>
        </div>

        <div className="text-xs text-gray-500">
          Writer Address: {writerAddress.slice(0, 6)}...{writerAddress.slice(-4)}
        </div>
      </CardContent>
    </Card>
  );
} 