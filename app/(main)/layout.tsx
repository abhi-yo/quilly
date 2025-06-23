import { Sidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-black">
        <Sidebar />
        <SidebarInset className="flex-1 overflow-auto bg-black">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200/20 px-4 md:hidden bg-black">
            <SidebarTrigger className="text-gray-400 hover:text-white" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-gray-600" />
          </header>
          <div className="bg-black min-h-full">
        {children}
          </div>
        </SidebarInset>
    </div>
    </SidebarProvider>
  );
} 