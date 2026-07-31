"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { Banknote, CircleDollarSign, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { orders, payments } from "@/lib/mock-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { Payment, PaymentStatus } from "@/types";

const paymentStatuses: PaymentStatus[] = [
  "pending",
  "completed",
  "failed",
  "refunded",
  "partially_refunded",
];

const orderLookup = Object.fromEntries(orders.map((o) => [o.id, o.orderNumber]));

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "transactionId",
    header: "Transaction ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-medium">{row.original.transactionId}</span>
    ),
  },
  {
    accessorKey: "orderId",
    header: "Order",
    cell: ({ row }) => (
      <Link
        href={`/orders/${row.original.orderId}`}
        className="font-medium text-primary hover:underline"
      >
        {orderLookup[row.original.orderId] ?? row.original.orderId}
      </Link>
    ),
  },
  {
    accessorKey: "vendorName",
    header: "Vendor",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-medium tabular-nums">
        {formatCurrency(row.original.amount)}
      </span>
    ),
  },
  {
    accessorKey: "commission",
    header: "Commission",
    cell: ({ row }) => (
      <span className="tabular-nums text-muted-foreground">
        {formatCurrency(row.original.commission)}
      </span>
    ),
  },
  {
    accessorKey: "vendorPayout",
    header: "Vendor Payout",
    cell: ({ row }) => (
      <span className="tabular-nums">{formatCurrency(row.original.vendorPayout)}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "method",
    header: "Method",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDateTime(row.original.createdAt)}
      </span>
    ),
  },
];

export default function PaymentsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const kpis = useMemo(() => {
    const processed = payments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);
    const pending = payments
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + p.amount, 0);
    const refunded = payments
      .filter((p) => p.status === "refunded" || p.status === "partially_refunded")
      .reduce((sum, p) => sum + p.amount, 0);
    return { processed, pending, refunded };
  }, []);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return payments;
    return payments.filter((p) => p.status === statusFilter);
  }, [statusFilter]);

  const summaryCards = [
    {
      label: "Total processed",
      value: kpis.processed,
      icon: CircleDollarSign,
      hint: "Completed transactions",
    },
    {
      label: "Pending",
      value: kpis.pending,
      icon: Banknote,
      hint: "Awaiting settlement",
    },
    {
      label: "Refunded",
      value: kpis.refunded,
      icon: RotateCcw,
      hint: "Returned to customers",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Payments"
        description="Transaction ledger, commissions, and vendor payouts"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {summaryCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">
                    {formatCurrency(card.value)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{card.hint}</p>
                </div>
                <div className="rounded-lg bg-muted p-2.5">
                  <card.icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        searchKey="transactionId"
        searchPlaceholder="Search transaction ID..."
        filters={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {paymentStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />
    </div>
  );
}
