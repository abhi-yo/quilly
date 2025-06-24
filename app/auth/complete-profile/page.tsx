"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserIcon, PenIcon } from "lucide-react";

export default function CompleteProfile() {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status, update } = useSession();
  const provider = searchParams.get("provider");

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const handleRoleSubmit = async () => {
    if (!selectedRole) {
      return;
    }
    
    if (!session?.user?.email) {
      alert("Session not available. Please try refreshing the page.");
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
          email: session.user.email,
          role: selectedRole,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await update({ role: selectedRole });
        router.push("/dashboard");
      } else {
        console.error("Failed to update role:", data);
        alert("Failed to update role. Please try again.");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-gray-400">
            {provider === "google" 
              ? "Welcome! Please choose your role to get started."
              : "Please select your role to continue."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedRole === "reader"
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-700 hover:border-gray-600"
              }`}
              onClick={() => setSelectedRole("reader")}
            >
              <div className="flex items-center space-x-3">
                <UserIcon className="h-6 w-6 text-blue-400" />
                <div>
                  <h3 className="font-semibold text-white">Reader</h3>
                  <p className="text-sm text-gray-400">
                    Discover and read amazing articles
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedRole === "writer"
                  ? "border-green-500 bg-green-500/10"
                  : "border-gray-700 hover:border-gray-600"
              }`}
              onClick={() => setSelectedRole("writer")}
            >
              <div className="flex items-center space-x-3">
                <PenIcon className="h-6 w-6 text-green-400" />
                <div>
                  <h3 className="font-semibold text-white">Writer</h3>
                  <p className="text-sm text-gray-400">
                    Create and publish your own articles
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleRoleSubmit}
              disabled={!selectedRole || isLoading}
              className="w-full"
            >
              {isLoading ? "Setting up..." : "Continue"}
            </Button>
            
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              className="w-full"
            >
              Skip for now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 