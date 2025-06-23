"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, RefreshCw, Gift } from 'lucide-react';
import { web3Service } from '@/lib/web3';
import { useToast } from '@/hooks/use-toast';

interface WalletConnectProps {
  onConnect?: (address: string) => void;
}

export default function WalletConnect({ onConnect }: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      if (typeof window !== 'undefined' && web3Service.isConnected()) {
        const currentAccount = await web3Service.getCurrentAccount();
        if (currentAccount) {
          setAddress(currentAccount);
          setIsConnected(true);
          await updateBalance(currentAccount);
          onConnect?.(currentAccount);
        }
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const updateBalance = async (walletAddress: string) => {
    try {
      const tokenBalance = await web3Service.getTokenBalance(walletAddress);
      setBalance(tokenBalance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const walletAddress = await web3Service.connectWallet();
      if (walletAddress) {
        setAddress(walletAddress);
        setIsConnected(true);
        await updateBalance(walletAddress);
        onConnect?.(walletAddress);
        
        toast({
          title: 'Wallet Connected',
          description: `Connected to ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
        });
      }
    } catch (error: any) {
      toast({
        title: 'Connection Failed',
        description: error.message || 'Failed to connect wallet',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const claimFaucet = async () => {
    if (!isConnected) return;
    
    setIsClaiming(true);
    try {
      const txHash = await web3Service.claimFaucet();
      
      // In demo mode, immediately update balance
      setBalance("100.00");
      
      toast({
        title: 'Tokens Claimed!',
        description: `Demo transaction completed: ${txHash.slice(0, 10)}...`
      });
      
      setTimeout(() => updateBalance(address), 3000);
    } catch (error: any) {
      toast({
        title: 'Claim Failed',
        description: error.message || 'Failed to claim tokens',
        variant: 'destructive'
      });
    } finally {
      setIsClaiming(false);
    }
  };

  const formatAddress = (addr: string) => 
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  if (!isConnected) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Connect Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4 text-sm">
            Connect your wallet to register and protect your content on the blockchain with immutable ownership records.
          </p>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
            <p className="text-yellow-300 text-xs">
              <strong>Demo Mode:</strong> Smart contracts are not deployed yet. All transactions are simulated for demonstration purposes.
            </p>
          </div>
          <Button 
            onClick={connectWallet}
            disabled={isLoading}
            className="w-full bg-white text-black hover:bg-gray-100"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Connect MetaMask
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Connected
          </div>
          <Badge variant="secondary" className="bg-green-500/20 text-green-300">
            Connected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-gray-400 text-sm">Address</p>
          <p className="text-white font-mono text-sm">{formatAddress(address)}</p>
        </div>
        
        <div>
          <p className="text-gray-400 text-sm">QUILL Balance</p>
          <p className="text-white font-bold text-lg">{parseFloat(balance).toFixed(2)} QUILL</p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={claimFaucet}
            disabled={isClaiming}
            variant="outline"
            size="sm"
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            {isClaiming ? (
              <>
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                Claiming...
              </>
            ) : (
              <>
                <Gift className="w-3 h-3 mr-1" />
                Claim 100 QUILL
              </>
            )}
          </Button>
          
          <Button
            onClick={() => updateBalance(address)}
            variant="outline"
            size="sm"
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 