"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, RefreshCw } from "lucide-react";
import { web3Service } from "@/lib/web3";
import { useToast } from "@/hooks/use-toast";

interface WalletConnectProps {
  onConnect?: (address: string) => void;
}

export default function WalletConnect({ onConnect }: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>("");
  const [balance, setBalance] = useState<string>("0.00");
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const connected = web3Service.isConnected();
      if (connected) {
        const addr = await web3Service.getCurrentAccount();
        if (addr) {
          setAddress(addr);
          setIsConnected(true);
          await updateBalance(addr);
          onConnect?.(addr);
        }
      }
    } catch (error) {
      console.error("Error checking connection:", error);
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const addr = await web3Service.connectWallet();
      if (addr) {
        setAddress(addr);
        setIsConnected(true);
        await updateBalance(addr);
        onConnect?.(addr);
        toast({
          title: "Wallet Connected",
          description: `Connected to ${addr.slice(0, 6)}...${addr.slice(-4)}`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const updateBalance = async (walletAddress?: string) => {
    try {
      const addr = walletAddress || address;
      if (!addr) return;

      const tokenBalance = await web3Service.getTokenBalance(addr);
      setBalance(tokenBalance);
    } catch (error) {
      console.error("Error updating balance:", error);
      toast({
        title: "Error",
        description: "Failed to update balance",
        variant: "destructive",
      });
    }
  };

  if (!isConnected) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Connect Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4 text-sm">
            Connect your MetaMask wallet to register your content on the
            blockchain and create immutable proof of ownership.
          </p>
          <Button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isConnecting ? (
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
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Connected
          </CardTitle>
          <Badge variant="secondary" className="bg-green-900 text-green-100">
            Connected
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-gray-400 text-sm mb-1">Address</p>
          <p className="text-white font-mono text-sm">
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-sm mb-1">QUILL Balance</p>
          <p className="text-white font-bold text-lg">{balance} QUILL</p>
        </div>

        <div className="flex gap-2">
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

        <div className="pt-2 border-t border-gray-800">
          <p className="text-gray-500 text-xs">
            Ready to register content on Polygon blockchain
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
