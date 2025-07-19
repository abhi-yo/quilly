"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Calendar,
  User,
  Eye,
  MessageCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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

export default function ArticlesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedTag, setSelectedTag] = useState("");
  const [popularTags, setPopularTags] = useState<
    { tag: string; count: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to strip HTML tags and get plain text
  const stripHtmlTags = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    if (session) {
      fetchArticles();
      fetchPopularTags();
    }
  }, [status, router, session]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tagParam = urlParams.get("tag");
    if (tagParam) {
      setSelectedTag(tagParam);
    }
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

  const fetchPopularTags = async () => {
    try {
      const response = await fetch("/api/tags");
      if (response.ok) {
        const data = await response.json();
        setPopularTags(data);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
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

      setArticles(articles.filter((article) => article._id !== articleId));

      toast({
        title: "Success",
        description: "Article deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting article:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete article",
        variant: "destructive",
      });
    }
  };

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "mine" && article.authorId === session?.user?.id);

    const matchesTag = !selectedTag || article.tags?.includes(selectedTag);

    return matchesSearch && matchesFilter && matchesTag;
  });

  const isWriter =
    session?.user?.role === "writer" || session?.user?.role === "admin";

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-3">Articles</h1>
            <p className="text-gray-400 text-lg">
              {isWriter
                ? "Manage your articles and explore content from other writers"
                : "Discover amazing content from our community of writers"}
            </p>
          </div>

          {isWriter && (
            <Link href="/write">
              <Button className="bg-white text-black hover:bg-gray-100 font-semibold rounded-lg transition-all hover:scale-[1.02]">
                <Plus className="mr-2 h-4 w-4" />
                Write New Article
              </Button>
            </Link>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search articles..."
              className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === "all"
                  ? "bg-white text-black"
                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-700"
              }`}
            >
              All Articles
            </button>
            {isWriter && (
              <button
                onClick={() => setSelectedFilter("mine")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === "mine"
                    ? "bg-white text-black"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700"
                }`}
              >
                My Articles
              </button>
            )}
          </div>
        </div>

        {popularTags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag("")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  !selectedTag
                    ? "bg-white text-black"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700"
                }`}
              >
                All
              </button>
              {popularTags.slice(0, 12).map((tagData) => (
                <button
                  key={tagData.tag}
                  onClick={() => setSelectedTag(tagData.tag)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedTag === tagData.tag
                      ? "bg-white text-black"
                      : "bg-gray-800/50 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  #{tagData.tag} ({tagData.count})
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-950/50 rounded-2xl p-6 animate-pulse border border-gray-800/50 h-80"
              >
                <div className="h-5 bg-gray-700/50 rounded mb-3"></div>
                <div className="h-4 bg-gray-700/50 rounded mb-2"></div>
                <div className="h-4 bg-gray-700/50 rounded mb-4 w-3/4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-5 bg-gray-700/50 rounded-full w-12"></div>
                  <div className="h-5 bg-gray-700/50 rounded-full w-16"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-700/50 rounded w-20"></div>
                  <div className="h-8 bg-gray-700/50 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 opacity-50">📝</div>
            <h3 className="text-2xl font-bold text-white mb-3">
              {searchTerm
                ? "No articles found"
                : isWriter
                ? "No articles yet"
                : "No articles available"}
            </h3>
            <p className="text-gray-400 text-base mb-6 max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search terms or browse all articles"
                : isWriter
                ? "Start writing your first article to share with the community"
                : "Check back later for new content from our writers"}
            </p>
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm("")}
                className="px-6 py-2.5 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Clear Search
              </button>
            ) : isWriter ? (
              <Link href="/write">
                <Button className="bg-white text-black hover:bg-gray-100 font-medium">
                  <Plus className="mr-2 h-4 w-4" />
                  Write Your First Article
                </Button>
              </Link>
            ) : (
              <Link href="/explore">
                <Button className="bg-white text-black hover:bg-gray-100 font-medium">
                  <Eye className="mr-2 h-4 w-4" />
                  Explore Articles
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div key={article._id} className="group">
                <div className="bg-gray-950/50 rounded-2xl p-6 hover:bg-gray-950/70 transition-all duration-300 border border-gray-800/50 hover:border-gray-600/50 h-80 flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-gray-100 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-400 line-clamp-3 leading-relaxed text-sm mb-4">
                      {stripHtmlTags(article.content || "").substring(0, 120)}
                      ...
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {article.tags?.slice(0, 2).map((tag, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedTag(tag);
                          }}
                          className="bg-gray-700/50 text-gray-300 hover:bg-gray-600/60 transition-colors border-0 text-xs px-2 py-0.5 rounded-full"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(article.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {isWriter && article.authorId === session?.user?.id && (
                        <div className="flex gap-1">
                          <Link href={`/write?edit=${article._id}`}>
                            <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded transition-colors">
                              <Edit className="h-3 w-3" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDeleteArticle(article._id)}
                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-700/30">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{(article.views || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          <span>{article.comments || 0}</span>
                        </div>
                      </div>

                      <Link href={`/articles/${article._id}`}>
                        <button className="px-3 py-1.5 bg-white/10 hover:bg-white hover:text-black text-white rounded-lg text-xs font-medium transition-all duration-300">
                          Read
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
