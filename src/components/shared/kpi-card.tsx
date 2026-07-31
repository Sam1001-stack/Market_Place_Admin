"use client";

import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Minus,
  Package,
  ShoppingCart,
  Store,
  Users,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatNumber, formatPercent, cn } from "@/lib/utils";
import type { KpiMetric } from "@/types";

const iconMap: Record<string, LucideIcon> = {
  "Total Revenue": DollarSign,
  "Marketplace GMV": ShoppingCart,
  "Total Orders": Package,
  "Active Vendors": Store,
  "Total Customers": Users,
  "Pending Approvals": Clock,
};

const accentMap: Record<string, { gradient: string; iconColor: string; iconBg: string }> = {
  "Total Revenue": {
    gradient: "from-teal-500/10 to-transparent",
    iconColor: "text-teal-700",
    iconBg: "bg-teal-50",
  },
  "Marketplace GMV": {
    gradient: "from-sky-500/10 to-transparent",
    iconColor: "text-sky-700",
    iconBg: "bg-sky-50",
  },
  "Total Orders": {
    gradient: "from-indigo-500/10 to-transparent",
    iconColor: "text-indigo-700",
    iconBg: "bg-indigo-50",
  },
  "Active Vendors": {
    gradient: "from-amber-500/10 to-transparent",
    iconColor: "text-amber-700",
    iconBg: "bg-amber-50",
  },
  "Total Customers": {
    gradient: "from-cyan-500/10 to-transparent",
    iconColor: "text-cyan-700",
    iconBg: "bg-cyan-50",
  },
  "Pending Approvals": {
    gradient: "from-rose-500/10 to-transparent",
    iconColor: "text-rose-700",
    iconBg: "bg-rose-50",
  },
};

interface KpiCardProps {
  metric: KpiMetric;
  index?: number;
}

export function KpiCard({ metric, index = 0 }: KpiCardProps) {
  const displayValue =
    metric.format === "currency"
      ? formatCurrency(Number(metric.value))
      : metric.format === "percent"
        ? `${metric.value}%`
        : formatNumber(Number(metric.value));

  const TrendIcon =
    metric.trend === "up" ? ArrowUpRight : metric.trend === "down" ? ArrowDownRight : Minus;
  const Icon = iconMap[metric.label] ?? DollarSign;
  const accent = accentMap[metric.label] ?? {
    gradient: "from-slate-500/10 to-transparent",
    iconColor: "text-slate-700",
    iconBg: "bg-slate-50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="group relative overflow-hidden border-border/70">
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
            accent.gradient
          )}
        />
        <CardContent className="relative p-5">
          <div className="flex items-start justify-between gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105",
                accent.iconBg,
                accent.iconColor
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
            </div>
            <div
              className={cn(
                "flex items-center gap-0.5 rounded-full px-2 py-1 text-[11px] font-semibold",
                metric.trend === "up" && "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60",
                metric.trend === "down" && "bg-rose-50 text-rose-700 ring-1 ring-rose-200/60",
                metric.trend === "neutral" && "bg-slate-100 text-slate-600 ring-1 ring-slate-200/80"
              )}
            >
              <TrendIcon className="h-3.5 w-3.5" />
              {formatPercent(metric.change)}
            </div>
          </div>
          <p className="mt-4 text-[13px] font-medium text-muted-foreground">{metric.label}</p>
          <p className="mt-1 text-[1.65rem] font-semibold tracking-tight text-foreground">
            {displayValue}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
