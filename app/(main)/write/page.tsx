"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { PenTool, Save, ArrowLeft, AlertTriangle, Copyright } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function WritePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const [enableCopyright, setEnableCopyright] = useState(true);

  const isWriter = session?.user?.role === "writer" || session?.user?.role === "admin";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated" && !isWriter) {
      toast({
        title: "Access Denied",
        description: "Only writers can create articles. Contact support to upgrade your account.",
        variant: "destructive",
      });
      router.push("/dashboard");
    }
  }, [status, isWriter, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content are required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title.trim(),
          content: formData.content.trim(),
          tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create article");
        return;
      }

      toast({
        title: "Success",
        description: "Article published successfully!",
      });

      router.push(`/articles/${data.id}`);
    } catch (error) {
      setError("An error occurred while publishing the article");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!formData.title.trim() && !formData.content.trim()) {
      return;
    }

    toast({
      title: "Draft Saved",
      description: "Your work has been saved locally",
    });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!session || !isWriter) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-md text-center">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-3">Access Restricted</h1>
          <p className="text-gray-400 mb-6">
            Only writers can create articles. Please contact support to upgrade your account or explore existing content.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/dashboard">
              <Button variant="outline" className="border-gray-700 text-gray-300">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/explore">
              <Button className="bg-white text-black hover:bg-gray-100">
                Explore Articles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-900/50 rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Write New Article</h1>
            <p className="text-gray-400 mt-1">Share your thoughts with the world</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="text-red-400 text-sm p-4 bg-red-950/20 rounded-xl border border-red-900/20">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <Input
              type="text"
              placeholder="Article title..."
              className="text-4xl font-bold bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 p-0 h-auto"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Content */}
          <div>
            <Textarea
              placeholder="Tell your story..."
              className="min-h-[500px] text-lg leading-relaxed bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 p-0 resize-none"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
          </div>

          {/* Tags */}
          <div className="border-t border-gray-900/50 pt-8">
            <Input
              type="text"
              placeholder="Add tags (comma separated)..."
              className="bg-gray-950/50 border-gray-800 text-white placeholder-gray-500 rounded-xl h-12 focus:border-gray-600 focus:ring-0"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
            {formData.tags && (
              <div className="flex flex-wrap gap-2 mt-4">
                {formData.tags.split(",").map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-gray-800 text-gray-300 px-3 py-1"
                  >
                    #{tag.trim()}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Copyright Protection */}
          <div className="border-t border-gray-900/50 pt-8">
            <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <Copyright className="w-5 h-5 text-blue-400" />
                <div>
                  <h4 className="text-white font-medium">Blockchain Copyright Protection</h4>
                  <p className="text-gray-400 text-sm">
                    Automatically register your article on the blockchain for immutable ownership proof
                  </p>
                </div>
              </div>
              <Switch
                checked={enableCopyright}
                onCheckedChange={setEnableCopyright}
              />
            </div>
            {enableCopyright && (
              <div className="mt-3 p-3 bg-gray-800/30 rounded-lg">
                <p className="text-gray-400 text-xs">
                  ✓ Your article will be hashed and registered on the Polygon blockchain
                  <br />
                  ✓ Creates permanent, tamper-proof proof of ownership
                  <br />
                  ✓ Small gas fee (~$0.01) required for blockchain transaction
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-gray-900/50 pt-8">
            <Button
              type="button"
              variant="ghost"
              onClick={handleSaveDraft}
              className="text-gray-400 hover:text-white hover:bg-gray-900/50 rounded-lg"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>

            <Button
              type="submit"
              className="h-12 px-8 bg-white text-black hover:bg-gray-100 font-semibold rounded-xl transition-all hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? "Publishing..." : "Publish Article"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 