"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Store,
  Users,
  Package,
  FolderTree,
  ShoppingCart,
  CreditCard,
  Percent,
  Ticket,
  FileText,
  Image,
  BarChart3,
  LineChart,
  Shield,
  Settings,
  ChevronLeft,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navGroups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "Analytics", href: "/analytics", icon: LineChart },
      { label: "Reports", href: "/reports", icon: BarChart3 },
    ],
  },
  {
    label: "Marketplace",
    items: [
      { label: "Vendors", href: "/vendors", icon: Store },
      { label: "Customers", href: "/customers", icon: Users },
      { label: "Products", href: "/products", icon: Package },
      { label: "Categories", href: "/categories", icon: FolderTree },
      { label: "Orders", href: "/orders", icon: ShoppingCart },
    ],
  },
  {
    label: "Commerce",
    items: [
      { label: "Payments", href: "/payments", icon: CreditCard },
      { label: "Commissions", href: "/commissions", icon: Percent },
      { label: "Coupons", href: "/coupons", icon: Ticket },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "CMS", href: "/cms", icon: FileText },
      { label: "Banners", href: "/banners", icon: Image },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Roles & Permissions", href: "/roles", icon: Shield },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

function NavContent({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="space-y-5 px-2.5 py-4">
      {navGroups.map((group) => (
        <div key={group.label}>
          {!collapsed && (
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              {group.label}
            </p>
          )}
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150",
                    active
                      ? "bg-gradient-to-r from-teal-500/20 to-teal-500/5 text-white shadow-[inset_0_0_0_1px_rgba(45,212,191,0.15)]"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {active && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-teal-400"
                    />
                  )}
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      active ? "text-teal-300" : "text-slate-500 group-hover:text-slate-300"
                    )}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function Sidebar() {
  const { sidebarCollapsed, sidebarMobileOpen, toggleSidebar, setSidebarMobileOpen } =
    useUIStore();

  return (
    <>
      <AnimatePresence>
        {sidebarMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r border-white/[0.06] bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:hidden",
          sidebarMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-4">
          <Brand />
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:bg-white/5 hover:text-white"
            onClick={() => setSidebarMobileOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <NavContent collapsed={false} onNavigate={() => setSidebarMobileOpen(false)} />
        </ScrollArea>
        <SidebarFooter collapsed={false} />
      </aside>

      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-white/[0.06] bg-sidebar text-sidebar-foreground transition-all duration-300 lg:flex",
          sidebarCollapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        <div
          className={cn(
            "flex h-16 items-center border-b border-white/[0.06]",
            sidebarCollapsed ? "justify-center px-2" : "justify-between px-4"
          )}
        >
          {!sidebarCollapsed && <Brand />}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:bg-white/5 hover:text-white"
            onClick={toggleSidebar}
          >
            <ChevronLeft
              className={cn("h-4 w-4 transition-transform duration-300", sidebarCollapsed && "rotate-180")}
            />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <NavContent collapsed={sidebarCollapsed} />
        </ScrollArea>
        <SidebarFooter collapsed={sidebarCollapsed} />
      </aside>
    </>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-teal-700 shadow-[0_8px_20px_rgba(13,148,136,0.35)]">
        <Store className="h-4 w-4 text-white" />
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-sidebar" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold tracking-tight text-white">MarketHub</p>
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-teal-400/80">
          Admin
        </p>
      </div>
    </div>
  );
}

function SidebarFooter({ collapsed }: { collapsed: boolean }) {
  if (collapsed) {
    return (
      <div className="border-t border-white/[0.06] p-2">
        <div className="flex justify-center py-2">
          <Avatar className="h-8 w-8 ring-2 ring-teal-500/20">
            <AvatarFallback className="bg-teal-500/20 text-[10px] text-teal-200">SA</AvatarFallback>
          </Avatar>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-white/[0.06] p-3">
      <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-2.5 ring-1 ring-white/[0.05]">
        <Avatar className="h-9 w-9 ring-2 ring-teal-500/20">
          <AvatarFallback className="bg-teal-500/20 text-xs font-semibold text-teal-200">
            SA
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">Super Admin</p>
          <p className="truncate text-[11px] text-slate-500">admin@markethub.com</p>
        </div>
      </div>
    </div>
  );
}
