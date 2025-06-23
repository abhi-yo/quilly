"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, AlertTriangle, FileCheck, Search } from 'lucide-react';
import { web3Service } from '@/lib/web3';
import { useToast } from '@/hooks/use-toast';

interface CopyrightProtectionProps {
  title: string;
  content: string;
  authorId: string;
  onRegistered?: (txHash: string) => void;
}

export default function CopyrightProtection({ 
  title, 
  content, 
  authorId,
  onRegistered 
}: CopyrightProtectionProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<'none' | 'registered' | 'verified'>('none');
  const [contentHash, setContentHash] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const { toast } = useToast();

  const generateHash = async () => {
    try {
      const response = await fetch('/api/blockchain/copyright', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-hash',
          title,
          content
        })
      });

      const result = await response.json();
      if (result.contentHash) {
        setContentHash(result.contentHash);
        return result.contentHash;
      }
    } catch (error) {
      console.error('Error generating hash:', error);
    }
    return null;
  };

  const registerCopyright = async () => {
    if (!web3Service.isConnected()) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet first',
        variant: 'destructive'
      });
      return;
    }

    setIsRegistering(true);
    try {
      let hash = contentHash;
      if (!hash) {
        hash = await generateHash();
        if (!hash) {
          throw new Error('Failed to generate content hash');
        }
      }

      const txHash = await web3Service.registerContent(hash, title, '');
      
      await fetch('/api/blockchain/copyright', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          title,
          contentHash: hash,
          txHash
        })
      });

      setRegistrationStatus('registered');
      onRegistered?.(txHash);
      
      toast({
        title: 'Copyright Registered!',
        description: 'Your content is now protected on the blockchain',
      });

    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.message || 'Failed to register copyright',
        variant: 'destructive'
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const verifyCopyright = async () => {
    setIsVerifying(true);
    try {
      let hash = contentHash;
      if (!hash) {
        hash = await generateHash();
        if (!hash) {
          throw new Error('Failed to generate content hash');
        }
      }

      const result = await web3Service.verifyContentOwnership(hash);
      setVerificationResult(result);
      
      if (result.exists) {
        setRegistrationStatus('verified');
        toast({
          title: 'Copyright Verified',
          description: 'Content ownership confirmed on blockchain',
        });
      } else {
        toast({
          title: 'No Copyright Found',
          description: 'This content is not registered on the blockchain',
          variant: 'destructive'
        });
      }

    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.message || 'Failed to verify copyright',
        variant: 'destructive'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusBadge = () => {
    switch (registrationStatus) {
      case 'registered':
        return (
          <Badge className="bg-green-500/20 text-green-300 border-green-500/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Registered
          </Badge>
        );
      case 'verified':
        return (
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/20">
            <Shield className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-gray-600 text-gray-400">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Unprotected
          </Badge>
        );
    }
  };

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-white" />
            Copyright Protection
          </div>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-400 text-sm">
          Protect your content with blockchain-based copyright registration.
          This creates an immutable proof of ownership.
        </p>

        {contentHash && (
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <p className="text-gray-400 text-xs mb-1">Content Hash</p>
            <p className="text-white font-mono text-xs break-all">{contentHash}</p>
          </div>
        )}

        {verificationResult && (
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <h4 className="text-white text-sm font-medium mb-2">Verification Result</h4>
            <div className="space-y-1 text-xs">
              <p className="text-gray-400">
                Exists: <span className={verificationResult.exists ? 'text-green-300' : 'text-red-300'}>
                  {verificationResult.exists ? 'Yes' : 'No'}
                </span>
              </p>
              {verificationResult.exists && (
                <>
                  <p className="text-gray-400">
                    Owner: <span className="text-white font-mono">
                      {verificationResult.author.slice(0, 6)}...{verificationResult.author.slice(-4)}
                    </span>
                  </p>
                  <p className="text-gray-400">
                    Registered: <span className="text-white">
                      {new Date(verificationResult.timestamp * 1000).toLocaleDateString()}
                    </span>
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={registerCopyright}
            disabled={isRegistering || registrationStatus === 'registered'}
            className="bg-white text-black hover:bg-gray-100 flex-1"
          >
            {isRegistering ? (
              <>
                <Shield className="w-4 h-4 mr-2 animate-pulse" />
                Registering...
              </>
            ) : (
              <>
                <FileCheck className="w-4 h-4 mr-2" />
                Register Copyright
              </>
            )}
          </Button>

          <Button
            onClick={verifyCopyright}
            disabled={isVerifying}
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            {isVerifying ? (
              <>
                <Search className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Verify
              </>
            )}
          </Button>
        </div>

        <div className="text-xs text-gray-500">
          Registration fee: ~0.001 MATIC (gas costs may apply)
        </div>
      </CardContent>
    </Card>
  );
} 