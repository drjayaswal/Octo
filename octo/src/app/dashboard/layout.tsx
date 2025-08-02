"use client";
import { useEffect, useState, useCallback } from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/appsidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Search, Menu, Command } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAgentsFilter } from "./agents/filters";

const SIDEBAR_OPEN_KEY = "octo.sidebar.open";

// Professional Search Modal Component
function SearchModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [filters, setFilters] = useAgentsFilter();
  const [searchQuery, setSearchQuery] = useState("");

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
      // Escape to close search
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        const input = document.getElementById("search-input");
        if (input) {
          input.focus();
          // input.select();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ search: query });
    setSearchQuery("");
    onOpenChange(false);
  };

  return open ? (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-2xl sm:max-w-lg xs:max-w-xs p-0 border-0 shadow-2xl rounded-2xl bg-gray-100 mx-2 xs:mx-1"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {/* Search Input */}
          <div className="px-2 py-2 sm:px-4 sm:pt-4 xs:px-1.5 xs:pt-2.5">
            <div className="relative flex items-center">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 sm:w-4 sm:h-4 xs:w-4 xs:h-4 text-gray-400" />
              <Input
                id="search-input"
                type="text"
                placeholder="Search for agents, meetings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-4 sm:pl-8 sm:pr-3 sm:py-3 sm:text-md text-xs border-2 border-gray-200 focus:ring-0 rounded-xl bg-white hover:bg-white transition-all duration-200 focus-visible:border-emerald-500 focus-visible:ring-0 focus-visible:outline-none xs:text-xs"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(searchQuery);
                  }
                }}
              />
              <Button
                type="button"
                className="ml-2 px-4 py-2 bg-emerald-500 text-white rounded-none rounded-r-xl hover:bg-emerald-700 transition-all duration-200 text-sm font-medium absolute right-0 top-1/2 transform -translate-y-1/2 xs:px-2 xs:py-1 xs:text-xs"
                onClick={() => handleSearch(searchQuery)}
                tabIndex={0}
              >
                Search
              </Button>
            </div>
          </div>

          <div className="hidden sm:block px-6 py-4 sm:px-4 sm:py-3 xs:px-2 xs:py-2 bg-gray-100 rounded-b-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-xs xs:text-[11px] text-gray-500 gap-2">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <div className="hidden sm:flex items-center gap-1 sm:gap-2">
                  <Command className="w-3 h-3 sm:w-3 sm:h-3 xs:w-2.5 xs:h-2.5" />
                  <span className="whitespace-nowrap">Powered by Octo</span>
                </div>
                <span className="hidden sm:inline">•</span>
                <span className="whitespace-nowrap">Press ⌘ + K to search</span>
                <span className="hidden sm:inline">•</span>
                <span className="whitespace-nowrap">Press Esc to close</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

function SidebarControls({ onSearchClick }: { onSearchClick: () => void }) {
  const { open: isOpen, setOpen, isMobile, toggleSidebar } = useSidebar();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_OPEN_KEY, JSON.stringify(isOpen));
  }, [isOpen]);

  return (
    <div className="flex items-center gap-2 sm:mb-3 mb-0">
      {isMobile ? (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden size-10 rounded-2xl text-emerald-700 bg-emerald-600/30 hover:bg-emerald-600/30 active:text-white active:bg-emerald-600 hover:text-emerald-800 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-none active:shadow-inner hover:shadow-xl"
          onClick={toggleSidebar}
        >
          <Menu className="size-5" />
          <span className="sr-only">Toggle mobile menu</span>
        </Button>
      ) : (
        <SidebarTrigger
          size="lg"
          className={cn(
            "transition-all duration-300 ease-in-out",
            "hover:scale-105 active:scale-95",
            isOpen
              ? "text-emerald-700 bg-white hover:bg-emerald-600/10 active:text-emerald-700 active:bg-emerald-600 hover:text-emerald-800 shadow-md"
              : "text-white bg-emerald-600 hover:bg-emerald-700 hover:text-white shadow-md",
            "rounded-xl border-0",
            "size-10"
          )}
        />
      )}
      <Button
        className={cn(
          "-ml-1 flex items-center gap-2 h-10 px-4 sm:w-50 w-70 font-medium transition-all duration-200 bg-white text-emerald-700 stroke-2.5 hover:bg-emerald-600/10 hover:text-emerald-800 rounded-xl shadow-md"
        )}
        onClick={onSearchClick}
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
  const [sidebarDefaultOpen, setSidebarDefaultOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_OPEN_KEY);
    setSidebarDefaultOpen(stored === "true");
  }, []);

  const handleSearchClick = useCallback(() => {
    setSearchModalOpen(true);
  }, []);

  return (
    <SidebarProvider defaultOpen={sidebarDefaultOpen}>
      <AppSidebar />
      <main className="md:m-2 md:ml-0.5 w-full min-h-full md:max-h-[calc(100svh-16px)] rounded-none overflow-scroll shadow-none relative z-10">
        <div className="sticky top-0 z-50 backdrop-blur-sm border-b border-gray-200 p-1">
          <SidebarControls onSearchClick={handleSearchClick} />
        </div>
        <div className="p-4">{children}</div>
        <SearchModal open={searchModalOpen} onOpenChange={setSearchModalOpen} />
      </main>
    </SidebarProvider>
  );
}
