"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, RefreshCw } from "lucide-react";
import { web3Service } from "@/lib/web3";
import { useToast } from "@/hooks/use-toast";

interface SimplifiedWalletConnectProps {
  onConnect?: (address: string) => void;
}

export default function SimplifiedWalletConnect({
  onConnect,
}: SimplifiedWalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>("");
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

        <div className="pt-2 border-t border-gray-800">
          <p className="text-gray-500 text-xs">
            Ready to register content on Polygon blockchain
          </p>
          <p className="text-gray-600 text-xs mt-1">
            Registration fee: 0.001 MATIC
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
