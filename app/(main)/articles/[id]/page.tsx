"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Calendar, Clock, Eye, MessageCircle, User, Share2, Bookmark, Heart, ArrowLeft, MoreVertical } from "lucide-react";
import { CommentSection } from "@/components/comment-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Article {
  _id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
  tags?: string[];
  views?: number;
  comments?: number;
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

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
      
      // Add dummy data if API doesn't return proper structure
      const articleWithDefaults = data || {
        _id: params.id,
        title: "Good Postman Alternative API Clients? Here're My Top 15",
        content: `Let's be honest. For a long time, Postman was the main tool for anyone working with APIs. If you've dealt with APIs, you've probably used Postman a lot – making collections, setting up environments, and hitting that "Send" button. It was the top choice and made dealing with APIs much easier for everyone. Big thanks to Postman for that!

But lately, does Postman feel a bit... much? It seems like it's gotten bigger and, strangely, slower. What used to be a quick tool for simple API calls now feels like a giant program.

What's Up with Postman? Why People Are Searching for Alternatives to Postman

It's not just you. Developers everywhere – on forums, in team chats, and on dev.to – are talking about the same issues. If these sound familiar, you're on the same page as many others:

It Feels Slow and Heavy: Remember when Postman was fast? For lots of us, it doesn't feel that way anymore. Starting it up can take a while, and if you have a lot of API requests saved, it can really drag.

Getting Too Complex: Postman has added tons of features over the years. While some are great, others make it feel bloated. Sometimes you just want to test an API quickly without dealing with all the extra stuff.

Pricing Changes: Postman's pricing has changed, and some features that used to be free now cost money. For solo developers or small teams, this can be frustrating.

Sync and Collaboration Issues: While Postman's cloud features are meant to help teams work together, they can sometimes cause problems. Syncing issues, version conflicts, and the need to be online can be annoying.

Looking for Something Simpler: Many developers want a tool that's focused, fast, and doesn't try to do everything. Sometimes less is more.

If you're nodding along, you're not alone. The good news? There are some fantastic alternatives out there that might be exactly what you're looking for.`,
        author: "Akshat",
        authorId: "user1",
        createdAt: new Date().toISOString(),
        tags: ["api", "tools", "development", "postman"],
        views: 1245,
        comments: 23
      };
      
      setArticle(articleWithDefaults);
    } catch (error) {
      console.error("Error fetching article:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading article...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
        <div className="text-6xl mb-4 opacity-50">📄</div>
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Article not found</h2>
        <p className="text-gray-400 mb-6 text-center max-w-md">The article you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/articles">
          <Button className="bg-white text-black hover:bg-gray-100">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Article Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link href="/articles">
            <button className="inline-flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm font-medium group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Articles
            </button>
          </Link>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {article.tags?.map((tag, index) => (
            <Badge
              key={index}
              className="bg-gray-800/50 text-gray-300 border-0 text-sm px-3 py-1 hover:bg-gray-700/50 transition-colors"
            >
              #{tag}
            </Badge>
          ))}
        </div>
        
        {/* Article Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
          {article.title}
        </h1>
        
        {/* Article Meta & Actions */}
        <div className="flex flex-col space-y-6 mb-12">
          {/* Author & Meta Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <User className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <div className="text-gray-300 font-medium text-lg">{article.author}</div>
                <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(article.createdAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{getReadingTime(article.content)} min read</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                <span className="text-lg font-medium">{article.views?.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <span className="text-lg font-medium">{article.comments}</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
                isLiked 
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" 
                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>Like</span>
            </button>
            
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
                isBookmarked 
                  ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30" 
                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
              <span>Save</span>
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200 font-medium"
            >
              <Share2 className="h-5 w-5" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Article Content */}
        <article className="mb-16">
          <div className="prose prose-invert prose-xl max-w-none">
            <div className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
              {article.content}
            </div>
          </div>
        </article>

        {/* Author Section */}
        <div className="border-t border-gray-800/50 pt-12 mb-16">
          <h3 className="text-2xl font-bold text-white mb-8">About the Author</h3>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center mx-auto sm:mx-0">
              <User className="h-10 w-10 text-gray-400" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h4 className="text-xl font-semibold text-white mb-3">{article.author}</h4>
              <p className="text-gray-400 leading-relaxed text-lg mb-6">
                Passionate developer and writer sharing insights about modern web development, 
                React, TypeScript, and best practices. Always learning and building amazing things.
              </p>
              <div className="flex gap-6 justify-center sm:justify-start">
                <button className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                  View Profile
                </button>
                <button className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                  Follow
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <CommentSection articleId={article._id} />
      </div>
    </div>
  );
} 