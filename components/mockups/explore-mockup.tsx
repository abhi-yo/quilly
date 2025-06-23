"use client";

import { motion } from "framer-motion";
import { Search, TrendingUp, Users, Clock, Star, Bookmark, Eye, MessageSquare, Filter, Hash } from "lucide-react";

export function ExploreMockup() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent" />
      
      {/* Header */}
      <div className="relative z-10 p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
              <Search className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Explore Articles</h3>
              <p className="text-sm text-white/60">Discover trending content</p>
            </div>
          </div>
          
          <motion.button
            className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
          >
            <Filter className="h-4 w-4" />
          </motion.button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <div className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-sm text-white/90 focus:outline-none focus:border-emerald-400/50 transition-colors">
            Search articles, topics, or authors...
          </div>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-white/40">
            ⌘K
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 space-y-6">
        {/* Topic Tags */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white">Popular Topics</h4>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'React', count: 234, active: true },
              { name: 'TypeScript', count: 189, active: false },
              { name: 'Next.js', count: 156, active: false },
              { name: 'Web Dev', count: 298, active: false }
            ].map((topic, index) => (
              <motion.button
                key={index}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-all duration-300 ${
                  topic.active 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                    : 'bg-white/5 text-white/70 border-white/20 hover:bg-white/10 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Hash className="h-3 w-3" />
                <span>{topic.name}</span>
                <span className="text-white/40">({topic.count})</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Featured Articles */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-white">Featured Articles</h4>
            <div className="flex items-center gap-1 text-xs text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              <span>Trending</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {[
              {
                title: "Modern React Patterns for 2024",
                author: "Sarah Chen",
                readTime: "8 min read",
                engagement: { views: "2.4k", likes: 156, comments: 23 },
                featured: true,
                rating: 4.8
              },
              {
                title: "TypeScript Best Practices",
                author: "Alex Rodriguez",
                readTime: "6 min read", 
                engagement: { views: "1.8k", likes: 124, comments: 18 },
                featured: false,
                rating: 4.6
              },
              {
                title: "Building Scalable APIs",
                author: "Jordan Kim",
                readTime: "12 min read",
                engagement: { views: "3.1k", likes: 203, comments: 45 },
                featured: false,
                rating: 4.9
              }
            ].map((article, index) => (
              <motion.div
                key={index}
                className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer border border-white/10 hover:border-white/20"
                whileHover={{ y: -2, x: 3 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {article.featured && (
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30">
                          Featured
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${
                              i < Math.floor(article.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-white/20'
                            }`} 
                          />
                        ))}
                        <span className="text-xs text-white/60 ml-1">{article.rating}</span>
                      </div>
                    </div>
                    
                    <h5 className="font-medium text-white mb-1 hover:text-emerald-300 transition-colors">
                      {article.title}
                    </h5>
                    
                    <div className="flex items-center gap-4 text-xs text-white/60 mb-3">
                      <span>by {article.author}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-white/60">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{article.engagement.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          <span>{article.engagement.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>{article.engagement.comments}</span>
                        </div>
                      </div>
                      
                      <motion.button
                        className="p-1.5 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Bookmark className="h-3 w-3" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-xs font-medium">
                    {article.author.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            className="bg-white/5 rounded-lg p-3 text-center"
            whileHover={{ y: -2 }}
          >
            <div className="text-lg font-bold text-white">1.2k</div>
            <div className="text-xs text-white/60">Articles</div>
          </motion.div>
          
          <motion.div
            className="bg-white/5 rounded-lg p-3 text-center"
            whileHover={{ y: -2 }}
          >
            <div className="text-lg font-bold text-white">450</div>
            <div className="text-xs text-white/60">Authors</div>
          </motion.div>
          
          <motion.div
            className="bg-white/5 rounded-lg p-3 text-center"
            whileHover={{ y: -2 }}
          >
            <div className="text-lg font-bold text-white">8.5k</div>
            <div className="text-xs text-white/60">Readers</div>
          </motion.div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="text-xs text-white/60">
            Updated 5 minutes ago
          </div>
          
          <motion.button
            className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-xs border border-emerald-500/30 transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            Load More
          </motion.button>
        </div>
      </div>
    </div>
  );
} 