"use client";

import { Bell, Command, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUIStore } from "@/stores/ui-store";
import { Badge } from "@/components/ui/badge";

const notifications = [
  {
    title: "New vendor pending approval",
    meta: "HomeNest Living · 2h ago",
    tone: "warning" as const,
  },
  {
    title: "Product awaiting review",
    meta: "Smart Home Hub Pro · 4h ago",
    tone: "info" as const,
  },
  {
    title: "Refund request submitted",
    meta: "ORD-2025-88425 · 1d ago",
    tone: "danger" as const,
  },
];

export function Header() {
  const setSidebarMobileOpen = useUIStore((s) => s.setSidebarMobileOpen);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/70 bg-card/75 px-4 backdrop-blur-xl sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 lg:hidden"
        onClick={() => setSidebarMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="relative hidden max-w-xl flex-1 md:block">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search vendors, orders, products…"
          className="h-10 rounded-xl border-border/80 bg-muted/40 pl-10 pr-20 shadow-none transition-colors focus-visible:bg-card"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-lg border border-border/80 bg-card px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground shadow-sm">
          <Command className="h-3 w-3" />K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Search className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-xl">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-2xl p-2 shadow-[var(--shadow-elevated)]">
            <DropdownMenuLabel className="flex items-center justify-between px-2 py-2">
              <span>Notifications</span>
              <Badge variant="secondary">3 new</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((item) => (
              <DropdownMenuItem
                key={item.title}
                className="flex cursor-pointer flex-col items-start gap-1 rounded-xl px-3 py-3"
              >
                <div className="flex w-full items-start gap-2">
                  <span
                    className={
                      item.tone === "warning"
                        ? "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500"
                        : item.tone === "info"
                          ? "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500"
                          : "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500"
                    }
                  />
                  <div>
                    <span className="font-medium">{item.title}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{item.meta}</span>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center rounded-xl py-2.5 text-primary">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="mx-1 hidden h-8 w-px bg-border/80 sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-10 gap-2.5 rounded-xl px-2 hover:bg-muted/80"
            >
              <Avatar className="h-8 w-8 ring-2 ring-primary/15">
                <AvatarFallback className="bg-gradient-to-br from-teal-500/20 to-sky-500/20 text-xs font-semibold text-primary">
                  SA
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium leading-none">Super Admin</p>
                <p className="mt-0.5 text-xs text-muted-foreground">admin@markethub.com</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5 shadow-[var(--shadow-elevated)]">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-lg">Profile</DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg">Preferences</DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg">Activity Log</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-lg text-destructive focus:text-destructive">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
