"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ResourcesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-lg text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Analytics & Resources</h1>
          <p className="text-gray-400 text-lg">
            Powerful ML-driven content analysis tools and insights for your blog
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <p className="text-white">
            NLP Analyzer is temporarily disabled during build. 
            It will be available once the application is running.
          </p>
        </div>
      </div>
    </div>
  );
} 