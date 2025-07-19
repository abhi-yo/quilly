"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import SimplifiedWalletConnect from "@/components/blockchain/SimplifiedWalletConnect";
import CopyrightProtection from "@/components/blockchain/CopyrightProtection";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function BlockchainPage() {
  const [connectedAddress, setConnectedAddress] = useState<string>("");
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedArticleId, setSelectedArticleId] = useState<string>("");
  const { data: session, status } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchArticles();
    }
  }, [status, session]);

  async function fetchArticles() {
    const userId = session?.user?.id;
    if (!userId) return;
    try {
      const res = await fetch(`/api/articles?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch articles",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch articles",
        variant: "destructive",
      });
    }
  }

  const handleWalletConnect = (address: string) => {
    setConnectedAddress(address);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3">
            Blockchain Copyright Protection
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl">
            Secure your creative work with immutable blockchain records. Create
            permanent, tamper-proof proof of ownership.
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-8">
            Connect your MetaMask wallet to register your content on the
            blockchain and create immutable proof of ownership.
          </p>
          <SimplifiedWalletConnect onConnect={handleWalletConnect} />
        </div>

        {/* Demo Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Protect Your Article</h2>
          <p className="text-gray-400 mb-8">
            Select one of your articles to secure with blockchain copyright
            protection.
          </p>
          {status === "loading" ? (
            <p>Loading...</p>
          ) : !session ? (
            <p>Please sign in to protect your articles.</p>
          ) : articles.length === 0 ? (
            <p>No articles found. Create one first!</p>
          ) : (
            <>
              <Select
                value={selectedArticleId}
                onValueChange={setSelectedArticleId}
              >
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select an article" />
                </SelectTrigger>
                <SelectContent>
                  {articles.map((article) => (
                    <SelectItem
                      key={article._id}
                      value={article._id}
                      disabled={article.copyrightProtected}
                    >
                      {article.title}{" "}
                      {article.copyrightProtected ? "(Protected)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedArticleId && (
                <div className="mt-8">
                  <CopyrightProtection
                    title={
                      articles.find((a) => a._id === selectedArticleId)
                        ?.title || ""
                    }
                    content={
                      articles.find((a) => a._id === selectedArticleId)
                        ?.content || ""
                    }
                    authorId={session.user.id}
                    articleId={selectedArticleId}
                    onRegistered={(txHash) => {
                      toast({
                        title: "Success",
                        description: `Article protected with tx: ${txHash}`,
                      });
                      fetchArticles();
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div>
              <div className="text-4xl font-bold text-gray-800 mb-4">01</div>
              <h3 className="text-xl font-semibold mb-3">Hash Generation</h3>
              <p className="text-gray-400">
                Your content is processed through SHA-256 to create a unique
                digital fingerprint.
              </p>
            </div>

            <div>
              <div className="text-4xl font-bold text-gray-800 mb-4">02</div>
              <h3 className="text-xl font-semibold mb-3">Blockchain Record</h3>
              <p className="text-gray-400">
                The hash and timestamp are permanently stored on the Polygon
                blockchain.
              </p>
            </div>

            <div>
              <div className="text-4xl font-bold text-gray-800 mb-4">03</div>
              <h3 className="text-xl font-semibold mb-3">Ownership Proof</h3>
              <p className="text-gray-400">
                Anyone can verify your ownership through the immutable
                blockchain record.
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-4">Immutable Records</h3>
              <p className="text-gray-400 mb-6">
                Once registered, your content ownership is permanently recorded
                on the blockchain. No central authority can alter or delete
                these records.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div>• Cryptographic security</div>
                <div>• Decentralized storage</div>
                <div>• Tamper-proof evidence</div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Legal Recognition</h3>
              <p className="text-gray-400 mb-6">
                Blockchain-based copyright registration is increasingly accepted
                by legal systems worldwide as valid proof of intellectual
                property ownership.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div>• Legally admissible evidence</div>
                <div>• International standards</div>
                <div>• Cost-effective protection</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center border-t border-gray-900 pt-12">
          <h2 className="text-3xl font-bold mb-4">
            Start Protecting Your Work
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of creators who trust blockchain technology to secure
            their intellectual property.
          </p>
          <div className="flex justify-center items-center gap-6 text-sm text-gray-500">
            <span>Instant protection</span>
            <span>•</span>
            <span>Global recognition</span>
            <span>•</span>
            <span>Permanent records</span>
          </div>
        </div>
      </div>
    </div>
  );
}
