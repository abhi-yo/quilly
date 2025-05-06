"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

interface CommentSectionProps {
  articleId: string;
}

interface Comment {
  _id: string;
  content: string;
  author: string;
  authorId: string;
  rating: number;
  createdAt: string;
}

export function CommentSection({ articleId }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?articleId=${articleId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    }
  };

  const handleSubmitComment = async () => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to comment",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
          articleId,
          rating,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      const data = await response.json();
      setComments([data, ...comments]);
      setNewComment("");
      setRating(5);
      toast({
        title: "Success",
        description: "Comment posted successfully",
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Comments</h2>

      {session?.user && (
        <div className="space-y-4">
          <h3 className="text-lg">Add a Comment</h3>
          <div className="flex items-start space-x-4">
            <div className="relative h-12 w-12 rounded-full overflow-hidden bg-[#222] flex items-center justify-center">
              <User className="h-6 w-6 text-gray-400" />
            </div>
            <div className="flex-1">
              <div className="relative">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Type your Comment"
                  className="w-full bg-[#1A1A1A] border-gray-800 rounded-xl py-6 pl-4 pr-24"
                  disabled={isSubmitting}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {Array(5).fill(null).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setRating(i + 1)}
                        className="focus:outline-none"
                      >
                        <svg
                          className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  <Button
                    onClick={handleSubmitComment}
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                    disabled={isSubmitting}
                  >
                    <Upload className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="py-4 text-left text-sm font-medium text-gray-400">Name</th>
                <th className="py-4 text-left text-sm font-medium text-gray-400">Date Created</th>
                <th className="py-4 text-left text-sm font-medium text-gray-400">Quality</th>
                <th className="py-4 text-left text-sm font-medium text-gray-400">Comments</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <tr key={comment._id} className="border-b border-gray-800">
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative h-8 w-8 rounded-full overflow-hidden bg-[#222] flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <span className="text-sm text-gray-300">{comment.author}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-sm text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-1">
                      {Array(5).fill(null).map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < comment.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-sm text-gray-400">{comment.content}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 