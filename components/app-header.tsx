"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

interface AppHeaderProps {
  title: string;
  description?: string;
}

export function AppHeader({ title, description }: AppHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200/20 px-4">
      <SidebarTrigger className="text-gray-400 hover:text-white md:hidden" />
      <Separator orientation="vertical" className="mr-2 h-4 bg-gray-600 md:hidden" />
      <div>
        <h1 className="text-lg font-semibold text-white">{title}</h1>
        {description && (
          <p className="text-sm text-gray-400">{description}</p>
        )}
      </div>
    </header>
  );
} 