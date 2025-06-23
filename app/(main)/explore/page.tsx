"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Grid, List, Filter, TrendingUp, Clock, User, Eye, MessageCircle } from "lucide-react";
import Link from "next/link";

interface Article {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  tags?: string[];
  views?: number;
  comments?: number;
}

export default function ExplorePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/articles");
        if (response.ok) {
          const data = await response.json();
          setArticles(data);
        } else {
          setArticles([
            {
              _id: "1",
              title: "Good Postman Alternative API Clients? Here're My Top 15",
              content: "Discover the best alternatives to Postman for API testing and development. From open-source tools to enterprise solutions, we cover everything you need to know about modern API clients and how they can streamline your development workflow.",
              author: "AKSHAT",
              createdAt: new Date().toISOString(),
              tags: ["api", "tools", "development"],
              views: 1245,
              comments: 23
            },
            {
              _id: "2", 
              title: "Building Modern Web Applications with Next.js 14",
              content: "Learn how to build scalable and performant web applications using Next.js 14, React Server Components, and modern development practices for production-ready applications that scale.",
              author: "JANE DOE",
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              tags: ["nextjs", "react", "web-development"],
              views: 892,
              comments: 15
            },
            {
              _id: "3",
              title: "Supercharge Your Coding Mojo: Connecting This FREE MCP Server",
              content: "Boost your development workflow with this powerful MCP server integration. Free, easy to set up, and incredibly useful for modern developers who want to enhance their productivity.",
              author: "ANONYMOUS",
              createdAt: new Date(Date.now() - 172800000).toISOString(),
              tags: ["coding", "productivity", "tools"],
              views: 567,
              comments: 8
            },
            {
              _id: "4",
              title: "The Future of AI in Software Development",
              content: "Exploring how artificial intelligence is transforming the way we write, test, and deploy software in 2024 and beyond. From code generation to automated testing.",
              author: "ALEX CHEN",
              createdAt: new Date(Date.now() - 259200000).toISOString(),
              tags: ["ai", "software", "future"],
              views: 1834,
              comments: 42
            },
            {
              _id: "5",
              title: "Mastering TypeScript: Advanced Patterns and Best Practices",
              content: "Deep dive into advanced TypeScript patterns, utility types, and best practices for building type-safe applications that scale with your team.",
              author: "SARAH MILLER",
              createdAt: new Date(Date.now() - 345600000).toISOString(),
              tags: ["typescript", "programming", "patterns"],
              views: 756,
              comments: 19
            },
            {
              _id: "6",
              title: "Database Design Principles for Scalable Applications",
              content: "Essential database design principles and patterns for building applications that scale efficiently with growing user bases and increasing data volumes.",
              author: "DAVID WANG",
              createdAt: new Date(Date.now() - 432000000).toISOString(),
              tags: ["database", "scaling", "architecture"],
              views: 634,
              comments: 12
            }
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const filteredArticles = articles.filter((article: Article) => {
    const matchesSearch = article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = selectedTag === "" || article.tags?.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const popularTags = ["development", "api", "nextjs", "react", "typescript", "ai"];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Explore
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover stories, insights, and ideas from our vibrant community of writers and thinkers
            </p>
            
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search for articles, topics, or authors..."
                  className="h-12 pl-12 pr-4 bg-white/5 backdrop-blur-sm border-white/10 text-white placeholder-gray-400 rounded-xl text-base focus:border-white/20 focus:bg-white/10 transition-all duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag("")}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedTag === ""
                    ? "bg-white text-black"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                All
              </button>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 capitalize ${
                    selectedTag === tag
                      ? "bg-white text-black"
                      : "bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 bg-gray-800/30 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'grid'
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'list'
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400 text-base">
            {isLoading ? "Loading..." : `${filteredArticles.length} articles found`}
            {selectedTag && (
              <span className="ml-2">
                in <span className="text-white font-medium">#{selectedTag}</span>
              </span>
            )}
          </p>
        </div>

        {/* Articles Display */}
        {isLoading ? (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl p-6 animate-pulse border border-gray-800/50 h-80">
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
              </div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 opacity-50">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-3">No articles found</h3>
            <p className="text-gray-400 text-base mb-6 max-w-md mx-auto">
              Try adjusting your search terms or explore different topics
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedTag("");
              }}
              className="px-6 py-2.5 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
          }>
            {filteredArticles.map((article: Article) => (
              <div key={article._id} className="group">
                {viewMode === 'grid' ? (
                  <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl p-6 hover:from-gray-800/60 hover:to-gray-700/40 transition-all duration-300 border border-gray-800/50 hover:border-gray-600/50 h-80 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-gray-100 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-400 line-clamp-3 leading-relaxed text-sm mb-4">
                        {article.content?.substring(0, 120)}...
                      </p>
                      
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {article.tags?.slice(0, 2).map((tag, index) => (
                          <Badge
                            key={index}
                            className="bg-gray-700/50 text-gray-300 hover:bg-gray-600/60 transition-colors border-0 text-xs px-2 py-0.5"
                          >
                            #{tag}
                          </Badge>
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
                            <Clock className="h-3 w-3" />
                            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <Link href={`/articles/${article._id}`}>
                          <button className="px-3 py-1.5 bg-white/10 hover:bg-white hover:text-black text-white rounded-lg text-xs font-medium transition-all duration-300">
                            Read
                          </button>
                        </Link>
                      </div>
                      
                      <div className="flex items-center gap-3 pt-3 border-t border-gray-700/30 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{article.views?.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          <span>{article.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/30 rounded-xl p-5 hover:from-gray-800/60 hover:to-gray-700/40 transition-all duration-300 border border-gray-800/50 hover:border-gray-600/50">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-2 hover:text-gray-100 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-gray-400 mb-3 line-clamp-2 text-sm">
                          {article.content?.substring(0, 150)}...
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span>{article.author}</span>
                            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                <span>{article.views?.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                <span>{article.comments}</span>
                              </div>
                            </div>
                          </div>
                          
                          <Link href={`/articles/${article._id}`}>
                            <button className="px-3 py-1.5 bg-white/10 hover:bg-white hover:text-black text-white rounded-lg text-xs font-medium transition-all duration-300">
                              Read Article
                            </button>
                          </Link>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-1.5">
                        {article.tags?.slice(0, 2).map((tag, index) => (
                          <Badge
                            key={index}
                            className="bg-gray-700/50 text-gray-300 border-0 text-xs px-2 py-0.5"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {!isLoading && filteredArticles.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-6 py-3 bg-gradient-to-r from-gray-800/80 to-gray-700/80 hover:from-gray-700 hover:to-gray-600 text-white rounded-xl font-medium transition-all duration-300 border border-gray-600/30 hover:border-gray-500/50">
              Load More Articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
}