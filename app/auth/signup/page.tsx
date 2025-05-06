"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Apple, Facebook } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [domain, setDomain] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const roles = [
    { id: "writer", label: "Writer" },
    { id: "reader", label: "Reader" },
    { id: "expert", label: "Subject Expert" },
    { id: "client", label: "Client" },
  ];

  const handleEmailSignup = async () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!role) {
      toast({
        title: "Error",
        description: "Please select a role",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        role,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        setStep(2);
        toast({
          title: "Success",
          description: "OTP has been sent to your email",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during signup",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        role,
        otp,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "OTP verified successfully",
        });
        setStep(3);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during verification",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetailsSubmit = async () => {
    if (!name || !mobile || !domain || !gender || !dob) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          role,
          name,
          mobile,
          domain,
          gender,
          dob: new Date(dob).toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save details");
      }

      if (data) {
        toast({
          title: "Success",
          description: "Profile details saved successfully",
        });
        router.push("/dashboard");
      } else {
        throw new Error("No data received from server");
      }
    } catch (error) {
      console.error("Error saving details:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while saving details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = (provider: 'apple' | 'google' | 'facebook') => {
    signIn(provider, {
      callbackUrl: "/dashboard",
    });
  };

  const resendOTP = async () => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        role,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "New OTP has been sent to your email",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 bg-[#111] text-white p-8 md:p-16 flex flex-col justify-between min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_100%)]"></div>
        <div className="relative z-10 text-2xl font-bold">Logo</div>
        
        <div className="relative z-10 flex-1 flex flex-col justify-center space-y-12">
          <div className="space-y-1">
            <h1 className="text-[2.5rem] leading-tight">
              <span className="font-light">Present</span><br />
              <span className="font-normal">yourself</span> <span className="font-light">as...</span>
            </h1>
          </div>
          
          <div className="space-y-3">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-sm border border-white/20 text-center transition-all text-base
                  ${role === r.id ? "bg-white text-black" : "hover:border-white hover:bg-transparent"}
                  ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {r.label}
              </button>
            ))}
          </div>
          
          <p className="text-xs text-white/60 text-center">
            For your personalized Dashboard<br />choose from the above.
          </p>
        </div>

        <div className="relative z-10 text-center">
          <p className="text-xl font-normal mb-2">Humane than AI, faster than human</p>
          <div className="text-2xl font-bold underline">Stick&Dot.</div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <div className="text-sm text-gray-600">
            Signup{role && ` > ${role}`}{step > 1 && " > OTP"}
          </div>
          <div className="space-x-6">
            <button className="text-sm">Community</button>
            <button className="text-sm">About</button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            {step === 1 && (
              <div className="space-y-4 md:space-y-6">
                <h2 className="text-xl md:text-2xl font-semibold">Create an Account</h2>
                
                <div className="flex justify-center space-x-4 md:space-x-8">
                  <button 
                    onClick={() => handleSocialSignIn("apple")}
                    disabled={isLoading}
                    className="p-3 md:p-4 rounded-full border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Apple className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                  <button 
                    onClick={() => handleSocialSignIn("google")}
                    disabled={isLoading}
                    className="p-3 md:p-4 rounded-full border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleSocialSignIn("facebook")}
                    disabled={isLoading}
                    className="p-3 md:p-4 rounded-full border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Facebook className="w-5 h-5 md:w-6 md:h-6 text-[#1877F2]" />
                  </button>
                </div>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">or</span>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4">
                  <div>
                    <p className="text-sm mb-2">Sign up with Email</p>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="w-full"
                    />
                  </div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full"
                  />
                  <Button
                    onClick={handleEmailSignup}
                    disabled={isLoading}
                    className="w-full bg-black text-white hover:bg-black/90 disabled:opacity-50"
                  >
                    {isLoading ? "Please wait..." : "Continue"}
                  </Button>
                </div>

                <p className="text-sm text-center">
                  Already have an account?{" "}
                  <button 
                    onClick={() => router.push("/auth/signin")} 
                    disabled={isLoading}
                    className="text-blue-600 hover:underline disabled:opacity-50 disabled:no-underline"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 md:space-y-6">
                <div>
                  <p className="text-sm text-gray-600">Step 2 of 3</p>
                  <h2 className="text-xl md:text-2xl font-semibold">Enter OTP</h2>
                  <p className="text-sm text-gray-600 mt-2">
                    A 6-digit code has been sent to {email}
                  </p>
                </div>

                <div className="flex justify-center">
                  <InputOTP 
                    maxLength={6} 
                    value={otp}
                    onChange={setOtp}
                    disabled={isLoading}
                    className="gap-1 sm:gap-2"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="w-10 h-10 md:w-12 md:h-12" />
                      <InputOTPSlot index={1} className="w-10 h-10 md:w-12 md:h-12" />
                      <InputOTPSlot index={2} className="w-10 h-10 md:w-12 md:h-12" />
                      <InputOTPSlot index={3} className="w-10 h-10 md:w-12 md:h-12" />
                      <InputOTPSlot index={4} className="w-10 h-10 md:w-12 md:h-12" />
                      <InputOTPSlot index={5} className="w-10 h-10 md:w-12 md:h-12" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button
                  onClick={handleOTPVerification}
                  disabled={isLoading}
                  className="w-full bg-black text-white hover:bg-black/90 disabled:opacity-50"
                >
                  {isLoading ? "Verifying..." : "Continue"}
                </Button>

                <p className="text-sm text-center">
                  Didn&apos;t receive code?{" "}
                  <button 
                    onClick={resendOTP}
                    disabled={isLoading} 
                    className="text-blue-600 hover:underline disabled:opacity-50 disabled:no-underline"
                  >
                    Resend Code
                  </button>
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 md:space-y-6">
                <div>
                  <p className="text-sm text-gray-600">Step 3 of 3</p>
                  <h2 className="text-xl md:text-2xl font-semibold">Add Details</h2>
                </div>

                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    className="w-full"
                  />
                  
                  <Input
                    type="tel"
                    placeholder="Mobile No."
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    disabled={isLoading}
                    className="w-full"
                  />

                  <Input
                    type="text"
                    placeholder="Name of Domain"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    disabled={isLoading}
                    className="w-full"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="text"
                      placeholder="Gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      disabled={isLoading}
                      className="w-full"
                    />
                    
                    <div className="relative">
                      <Input
                        type="date"
                        placeholder="DOB"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        disabled={isLoading}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleDetailsSubmit}
                    disabled={isLoading}
                    className="w-full bg-black text-white hover:bg-black/90 disabled:opacity-50"
                  >
                    {isLoading ? "Please wait..." : "Continue"}
                  </Button>

                  <button 
                    onClick={() => router.push("/dashboard")}
                    className="w-full text-sm text-gray-500 hover:underline"
                  >
                    Skip for now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}