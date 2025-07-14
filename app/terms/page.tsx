"use client";

import {
  FileText,
  Users,
  Shield,
  AlertTriangle,
  Scale,
  Gavel,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Navigation Header */}
      <nav className="border-b border-gray-800 lg:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Scale className="h-6 w-6 text-blue-500" />
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
            <Scale className="h-8 w-8 sm:h-12 sm:w-12 text-blue-500 mb-2 sm:mb-0 sm:mr-4" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Terms of Service
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-2 sm:px-0">
            These terms govern your use of Quilly and outline your rights and
            responsibilities as a user.
          </p>
          <p className="text-sm text-gray-400 mt-3 sm:mt-4">
            Last updated: January 2025
          </p>
        </div>

        <div className="space-y-8 sm:space-y-12">
          <Card className="bg-gray-800/30 border-gray-700/50">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <FileText className="h-8 w-8 text-blue-500 mr-4" />
                <h2 className="text-3xl font-semibold">Acceptance of Terms</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  By accessing and using Quilly, you accept and agree to be
                  bound by the terms and provision of this agreement. If you do
                  not agree to abide by these terms, please do not use this
                  service.
                </p>
                <p>
                  These Terms of Service constitute a legally binding agreement
                  between you and Quilly. We may update these terms from time to
                  time, and your continued use of our service indicates your
                  acceptance of any changes.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/30 border-gray-700/50">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Users className="h-8 w-8 text-green-500 mr-4" />
                <h2 className="text-3xl font-semibold">
                  User Accounts & Responsibilities
                </h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-green-400">
                    Account Creation
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>
                      • You must be at least 13 years old to create an account
                    </li>
                    <li>
                      • You must provide accurate and complete information
                    </li>
                    <li>
                      • You are responsible for maintaining account security
                    </li>
                    <li>
                      • You must notify us immediately of any unauthorized
                      access
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-green-400">
                    User Conduct
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Respect other users and their content</li>
                    <li>
                      • Do not engage in harassment, spam, or abusive behavior
                    </li>
                    <li>
                      • Do not share false, misleading, or harmful information
                    </li>
                    <li>• Comply with all applicable laws and regulations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/30 border-gray-700/50">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Shield className="h-8 w-8 text-purple-500 mr-4" />
                <h2 className="text-3xl font-semibold">
                  Content & Intellectual Property
                </h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-purple-400">
                    Your Content
                  </h3>
                  <div className="space-y-3 text-gray-300">
                    <p>
                      You retain ownership of all content you create on Quilly.
                      By posting content, you grant us a non-exclusive license
                      to display, distribute, and promote your content on our
                      platform.
                    </p>
                    <p>
                      You are responsible for ensuring that your content does
                      not infringe on the rights of others and complies with our
                      community guidelines.
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-purple-400">
                    Platform Content
                  </h3>
                  <div className="space-y-3 text-gray-300">
                    <p>
                      Quilly&apos;s platform, features, and design are protected
                      by copyright, trademark, and other laws. You may not copy,
                      modify, or distribute our platform without permission.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/30 border-gray-700/50">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <AlertTriangle className="h-8 w-8 text-yellow-500 mr-4" />
                <h2 className="text-3xl font-semibold">Prohibited Uses</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  The following activities are strictly prohibited on our
                  platform:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-yellow-400">
                      Content Violations
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Posting illegal, harmful, or offensive content</li>
                      <li>• Copyright or trademark infringement</li>
                      <li>• Spam, phishing, or malicious content</li>
                      <li>• False information or impersonation</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-yellow-400">
                      Technical Violations
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Attempting to hack or exploit our systems</li>
                      <li>• Using automated tools to access our platform</li>
                      <li>• Reverse engineering our software</li>
                      <li>• Overwhelming our servers with requests</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/30 border-gray-700/50">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Gavel className="h-8 w-8 text-red-500 mr-4" />
                <h2 className="text-3xl font-semibold">
                  Termination & Enforcement
                </h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-red-400">
                    Account Termination
                  </h3>
                  <div className="space-y-3 text-gray-300">
                    <p>
                      We reserve the right to suspend or terminate your account
                      if you violate these terms or engage in behavior that
                      harms our community or platform.
                    </p>
                    <p>
                      You may delete your account at any time through your
                      account settings. Upon termination, your access to the
                      platform will be revoked.
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-red-400">
                    Content Removal
                  </h3>
                  <div className="space-y-3 text-gray-300">
                    <p>
                      We may remove content that violates these terms or our
                      community guidelines. We will notify you when possible,
                      but immediate removal may be necessary in severe cases.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/30 border-gray-700/50">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Scale className="h-8 w-8 text-cyan-500 mr-4" />
                <h2 className="text-3xl font-semibold">
                  Disclaimers & Limitations
                </h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-cyan-400">
                    Service Availability
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    While we strive to maintain constant availability, Quilly is
                    provided &quot;as is&quot; without warranties of any kind.
                    We do not guarantee uninterrupted service and may perform
                    maintenance that temporarily affects availability.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-cyan-400">
                    Limitation of Liability
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    To the fullest extent permitted by law, Quilly shall not be
                    liable for any indirect, incidental, special, or
                    consequential damages resulting from your use of our
                    platform.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/30 border-gray-700/50">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <FileText className="h-8 w-8 text-orange-500 mr-4" />
                <h2 className="text-3xl font-semibold">Contact & Legal</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  If you have questions about these Terms of Service or need to
                  report a violation, please contact us using the information
                  below.
                </p>
                <div className="bg-gray-900/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 text-orange-400">
                    Legal Contact
                  </h3>
                  <div className="space-y-2 text-gray-300">
                    <p>
                      <strong>Email:</strong> legal@quilly.com
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
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-3 text-orange-400">
                    Governing Law
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    These terms are governed by the laws of the jurisdiction in
                    which Quilly operates. Any disputes will be resolved through
                    binding arbitration.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-gray-400 text-sm">
            <p>
              By using Quilly, you acknowledge that you have read, understood,
              and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
