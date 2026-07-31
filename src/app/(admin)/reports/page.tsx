"use client";

import { useMemo, useState } from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  dashboardKpis,
  revenueChart,
  orderTrends,
  vendorPerformance,
  customerGrowth,
  productSales,
  orders,
  vendors,
  customers,
  products,
  payments,
} from "@/lib/mock-data";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import type { KpiMetric } from "@/types";

type ReportType =
  | "sales"
  | "revenue"
  | "vendors"
  | "customers"
  | "products"
  | "payments";

const reportTabs: { value: ReportType; label: string }[] = [
  { value: "sales", label: "Sales" },
  { value: "revenue", label: "Revenue" },
  { value: "vendors", label: "Vendors" },
  { value: "customers", label: "Customers" },
  { value: "products", label: "Products" },
  { value: "payments", label: "Payments" },
];

export default function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>("sales");
  const [fromDate, setFromDate] = useState("2025-01-01");
  const [toDate, setToDate] = useState("2025-12-31");

  const kpis = useMemo((): KpiMetric[] => {
    switch (reportType) {
      case "sales":
        return [
          dashboardKpis[2],
          {
            label: "Avg Order Value",
            value: 154,
            change: 4.1,
            trend: "up",
            format: "currency",
          },
          {
            label: "Items Sold",
            value: 42180,
            change: 6.8,
            trend: "up",
            format: "number",
          },
          {
            label: "Conversion Rate",
            value: 3.4,
            change: 0.6,
            trend: "up",
            format: "percent",
          },
        ];
      case "revenue":
        return [
          dashboardKpis[0],
          dashboardKpis[1],
          {
            label: "Net Margin",
            value: 18.2,
            change: 1.4,
            trend: "up",
            format: "percent",
          },
          {
            label: "Refunds",
            value: 42800,
            change: -2.1,
            trend: "down",
            format: "currency",
          },
        ];
      case "vendors":
        return [
          dashboardKpis[3],
          {
            label: "Avg Vendor GMV",
            value: 7156,
            change: 5.3,
            trend: "up",
            format: "currency",
          },
          {
            label: "Top Vendor Sales",
            value: 284000,
            change: 9.2,
            trend: "up",
            format: "currency",
          },
          {
            label: "Pending Approvals",
            value: 86,
            change: -4.2,
            trend: "down",
            format: "number",
          },
        ];
      case "customers":
        return [
          dashboardKpis[4],
          {
            label: "New Customers",
            value: 5800,
            change: 11.2,
            trend: "up",
            format: "number",
          },
          {
            label: "Repeat Rate",
            value: 42.5,
            change: 2.8,
            trend: "up",
            format: "percent",
          },
          {
            label: "Avg LTV",
            value: 312,
            change: 7.4,
            trend: "up",
            format: "currency",
          },
        ];
      case "products":
        return [
          {
            label: "Active SKUs",
            value: products.filter((p) => p.status === "approved").length,
            change: 3.2,
            trend: "up",
            format: "number",
          },
          {
            label: "Units Sold",
            value: products.reduce((s, p) => s + p.sales, 0),
            change: 8.1,
            trend: "up",
            format: "number",
          },
          {
            label: "Out of Stock",
            value: products.filter((p) => p.stock === 0).length,
            change: -1.5,
            trend: "down",
            format: "number",
          },
          {
            label: "Pending Review",
            value: products.filter((p) => p.status === "pending").length,
            change: 0,
            trend: "neutral",
            format: "number",
          },
        ];
      case "payments":
        return [
          {
            label: "Processed Volume",
            value: payments
              .filter((p) => p.status === "completed")
              .reduce((s, p) => s + p.amount, 0),
            change: 10.4,
            trend: "up",
            format: "currency",
          },
          {
            label: "Commission Earned",
            value: payments.reduce((s, p) => s + p.commission, 0),
            change: 8.7,
            trend: "up",
            format: "currency",
          },
          {
            label: "Vendor Payouts",
            value: payments.reduce((s, p) => s + p.vendorPayout, 0),
            change: 9.1,
            trend: "up",
            format: "currency",
          },
          {
            label: "Failed Payments",
            value: payments.filter((p) => p.status === "failed").length,
            change: -12.0,
            trend: "down",
            format: "number",
          },
        ];
    }
  }, [reportType]);

  function exportReport(format: "csv" | "pdf") {
    toast.success("Export started", {
      description: `${reportType} report (${format.toUpperCase()}) · ${fromDate} to ${toDate}`,
    });
  }

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Generate and export marketplace performance reports"
        actions={
          <div className="flex flex-wrap items-end gap-3">
            <div className="grid gap-1">
              <Label htmlFor="from-date" className="text-xs">
                From
              </Label>
              <Input
                id="from-date"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-9 w-[150px]"
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="to-date" className="text-xs">
                To
              </Label>
              <Input
                id="to-date"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-9 w-[150px]"
              />
            </div>
            <Button variant="outline" onClick={() => exportReport("csv")}>
              <FileSpreadsheet className="h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => exportReport("pdf")}>
              <FileText className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        }
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={reportType}
          onValueChange={(v) => setReportType(v as ReportType)}
        >
          <TabsList className="h-auto flex-wrap">
            {reportTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Select
          value={reportType}
          onValueChange={(v) => setReportType(v as ReportType)}
        >
          <SelectTrigger className="w-[180px] sm:hidden">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {reportTabs.map((tab) => (
              <SelectItem key={tab.value} value={tab.value}>
                {tab.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((metric, i) => (
          <KpiCard key={`${reportType}-${metric.label}`} metric={metric} index={i} />
        ))}
      </div>

      <div className="mb-6">
        {reportType === "sales" && <OrderTrendsChart data={orderTrends} />}
        {reportType === "revenue" && <RevenueChart data={revenueChart} />}
        {reportType === "vendors" && (
          <VendorPerformanceChart data={vendorPerformance} />
        )}
        {reportType === "customers" && (
          <CustomerGrowthChart data={customerGrowth} />
        )}
        {reportType === "products" && <ProductSalesChart data={productSales} />}
        {reportType === "payments" && <RevenueChart data={revenueChart} />}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="capitalize">{reportType} summary</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => exportReport("csv")}>
            <Download className="h-4 w-4" />
            Download
          </Button>
        </CardHeader>
        <CardContent>
          {reportType === "sales" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.slice(0, 8).map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.vendorName}</TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(order.total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {reportType === "revenue" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">GMV</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenueChart.map((point) => (
                  <TableRow key={point.name}>
                    <TableCell className="font-medium">{point.name}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(point.value)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(point.secondary ?? 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {reportType === "vendors" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Sales</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.slice(0, 8).map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">{vendor.storeName}</TableCell>
                    <TableCell>{vendor.category}</TableCell>
                    <TableCell>
                      <StatusBadge status={vendor.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(vendor.sales)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(vendor.orders)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {reportType === "customers" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Spent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.slice(0, 8).map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>
                      <StatusBadge status={customer.status} />
                    </TableCell>
                    <TableCell>{formatDate(customer.joinDate)}</TableCell>
                    <TableCell className="text-right">
                      {formatNumber(customer.orders)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(customer.totalSpent)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {reportType === "products" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Sales</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.slice(0, 8).map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <StatusBadge status={product.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(product.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(product.sales)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {reportType === "payments" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.slice(0, 8).map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.transactionId}
                    </TableCell>
                    <TableCell>{payment.vendorName}</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>
                      <StatusBadge status={payment.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
