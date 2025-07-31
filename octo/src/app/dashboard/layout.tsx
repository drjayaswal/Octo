"use client";
import { useEffect, useState } from "react";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/appsidebar";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Search, Menu } from "lucide-react";
import { toast } from "sonner";

const SIDEBAR_OPEN_KEY = "octo.sidebar.open";

function SidebarControls() {
  const { open: isOpen, setOpen } = useSidebar();

  return (
    <div
      className={clsx(
        "fixed top-[8px] z-50 transition-all duration-300 flex items-center",
        isOpen
          ? "left-[211.5px] top-2 bg-transparent rounded"
          : "left-2 top-2 bg-emerald-600 rounded-xl"
      )}
    >
      <Button
        size="icon"
        variant="ghost"
        onClick={() => setOpen(!isOpen)}
        className={cn(
          isOpen
            ? "text-emerald-700 bg-transparent stroke-2.5 hover:bg-emerald-600/20 hover:text-emerald-600 size-10 rounded-xl shadow-none"
            : "text-white bg-emerald-600 stroke-2.5 hover:bg-emerald-600 hover:text-white size-10 rounded-4xl -mr-2 shadow-none",
          "cursor-pointer"
        )}
      >
        <Menu className="w-5 h-5" />
      </Button>

      <Button
        className={cn(
          "ml-2 flex items-center gap-2 h-10 px-4 w-52 font-medium transition-all duration-200 bg-white text-emerald-700 stroke-2.5 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl shadow-inner",
          isOpen ? "border border-emerald-600/20" : "border-2 border-emerald-600"
        )}
        onClick={() => {
          toast.success("Feature Coming Soon");
        }}
      >
        <Search className="w-5 h-5 text-emerald-600" />
        <span className="flex-1 text-left">Search</span>
        <kbd className="ml-2 px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-mono border-0 shadow-inner">
          ⌘ K
        </kbd>
      </Button>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_OPEN_KEY);
    try {
      setSidebarOpen(stored ? JSON.parse(stored) : true);
    } catch {
      setSidebarOpen(true);
    }
  }, []);


  const handleSidebarChange = (open: boolean) => {
    setSidebarOpen(open);
    localStorage.setItem(SIDEBAR_OPEN_KEY, JSON.stringify(open));
  };

  if (sidebarOpen === null) return null;

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={handleSidebarChange}>
      <AppSidebar />
      <main className="md:m-2 md:ml-0.5 w-full min-h-full md:max-h-[calc(100svh-16px)] bg-transparent rounded-none overflow-scroll shadow-none relative z-10">
        <SidebarControls />
        {children}
      </main>
    </SidebarProvider>
  );
}
