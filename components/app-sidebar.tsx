"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  Megaphone,
  Users,
  BarChart3,
  UserCircle,
  Settings,
  Crosshair,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  CreditCard,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { title: "Overview", href: "/", icon: LayoutDashboard },
  { title: "Campaigns", href: "/campaigns", icon: Megaphone },
  { title: "Leads", href: "/leads", icon: Users },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Accounts", href: "/accounts", icon: UserCircle },
  { title: "Billing", href: "/billing", icon: CreditCard },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const themeBtn = (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors w-full",
        "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        collapsed && "justify-center px-0 w-10 mx-auto"
      )}
      aria-label="Toggle theme"
    >
      {mounted && isDark ? (
        <Sun className="h-4 w-4 shrink-0" />
      ) : (
        <Moon className="h-4 w-4 shrink-0" />
      )}
      {!collapsed && <span>{mounted && isDark ? "Light mode" : "Dark mode"}</span>}
    </button>
  );

  const signOutBtn = (
    <button
      onClick={() => {
        window.location.href = "/sign-in";
      }}
      className={cn(
        "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors w-full",
        "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
        collapsed && "justify-center px-0 w-10 mx-auto"
      )}
      aria-label="Sign out"
    >
      <LogOut className="h-4 w-4 shrink-0" />
      {!collapsed && <span>Sign out</span>}
    </button>
  );

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "relative flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-200 ease-in-out shrink-0",
          collapsed ? "w-14" : "w-48"
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-center border-b border-sidebar-border h-14 shrink-0 overflow-hidden",
            collapsed ? "justify-center px-0" : "gap-2.5 px-4"
          )}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary">
            <Crosshair className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold tracking-tight text-sidebar-foreground whitespace-nowrap">
              LeadRaider
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 flex-1 p-2 overflow-hidden">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const btn = (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                  "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  active && "bg-sidebar-accent text-primary",
                  collapsed && "justify-center px-0 w-10 mx-auto"
                )}
              >
                <item.icon
                  className={cn("h-4 w-4 shrink-0", active && "text-primary")}
                />
                {!collapsed && <span className="truncate">{item.title}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{btn}</TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              );
            }
            return <div key={item.href}>{btn}</div>;
          })}
        </nav>

        {/* Footer — status + theme toggle + signout */}
        <div className="border-t border-sidebar-border p-2 flex flex-col gap-0.5">
          {/* Workers status */}
          {!collapsed && (
            <div className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-muted-foreground">
              <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-success animate-pulse-dot" />
              <span className="truncate">3 workers active</span>
            </div>
          )}

          {/* Theme toggle */}
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>{themeBtn}</TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                {mounted && isDark ? "Light mode" : "Dark mode"}
              </TooltipContent>
            </Tooltip>
          ) : (
            themeBtn
          )}

          {/* Sign out */}
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>{signOutBtn}</TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                Sign out
              </TooltipContent>
            </Tooltip>
          ) : (
            signOutBtn
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={cn(
            "absolute -right-3 top-[3.5rem] z-10 flex h-6 w-6 items-center justify-center rounded-full",
            "bg-sidebar border border-sidebar-border text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>
      </aside>
    </TooltipProvider>
  );
}
