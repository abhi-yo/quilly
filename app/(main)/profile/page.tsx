"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { User, Mail, Calendar, PenTool, Edit2, Save, X, BookOpen } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(session?.user?.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isWriter = session?.user?.role === "writer" || session?.user?.role === "admin";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    if (session?.user?.name && !isEditingName) {
      setNewName(session.user.name);
    }
  }, [status, router, session, isEditingName]);

  const handleSaveName = async () => {
    if (newName.trim().length < 1) {
      toast({ title: "Error", description: "Name cannot be empty.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update name");
      }

      await update({ name: newName.trim() });

      setIsEditingName(false);
      toast({ title: "Success", description: "Name updated successfully." });

    } catch (error) {
      console.error("Error updating name:", error);
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to update name", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-lg text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Profile</h1>
          <p className="text-gray-400 text-lg">
            {isWriter 
              ? "Manage your account and view your writing statistics" 
              : "Manage your account and view your reading activity"
            }
          </p>
        </div>

        {/* Profile Information */}
        <div className="space-y-6">
            {/* Basic Info Card */}
            <div className="bg-gray-950/50 backdrop-blur-sm border border-gray-900/50 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <User className="h-6 w-6 text-gray-400" />
                Personal Information
              </h2>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">Full Name</label>
                  {isEditingName ? (
                    <div className="flex items-center gap-3">
                      <Input 
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Enter your name"
                        className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 flex-1"
                        disabled={isSubmitting}
                      />
                      <Button 
                        onClick={handleSaveName}
                        size="sm"
                        disabled={isSubmitting || newName.trim() === (session?.user?.name || "")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => {
                           setIsEditingName(false);
                           setNewName(session?.user?.name || "");
                        }}
                        disabled={isSubmitting}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                           <span className="text-white font-semibold">
                             {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                           </span>
                         </div>
                         <div>
                           <p className="text-xl font-medium text-white">{session?.user?.name || "Name not set"}</p>
                           <p className="text-sm text-gray-400">
                             {isWriter ? "Writer" : "Reader"}
                           </p>
                         </div>
                       </div>
                       <Button 
                         variant="outline" 
                         size="sm" 
                         onClick={() => setIsEditingName(true)}
                         className="border-gray-700 text-gray-300 hover:bg-gray-800"
                       >
                         <Edit2 className="h-4 w-4 mr-1" />
                         Edit
                       </Button>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">Email Address</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-900/30 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-white">{session?.user?.email}</span>
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">Role</label>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-gray-500/20 text-gray-300 border-gray-500/30">
                      {isWriter ? (
                        <PenTool className="h-3 w-3 mr-1" />
                      ) : (
                        <BookOpen className="h-3 w-3 mr-1" />
                      )}
                      {(session?.user?.role || "reader").charAt(0).toUpperCase() + (session?.user?.role || "reader").slice(1)}
                    </Badge>
                  </div>
                </div>

                {/* Join Date */}
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">Member Since</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-900/30 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-white">
                      {new Date().toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
} 