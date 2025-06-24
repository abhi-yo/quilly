"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User, Users, Shield, Check } from "lucide-react";
import Link from "next/link";

export default function SignUp() {
  const [step, setStep] = useState<'signup' | 'verify'>('signup');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "reader",
  });
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{ score: number; errors: string[] }>({ score: 0, errors: [] });
  const { toast } = useToast();
  const router = useRouter();

  const validatePassword = (password: string) => {
    const errors = [];
    let score = 0;

    if (password.length < 8) {
      errors.push("At least 8 characters");
    } else {
      score += 1;
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("One uppercase letter");
    } else {
      score += 1;
    }

    if (!/[a-z]/.test(password)) {
      errors.push("One lowercase letter");
    } else {
      score += 1;
    }

    if (!/\d/.test(password)) {
      errors.push("One number");
    } else {
      score += 1;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("One special character");
    } else {
      score += 1;
    }

    setPasswordStrength({ score, errors });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (passwordStrength.errors.length > 0) {
      setError("Please fix password requirements");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Account created! Please check your email for verification code.");
        setStep('verify');
        toast({
          title: "Account Created",
          description: "Please check your email for the verification code.",
        });
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          setError(data.errors.join(", "));
        } else {
          setError(data.message || "An error occurred during signup");
        }
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit code");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp: otp,
        }),
      });

        const data = await response.json();

      if (response.ok) {
        toast({
          title: "Email Verified",
          description: "Your account has been verified successfully!",
        });
        router.push("/auth/signin?verified=true");
      } else {
        setError(data.error || "Invalid verification code");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess("New verification code sent to your email");
        toast({
          title: "Code Resent",
          description: "A new verification code has been sent to your email.",
        });
      } else {
        setError("Failed to resend code. Please try again.");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/auth/complete-profile?provider=google" });
  };

  if (step === 'verify') {
    return (
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-medium text-white">Verify your email</h1>
          <p className="text-gray-400 mt-2">
            We've sent a 6-digit code to <span className="text-white">{formData.email}</span>
          </p>
        </div>

        <div className="bg-gray-900/40 border border-gray-800 rounded-lg p-6">
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            {error && (
              <div className="bg-red-900/20 border border-red-700/30 text-red-400 px-3 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-900/20 border border-green-700/30 text-green-400 px-3 py-2 rounded-lg text-sm">
                {success}
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-center text-lg tracking-widest placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="000000"
                maxLength={6}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Enter the 6-digit code from your email</p>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-400">
            Didn't receive the code?{" "}
            <button
              onClick={resendOTP}
              disabled={isLoading}
              className="text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
            >
              Resend code
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => setStep('signup')}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              ← Back to signup
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-medium text-white">Create your account</h1>
          </div>
          
      <div className="bg-gray-900/40 border border-gray-800 rounded-lg p-6">
        <div className="space-y-3 mb-6">
              <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 text-sm font-medium py-2.5 px-4 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>
        </div>

        <div className="text-center text-sm text-gray-400 mb-4">
          or
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/20 border border-red-700/30 text-red-400 px-3 py-2 rounded-lg text-sm">
              {error}
      </div>
          )}

          {success && (
            <div className="bg-green-900/20 border border-green-700/30 text-green-400 px-3 py-2 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Full name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Email address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
              placeholder="john.doe@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  validatePassword(e.target.value);
                }}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors pr-10"
                placeholder="••••••••••"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {formData.password && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <div className={`h-1 flex-1 rounded ${passwordStrength.score >= 1 ? 'bg-red-500' : 'bg-gray-700'}`} />
                  <div className={`h-1 flex-1 rounded ${passwordStrength.score >= 3 ? 'bg-yellow-500' : 'bg-gray-700'}`} />
                  <div className={`h-1 flex-1 rounded ${passwordStrength.score >= 5 ? 'bg-green-500' : 'bg-gray-700'}`} />
                </div>
                {passwordStrength.errors.length > 0 && (
                  <div className="text-xs text-gray-400">
                    Missing: {passwordStrength.errors.join(", ")}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              I want to join as
            </label>
            <div className="grid grid-cols-2 gap-3">
                            <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "reader" })}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm border transition-colors ${
                  formData.role === "reader"
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <User className="w-4 h-4" />
                Reader
              </button>
                            <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "writer" })}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm border transition-colors ${
                  formData.role === "writer"
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <Users className="w-4 h-4" />
                Writer
              </button>
            </div>
                </div>
                
                <button
            type="submit"
            disabled={isLoading || passwordStrength.errors.length > 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
            {isLoading ? "Creating account..." : "Create account"}
                </button>
        </form>
              </div>

      <div className="text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link href="/auth/signin" className="text-white hover:text-gray-300 transition-colors">
          Sign in
        </Link>
      </div>
    </div>
  );
}