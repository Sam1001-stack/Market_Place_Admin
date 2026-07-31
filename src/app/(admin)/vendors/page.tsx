"use client";

import * as React from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, CheckCircle2, XCircle, Ban, Eye } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { vendors } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Vendor } from "@/types";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function VendorsPage() {
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const filtered = React.useMemo(() => {
    if (statusFilter === "all") return vendors;
    return vendors.filter((v) => v.status === statusFilter);
  }, [statusFilter]);

  const columns: ColumnDef<Vendor>[] = [
    {
      accessorKey: "name",
      header: "Vendor",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(row.original.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{row.original.name}</p>
            <p className="truncate text-xs text-muted-foreground">{row.original.phone}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "storeName",
      header: "Store name",
      filterFn: (row, _id, value) => {
        const search = String(value).toLowerCase();
        return (
          row.original.storeName.toLowerCase().includes(search) ||
          row.original.name.toLowerCase().includes(search)
        );
      },
      cell: ({ row }) => (
        <span className="font-medium text-foreground">{row.original.storeName}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.email}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "registrationDate",
      header: "Registration date",
      cell: ({ row }) => formatDate(row.original.registrationDate),
    },
    {
      accessorKey: "sales",
      header: "Sales",
      cell: ({ row }) => (
        <span className="font-medium">{formatCurrency(row.original.sales)}</span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const vendor = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/vendors/${vendor.id}`}>
                  <Eye />
                  View details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => toast.success(`${vendor.storeName} approved`)}
              >
                <CheckCircle2 />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toast.error(`${vendor.storeName} rejected`)}
              >
                <XCircle />
                Reject
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toast.warning(`${vendor.storeName} suspended`)}
              >
                <Ban />
                Suspend
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Vendors"
        description="Review vendor applications, manage store status, and monitor performance"
      />

      <DataTable
        columns={columns}
        data={filtered}
        searchKey="storeName"
        searchPlaceholder="Search by store or vendor name..."
        filters={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        }
      />
    </div>
  );
}
