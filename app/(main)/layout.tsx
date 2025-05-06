import { Sidebar } from "@/components/sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar className="w-64 flex-none" />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
} 