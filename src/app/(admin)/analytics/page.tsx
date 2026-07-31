"use client";

import { useState } from "react";
import {
  DollarSign,
  Percent,
  ShoppingBag,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import {
  RevenueChart,
  OrderTrendsChart,
  VendorPerformanceChart,
  CustomerGrowthChart,
  ProductSalesChart,
} from "@/components/dashboard/charts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  dashboardKpis,
  revenueChart,
  orderTrends,
  vendorPerformance,
  customerGrowth,
  productSales,
} from "@/lib/mock-data";
import type { KpiMetric } from "@/types";

const insightMetrics: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Target;
}[] = [
  {
    label: "Conversion Rate",
    value: "3.42%",
    detail: "+0.28% vs prior period",
    icon: Target,
  },
  {
    label: "Avg Order Value",
    value: "$154.20",
    detail: "+4.1% vs prior period",
    icon: DollarSign,
  },
  {
    label: "Cart Abandonment",
    value: "68.4%",
    detail: "-2.3% improvement",
    icon: ShoppingBag,
  },
  {
    label: "Repeat Purchase",
    value: "42.5%",
    detail: "+2.8% vs prior period",
    icon: Users,
  },
  {
    label: "Take Rate",
    value: "11.8%",
    detail: "Commission / GMV",
    icon: Percent,
  },
  {
    label: "Revenue / Customer",
    value: "$62.15",
    detail: "+7.4% vs prior period",
    icon: TrendingUp,
  },
];

const extraKpis: KpiMetric[] = [
  {
    label: "Session → Purchase",
    value: 3.4,
    change: 0.6,
    trend: "up",
    format: "percent",
  },
  {
    label: "Refund Rate",
    value: 1.8,
    change: -0.4,
    trend: "down",
    format: "percent",
  },
  {
    label: "NPS Score",
    value: 72,
    change: 3.2,
    trend: "up",
    format: "number",
  },
];

export default function AnalyticsPage() {
  const [fromDate, setFromDate] = useState("2025-01-01");
  const [toDate, setToDate] = useState("2025-12-31");
  const [range, setRange] = useState("12m");

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Deep-dive marketplace performance and customer behavior"
        actions={
          <div className="flex flex-wrap items-end gap-3">
            <div className="grid gap-1">
              <Label className="text-xs">Preset</Label>
              <Select value={range} onValueChange={setRange}>
                <SelectTrigger className="h-9 w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="12m">Last 12 months</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1">
              <Label htmlFor="analytics-from" className="text-xs">
                From
              </Label>
              <Input
                id="analytics-from"
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setRange("custom");
                }}
                className="h-9 w-[150px]"
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="analytics-to" className="text-xs">
                To
              </Label>
              <Input
                id="analytics-to"
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setRange("custom");
                }}
                className="h-9 w-[150px]"
              />
            </div>
          </div>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {[...dashboardKpis.slice(0, 3), ...extraKpis].map((metric, i) => (
          <KpiCard key={metric.label} metric={metric} index={i} />
        ))}
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {insightMetrics.map((insight) => {
          const Icon = insight.icon;
          return (
            <Card key={insight.label}>
              <CardContent className="flex items-start gap-4 p-5">
                <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {insight.label}
                  </p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight">
                    {insight.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {insight.detail}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mb-6 grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueChart data={revenueChart} />
        </div>
        <OrderTrendsChart data={orderTrends} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <VendorPerformanceChart data={vendorPerformance} />
        <CustomerGrowthChart data={customerGrowth} />
        <ProductSalesChart data={productSales} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Period insight</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Showing analytics for{" "}
          <span className="font-medium text-foreground">
            {fromDate} → {toDate}
          </span>{" "}
          ({range === "custom" ? "custom range" : range}). Revenue growth remains
          strong with GMV outpacing platform take rate. Focus areas: reduce cart
          abandonment and expand top-performing vendor categories.
        </CardContent>
      </Card>
    </div>
  );
}
