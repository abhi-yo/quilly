"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  HomeIcon, 
  CogIcon, 
  LayoutIcon,
  UserIcon,
  LogInIcon,
  UserPlusIcon,
  LogOutIcon,
  FileTextIcon,
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ 
      callbackUrl: '/auth/signup',
      redirect: true 
    });
  };

  const mainMenuItems = [
    {
      title: "Dashboard",
      icon: <HomeIcon className="w-5 h-5" />,
      href: "/dashboard",
    },
    {
      title: "Articles",
      icon: <FileTextIcon className="w-5 h-5" />,
      href: "/articles",
    },
    {
      title: "Settings",
      icon: <CogIcon className="w-5 h-5" />,
      href: "/settings",
    },
    {
      title: "Explore",
      icon: <LayoutIcon className="w-5 h-5" />,
      href: "/explore",
    },
  ];

  const accountItems = [
    {
      title: "Profile",
      icon: <UserIcon className="w-5 h-5" />,
      href: "/profile",
    },
    {
      title: "Sign In",
      icon: <LogInIcon className="w-5 h-5" />,
      href: "/auth/signin",
    },
    {
      title: "Sign Up",
      icon: <UserPlusIcon className="w-5 h-5" />,
      href: "/auth/signup",
    },
    {
      title: "Sign Out",
      icon: <LogOutIcon className="w-5 h-5" />,
      onClick: handleSignOut,
    },
  ];

  return (
    <div className={cn("pb-12 min-h-screen bg-black", className)}>
      <div className="space-y-4 py-4">
        <div className="px-6 py-2">
          <Link href="/" className="flex items-center">
            <h2 className="text-2xl font-semibold text-white tracking-tight">
              Stick&Dot.
            </h2>
          </Link>
        </div>

        <div className="px-6 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight text-gray-400">
            MAIN MENU
          </h2>
          <ScrollArea className="px-1">
            <div className="space-y-1">
              {mainMenuItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  asChild
                  className={cn(
                    "w-full justify-start text-gray-400 hover:text-white hover:bg-gray-900",
                    pathname === item.href && "bg-gray-900 text-white"
                  )}
                >
                  <Link href={item.href}>
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="px-6 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight text-gray-400">
            ACCOUNT PAGES
          </h2>
          <ScrollArea className="px-1">
            <div className="space-y-1">
              {accountItems.map((item) => (
                <Button
                  key={item.title}
                  variant="ghost"
                  {...(item.href
                    ? {
                        asChild: true,
                        children: (
                          <Link href={item.href}>
                            {item.icon}
                            <span className="ml-3">{item.title}</span>
                          </Link>
                        ),
                      }
                    : {
                        onClick: item.onClick,
                        children: (
                          <>
                            {item.icon}
                            <span className="ml-3">{item.title}</span>
                          </>
                        ),
                      }
                  )}
                  className={cn(
                    "w-full justify-start text-gray-400 hover:text-white hover:bg-gray-900",
                    pathname === item.href && "bg-gray-900 text-white"
                  )}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="absolute bottom-4 left-0 right-0 px-6">
        <div className="text-2xl font-bold text-white">Logo</div>
      </div>
    </div>
  );
} 