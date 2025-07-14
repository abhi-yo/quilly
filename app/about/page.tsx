"use client";

import { PenTool, Users, Target, Heart, Zap, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Navigation Header */}
      <nav className="border-b border-gray-800 lg:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <PenTool className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-bold">Quilly</span>
            </div>
            <a href="/" className="text-sm text-gray-400 hover:text-white">
              ← Back to Home
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6">
            <PenTool className="h-8 w-8 sm:h-12 sm:w-12 text-blue-500 mb-2 sm:mb-0 sm:mr-4" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              About Quilly
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
            We&apos;re building the modern writing platform for professionals
            who value quality over quantity. Join our community of writers and
            readers in a distraction-free environment.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-16">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6">
              Our Mission
            </h2>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              In a world filled with noise and distractions, Quilly provides a
              sanctuary for thoughtful writing and meaningful content
              consumption. We believe that quality content deserves a platform
              that respects both creators and readers.
            </p>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              Our mission is to create a sustainable ecosystem where writers can
              focus on their craft and readers can discover truly valuable
              content without the clutter of advertisements and clickbait.
            </p>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6">
              Why Quilly?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Target className="h-6 w-6 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">
                    Focus on Quality
                  </h4>
                  <p className="text-gray-400 text-sm">
                    No distractions, just pure focus on creating and consuming
                    great content.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Users className="h-6 w-6 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">
                    Community Driven
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Built by writers, for writers and readers who appreciate
                    thoughtful content.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Shield className="h-6 w-6 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">
                    Content Protection
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Blockchain-powered copyright protection for your
                    intellectual property.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8 sm:mb-12">
            Our Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="bg-gray-800/30 border-gray-700/50">
              <CardContent className="p-8 text-center">
                <div className="p-3 bg-gray-700/50 rounded-xl w-fit mx-auto mb-6">
                  <Heart className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Passion</h3>
                <p className="text-gray-400 leading-relaxed">
                  We&apos;re passionate about creating tools that empower
                  writers and enhance the reading experience.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-gray-700/50">
              <CardContent className="p-8 text-center">
                <div className="p-3 bg-gray-700/50 rounded-xl w-fit mx-auto mb-6">
                  <Zap className="h-8 w-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Innovation</h3>
                <p className="text-gray-400 leading-relaxed">
                  We leverage cutting-edge technology like blockchain and AI to
                  solve real problems for content creators.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-gray-700/50">
              <CardContent className="p-8 text-center">
                <div className="p-3 bg-gray-700/50 rounded-xl w-fit mx-auto mb-6">
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Community</h3>
                <p className="text-gray-400 leading-relaxed">
                  We believe in the power of community and building connections
                  between writers and readers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6">
            Join Our Journey
          </h2>
          <p className="text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto px-2 sm:px-0">
            Whether you&apos;re a writer looking to share your thoughts or a
            reader seeking quality content, Quilly is designed for you. Join us
            in building the future of content publishing.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href="/auth/signup"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors w-full sm:w-auto"
            >
              Start Writing Today
            </a>
            <a
              href="/explore"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-transparent border border-gray-600 text-white hover:bg-gray-800/40 font-medium rounded-xl transition-colors w-full sm:w-auto"
            >
              Explore Articles
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
