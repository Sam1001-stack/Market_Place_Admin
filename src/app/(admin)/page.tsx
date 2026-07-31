"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock, Package, Store } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  RevenueChart,
  OrderTrendsChart,
  VendorPerformanceChart,
  CustomerGrowthChart,
  ProductSalesChart,
} from "@/components/dashboard/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  dashboardKpis,
  revenueChart,
  orderTrends,
  vendorPerformance,
  customerGrowth,
  productSales,
  activityLogs,
  vendors,
  products,
  orders,
} from "@/lib/mock-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function DashboardPage() {
  const pendingVendors = vendors.filter((v) => v.status === "pending");
  const pendingProducts = products.filter((p) => p.status === "pending");
  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Real-time marketplace performance, approvals, and commerce activity"
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/analytics">Analytics</Link>
            </Button>
            <Button asChild>
              <Link href="/reports">
                View Reports <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </>
        }
      />

      <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {dashboardKpis.map((metric, i) => (
          <KpiCard key={metric.label} metric={metric} index={i} />
        ))}
      </div>

      <div className="mb-7 grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueChart data={revenueChart} />
        </div>
        <OrderTrendsChart data={orderTrends} />
      </div>

      <div className="mb-7 grid gap-4 lg:grid-cols-3">
        <VendorPerformanceChart data={vendorPerformance} />
        <CustomerGrowthChart data={customerGrowth} />
        <ProductSalesChart data={productSales} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 bg-gradient-to-r from-amber-50/80 to-transparent">
            <div>
              <CardTitle>Pending Approvals</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Needs your attention</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-5">
            <div>
              <div className="mb-2.5 flex items-center gap-2 text-[13px] font-semibold">
                <Store className="h-4 w-4 text-primary" />
                Vendors
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {pendingVendors.length}
                </span>
              </div>
              <div className="space-y-1">
                {pendingVendors.map((v) => (
                  <Link
                    key={v.id}
                    href={`/vendors/${v.id}`}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-muted/70"
                  >
                    <span className="font-medium">{v.storeName}</span>
                    <StatusBadge status={v.status} />
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2.5 flex items-center gap-2 text-[13px] font-semibold">
                <Package className="h-4 w-4 text-primary" />
                Products
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {pendingProducts.length}
                </span>
              </div>
              <div className="space-y-1">
                {pendingProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-muted/70"
                  >
                    <span className="truncate font-medium">{p.name}</span>
                    <StatusBadge status={p.status} />
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 bg-gradient-to-r from-sky-50/80 to-transparent">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Latest marketplace activity</p>
            </div>
            <Button variant="ghost" size="sm" className="rounded-lg text-primary" asChild>
              <Link href="/orders">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-5">
            {recentOrders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/orders/${order.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 p-3.5 transition-all hover:border-primary/20 hover:bg-accent/50 hover:shadow-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{order.orderNumber}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{order.customerName}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold">{formatCurrency(order.total)}</p>
                    <div className="mt-1 flex justify-end">
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 bg-gradient-to-r from-teal-50/80 to-transparent">
            <div>
              <CardTitle>Activity Log</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Admin actions timeline</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-0 pt-5">
            {activityLogs.map((log, i) => (
              <div
                key={log.id}
                className="relative border-l-2 border-border/80 pb-5 pl-4 last:pb-0"
              >
                <span
                  className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-card ${
                    i === 0 ? "bg-primary" : "bg-slate-300"
                  }`}
                />
                <p className="text-sm font-semibold">{log.action}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{log.target}</p>
                <p className="mt-1 text-[11px] text-muted-foreground/80">
                  {log.user} · {formatDateTime(log.timestamp)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
