"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  PenTool,
  FileText,
  Eye,
  TrendingUp,
  Plus,
  MessageCircle,
  Clock,
  Star,
  BookOpen,
  Users,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function Dashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalViews: 0,
    totalReads: 0,
    engagementRate: 0,
  });

  const [analytics, setAnalytics] = useState({
    words: { value: 0 },
    trends: [],
    engagement: { value: 0 },
    overallRating: { value: 0 },
    performance: { feedbacks: 0 },
    payments: { value: 0 },
    commentsPerArticle: { value: 0 },
  });

  const [recentArticles, setRecentArticles] = useState<
    Array<{
      _id: string;
      title: string;
      content: string;
      author: string;
      authorId: string;
      createdAt: string;
      views?: number;
      comments?: number;
    }>
  >([]);

  const [readerStats, setReaderStats] = useState({
    totalArticles: 0,
    totalAuthors: 0,
    avgReadTime: 0,
    articlesThisWeek: 0,
  });

  const [trendingArticles, setTrendingArticles] = useState<
    Array<{
      _id: string;
      title: string;
      content: string;
      author: string;
      authorId: string;
      createdAt: string;
      views?: number;
      comments?: number;
    }>
  >([]);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good afternoon";
    } else if (hour >= 17 && hour < 22) {
      return "Good evening";
    } else {
      return "Good night";
    }
  };

  const isWriter =
    session?.user?.role === "writer" || session?.user?.role === "admin";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats");
        if (response.ok) {
          const data = await response.json();
          setStats({
            totalArticles: data.articles?.value || 0,
            totalViews: data.views?.value || 0,
            totalReads: data.reads?.value || 0,
            engagementRate: data.engagement?.value || 0,
          });
          setAnalytics({
            words: data.words || { value: 0 },
            trends: data.trends || [],
            engagement: data.engagement || { value: 0 },
            overallRating: data.rating || { value: 0 },
            performance: { feedbacks: data.comments?.value || 0 },
            payments: data.payments || { value: 0 },
            commentsPerArticle: data.commentsPerArticle || { value: 0 },
          });
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    const fetchReaderContent = async () => {
      try {
        const response = await fetch("/api/articles?limit=6");
        if (response.ok) {
          const articles = await response.json();
          setTrendingArticles(articles);

          const uniqueAuthors = new Set(
            articles.map((article: any) => article.authorId)
          );
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

          const recentArticles = articles.filter(
            (article: any) => new Date(article.createdAt) >= oneWeekAgo
          );

          setReaderStats({
            totalArticles: articles.length,
            totalAuthors: uniqueAuthors.size,
            avgReadTime: Math.floor(Math.random() * 5) + 3,
            articlesThisWeek: recentArticles.length,
          });
        }
      } catch (error) {
        console.error("Failed to fetch reader content:", error);
      }
    };

    if (session) {
      if (isWriter) {
        fetchStats();
        fetchRecentArticles();
      } else {
        fetchReaderContent();
      }
    }
  }, [session, isWriter]);

  const fetchRecentArticles = async () => {
    try {
      const response = await fetch(
        `/api/articles?userId=${session?.user?.id}&limit=3`
      );
      if (response.ok) {
        const articles = await response.json();
        setRecentArticles(articles);
      }
    } catch (error) {
      console.error("Failed to fetch recent articles:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3">
            {getTimeBasedGreeting()}, {session?.user?.name}!
          </h1>
          <p className="text-gray-400 text-lg">
            {isWriter
              ? "Ready to create something amazing?"
              : "Discover amazing content from our writers"}
          </p>
        </div>

        {isWriter && (
          <div className="mb-12">
            <Link href="/write">
              <Button className="h-14 px-8 bg-white text-black hover:bg-gray-100 font-semibold rounded-xl transition-all hover:scale-[1.02] text-lg">
                <Plus className="mr-3 h-5 w-5" />
                Write New Article
              </Button>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-950/50 backdrop-blur-sm border border-gray-900/50 rounded-2xl p-6 hover:bg-gray-950/70 transition-all">
            <div className="flex items-center justify-between mb-3">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {isWriter
                ? stats.totalArticles || 0
                : readerStats.totalArticles || 0}
            </div>
            <div className="text-sm text-gray-400">
              {isWriter ? "Your Articles" : "Available Articles"}
            </div>
          </div>

          <div className="bg-gray-950/50 backdrop-blur-sm border border-gray-900/50 rounded-2xl p-6 hover:bg-gray-950/70 transition-all">
            <div className="flex items-center justify-between mb-3">
              {isWriter ? (
                <Eye className="h-5 w-5 text-gray-400" />
              ) : (
                <Users className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {isWriter
                ? (stats.totalViews || 0).toLocaleString()
                : readerStats.totalAuthors || 0}
            </div>
            <div className="text-sm text-gray-400">
              {isWriter ? "Your Views" : "Active Writers"}
            </div>
          </div>

          <div className="bg-gray-950/50 backdrop-blur-sm border border-gray-900/50 rounded-2xl p-6 hover:bg-gray-950/70 transition-all">
            <div className="flex items-center justify-between mb-3">
              {isWriter ? (
                <TrendingUp className="h-5 w-5 text-gray-400" />
              ) : (
                <Clock className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {isWriter
                ? (stats.totalReads || 0).toLocaleString()
                : `${readerStats.avgReadTime}m`}
            </div>
            <div className="text-sm text-gray-400">
              {isWriter ? "Your Reads" : "Avg Read Time"}
            </div>
          </div>

          <div className="bg-gray-950/50 backdrop-blur-sm border border-gray-900/50 rounded-2xl p-6 hover:bg-gray-950/70 transition-all">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {isWriter
                ? `${stats.engagementRate || 0}%`
                : readerStats.articlesThisWeek}
            </div>
            <div className="text-sm text-gray-400">
              {isWriter ? "Engagement" : "New This Week"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {isWriter ? (
            <div className="bg-gray-950/30 backdrop-blur-sm border border-gray-900/50 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Recent Articles
              </h2>
              <div className="space-y-4">
                {recentArticles.length > 0 ? (
                  <>
                    {recentArticles.map((article) => (
                      <Link key={article._id} href={`/articles/${article._id}`}>
                        <div className="p-4 bg-gray-900/30 rounded-lg hover:bg-gray-900/50 transition-all cursor-pointer group">
                          <h3 className="text-white font-medium group-hover:text-gray-100 transition-colors line-clamp-1">
                            {article.title}
                          </h3>
                          <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                            {article.content?.substring(0, 100)}...
                          </p>
                          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                            <span>
                              {new Date(article.createdAt).toLocaleDateString()}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {article.views || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                {article.comments || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                    <Link href="/articles">
                      <Button
                        variant="ghost"
                        className="w-full text-gray-400 hover:text-white hover:bg-gray-900/50 rounded-lg"
                      >
                        View All Articles
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-gray-400 text-center py-8">
                      No articles yet. Start writing your first article!
                    </p>
                    <Link href="/write">
                      <Button
                        variant="outline"
                        className="w-full border-gray-800 text-white hover:bg-gray-900 rounded-lg"
                      >
                        <PenTool className="mr-2 h-4 w-4" />
                        Create Your First Article
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-950/30 backdrop-blur-sm border border-gray-900/50 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">
                  Trending Articles
                </h2>
                <Badge
                  variant="secondary"
                  className="bg-blue-500/10 text-blue-400 border-blue-500/20"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Hot
                </Badge>
              </div>
              <div className="space-y-4">
                {trendingArticles.slice(0, 3).map((article, index) => (
                  <Link key={article._id} href={`/articles/${article._id}`}>
                    <div className="p-4 bg-gray-900/30 rounded-lg hover:bg-gray-900/50 transition-all cursor-pointer group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant="outline"
                              className="text-xs border-gray-600 text-gray-400"
                            >
                              #{index + 1}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              by {article.author}
                            </span>
                          </div>
                          <h3 className="text-white font-medium group-hover:text-gray-100 transition-colors line-clamp-1">
                            {article.title}
                          </h3>
                          <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                            {article.content?.substring(0, 80)}...
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                        <span>
                          {new Date(article.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {Math.floor(Math.random() * 500) + 100}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {Math.floor(Math.random() * 5) + 2}m
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                <Link href="/explore">
                  <Button
                    variant="ghost"
                    className="w-full text-gray-400 hover:text-white hover:bg-gray-900/50 rounded-lg"
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Explore All Articles
                  </Button>
                </Link>
              </div>
            </div>
          )}

          <div className="bg-gray-950/30 backdrop-blur-sm border border-gray-900/50 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Quick Actions
            </h2>
            <div className="space-y-3">
              {!isWriter && (
                <Link href="/explore">
                  <Button className="w-full justify-start bg-blue-500 hover:bg-blue-600 text-white rounded-lg h-12">
                    <BookOpen className="mr-3 h-5 w-5" />
                    Explore Articles
                  </Button>
                </Link>
              )}
              <Link href="/articles">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-900/50 rounded-lg h-12"
                >
                  <FileText className="mr-3 h-5 w-5" />
                  {isWriter ? "View All Articles" : "Browse All Articles"}
                </Button>
              </Link>
              {!isWriter && (
                <Link href="/explore">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-900/50 rounded-lg h-12"
                  >
                    <Filter className="mr-3 h-5 w-5" />
                    Filter by Category
                  </Button>
                </Link>
              )}
              <Link href="/profile">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-900/50 rounded-lg h-12"
                >
                  <FileText className="mr-3 h-5 w-5" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {isWriter && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Analytics & Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-950/30 backdrop-blur-sm border border-gray-900/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {analytics.words.value.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Total Words</div>
              </div>

              <div className="bg-gray-950/30 backdrop-blur-sm border border-gray-900/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <MessageCircle className="h-5 w-5 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {analytics.performance.feedbacks}
                </div>
                <div className="text-sm text-gray-400">Total Comments</div>
              </div>

              <div className="bg-gray-950/30 backdrop-blur-sm border border-gray-900/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <TrendingUp className="h-5 w-5 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {analytics.overallRating.value.toFixed(1)}
                </div>
                <div className="text-sm text-gray-400">Avg Rating</div>
              </div>

              <div className="bg-gray-950/30 backdrop-blur-sm border border-gray-900/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <Eye className="h-5 w-5 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {analytics.commentsPerArticle?.value?.toFixed(1) ||
                    analytics.engagement.value.toFixed(1)}
                </div>
                <div className="text-sm text-gray-400">
                  Avg Comments/Article
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
