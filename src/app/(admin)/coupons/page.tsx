"use client";

import { useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Ban, Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { coupons as initialCoupons } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Coupon, CouponType } from "@/types";

const emptyForm = {
  code: "",
  type: "percentage" as CouponType,
  value: "",
  usageLimit: "",
  startsAt: "",
  expiresAt: "",
};

function formatCouponValue(coupon: Coupon) {
  if (coupon.type === "free_shipping") return "Free shipping";
  if (coupon.type === "percentage") return `${coupon.value}%`;
  return formatCurrency(coupon.value);
}

function typeLabel(type: CouponType) {
  if (type === "free_shipping") return "Free shipping";
  if (type === "percentage") return "Percentage";
  return "Fixed";
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const columns: ColumnDef<Coupon>[] = useMemo(
    () => [
      {
        accessorKey: "code",
        header: "Code",
        cell: ({ row }) => (
          <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs font-semibold tracking-wide">
            {row.original.code}
          </span>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <span className="capitalize">{typeLabel(row.original.type)}</span>
        ),
      },
      {
        id: "value",
        header: "Value",
        cell: ({ row }) => (
          <span className="font-medium tabular-nums">
            {formatCouponValue(row.original)}
          </span>
        ),
      },
      {
        id: "usage",
        header: "Usage",
        cell: ({ row }) => (
          <span className="tabular-nums text-muted-foreground">
            {row.original.usedCount}/{row.original.usageLimit}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "startsAt",
        header: "Starts",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {formatDate(row.original.startsAt)}
          </span>
        ),
      },
      {
        accessorKey: "expiresAt",
        header: "Expires",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {formatDate(row.original.expiresAt)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const disabled = row.original.status === "disabled";
          return (
            <Button
              variant="ghost"
              size="sm"
              disabled={disabled || row.original.status === "expired"}
              onClick={() => {
                setCoupons((prev) =>
                  prev.map((c) =>
                    c.id === row.original.id ? { ...c, status: "disabled" } : c
                  )
                );
                toast.success(`Coupon ${row.original.code} disabled`);
              }}
            >
              <Ban className="mr-1.5 h-3.5 w-3.5" />
              {disabled ? "Disabled" : "Disable"}
            </Button>
          );
        },
      },
    ],
    []
  );

  function resetForm() {
    setForm(emptyForm);
  }

  function handleCreate() {
    if (!form.code.trim() || !form.usageLimit || !form.startsAt || !form.expiresAt) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (form.type !== "free_shipping" && !form.value) {
      toast.error("Please enter a discount value");
      return;
    }
    const value = form.type === "free_shipping" ? 0 : Number(form.value);
    const usageLimit = Number(form.usageLimit);
    if (Number.isNaN(value) || value < 0) {
      toast.error("Invalid discount value");
      return;
    }
    if (Number.isNaN(usageLimit) || usageLimit < 1) {
      toast.error("Usage limit must be at least 1");
      return;
    }

    const newCoupon: Coupon = {
      id: `cp-${Date.now()}`,
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value,
      usageLimit,
      usedCount: 0,
      status: "active",
      startsAt: form.startsAt,
      expiresAt: form.expiresAt,
    };

    setCoupons((prev) => [newCoupon, ...prev]);
    setOpen(false);
    resetForm();
    toast.success(`Coupon ${newCoupon.code} created`);
  }

  return (
    <div>
      <PageHeader
        title="Coupons"
        description="Create and manage promotional discount codes"
        actions={
          <Dialog
            open={open}
            onOpenChange={(next) => {
              setOpen(next);
              if (!next) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-1.5 h-4 w-4" />
                Create Coupon
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create coupon</DialogTitle>
                <DialogDescription>
                  Define a promotional code with type, value, usage limits, and dates.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="coupon-code">Code</Label>
                  <Input
                    id="coupon-code"
                    placeholder="SUMMER25"
                    value={form.code}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(value: CouponType) =>
                      setForm((f) => ({ ...f, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="free_shipping">Free shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {form.type !== "free_shipping" && (
                  <div className="grid gap-2">
                    <Label htmlFor="coupon-value">
                      Value {form.type === "percentage" ? "(%)" : "($)"}
                    </Label>
                    <Input
                      id="coupon-value"
                      type="number"
                      min={0}
                      placeholder={form.type === "percentage" ? "25" : "10"}
                      value={form.value}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, value: e.target.value }))
                      }
                    />
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="coupon-limit">Usage limit</Label>
                  <Input
                    id="coupon-limit"
                    type="number"
                    min={1}
                    placeholder="1000"
                    value={form.usageLimit}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, usageLimit: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="coupon-starts">Starts</Label>
                    <Input
                      id="coupon-starts"
                      type="date"
                      value={form.startsAt}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, startsAt: e.target.value }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="coupon-expires">Expires</Label>
                    <Input
                      id="coupon-expires"
                      type="date"
                      value={form.expiresAt}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, expiresAt: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate}>Create coupon</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <DataTable
        columns={columns}
        data={coupons}
        searchKey="code"
        searchPlaceholder="Search coupon codes..."
      />
    </div>
  );
}
