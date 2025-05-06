"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { User } from "lucide-react";
import { CommentSection } from "@/components/comment-section";
import { SuggestedKeywords } from "@/components/suggested-keywords";
import { EngagementChart } from "@/components/engagement-chart";

interface Article {
  _id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
}

export default function ArticlesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isWriter, setIsWriter] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signup");
    }
    if (session?.user?.role === "writer" || session?.user?.role === "admin") {
      setIsWriter(true);
    }
  }, [status, router, session]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/articles");
      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast({
        title: "Error",
        description: "Failed to load articles. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (title.length < 3) {
      toast({
        title: "Validation Error",
        description: "Title must be at least 3 characters long",
        variant: "destructive",
      });
      return false;
    }
    if (content.length < 10) {
      toast({
        title: "Validation Error",
        description: "Content must be at least 10 characters long",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          title, 
          content,
          author: session?.user?.name || "Anonymous",
          authorId: session?.user?.id
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create article");
      }

      setArticles([data, ...articles]);
      setTitle("");
      setContent("");
      setDialogOpen(false);
      toast({
        title: "Success",
        description: "Article created successfully!",
      });
    } catch (error) {
      console.error("Error creating article:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create article",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete article");
      }

      setArticles(articles.filter(article => article._id !== articleId));
      
      toast({
        title: "Success",
        description: "Article deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting article:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete article",
        variant: "destructive",
      });
    }
  };

  if (status === "loading") {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="w-full flex flex-col">
        <header className="w-full bg-[#1A1A1A] shadow-sm">
          <div className="w-full px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Articles</h1>
            {isWriter && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default">Write New</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[725px]">
                  <DialogHeader>
                    <DialogTitle>Create New Article</DialogTitle>
                    <DialogDescription>
                      Write your article here. Click submit when you&apos;re done.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmitArticle} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter article title"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your article content here..."
                        className="min-h-[300px]"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Article"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="text-lg text-gray-400">Loading articles...</div>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No articles found.</p>
              {isWriter && (
                <p className="mt-2 text-sm text-gray-500">
                  Click the &quot;Write New&quot; button to create one.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <Link key={article._id} href={`/articles/${article._id}`} passHref legacyBehavior>
                  <a className="block p-4 rounded-lg cursor-pointer transition-colors bg-[#1A1A1A] hover:bg-[#222] border border-transparent">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-white">{article.title}</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          by {article.author} • {new Date(article.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {isWriter && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-white z-10 relative"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteArticle(article._id);
                          }}
                        >
                          <User className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 