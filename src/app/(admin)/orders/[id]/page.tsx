"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Package, Truck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { orders, payments } from "@/lib/mock-data";
import { cn, formatCurrency, formatDateTime } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const timelineSteps: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

function getStepIndex(status: OrderStatus) {
  if (status === "cancelled" || status === "refunded") return -1;
  return timelineSteps.indexOf(status);
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const order = orders.find((o) => o.id === params.id);
  const payment = payments.find((p) => p.orderId === params.id);

  if (!order) {
    return (
      <div>
        <PageHeader title="Order not found" description="This order does not exist." />
        <Button variant="outline" asChild>
          <Link href="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to orders
          </Link>
        </Button>
      </div>
    );
  }

  const stepIndex = getStepIndex(order.status);
  const isTerminal = order.status === "cancelled" || order.status === "refunded";

  return (
    <div>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground">
          <Link href="/orders">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to orders
          </Link>
        </Button>
      </div>

      <PageHeader
        title={order.orderNumber}
        description={`Placed ${formatDateTime(order.createdAt)}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={order.status} />
            <StatusBadge status={order.paymentStatus} />
          </div>
        }
      />

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Customer
                </p>
                <p className="mt-1 text-sm font-medium">{order.customerName}</p>
                <p className="text-xs text-muted-foreground">ID: {order.customerId}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Vendor
                </p>
                <p className="mt-1 text-sm font-medium">{order.vendorName}</p>
                <p className="text-xs text-muted-foreground">ID: {order.vendorId}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Items
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  {order.items} item{order.items !== 1 ? "s" : ""}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Total
                </p>
                <p className="mt-1 text-lg font-semibold tabular-nums">
                  {formatCurrency(order.total)}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="mb-4 text-sm font-medium">Fulfillment timeline</p>
              {isTerminal ? (
                <div className="rounded-lg border border-border bg-muted/40 px-4 py-3">
                  <StatusBadge status={order.status} />
                  <p className="mt-2 text-sm text-muted-foreground">
                    This order was {order.status} and is no longer progressing through fulfillment.
                  </p>
                </div>
              ) : (
                <ol className="relative space-y-0">
                  {timelineSteps.map((step, i) => {
                    const reached = stepIndex >= i;
                    const current = stepIndex === i;
                    return (
                      <li key={step} className="relative flex gap-4 pb-6 last:pb-0">
                        {i < timelineSteps.length - 1 && (
                          <span
                            className={cn(
                              "absolute left-[7px] top-4 h-[calc(100%-8px)] w-0.5",
                              stepIndex > i ? "bg-primary" : "bg-border"
                            )}
                          />
                        )}
                        <span
                          className={cn(
                            "relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2",
                            reached
                              ? "border-primary bg-primary"
                              : "border-border bg-card",
                            current && "ring-4 ring-primary/15"
                          )}
                        />
                        <div>
                          <p
                            className={cn(
                              "text-sm capitalize",
                              reached ? "font-medium text-foreground" : "text-muted-foreground"
                            )}
                          >
                            {step}
                          </p>
                          {current && (
                            <p className="text-xs text-muted-foreground">Current status</p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                Shipping
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Shipping status</p>
                <p className="mt-0.5 font-medium">
                  {order.shippingStatus ?? "Not available"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tracking number</p>
                <p className="mt-0.5 font-mono text-sm font-medium">
                  {order.trackingNumber ?? "—"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={order.paymentStatus} />
              </div>
              {payment ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Transaction</span>
                    <span className="font-mono text-xs">{payment.transactionId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Method</span>
                    <span className="font-medium">{payment.method}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium tabular-nums">
                      {formatCurrency(payment.amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Paid at</span>
                    <span>{formatDateTime(payment.createdAt)}</span>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">No payment record linked.</p>
              )}
            </CardContent>
          </Card>

          {(order.status === "refunded" ||
            order.paymentStatus === "refunded" ||
            order.paymentStatus === "partially_refunded") && (
            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader>
                <CardTitle>Refund information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Refund status</span>
                  <StatusBadge status={order.paymentStatus} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Refund amount</span>
                  <span className="font-medium tabular-nums">
                    {formatCurrency(payment?.amount ?? order.total)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Funds were returned to the customer. Vendor payout for this order is zeroed.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
