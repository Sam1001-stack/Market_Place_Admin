"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Ban,
  CheckCircle2,
  Mail,
  MapPin,
  Package,
  Phone,
  ShoppingCart,
  Star,
  Store,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/shared/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { vendors, products, orders } from "@/lib/mock-data";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import type { VendorStatus } from "@/types";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function VendorDetailPage() {
  const params = useParams<{ id: string }>();
  const found = vendors.find((v) => v.id === params.id);
  const [status, setStatus] = React.useState<VendorStatus | null>(found?.status ?? null);

  if (!found || !status) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <Store className="h-12 w-12 text-muted-foreground" />
        <div>
          <h1 className="text-xl font-semibold">Vendor not found</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The vendor you are looking for does not exist or has been removed.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/vendors">
            <ArrowLeft className="h-4 w-4" />
            Back to vendors
          </Link>
        </Button>
      </div>
    );
  }

  const vendor = { ...found, status };
  const vendorProducts = products.filter((p) => p.vendorId === vendor.id);
  const vendorOrders = orders.filter((o) => o.vendorId === vendor.id);

  const handleApprove = () => {
    setStatus("approved");
    toast.success(`${vendor.storeName} approved`);
  };
  const handleReject = () => {
    setStatus("rejected");
    toast.error(`${vendor.storeName} rejected`);
  };
  const handleSuspend = () => {
    setStatus("suspended");
    toast.warning(`${vendor.storeName} suspended`);
  };

  const kpis = [
    { label: "Sales", value: formatCurrency(vendor.sales), icon: ShoppingCart },
    { label: "Products", value: formatNumber(vendor.products), icon: Package },
    { label: "Orders", value: formatNumber(vendor.orders), icon: ShoppingCart },
    { label: "Commission", value: `${vendor.commission}%`, icon: Store },
    { label: "Rating", value: vendor.rating > 0 ? vendor.rating.toFixed(1) : "—", icon: Star },
  ];

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground" asChild>
          <Link href="/vendors">
            <ArrowLeft className="h-4 w-4" />
            Back to vendors
          </Link>
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary/10 text-lg text-primary">
                {getInitials(vendor.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">{vendor.storeName}</h1>
                <StatusBadge status={vendor.status} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {vendor.name} · Registered {formatDate(vendor.registrationDate)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(status === "pending" || status === "rejected") && (
              <Button variant="success" onClick={handleApprove}>
                <CheckCircle2 className="h-4 w-4" />
                Approve
              </Button>
            )}
            {(status === "pending" || status === "approved" || status === "active") && (
              <Button variant="destructive" onClick={handleReject}>
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
            )}
            {(status === "active" || status === "approved") && (
              <Button variant="outline" onClick={handleSuspend}>
                <Ban className="h-4 w-4" />
                Suspend
              </Button>
            )}
            {status === "suspended" && (
              <Button variant="success" onClick={handleApprove}>
                <CheckCircle2 className="h-4 w-4" />
                Reactivate
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                  <kpi.icon className="h-4 w-4 text-primary" />
                </div>
                <p className="mt-2 text-2xl font-semibold tracking-tight">{kpi.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products ({vendorProducts.length})</TabsTrigger>
          <TabsTrigger value="orders">Orders ({vendorOrders.length})</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Store details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {vendor.description && (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {vendor.description}
                </p>
              )}
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailRow icon={Mail} label="Email" value={vendor.email} />
                <DetailRow icon={Phone} label="Phone" value={vendor.phone} />
                <DetailRow icon={MapPin} label="Address" value={vendor.address ?? "—"} />
                <DetailRow icon={Store} label="Category" value={vendor.category ?? "—"} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              {vendorProducts.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No products for this vendor.
                </p>
              ) : (
                <div className="divide-y divide-border">
                  {vendorProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0 hover:bg-muted/40"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.sku} · {product.category}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">
                          {formatCurrency(product.price)}
                        </span>
                        <StatusBadge status={product.status} />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {vendorOrders.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No orders for this vendor.
                </p>
              ) : (
                <div className="divide-y divide-border">
                  {vendorOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{order.orderNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.customerName} · {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">
                          {formatCurrency(order.total)}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Average order value"
              value={
                vendor.orders > 0
                  ? formatCurrency(Math.round(vendor.sales / vendor.orders))
                  : "—"
              }
              hint="Sales divided by total orders"
            />
            <StatCard
              title="Catalog size"
              value={formatNumber(vendor.products)}
              hint="Active and pending listings"
            />
            <StatCard
              title="Commission rate"
              value={`${vendor.commission}%`}
              hint="Platform take rate for this store"
            />
            <StatCard
              title="Customer rating"
              value={vendor.rating > 0 ? `${vendor.rating.toFixed(1)} / 5` : "No ratings"}
              hint="Average buyer feedback score"
            />
            <StatCard
              title="Lifetime GMV"
              value={formatCurrency(vendor.sales)}
              hint="Gross merchandise volume"
            />
            <StatCard
              title="Fulfillment volume"
              value={formatNumber(vendor.orders)}
              hint="Completed and in-progress orders"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 rounded-lg bg-primary/10 p-2">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="mt-2 text-xl font-semibold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}
