"use client";

import { Shield, Eye, Lock, Database, User, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Navigation Header */}
      <nav className="border-b border-gray-800 lg:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-bold">Quilly</span>
            </div>
            <a href="/" className="text-sm text-gray-400 hover:text-white">
              ← Back to Home
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6">
            <Shield className="h-8 w-8 sm:h-12 sm:w-12 text-blue-500 mb-2 sm:mb-0 sm:mr-4" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Privacy Policy
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-2 sm:px-0">
            Your privacy is important to us. This policy explains how we
            collect, use, and protect your information.
          </p>
          <p className="text-sm text-gray-400 mt-3 sm:mt-4">
            Last updated: January 2025
          </p>
        </div>

        <div className="space-y-8 sm:space-y-12">
          <Card className="bg-gray-800/30 border-gray-700/50">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Database className="h-8 w-8 text-blue-500 mr-4" />
                <h2 className="text-3xl font-semibold">
                  Information We Collect
                </h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-400">
                    Account Information
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Email address (required for account creation)</li>
                    <li>• Name and profile information you provide</li>
                    <li>• Profile bio and writing preferences</li>
                    <li>• Authentication data (passwords are encrypted)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-400">
                    Content Information
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Articles and posts you create</li>
                    <li>• Comments and interactions</li>
                    <li>• Reading preferences and engagement data</li>
                    <li>• Tags and categories you use</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-400">
                    Usage Information
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>
                      • How you use our platform (reading, writing patterns)
                    </li>
                    <li>• Device information and browser type</li>
                    <li>• IP address and general location data</li>
                    <li>• Performance and analytics data</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/30 border-gray-700/50">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Eye className="h-8 w-8 text-green-500 mr-4" />
                <h2 className="text-3xl font-semibold">
                  How We Use Your Information
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-green-400">
                    Service Operation
                  </h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Provide and maintain our writing platform</li>
                    <li>• Authenticate and manage your account</li>
                    <li>• Enable content creation and sharing</li>
                    <li>• Process and display your articles</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-green-400">
                    Improvement & Analytics
                  </h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Analyze platform usage to improve features</li>
                    <li>• Provide writing and reading analytics</li>
                    <li>• Recommend relevant content</li>
                    <li>• Detect and prevent spam or abuse</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-green-400">
                    Communication
                  </h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Send important account notifications</li>
                    <li>• Respond to your support requests</li>
                    <li>• Send optional newsletters (with consent)</li>
                    <li>• Notify about platform updates</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-green-400">
                    Legal Compliance
                  </h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Comply with applicable laws</li>
                    <li>• Protect our rights and users</li>
                    <li>• Enforce our terms of service</li>
                    <li>• Handle legal requests properly</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/30 border-gray-700/50">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Lock className="h-8 w-8 text-yellow-500 mr-4" />
                <h2 className="text-3xl font-semibold">
                  Data Protection & Security
                </h2>
              </div>
              <div className="space-y-6">
                <p className="text-gray-300 leading-relaxed">
                  We implement industry-standard security measures to protect
                  your personal information. This includes encryption, secure
                  data transmission, and regular security audits.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-yellow-400">
                      Technical Safeguards
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• SSL/TLS encryption for data transmission</li>
                      <li>• Encrypted password storage</li>
                      <li>• Regular security updates and patches</li>
                      <li>• Secure database configurations</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-yellow-400">
                      Access Controls
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Limited employee access to user data</li>
                      <li>• Multi-factor authentication for admin accounts</li>
                      <li>• Regular access reviews and monitoring</li>
                      <li>• Secure API endpoints with authentication</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/30 border-gray-700/50">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <User className="h-8 w-8 text-purple-500 mr-4" />
                <h2 className="text-3xl font-semibold">
                  Your Rights & Choices
                </h2>
              </div>
              <div className="space-y-6">
                <p className="text-gray-300 leading-relaxed">
                  You have control over your personal information. Here are the
                  rights and choices available to you:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-purple-400">
                      Data Access & Control
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Access your personal data</li>
                      <li>• Update your profile information</li>
                      <li>• Download your content</li>
                      <li>• Delete your account and data</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-purple-400">
                      Communication Preferences
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Opt out of marketing emails</li>
                      <li>• Control notification settings</li>
                      <li>• Manage email frequency</li>
                      <li>• Update contact preferences</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/30 border-gray-700/50">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Mail className="h-8 w-8 text-red-500 mr-4" />
                <h2 className="text-3xl font-semibold">Contact Us</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  If you have any questions about this Privacy Policy or how we
                  handle your data, please do not hesitate to contact us.
                </p>
                <div className="bg-gray-900/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 text-red-400">
                    Get in Touch
                  </h3>
                  <div className="space-y-2 text-gray-300">
                    <p>
                      <strong>Email:</strong> privacy@quilly.com
                    </p>
                    <p>
                      <strong>Support:</strong> help@quilly.com
                    </p>
                    <p>
                      <strong>Address:</strong> 123 Content Street, Writing
                      City, WC 12345
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-gray-400 text-sm">
            <p>
              This privacy policy may be updated from time to time. We will
              notify you of any significant changes via email or through our
              platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
