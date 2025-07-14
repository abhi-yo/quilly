"use client";

import { Mail, MessageCircle, Phone, MapPin, Clock, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);

    // Show success message (you can implement proper toast/notification)
    alert("Thank you for your message! We will get back to you soon.");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Navigation Header */}
      <nav className="border-b border-gray-800 lg:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-6 w-6 text-blue-500" />
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
            <MessageCircle className="h-8 w-8 sm:h-12 sm:w-12 text-blue-500 mb-2 sm:mb-0 sm:mr-4" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Contact Us
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-2 sm:px-0">
            Have questions, feedback, or need support? We&apos;d love to hear
            from you. Get in touch using any of the methods below.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <Card className="bg-gray-800/30 border-gray-700/50">
            <CardContent className="p-8 text-center">
              <div className="p-3 bg-gray-700/50 rounded-xl w-fit mx-auto mb-6">
                <Mail className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Email Support</h3>
              <div className="space-y-2 text-gray-300">
                <p className="text-sm">General Inquiries</p>
                <p className="font-medium">hello@quilly.com</p>
                <p className="text-sm mt-4">Technical Support</p>
                <p className="font-medium">support@quilly.com</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/30 border-gray-700/50">
            <CardContent className="p-8 text-center">
              <div className="p-3 bg-gray-700/50 rounded-xl w-fit mx-auto mb-6">
                <Clock className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Response Time</h3>
              <div className="space-y-2 text-gray-300">
                <p className="text-sm">General Inquiries</p>
                <p className="font-medium">Within 24 hours</p>
                <p className="text-sm mt-4">Technical Issues</p>
                <p className="font-medium">Within 2-4 hours</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/30 border-gray-700/50">
            <CardContent className="p-8 text-center">
              <div className="p-3 bg-gray-700/50 rounded-xl w-fit mx-auto mb-6">
                <MapPin className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Office Location</h3>
              <div className="space-y-2 text-gray-300">
                <p className="text-sm">Headquarters</p>
                <p className="font-medium">123 Content Street</p>
                <p className="font-medium">Writing City, WC 12345</p>
                <p className="font-medium">United States</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="business">Business Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-vertical"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-3">
                  How do I reset my password?
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  You can reset your password by clicking the &quot;Forgot
                  Password&quot; link on the sign-in page. We&apos;ll send you a
                  reset link via email.
                </p>
              </div>

              <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-3">
                  Can I delete my account?
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Yes, you can delete your account at any time through your
                  account settings. This action is permanent and cannot be
                  undone.
                </p>
              </div>

              <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">
                  How does blockchain copyright work?
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Our blockchain copyright feature creates an immutable record
                  of your content on the blockchain, providing proof of
                  ownership and creation timestamp.
                </p>
              </div>

              <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                  Is Quilly free to use?
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Yes, Quilly offers a free tier with core features. We also
                  offer premium features for advanced users and writers who want
                  additional tools.
                </p>
              </div>
            </div>

            <div className="mt-8 bg-gray-900/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-orange-400">
                Still have questions?
              </h3>
              <p className="text-gray-300 mb-4">
                Check out our comprehensive help documentation or reach out to
                our support team.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="/help"
                  className="inline-flex items-center justify-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                >
                  View Help Docs
                </a>
                <a
                  href="mailto:support@quilly.com"
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                >
                  Email Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
