"use client";

import {
  HelpCircle,
  Book,
  Search,
  User,
  PenTool,
  Shield,
  Settings,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("getting-started");

  const categories = [
    { id: "getting-started", name: "Getting Started", icon: Book },
    { id: "writing", name: "Writing & Publishing", icon: PenTool },
    { id: "account", name: "Account Management", icon: User },
    { id: "blockchain", name: "Blockchain Features", icon: Shield },
    { id: "settings", name: "Settings & Privacy", icon: Settings },
    { id: "troubleshooting", name: "Troubleshooting", icon: HelpCircle },
  ];

  const helpContent = {
    "getting-started": [
      {
        question: "How do I create an account?",
        answer:
          "Click 'Sign Up' on the homepage, enter your email and password, verify your email address, and complete your profile setup by choosing your role (Writer or Reader).",
      },
      {
        question: "What's the difference between Writer and Reader accounts?",
        answer:
          "Writers can create, publish, and manage articles with access to analytics. Readers can browse, read, and engage with content through comments and interactions.",
      },
      {
        question: "How do I navigate the platform?",
        answer:
          "Use the sidebar menu to access Dashboard, Write (for writers), Articles, Explore, Profile, and Settings. The Dashboard provides an overview of your activity and quick actions.",
      },
      {
        question: "Can I change my account type later?",
        answer:
          "Currently, you cannot change between Writer and Reader account types. You would need to create a new account with your preferred role.",
      },
    ],
    writing: [
      {
        question: "How do I write and publish an article?",
        answer:
          "Go to the Write page from the sidebar, use our rich text editor to create your content, add tags for better discoverability, preview your article, and click Publish when ready.",
      },
      {
        question: "What formatting options are available?",
        answer:
          "Our editor supports bold, italic, headers, lists, links, and basic formatting. On mobile, we provide a simplified interface for better writing experience.",
      },
      {
        question: "How do tags work?",
        answer:
          "Tags help categorize your content and make it discoverable. You can add multiple tags to each article. Popular tags are suggested as you type.",
      },
      {
        question: "Can I save drafts?",
        answer:
          "Yes, the editor automatically saves your work as you type. You can also manually save drafts and return to edit them later before publishing.",
      },
      {
        question: "How do I edit or delete published articles?",
        answer:
          "Visit your Dashboard or Articles page, find your article, and use the edit or delete options. Note that deleting published articles is permanent.",
      },
    ],
    account: [
      {
        question: "How do I update my profile?",
        answer:
          "Go to Profile in the sidebar menu, click Edit Profile, and update your name, bio, or other information. Changes are saved automatically.",
      },
      {
        question: "How do I change my password?",
        answer:
          "Go to Settings, find the Password section, enter your current password and new password, then confirm the change.",
      },
      {
        question: "Can I delete my account?",
        answer:
          "Yes, you can delete your account in Settings under Account Management. This action is permanent and cannot be undone.",
      },
      {
        question: "How do I reset my password if I forgot it?",
        answer:
          "Click 'Forgot Password' on the sign-in page, enter your email address, and follow the instructions in the reset email we send you.",
      },
    ],
    blockchain: [
      {
        question: "What is blockchain copyright protection?",
        answer:
          "Our blockchain feature creates an immutable record of your content on the blockchain, providing cryptographic proof of ownership and creation timestamp.",
      },
      {
        question: "How do I connect my wallet?",
        answer:
          "Go to the Blockchain page, click Connect Wallet, and follow the prompts to connect your MetaMask or compatible Web3 wallet.",
      },
      {
        question: "What are QUILL tokens?",
        answer:
          "QUILL tokens are our platform's cryptocurrency used for tipping writers and participating in governance decisions. You can claim tokens from our faucet.",
      },
      {
        question: "How does the tipping system work?",
        answer:
          "Readers can tip writers using QUILL tokens by clicking the tip button on articles. Writers receive tokens directly to their connected wallet.",
      },
      {
        question: "Is blockchain copyright legally binding?",
        answer:
          "Blockchain records provide strong evidence of creation and ownership, but legal enforceability depends on your jurisdiction's laws regarding digital evidence.",
      },
    ],
    settings: [
      {
        question: "How do I manage my privacy settings?",
        answer:
          "Visit Settings > Privacy to control who can see your profile, articles, and contact you. You can also manage notification preferences here.",
      },
      {
        question: "How do I control email notifications?",
        answer:
          "Go to Settings > Notifications to choose which emails you receive, including new followers, comments, and platform updates.",
      },
      {
        question: "Can I make my profile private?",
        answer:
          "You can control profile visibility in Settings. You can hide your profile from public searches while keeping your published articles visible.",
      },
      {
        question: "How do I export my data?",
        answer:
          "Contact our support team to request a data export. We'll provide your articles, comments, and profile data in a downloadable format.",
      },
    ],
    troubleshooting: [
      {
        question: "I can't sign in to my account",
        answer:
          "Check that you're using the correct email and password. If you still can't access your account, use the password reset option or contact support.",
      },
      {
        question: "My articles aren't showing up",
        answer:
          "Ensure your articles are published (not saved as drafts). If published articles are missing, try refreshing the page or contact support.",
      },
      {
        question: "The editor is not working properly",
        answer:
          "Try refreshing the page, clearing your browser cache, or using a different browser. Contact support if the issue persists.",
      },
      {
        question: "I'm having issues with wallet connection",
        answer:
          "Ensure you have MetaMask installed and unlocked. Check that you're connected to the correct network (Polygon Amoy testnet).",
      },
      {
        question: "How do I report a bug or issue?",
        answer:
          "Use the Contact form with 'Bug Report' as the subject, or email us directly at support@quilly.com with a detailed description of the issue.",
      },
    ],
  };

  const filteredContent = helpContent[
    activeCategory as keyof typeof helpContent
  ].filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Navigation Header */}
      <nav className="border-b border-gray-800 lg:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-6 w-6 text-blue-500" />
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
            <HelpCircle className="h-8 w-8 sm:h-12 sm:w-12 text-blue-500 mb-2 sm:mb-0 sm:mr-4" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Help Center
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8 px-2 sm:px-0">
            Find answers to common questions and learn how to make the most of
            Quilly.
          </p>

          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-semibold mb-6">Categories</h2>
            <div className="space-y-2">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left p-4 rounded-lg transition-colors flex items-center ${
                      activeCategory === category.id
                        ? "bg-blue-500/20 border border-blue-500/30 text-blue-400"
                        : "bg-gray-800/30 border border-gray-700/50 text-gray-300 hover:bg-gray-700/30"
                    }`}
                  >
                    <IconComponent className="h-5 w-5 mr-3" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Help Content */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="text-3xl font-semibold mb-2">
                {categories.find((cat) => cat.id === activeCategory)?.name}
              </h2>
              <p className="text-gray-400">
                {filteredContent.length}{" "}
                {filteredContent.length === 1 ? "article" : "articles"} found
              </p>
            </div>

            <div className="space-y-6">
              {filteredContent.map((item, index) => (
                <Card key={index} className="bg-gray-800/30 border-gray-700/50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-blue-400 mb-4">
                      {item.question}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {item.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredContent.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No results found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or browse a different
                  category.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-16 bg-gray-900/50 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-semibold mb-6">Still need help?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Can&apos;t find what you&apos;re looking for? Our support team is
            here to help you get the most out of Quilly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Contact Support
            </a>
            <a
              href="mailto:support@quilly.com"
              className="inline-flex items-center justify-center px-8 py-3 bg-transparent border border-gray-600 text-white hover:bg-gray-800/40 font-medium rounded-xl transition-colors"
            >
              Email Us Directly
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
