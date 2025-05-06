"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(session?.user?.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signup");
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
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Profile</h1>
      <div className="max-w-2xl">
        <Card className="bg-[#1A1A1A] border-gray-700 text-white">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1">
              <label className="text-sm font-medium text-gray-400">Name</label>
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <Input 
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter your name"
                    className="bg-[#222] border-gray-600 text-white"
                    disabled={isSubmitting}
                  />
                  <Button 
                    onClick={handleSaveName}
                    size="sm"
                    disabled={isSubmitting || newName.trim() === (session?.user?.name || "")}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </Button>
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                       setIsEditingName(false);
                       setNewName(session?.user?.name || "");
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              ) : session?.user?.name ? (
                <div className="flex items-center justify-between">
                   <p className="text-lg">{session.user.name}</p>
                   <Button variant="outline" size="sm" onClick={() => setIsEditingName(true)}>
                     Edit
                   </Button>
                </div>
              ) : (
                 <Button 
                   variant="secondary" 
                   onClick={() => {
                     setNewName("");
                     setIsEditingName(true);
                   }}
                 >
                   Add Name
                 </Button>
              )}
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-medium text-gray-400">Email</label>
              <p className="text-lg">{session?.user?.email}</p>
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-medium text-gray-400">Role</label>
              <p className="text-lg capitalize">{session?.user?.role || "user"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 