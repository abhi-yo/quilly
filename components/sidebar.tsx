"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { 
  HomeIcon, 
  CogIcon, 
  LayoutIcon,
  UserIcon,
  LogOutIcon,
  FileTextIcon,
  PenToolIcon,
  FingerprintIcon,
} from "lucide-react";
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ 
      callbackUrl: '/auth/signin',
      redirect: true 
    });
  };

  const isWriter = session?.user?.role === "writer" || session?.user?.role === "admin";

  const mainMenuItems = [
    {
      title: "Dashboard",
      icon: HomeIcon,
      href: "/dashboard",
      showForRole: "all"
    },
    {
      title: "Write",
      icon: PenToolIcon,
      href: "/write",
      showForRole: "writer"
    },
    {
      title: "Articles",
      icon: FileTextIcon,
      href: "/articles",
      showForRole: "all"
    },
    {
      title: "Explore",
      icon: LayoutIcon,
      href: "/explore",
      showForRole: "all"
    },
    {
      title: "Copyright",
      icon: FingerprintIcon,
      href: "/blockchain",
      showForRole: "all"
    },
    {
      title: "Profile",
      icon: UserIcon,
      href: "/profile",
      showForRole: "all"
    },
    {
      title: "Settings",
      icon: CogIcon,
      href: "/settings",
      showForRole: "all"
    },
  ];

  const filteredMenuItems = mainMenuItems.filter(item => 
    item.showForRole === "all" || (item.showForRole === "writer" && isWriter)
  );

  return (
    <SidebarContainer 
      collapsible="offcanvas" 
      className="w-64 h-screen bg-black border-r border-gray-900/50 flex flex-col"
      style={{ backgroundColor: '#000000' }}
    >
      <SidebarHeader className="p-6 pb-4 bg-black">
        <div className="flex items-center">
          <Link href="/dashboard" className="flex items-center">
            <h2 className="text-2xl font-bold text-white">Quilly</h2>
          </Link>
          <SidebarTrigger className="text-gray-400 hover:text-white md:hidden ml-auto" />
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 px-4 pt-2 bg-black">
        <div className="space-y-1">
          {filteredMenuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "w-full flex items-center h-10 px-3 text-gray-400 hover:text-white hover:bg-gray-900/50 transition-all rounded-lg cursor-pointer",
                  pathname === item.href && "bg-gray-900 text-white"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="ml-3 font-medium">{item.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-900/50 p-4 bg-black">
        <div
          onClick={handleSignOut}
          className="w-full flex items-center h-10 px-3 text-gray-400 hover:text-white hover:bg-gray-900/50 transition-all rounded-lg cursor-pointer"
        >
          <LogOutIcon className="w-5 h-5" />
          <span className="ml-3 font-medium">Sign Out</span>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </SidebarContainer>
  );
} 