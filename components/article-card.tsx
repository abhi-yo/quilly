"use client";

import Image from "next/image";
import { Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface ArticleCardProps {
  article: {
    title: string;
    author: string;
    readTime: string;
  };
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="w-full h-full rounded-[5.31px] p-0 border-none">
      <CardContent className="p-0 h-full">
        <div className="relative w-full h-full aspect-square bg-[#d9d9d9] rounded-[2.66px] bg-cover bg-center overflow-hidden">
          {/* Background image or gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          
          {/* Title */}
          <div className="absolute top-1/2 left-[10%] transform -translate-y-1/2 font-extrabold text-[2.5rem] leading-tight tracking-wide text-[#353535]">
            {article.title}
          </div>
          
          {/* Author section */}
          <div className="absolute bottom-4 left-4 flex items-center gap-3">
            <Avatar className="w-8 h-8 bg-white">
              <AvatarFallback>{article.author?.charAt(0).toUpperCase() || "A"}</AvatarFallback>
            </Avatar>
            <span className="font-normal text-[#fefefe99] text-sm tracking-wider whitespace-nowrap">
              {article.author.toUpperCase()}
            </span>
          </div>
          
          {/* Read time */}
          <div className="absolute top-4 right-4">
            <div className="relative px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-solid border-[#d9d9d9] shadow">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/90" />
                <span className="text-sm text-white/90 tracking-wider">
                  {article.readTime} mins read
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 