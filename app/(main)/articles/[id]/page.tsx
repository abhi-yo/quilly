"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Calendar,
  Clock,
  Eye,
  MessageCircle,
  User,
  Share2,
  Bookmark,
  Heart,
  ArrowLeft,
  MoreVertical,
} from "lucide-react";
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

interface AuthorInfo {
  name: string;
  bio?: string;
  email: string;
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [article, setArticle] = useState<Article | null>(null);
  const [authorInfo, setAuthorInfo] = useState<AuthorInfo | null>(null);
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
      setArticle(data);

      // Fetch author information
      if (data.authorId) {
        fetchAuthorInfo(data.authorId);
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      setArticle(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAuthorInfo = async (authorId: string) => {
    try {
      const response = await fetch(`/api/user?id=${authorId}`);
      if (response.ok) {
        const userData = await response.json();
        setAuthorInfo(userData);
      }
    } catch (error) {
      console.error("Error fetching author info:", error);
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
    const words = content.split(" ").length;
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
        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          Article not found
        </h2>
        <p className="text-gray-400 mb-6 text-center max-w-md">
          The article you&apos;re looking for doesn&apos;t exist.
        </p>
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header Section */}
        <div className="mb-8 md:mb-12">
          {/* Back Navigation */}
          <div className="mb-6 md:mb-8">
            <Link href="/articles">
              <button className="inline-flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm font-medium group rounded-lg hover:bg-gray-800/50">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Articles
              </button>
            </Link>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag, index) => (
                <Link
                  key={index}
                  href={`/articles?tag=${encodeURIComponent(tag)}`}
                  className="bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all text-sm px-3 py-1.5 rounded-lg font-medium"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Article Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-8 leading-tight">
            {article.title}
          </h1>
        </div>

        {/* Article Meta & Actions */}
        <div className="border-b border-gray-800/50 pb-8 mb-8 md:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Author & Meta Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <User className="h-6 w-6 md:h-7 md:w-7 text-gray-400" />
              </div>
              <div>
                <div className="text-white font-semibold text-lg md:text-xl">
                  {article.author}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(article.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{getReadingTime(article.content)} min read</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats & Actions Combined */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
              {/* Stats */}
              <div className="flex items-center gap-6 text-gray-400">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  <span className="text-lg font-semibold">
                    {article.views?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-lg font-semibold">
                    {article.comments || 0}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                    isLiked
                      ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                  />
                  <span>Like</span>
                </button>

                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                    isBookmarked
                      ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                      : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
                  }`}
                >
                  <Bookmark
                    className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
                  />
                  <span>Save</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200 font-medium text-sm"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="mb-12 md:mb-16">
          <div className="prose prose-invert prose-lg lg:prose-xl max-w-none">
            <div
              className="text-gray-300 leading-relaxed text-lg lg:text-xl article-content [&>h1]:text-3xl [&>h1]:lg:text-4xl [&>h1]:font-bold [&>h1]:text-white [&>h1]:mb-6 [&>h2]:text-2xl [&>h2]:lg:text-3xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:lg:text-2xl [&>h3]:font-semibold [&>h3]:text-white [&>h3]:mb-3 [&>p]:mb-6 [&>ul]:mb-6 [&>ol]:mb-6 [&>blockquote]:border-l-4 [&>blockquote]:border-gray-600 [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-gray-400"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </article>

        {/* Author Section */}
        <div className="border-t border-gray-800/50 pt-8 md:pt-12 mb-12 md:mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">
            About the Author
          </h3>
          <div className="bg-gray-900/30 rounded-2xl p-6 md:p-8 border border-gray-800/50">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center mx-auto sm:mx-0 shrink-0">
                <User className="h-10 w-10 md:h-12 md:w-12 text-gray-400" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-xl md:text-2xl font-bold text-white mb-4">
                  {article.author}
                </h4>
                <p className="text-gray-400 leading-relaxed text-base md:text-lg mb-6 max-w-2xl">
                  {authorInfo?.bio ||
                    "Passionate developer and writer sharing insights about modern web development, React, TypeScript, and best practices. Always learning and building amazing things."}
                </p>
                <div className="flex gap-4 md:gap-6 justify-center sm:justify-start">
                  <Link href={`/profile/${article.authorId}`}>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                      View Profile
                    </button>
                  </Link>
                  <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-medium rounded-lg transition-colors">
                    Follow
                  </button>
                </div>
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
