"use client";

import type React from "react";

import {
  Bot,
  Calendar,
  ChevronUp,
  LogOut,
  Settings,
  User,
  Video,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const navigationData = {
  user: {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/Surf.png",
    initials: "JD",
  },
  brand: {
    name: "Octo",
    logo: "/logo.png",
  },
  mainNavigation: [
    {
      title: "Meetings",
      url: "/dashboard/meetings",
      icon: Video,
    },
    {
      title: "Calendar",
      url: "/dashboard/calendar",
      icon: Calendar,
    },
    {
      title: "Agents",
      url: "/dashboard/agents",
      icon: Bot,
    },
  ],
  account: [
    {
      title: "Upgrade Plan",
      url: "/dashboard/prices",
      icon: Zap,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],
};
const dropdownItem = [
  {
    title: "Profile",
    url: "/dashboard/settings",
    icon: User,
  },
  {
    title: "Upgrade to Pro",
    url: "/dashboard/plans",
    icon: Zap,
  },
];
export function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar variant="sidebar">
      <SidebarHeader>
        <SidebarMenu className="p-[2px]">
          <div className="flex justify-center items-center w-full">
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="hover:bg-transparent bg-transparent p-6"
                asChild
              >
                <Link href="/" className="flex items-center gap-3">
                  <img
                    src={navigationData.brand.logo}
                    alt="Company Logo"
                    className="w-10 h-10 md:w-14 md:h-14 invert rounded-4xl"
                  />
                  <div className="font-bold text-2xl block md:hidden">
                    {navigationData.brand.name}
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </div>
        </SidebarMenu>
        <Separator />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Features</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationData.mainNavigation.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "relative hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors",
                        isActive && [
                          "text-emerald-600 bg-emerald-500/10",
                          "border-l border-l-emerald-600 rounded-l-none",
                          "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-emerald-600",
                        ]
                      )}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-2 w-full"
                      >
                        <item.icon
                          className={cn(
                            "size-4",
                            isActive && "text-emerald-600 peer-hover:text-white"
                          )}
                        />
                        <span className={cn(isActive && "font-medium")}>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator className="text-black" />
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationData.account.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "relative hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors",
                        isActive && [
                          "bg-emerald-100 text-emerald-600 hover:bg-emerald-600/20",
                          "border-l border-l-emerald-600 rounded-l-none",
                          "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-emerald-600",
                        ]
                      )}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-2 w-full"
                      >
                        <item.icon
                          className={cn(
                            "size-4",
                            isActive && "text-emerald-600"
                          )}
                        />
                        <span className={cn(isActive && "font-medium")}>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="w-full rounded-b-[9px]">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <SidebarMenuButton
                variant={"default"}
                size={"lg"}
                className="cursor-pointer bg-white hover:bg-emerald-500/10focus-visible:ring-0 rounded-2xl"
                asChild
              >
                <DropdownMenuTrigger className="flex items-center gap-3 pl-4">
                  <Avatar className="size-8 bg-transparent">
                    <AvatarImage
                      src="/logo.png"
                      alt="User Avatar"
                      className="object-cover invert"
                    />
                    <AvatarFallback className="bg-emerald-600/10 text-white">
                      U
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex space-x-20">
                    <span className="text-[16px] text-black font-medium">
                      John
                    </span>
                    <ChevronUp className="text-black sm:ml-0 ml-10" />
                  </div>
                </DropdownMenuTrigger>
              </SidebarMenuButton>
              <DropdownMenuContent
                side="top"
                sideOffset={15}
                className="mb-2 rounded-xl shadow-xl -ml-1 bg-white border-0"
              >
                <DropdownMenuLabel className="flex gap-2 items-center select-none cursor-none">
                  <Avatar className="size-10 bg-transparent">
                    <AvatarImage
                      src="/logo.png"
                      alt="User Avatar"
                      className="object-cover invert"
                    />
                    <AvatarFallback className="bg-white text-black">
                      U
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span>John Lawyer</span>
                    <span className="text-xs font-normal text-gray-500">
                      johnlawyer@gmail.com
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {dropdownItem.map((item, index) => (
                  <Link key={index} href={item.url} className="">
                    <DropdownMenuItem
                      className="cursor-pointer focus:bg-emerald-600/5 focus:text-emerald-600"
                      key={index}
                    >
                      <item.icon className="group-hover:text-emerald-600" />{" "}
                      {item.title}
                    </DropdownMenuItem>
                  </Link>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer focus:bg-red-500/5 focus:text-red-600 rounded-b-lg rounded-t-none"
                  onClick={async () => {
                    const a = toast.loading("Logging Out");
                    await authClient.signOut();
                    setTimeout(() => {
                      toast.dismiss(a);
                      toast.success("Logged Out")
                      redirect("/signin");
                    }, 2000);
                  }}
                >
                  <LogOut className="group-hover:text-red-600" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
              <p className="text-muted-foreground">Dashboard Content</p>
            </div>
            <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
              <p className="text-muted-foreground">Analytics Widget</p>
            </div>
            <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
              <p className="text-muted-foreground">Quick Actions</p>
            </div>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                Welcome to Your Dashboard
              </h2>
              <p className="text-muted-foreground">
                This is your main content area. The sidebar is fully responsive
                and accessible.
              </p>
              <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-sm text-emerald-800">
                  <strong>Active Tab Styling:</strong> Notice the solid left
                  border on active navigation items, along with enhanced
                  background and font weight for better visual feedback.
                </p>
              </div>
            </div>
          </div>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
