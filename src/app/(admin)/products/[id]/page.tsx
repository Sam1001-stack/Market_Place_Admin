"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Package,
  Store,
  Tag,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { products, vendors } from "@/lib/mock-data";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import type { ProductStatus } from "@/types";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const found = products.find((p) => p.id === params.id);
  const [status, setStatus] = React.useState<ProductStatus | null>(found?.status ?? null);

  if (!found || !status) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <Package className="h-12 w-12 text-muted-foreground" />
        <div>
          <h1 className="text-xl font-semibold">Product not found</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The product you are looking for does not exist or has been removed.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/products">
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </Link>
        </Button>
      </div>
    );
  }

  const product = { ...found, status };
  const vendor = vendors.find((v) => v.id === product.vendorId);

  const handleApprove = () => {
    setStatus("approved");
    toast.success(`"${product.name}" approved`);
  };
  const handleReject = () => {
    setStatus("rejected");
    toast.error(`"${product.name}" rejected`);
  };

  const metrics = [
    { label: "Price", value: formatCurrency(product.price) },
    { label: "Stock", value: formatNumber(product.stock) },
    { label: "Sales", value: formatNumber(product.sales) },
    { label: "Submitted", value: formatDate(product.submittedAt) },
  ];

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground" asChild>
          <Link href="/products">
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </Link>
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
              <StatusBadge status={product.status} />
            </div>
            <p className="mt-1 font-mono text-sm text-muted-foreground">{product.sku}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {status !== "approved" && (
              <Button variant="success" onClick={handleApprove}>
                <CheckCircle2 className="h-4 w-4" />
                Approve
              </Button>
            )}
            {status !== "rejected" && (
              <Button variant="destructive" onClick={handleReject}>
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="p-5">
                <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">{metric.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Product details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex aspect-[16/9] items-center justify-center rounded-xl border border-dashed border-border bg-muted/40">
              <div className="text-center">
                <Package className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Product preview</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Description
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                {product.description ?? "No description provided."}
              </p>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Tag className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Category
                  </p>
                  <p className="mt-0.5 text-sm font-medium">{product.category}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    SKU
                  </p>
                  <p className="mt-0.5 font-mono text-sm font-medium">{product.sku}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vendor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Store className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{product.vendorName}</p>
                {vendor && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{vendor.name}</p>
                )}
              </div>
            </div>

            {vendor && (
              <>
                <Separator />
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Status</span>
                    <StatusBadge status={vendor.status} />
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Email</span>
                    <span className="truncate font-medium">{vendor.email}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{vendor.category ?? "—"}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/vendors/${vendor.id}`}>View vendor profile</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
