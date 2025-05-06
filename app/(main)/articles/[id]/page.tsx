"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CommentSection } from "@/components/comment-section";
import { SuggestedKeywords } from "@/components/suggested-keywords";
import { EngagementChart } from "@/components/engagement-chart";
import { User } from "lucide-react";

interface Article {
  _id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signup");
    }
  }, [status, router]);

  useEffect(() => {
    fetchArticle();
  }, [params.id]);

  const fetchArticle = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/articles/${params.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch article");
      }
      const data = await response.json();
      setArticle(data);
    } catch (error) {
      console.error("Error fetching article:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-lg">Article not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-white py-12">
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        <Link href="/articles" className="inline-flex items-center text-sm text-gray-400 hover:text-gray-200 mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Articles
        </Link>

        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">{article.title}</h1>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
            <span>{article.author}</span>
            <span>•</span>
            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="bg-[#1A1A1A] rounded-2xl p-6 flex justify-between items-start">
          <SuggestedKeywords />
          <EngagementChart />
        </div>

        <div className="w-full aspect-[16/9] rounded-2xl bg-[#1A1A1A] flex items-center justify-center">
          <div className="text-gray-600 text-5xl font-bold">ARTICLE IMAGE</div>
        </div>

        <div className="prose prose-invert max-w-none space-y-6">
          <p>{article.content}</p>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <h2 className="text-xl font-semibold mb-6">ABOUT THE AUTHOR</h2>
          <div className="flex items-start space-x-6">
            <div className="relative h-20 w-20 rounded-full overflow-hidden bg-[#222] flex items-center justify-center">
              <User className="h-10 w-10 text-gray-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">{article.author}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Author bio will be added later
              </p>
            </div>
          </div>
        </div>

        <CommentSection articleId={article._id} />
      </div>
    </div>
  );
} 