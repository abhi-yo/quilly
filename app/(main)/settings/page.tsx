"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Trash2, 
  Save, 
  X, 
  Edit2, 
  Mail, 
  Lock,
  Moon,
  LogOut,
  AlertTriangle
} from "lucide-react";

export default function SettingsPage() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [status, router, session]);

  const handleSettingChange = (setting: string, value: boolean) => {
    if (setting === 'emailNotifications') {
      setEmailNotifications(value);
      toast({
        title: "Settings Updated",
        description: `Email notifications ${value ? 'enabled' : 'disabled'}.`,
      });
    } else if (setting === 'marketingEmails') {
      setMarketingEmails(value);
      toast({
        title: "Settings Updated",
        description: `Marketing emails ${value ? 'enabled' : 'disabled'}.`,
      });
    }
  };

  const handleUpdateProfile = async () => {
    if (name.trim().length < 1) {
      toast({ title: "Error", description: "Name cannot be empty.", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile');
      }

      await updateSession({ name: name.trim() });
      setIsEditingName(false);

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/user', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      toast({
        title: "Account Deleted",
        description: "Your account has been deleted successfully.",
      });

      await signOut({ callbackUrl: '/auth/signup' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/auth/signin' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
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
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Settings</h1>
          <p className="text-gray-400 text-lg">Manage your account preferences and security settings</p>
        </div>

        <div className="space-y-8">
          {/* Account Information */}
          <div className="bg-gray-950/50 backdrop-blur-sm border border-gray-900/50 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <User className="h-6 w-6 text-gray-400" />
              Account Information
            </h2>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">Full Name</label>
                {isEditingName ? (
                  <div className="flex items-center gap-3">
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 flex-1"
                      disabled={isSubmitting}
                    />
                    <Button 
                      onClick={handleUpdateProfile}
                      size="sm"
                      disabled={isSubmitting || name.trim() === (session?.user?.name || "")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditingName(false);
                        setName(session?.user?.name || "");
                      }}
                      disabled={isSubmitting}
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 p-3 bg-gray-900/30 rounded-lg flex-1 mr-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="text-white">{session?.user?.name || "Not set"}</span>
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
                  <Badge variant="secondary" className="bg-gray-500/20 text-gray-300 ml-auto">Verified</Badge>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">Account Type</label>
                <div className="flex items-center gap-3 p-3 bg-gray-900/30 rounded-lg">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <span className="text-white capitalize">{session?.user?.role || "user"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-gray-950/50 backdrop-blur-sm border border-gray-900/50 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <Bell className="h-6 w-6 text-gray-400" />
              Notification Preferences
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-white font-medium">Email Notifications</label>
                  <p className="text-sm text-gray-400">
                    Receive notifications about comments and interactions on your articles
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-white font-medium">Marketing Emails</label>
                  <p className="text-sm text-gray-400">
                    Receive updates about new features and writing tips
                  </p>
                </div>
                <Switch
                  checked={marketingEmails}
                  onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-white font-medium">Dark Mode</label>
                  <p className="text-sm text-gray-400">
                    Dark mode is always enabled for the best writing experience
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-gray-400" />
                  <Badge variant="secondary" className="bg-gray-500/20 text-gray-300">Always On</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-gray-950/50 backdrop-blur-sm border border-gray-900/50 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <Lock className="h-6 w-6 text-gray-400" />
              Security
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-white font-medium">Password</label>
                  <p className="text-sm text-gray-400">
                    Your account is secured with a strong password
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  disabled
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-white font-medium">Sign Out</label>
                  <p className="text-sm text-gray-400">
                    Sign out of your account on this device
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-950/20 border border-red-900/50 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-red-300 mb-6 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-red-400" />
              Danger Zone
            </h2>

            <div className="space-y-4">
              <p className="text-red-200 text-sm">
                Once you delete your account, there is no going back. This will permanently delete 
                your account, all your articles, and remove all your data from our servers.
              </p>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-gray-900 border-gray-700">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-300">
                      This action cannot be undone. This will permanently delete your
                      account and remove all your data from our servers including:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>All your articles and drafts</li>
                        <li>Your profile information</li>
                        <li>All comments and interactions</li>
                        <li>Analytics and statistics</li>
                      </ul>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 