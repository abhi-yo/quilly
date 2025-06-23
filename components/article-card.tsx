"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Eye, MessageCircle } from "lucide-react";
import Link from "next/link";

interface ArticleCardProps {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  tags?: string[];
  views?: number;
  comments?: number;
}

export default function ArticleCard({
  id,
  title,
  content,
  author,
  createdAt,
  tags = [],
  views = 0,
  comments = 0,
}: ArticleCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const excerpt = content.length > 200 ? content.substring(0, 200) + "..." : content;

  return (
    <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-white text-xl font-semibold line-clamp-2 hover:text-gray-200 transition-colors">
            <Link href={`/articles/${id}`}>{title}</Link>
          </CardTitle>
        </div>
        
        <CardDescription className="flex items-center gap-3 text-gray-400 text-sm">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-300 line-clamp-4 mb-4 leading-relaxed">
          {excerpt}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-gray-800 text-gray-300 hover:bg-gray-700 text-xs"
              >
                #{tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="border-gray-700 text-gray-400 text-xs">
                +{tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{views}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              <span>{comments}</span>
            </div>
          </div>

          <Link href={`/articles/${id}`}>
            <Button 
              variant="outline" 
              size="sm"
              className="border-gray-700 text-white hover:bg-gray-800 hover:border-gray-600"
            >
              Read More
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
} 