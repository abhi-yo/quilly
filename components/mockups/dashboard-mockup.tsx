"use client";

import { motion } from "framer-motion";
import { BarChart3, Eye, MessageSquare, TrendingUp, FileText, PenTool, Users, Calendar, Check, Plus, Bell } from "lucide-react";

export function DashboardMockup() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8 rounded-2xl overflow-hidden border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
            <PenTool className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Writing Dashboard</h1>
            <p className="text-white/60 text-sm mt-1">Welcome back, let&apos;s create something amazing</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <motion.div 
            className="p-3 hover:bg-white/10 rounded-xl transition-colors cursor-pointer border border-white/10"
            whileHover={{ scale: 1.05 }}
          >
            <Bell className="h-5 w-5 text-white/70" />
          </motion.div>
          <motion.div 
            className="p-3 hover:bg-white/10 rounded-xl transition-colors cursor-pointer border border-white/10"
            whileHover={{ scale: 1.05 }}
          >
            <Calendar className="h-5 w-5 text-white/70" />
          </motion.div>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold border border-blue-400/30 shadow-lg">
            A
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Analytics Card */}
        <motion.div 
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl hover:bg-white/8 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-semibold text-white">Analytics</h3>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <BarChart3 className="h-5 w-5 text-white/80" />
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-white/70 font-medium">Published</span>
                <span className="text-white font-bold text-lg">78%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-white to-gray-300 rounded-full h-3 shadow-lg"
                  initial={{ width: 0 }}
                  animate={{ width: "78%" }}
                  transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-white/70 font-medium">Drafts</span>
                <span className="text-white font-bold text-lg">22%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-green-400 to-green-500 rounded-full h-3 shadow-lg"
                  initial={{ width: 0 }}
                  animate={{ width: "22%" }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="text-white/60 text-sm">This month</div>
            <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
              <TrendingUp className="h-4 w-4" />
              <span>+12%</span>
            </div>
          </div>
        </motion.div>

        {/* Team Card */}
        <motion.div 
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl hover:bg-white/8 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-semibold text-white">Team</h3>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <Users className="h-5 w-5 text-white/80" />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center -space-x-3">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold border-3 border-black shadow-lg"
                whileHover={{ scale: 1.1, zIndex: 10 }}
              >
                AB
              </motion.div>
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold border-3 border-black shadow-lg"
                whileHover={{ scale: 1.1, zIndex: 10 }}
              >
                JD
              </motion.div>
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold border-3 border-black shadow-lg"
                whileHover={{ scale: 1.1, zIndex: 10 }}
              >
                MK
              </motion.div>
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-white font-semibold border-3 border-black shadow-lg"
                whileHover={{ scale: 1.1, zIndex: 10 }}
              >
                +2
              </motion.div>
            </div>
            
            <motion.button 
              className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl transition-all duration-300 text-white font-medium border border-white/20 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Invite
            </motion.button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="text-white/60 text-sm">Team size</div>
            <div className="text-white font-medium">5 members</div>
          </div>
        </motion.div>
      </div>

      {/* Upcoming Tasks */}
      <motion.div 
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl hover:bg-white/8 transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ y: -2 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-semibold text-white">Upcoming</h3>
            <p className="text-white/60 text-sm mt-1">Tasks and deadlines</p>
          </div>
          <motion.button 
            className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl transition-all duration-300 text-white font-medium border border-white/20 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All
          </motion.button>
        </div>
        
        <div className="space-y-4">
          <motion.div 
            className="flex items-center gap-5 p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 shadow-lg"
            whileHover={{ x: 8, scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-lg border-2 border-green-400 flex items-center justify-center shadow-lg">
              <Check className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-white font-semibold text-lg">Publish React Tutorial</div>
              <div className="text-white/60 text-sm mt-1">Complete the final review and publish</div>
            </div>
            <div className="text-white/50 font-medium">Yesterday</div>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-5 p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 shadow-lg"
            whileHover={{ x: 8, scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-6 h-6 bg-white/20 border-2 border-white/40 rounded-lg"></div>
            <div className="flex-1">
              <div className="text-white font-semibold text-lg">Review Article Drafts</div>
              <div className="text-white/60 text-sm mt-1">Check pending submissions for approval</div>
            </div>
            <div className="text-white/50 font-medium">Today</div>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-5 p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 shadow-lg"
            whileHover={{ x: 8, scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-6 h-6 bg-white/20 border-2 border-white/40 rounded-lg"></div>
            <div className="flex-1">
              <div className="text-white font-semibold text-lg">Update Author Bio</div>
              <div className="text-white/60 text-sm mt-1">Refresh profile information and photo</div>
            </div>
            <div className="text-white/50 font-medium">Tomorrow</div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
} 