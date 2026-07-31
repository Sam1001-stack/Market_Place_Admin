"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Ban,
  Calendar,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  User,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/shared/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { customers, orders } from "@/lib/mock-data";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import type { CustomerStatus } from "@/types";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function CustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const found = customers.find((c) => c.id === params.id);
  const [status, setStatus] = React.useState<CustomerStatus | null>(found?.status ?? null);

  if (!found || !status) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <User className="h-12 w-12 text-muted-foreground" />
        <div>
          <h1 className="text-xl font-semibold">Customer not found</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The customer you are looking for does not exist or has been removed.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/customers">
            <ArrowLeft className="h-4 w-4" />
            Back to customers
          </Link>
        </Button>
      </div>
    );
  }

  const customer = { ...found, status };
  const customerOrders = orders.filter((o) => o.customerId === customer.id);
  const isBlocked = status === "blocked";

  const handleToggleBlock = () => {
    if (isBlocked) {
      setStatus("active");
      toast.success(`${customer.name} unblocked`);
    } else {
      setStatus("blocked");
      toast.warning(`${customer.name} blocked`);
    }
  };

  const kpis = [
    { label: "Orders", value: formatNumber(customer.orders) },
    { label: "Total spent", value: formatCurrency(customer.totalSpent) },
    {
      label: "Avg. order value",
      value:
        customer.orders > 0
          ? formatCurrency(Math.round(customer.totalSpent / customer.orders))
          : "—",
    },
    {
      label: "Last order",
      value: customer.lastOrder ? formatDate(customer.lastOrder) : "—",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground" asChild>
          <Link href="/customers">
            <ArrowLeft className="h-4 w-4" />
            Back to customers
          </Link>
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary/10 text-lg text-primary">
                {getInitials(customer.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">{customer.name}</h1>
                <StatusBadge status={customer.status} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Customer since {formatDate(customer.joinDate)}
              </p>
            </div>
          </div>

          <Button
            variant={isBlocked ? "success" : "destructive"}
            onClick={handleToggleBlock}
          >
            {isBlocked ? (
              <>
                <UserCheck className="h-4 w-4" />
                Unblock
              </>
            ) : (
              <>
                <Ban className="h-4 w-4" />
                Block
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="p-5">
                <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">{kpi.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Account details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow icon={Mail} label="Email" value={customer.email} />
            <DetailRow icon={Phone} label="Phone" value={customer.phone} />
            <DetailRow
              icon={MapPin}
              label="Address"
              value={customer.address ?? "—"}
            />
            <Separator />
            <DetailRow
              icon={Calendar}
              label="Joined"
              value={formatDate(customer.joinDate)}
            />
            <DetailRow
              icon={ShoppingBag}
              label="Account status"
              value={customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order history</CardTitle>
          </CardHeader>
          <CardContent>
            {customerOrders.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No orders found for this customer.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {customerOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.vendorName} · {formatDate(order.createdAt)} · {order.items}{" "}
                        item{order.items !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
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
      </div>
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
