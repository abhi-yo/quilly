"use client";

import { motion } from "framer-motion";
import { Bold, Italic, Link, Image, Type, AlignLeft, AlignCenter, Save, Eye, Settings, Clock, BarChart2 } from "lucide-react";

export function WritingMockup() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent" />
      
      {/* Header with Toolbar */}
      <div className="relative z-10 p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30">
              <Type className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Article Editor</h3>
              <p className="text-sm text-white/60">Draft • Auto-saved 2 min ago</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white/70 transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Eye className="h-3 w-3" />
              <span>Preview</span>
            </motion.button>
            <motion.button
              className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm text-white transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Save className="h-3 w-3" />
              <span>Publish</span>
            </motion.button>
          </div>
        </div>
        
        {/* Formatting Toolbar */}
        <div className="flex items-center gap-1 p-2 bg-white/5 rounded-lg">
          {[
            { icon: Bold, label: "Bold" },
            { icon: Italic, label: "Italic" },
            { icon: Link, label: "Link" },
            { icon: Image, label: "Image" },
            { icon: AlignLeft, label: "Align Left" },
            { icon: AlignCenter, label: "Align Center" }
          ].map((tool, index) => (
            <motion.button
              key={index}
              className="p-2 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <tool.icon className="h-4 w-4" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-10 p-6 space-y-6">
        {/* Title Input */}
        <div className="space-y-3">
          <motion.div
            className="bg-white/5 rounded-lg p-4 border border-white/10 focus-within:border-purple-400/50 transition-colors"
            whileFocus={{ scale: 1.01 }}
          >
            <div className="text-2xl font-bold text-white placeholder-white/40">
              Building Modern Web Applications with React and TypeScript
            </div>
          </motion.div>
          
          <motion.div
            className="bg-white/5 rounded-lg p-3 border border-white/10 focus-within:border-purple-400/50 transition-colors"
            whileFocus={{ scale: 1.01 }}
          >
            <div className="text-white/70 placeholder-white/40">
              A comprehensive guide to creating scalable, type-safe applications
            </div>
          </motion.div>
        </div>

        {/* Content Preview */}
        <div className="space-y-4">
          <div className="bg-white/5 rounded-lg p-4 space-y-3">
            <div className="text-white/90 leading-relaxed">
              In the rapidly evolving landscape of web development, the combination of React and TypeScript has emerged as a powerful duo for building robust, scalable applications. This comprehensive guide will walk you through the essential patterns and best practices.
            </div>
            
            <div className="text-white/90 leading-relaxed">
                             <span className="font-semibold text-purple-400">TypeScript</span> brings static typing to JavaScript, helping catch errors at compile time and providing excellent IDE support. When combined with React&apos;s component-based architecture, it creates a development experience that&apos;s both productive and maintainable.
            </div>
            
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <div className="h-1 w-1 bg-white/40 rounded-full"></div>
              <span>Section: Getting Started</span>
            </div>
          </div>
          
          {/* Writing Stats */}
          <div className="grid grid-cols-3 gap-3">
            <motion.div
              className="bg-white/5 rounded-lg p-3 text-center"
              whileHover={{ y: -2 }}
            >
              <div className="text-xl font-bold text-white">1,247</div>
              <div className="text-xs text-white/60">Words</div>
            </motion.div>
            
            <motion.div
              className="bg-white/5 rounded-lg p-3 text-center"
              whileHover={{ y: -2 }}
            >
              <div className="text-xl font-bold text-white">6 min</div>
              <div className="text-xs text-white/60">Read Time</div>
            </motion.div>
            
            <motion.div
              className="bg-white/5 rounded-lg p-3 text-center"
              whileHover={{ y: -2 }}
            >
              <div className="text-xl font-bold text-white">A+</div>
              <div className="text-xs text-white/60">SEO Score</div>
            </motion.div>
          </div>
        </div>

        {/* Tags & Categories */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white">Tags & Categories</h4>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Web Development', 'JavaScript'].map((tag, index) => (
              <motion.span
                key={index}
                className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-500/30"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {tag}
              </motion.span>
            ))}
            <motion.button
              className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-full text-xs border border-white/20 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              + Add Tag
            </motion.button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-4 text-xs text-white/60">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Last saved: 2 min ago</span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart2 className="h-3 w-3" />
              <span>Readability: Good</span>
            </div>
          </div>
          
          <motion.button
            className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
            whileHover={{ scale: 1.1, rotate: 90 }}
          >
            <Settings className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
} 