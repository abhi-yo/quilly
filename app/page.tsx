"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PenTool,
  BookOpen,
  BarChart3,
  Search,
  Users,
  ArrowRight,
  Check,
  Star,
  FileCheck,
  Eye,
  Plus,
  FileText,
  Shield,
  TrendingUp,
  User,
  Edit3,
  Clock,
  Heart,
  Bookmark,
} from "lucide-react";
import { DashboardMockup } from "@/components/mockups/dashboard-mockup";
import { WritingMockup } from "@/components/mockups/writing-mockup";
import { ExploreMockup } from "@/components/mockups/explore-mockup";
import { motion } from "framer-motion";
import { Instrument_Serif } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
});

function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="border-b border-gray-800 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <PenTool className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold">Quilly</span>
            </div>

            {/* Center Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Features
              </Link>
              <Link
                href="#testimonials"
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Reviews
              </Link>
              <Link
                href="#contact"
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Contact
              </Link>
            </div>

            {/* Login Button */}
            <div className="flex items-center">
              <Link href="/auth/signin">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium transition-colors">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 md:pt-48 md:pb-28 lg:pt-52 lg:pb-36 overflow-hidden">
        {/* Bottom glow effect */}
        <div className="absolute inset-x-0 bottom-0 z-0 flex items-end justify-center pointer-events-none -mb-40">
          <div className="h-32 w-[30rem] sm:h-40 sm:w-[40rem] rounded-full bg-blue-500/30 opacity-200 blur-[90px] contrast-[1.2]" />
        </div>

        {/* Grid pattern background */}
        <div
          className="absolute inset-0 z-0 opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' width='64' height='64' fill='none' stroke='rgb(255 255 255 / 0.07)'%3e%3cpath d='M0 .5H63.5V64'/%3e%3c/svg%3e")`,
            backgroundSize: "64px 64px",
          }}
        />

        {/* Decorative Shapes */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 sm:-translate-x-1/4 sm:-translate-y-1/4 z-10">
          <div className="w-[25rem] h-[25rem] sm:w-[40rem] sm:h-[40rem] bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl" />
        </div>
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 sm:translate-x-1/4 sm:translate-y-1/4 z-10">
          <div className="w-[20rem] h-[20rem] sm:w-[30rem] sm:h-[30rem] bg-gradient-to-tl from-gray-500/5 via-gray-500/5 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="max-w-4xl mx-auto text-center -mt-10 sm:-mt-20">
            <div className="relative max-w-5xl mx-auto mb-4 sm:mb-6 md:mb-8 mt-6 sm:mt-10">
              <h1 className="text-4xl xs:text-5xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.2] sm:leading-[1.15] md:leading-[1.1] font-medium text-center">
                <div className="mb-1 md:mb-2">
                  <span
                    className={`${instrumentSerif.className} text-white italic`}
                    style={{
                      fontWeight: 400,
                      letterSpacing: "-0.02em",
                      fontSize: "1.2em",
                    }}
                  >
                    Focus On Writing
                  </span>
                </div>
                <div>
                  <span className="text-blue-500 tracking-tight font-bold">
                    Not Distractions
                  </span>
                </div>
              </h1>
            </div>

            <p className="text-lg sm:text-lg text-gray-300 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
              Quilly is the modern writing platform for professionals who value
              quality over quantity. Join writers and readers in a
              distraction-free environment.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-2 sm:px-0">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-12 sm:px-9 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto min-w-[280px] sm:min-w-0"
                >
                  Start Writing <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border border-gray-600 text-white hover:bg-gray-800/40 hover:border-gray-500 font-medium px-12 sm:px-9 py-3 rounded-xl transition-all duration-200 w-full sm:w-auto min-w-[280px] sm:min-w-0"
                >
                  Explore Articles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* App Preview */}
      <section className="hidden md:block pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            {/* Background cards for layered effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl transform rotate-1 scale-[0.98] opacity-30 blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-750 to-gray-850 rounded-2xl transform -rotate-1 scale-[0.99] opacity-50 blur-[1px]"></div>

            {/* Main card */}
            <div className="relative bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl p-[3px] shadow-2xl border border-white/10">
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden">
                {/* Interactive Dashboard Preview */}
                <div className="w-full aspect-[2/1] relative">
                  <motion.div
                    className="w-full h-full bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white p-6 rounded-2xl overflow-hidden flex flex-col"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    {/* Header with view toggle */}
                    <motion.div
                      className="flex items-center justify-between mb-6"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <BarChart3 className="h-4 w-4 text-blue-400" />
                        </motion.div>
                        <h1 className="text-lg font-semibold text-white">
                          Dashboard
                        </h1>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* View Toggle */}
                        <motion.div
                          className="flex bg-gray-800/50 rounded-lg p-1 border border-gray-700/50"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          <button className="px-3 py-1.5 text-xs rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                            <Edit3 className="h-3 w-3" />
                            Writer
                          </button>
                          <button className="px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Reader
                          </button>
                        </motion.div>

                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            A
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Stats Cards */}
                    <motion.div
                      className="grid grid-cols-4 gap-4 mb-6"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {[
                        {
                          label: "Published",
                          value: "12",
                          subtitle: "articles",
                          icon: FileText,
                        },
                        {
                          label: "Total Views",
                          value: "2.4K",
                          subtitle: "this month",
                          icon: Eye,
                        },
                        {
                          label: "Bookmarked",
                          value: "156",
                          subtitle: "by readers",
                          icon: Bookmark,
                        },
                        {
                          label: "Protected",
                          value: "8",
                          subtitle: "blockchain",
                          icon: Shield,
                        },
                      ].map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                          <motion.div
                            key={index}
                            className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            whileHover={{ y: -2 }}
                          >
                            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                              <IconComponent className="h-4 w-4" />
                              {stat.label}
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">
                              {stat.value}
                            </div>
                            <div className="text-xs text-gray-500">
                              {stat.subtitle}
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>

                    {/* Main Content - Articles and Analytics */}
                    <div className="grid grid-cols-3 gap-6 flex-1">
                      {/* Articles Section */}
                      <motion.div
                        className="col-span-2 bg-gray-800/30 border border-gray-700/50 rounded-xl p-4"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-white">
                              My Published Articles
                            </h3>
                            <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-300">
                              Writer View
                            </span>
                          </div>
                          <span className="text-xs text-blue-400 cursor-pointer">
                            View All
                          </span>
                        </div>

                        {/* Articles List */}
                        <div className="space-y-3">
                          {[
                            {
                              title: "Protecting Your Words in the Digital Age",
                              views: "1.2K",
                              date: "2 days ago",
                            },
                            {
                              title:
                                "Why Blockchain Matters for Modern Writers",
                              views: "856",
                              date: "4 days ago",
                            },
                            {
                              title:
                                "The Future of Creativity: How Blockchain...",
                              views: "643",
                              date: "1 week ago",
                              protected: true,
                            },
                          ].map((article, i) => (
                            <motion.div
                              key={i}
                              className="flex items-center justify-between py-2"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 1 + i * 0.1 }}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    article.protected
                                      ? "bg-green-400"
                                      : "bg-blue-400"
                                  }`}
                                />
                                <div>
                                  <div className="text-sm text-white">
                                    {article.title}
                                  </div>
                                  <div className="text-xs text-gray-400 flex items-center gap-2">
                                    <span>{article.date}</span>
                                    {article.protected && (
                                      <span className="text-green-400 flex items-center gap-1">
                                        <Shield className="h-3 w-3" />
                                        Protected
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Eye className="h-3 w-3" />
                                <span>{article.views}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Growth Summary */}
                        <div className="mt-4 pt-3 border-t border-gray-700/50 flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            This month
                          </span>
                          <span className="text-xs text-green-400 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            +15% growth
                          </span>
                        </div>
                      </motion.div>

                      {/* Analytics Panel */}
                      <motion.div
                        className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1 }}
                      >
                        <h3 className="text-sm font-semibold text-white mb-4">
                          Analytics
                        </h3>

                        {/* Simple Chart */}
                        <div className="h-24 mb-4 bg-gray-900/50 rounded-lg p-3">
                          <svg viewBox="0 0 100 32" className="w-full h-full">
                            <motion.polyline
                              points="5,28 25,20 45,24 65,16 85,8"
                              fill="none"
                              stroke="#3B82F6"
                              strokeWidth="2"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ delay: 1.2, duration: 1.5 }}
                            />
                          </svg>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            This week
                          </span>
                          <span className="text-xs text-green-400">+23%</span>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Value Proposition */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold mb-3 sm:mb-4">
              Built for writers and readers
            </h2>
            <p className="text-lg text-gray-400">
              Two distinct experiences, one powerful platform
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {/* For Writers */}
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-gray-700/50 rounded-lg mr-3">
                  <PenTool className="h-5 w-5 text-gray-300" />
                </div>
                <h3 className="text-xl sm:text-2xl font-medium">For Writers</h3>
              </div>

              <p className="text-gray-400 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
                Create, publish, and manage high-quality articles with analytics
                insights
              </p>

              <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                <div className="flex items-start">
                  <div className="p-0.5 bg-gray-700/50 rounded mr-3 mt-1">
                    <Check className="h-3 w-3 text-gray-300" />
                  </div>
                  <div>
                    <h4 className="font-normal text-white mb-1">
                      Distraction-free editor
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Clean, minimal writing environment
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-0.5 bg-gray-700/50 rounded mr-3 mt-1">
                    <Check className="h-3 w-3 text-gray-300" />
                  </div>
                  <div>
                    <h4 className="font-normal text-white mb-1">
                      Analytics & insights
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Track views, engagement, and growth
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-0.5 bg-gray-700/50 rounded mr-3 mt-1">
                    <Check className="h-3 w-3 text-gray-300" />
                  </div>
                  <div>
                    <h4 className="font-normal text-white mb-1">
                      Content protection
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Secure your work with blockchain-based copyright
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-gray-700/50 h-48 sm:h-64">
                <WritingMockup />
              </div>
            </div>

            {/* For Readers */}
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-gray-700/50 rounded-lg mr-3">
                  <BookOpen className="h-5 w-5 text-gray-300" />
                </div>
                <h3 className="text-xl sm:text-2xl font-medium">For Readers</h3>
              </div>

              <p className="text-gray-400 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
                Discover, read, and engage with well-written articles on topics
                you care about
              </p>

              <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                <div className="flex items-start">
                  <div className="p-0.5 bg-gray-700/50 rounded mr-3 mt-1">
                    <Check className="h-3 w-3 text-gray-300" />
                  </div>
                  <div>
                    <h4 className="font-normal text-white mb-1">
                      Curated quality content
                    </h4>
                    <p className="text-gray-400 text-sm">
                      High-quality articles from expert writers
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-0.5 bg-gray-700/50 rounded mr-3 mt-1">
                    <Check className="h-3 w-3 text-gray-300" />
                  </div>
                  <div>
                    <h4 className="font-normal text-white mb-1">
                      Smart discovery
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Find content that matters to you
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-0.5 bg-gray-700/50 rounded mr-3 mt-1">
                    <Check className="h-3 w-3 text-gray-300" />
                  </div>
                  <div>
                    <h4 className="font-normal text-white mb-1">
                      Distraction-free reading
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Clean, optimized reading experience
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-gray-700/50 h-48 sm:h-64">
                <ExploreMockup />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-lg text-gray-400">
              Powerful features wrapped in a minimal interface
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-800/30 border-gray-700/50">
              <CardContent className="p-8 text-center">
                <div className="p-3 bg-gray-700/50 rounded-xl w-fit mx-auto mb-6">
                  <BarChart3 className="h-6 w-6 text-gray-300" />
                </div>
                <h3 className="text-xl font-normal mb-3">
                  Analytics & Insights
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Track your article performance with detailed analytics
                  including views, reads, and engagement metrics.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-gray-700/50">
              <CardContent className="p-8 text-center">
                <div className="p-3 bg-gray-700/50 rounded-xl w-fit mx-auto mb-6">
                  <FileCheck className="h-6 w-6 text-gray-300" />
                </div>
                <h3 className="text-xl font-normal mb-3">Content Protection</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Protect your intellectual property with blockchain-based
                  copyright registration and verification.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-gray-700/50">
              <CardContent className="p-8 text-center">
                <div className="p-3 bg-gray-700/50 rounded-xl w-fit mx-auto mb-6">
                  <Users className="h-6 w-6 text-gray-300" />
                </div>
                <h3 className="text-xl font-normal mb-3">
                  Community Engagement
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Connect with other writers and readers through comments,
                  discussions, and meaningful interactions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold mb-4">
              Trusted by professionals
            </h2>
            <p className="text-xl text-gray-400">
              See what our community has to say about their experience
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-8">
              <div className="flex mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-gray-400 fill-current"
                  />
                ))}
              </div>
              <blockquote className="text-gray-300 mb-8 text-base leading-relaxed">
                &ldquo;The writing experience is incredible. No distractions,
                just pure focus on creating great content. The analytics help me
                understand what resonates with my audience.&rdquo;
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full mr-4 flex items-center justify-center">
                  <span className="text-white font-normal text-sm">PS</span>
                </div>
                <div>
                  <div className="font-normal text-white">Priya Sharma</div>
                  <div className="text-gray-400 text-xs">
                    Tech Writer & Content Strategist
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-8">
              <div className="flex mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-gray-400 fill-current"
                  />
                ))}
              </div>
              <blockquote className="text-gray-300 mb-8 text-base leading-relaxed">
                &ldquo;Finally, a platform that prioritizes quality content over
                noise. The reading experience is unmatched, and I discover
                amazing articles daily.&rdquo;
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full mr-4 flex items-center justify-center">
                  <span className="text-white font-normal text-sm">AK</span>
                </div>
                <div>
                  <div className="font-normal text-white">Arjun Kumar</div>
                  <div className="text-gray-400 text-xs">Product Manager</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-8">
              <div className="flex mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-gray-400 fill-current"
                  />
                ))}
              </div>
              <blockquote className="text-gray-300 mb-8 text-base leading-relaxed">
                &ldquo;The analytics dashboard is a game-changer. I can see
                exactly how my content performs and my engagement has increased
                significantly since joining.&rdquo;
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full mr-4 flex items-center justify-center">
                  <span className="text-white font-normal text-sm">RG</span>
                </div>
                <div>
                  <div className="font-normal text-white">Rhea Gupta</div>
                  <div className="text-gray-400 text-xs">
                    Content Creator & Blogger
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Join thousands of writers and readers who&apos;ve made Quilly their
            home for quality content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium text-lg px-8 py-3 rounded-xl transition-colors"
              >
                Start Writing Today <PenTool className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-gray-600 text-white hover:bg-gray-800/40 font-medium text-lg px-8 py-3 rounded-xl transition-colors"
              >
                Explore Articles <BookOpen className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <PenTool className="h-6 w-6" />
                <span className="text-lg font-semibold">Quilly</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                The modern writing platform for professionals who value quality
                over quantity.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link
                    href="/auth/signup"
                    className="hover:text-white transition-colors"
                  >
                    For Writers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/signin"
                    className="hover:text-white transition-colors"
                  >
                    For Readers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-white transition-colors"
                  >
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/explore"
                    className="hover:text-white transition-colors"
                  >
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link
                    href="/help"
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="hover:text-white transition-colors"
                  >
                    Writing Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="hover:text-white transition-colors"
                  >
                    Best Practices
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resources"
                    className="hover:text-white transition-colors"
                  >
                    Analytics Tools
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Quilly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return null;
  }

  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="w-full overflow-x-hidden">
      <LandingPage />
    </div>
  );
}
