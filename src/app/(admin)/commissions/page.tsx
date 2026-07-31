"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { commissionRules as initialRules, orders, payments } from "@/lib/mock-data";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import type { CommissionRule, Payment } from "@/types";

const orderLookup = Object.fromEntries(orders.map((o) => [o.id, o.orderNumber]));

const emptyRuleForm = {
  name: "",
  category: "",
  percentage: "",
};

export default function CommissionsPage() {
  const [rules, setRules] = useState<CommissionRule[]>(initialRules);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<CommissionRule | null>(null);
  const [form, setForm] = useState(emptyRuleForm);

  const ruleColumns: ColumnDef<CommissionRule>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
      },
      {
        accessorKey: "percentage",
        header: "Percentage",
        cell: ({ row }) => (
          <span className="tabular-nums font-medium">{row.original.percentage}%</span>
        ),
      },
      {
        accessorKey: "active",
        header: "Status",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Switch
              checked={row.original.active}
              onCheckedChange={(checked) => {
                setRules((prev) =>
                  prev.map((r) =>
                    r.id === row.original.id ? { ...r, active: checked } : r
                  )
                );
                toast.success(
                  checked
                    ? `${row.original.name} activated`
                    : `${row.original.name} deactivated`
                );
              }}
            />
            <StatusBadge status={row.original.active ? "active" : "inactive"} />
          </div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {formatDate(row.original.createdAt)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditing(row.original);
              setForm({
                name: row.original.name,
                category: row.original.category,
                percentage: String(row.original.percentage),
              });
              setEditOpen(true);
            }}
          >
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            Edit
          </Button>
        ),
      },
    ],
    []
  );

  const historyColumns: ColumnDef<Payment>[] = useMemo(
    () => [
      {
        accessorKey: "transactionId",
        header: "Transaction ID",
        cell: ({ row }) => (
          <span className="font-mono text-xs font-medium">
            {row.original.transactionId}
          </span>
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
        header: "Order amount",
        cell: ({ row }) => (
          <span className="tabular-nums">{formatCurrency(row.original.amount)}</span>
        ),
      },
      {
        accessorKey: "commission",
        header: "Commission",
        cell: ({ row }) => (
          <span className="font-medium tabular-nums text-emerald-700">
            {formatCurrency(row.original.commission)}
          </span>
        ),
      },
      {
        id: "rate",
        header: "Rate",
        cell: ({ row }) => {
          const rate =
            row.original.amount > 0
              ? ((row.original.commission / row.original.amount) * 100).toFixed(1)
              : "0";
          return <span className="tabular-nums text-muted-foreground">{rate}%</span>;
        },
      },
      {
        accessorKey: "vendorPayout",
        header: "Vendor payout",
        cell: ({ row }) => (
          <span className="tabular-nums">
            {formatCurrency(row.original.vendorPayout)}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
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
    ],
    []
  );

  function resetForm() {
    setForm(emptyRuleForm);
    setEditing(null);
  }

  function handleAdd() {
    if (!form.name.trim() || !form.category.trim() || !form.percentage) {
      toast.error("Please fill in all fields");
      return;
    }
    const percentage = Number(form.percentage);
    if (Number.isNaN(percentage) || percentage < 0 || percentage > 100) {
      toast.error("Percentage must be between 0 and 100");
      return;
    }
    const newRule: CommissionRule = {
      id: `cr-${Date.now()}`,
      name: form.name.trim(),
      category: form.category.trim(),
      percentage,
      active: true,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setRules((prev) => [newRule, ...prev]);
    setAddOpen(false);
    resetForm();
    toast.success("Commission rule added");
  }

  function handleEdit() {
    if (!editing) return;
    if (!form.name.trim() || !form.category.trim() || !form.percentage) {
      toast.error("Please fill in all fields");
      return;
    }
    const percentage = Number(form.percentage);
    if (Number.isNaN(percentage) || percentage < 0 || percentage > 100) {
      toast.error("Percentage must be between 0 and 100");
      return;
    }
    setRules((prev) =>
      prev.map((r) =>
        r.id === editing.id
          ? {
              ...r,
              name: form.name.trim(),
              category: form.category.trim(),
              percentage,
            }
          : r
      )
    );
    setEditOpen(false);
    resetForm();
    toast.success("Commission rule updated");
  }

  const ruleFormFields = (
    <div className="grid gap-4 py-2">
      <div className="grid gap-2">
        <Label htmlFor="rule-name">Name</Label>
        <Input
          id="rule-name"
          placeholder="e.g. Electronics Standard"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="rule-category">Category</Label>
        <Input
          id="rule-category"
          placeholder="e.g. Electronics"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="rule-percentage">Percentage</Label>
        <Input
          id="rule-percentage"
          type="number"
          min={0}
          max={100}
          step={0.1}
          placeholder="12"
          value={form.percentage}
          onChange={(e) => setForm((f) => ({ ...f, percentage: e.target.value }))}
        />
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Commissions"
        description="Configure marketplace commission rules and review transaction breakdowns"
        actions={
          <Dialog
            open={addOpen}
            onOpenChange={(open) => {
              setAddOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-1.5 h-4 w-4" />
                Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add commission rule</DialogTitle>
                <DialogDescription>
                  Define a category-based commission percentage for vendor sales.
                </DialogDescription>
              </DialogHeader>
              {ruleFormFields}
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd}>Save rule</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Commission Rules</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="rules">
          <DataTable
            columns={ruleColumns}
            data={rules}
            searchKey="name"
            searchPlaceholder="Search rules..."
          />
        </TabsContent>

        <TabsContent value="history">
          <DataTable
            columns={historyColumns}
            data={payments}
            searchKey="transactionId"
            searchPlaceholder="Search transactions..."
          />
        </TabsContent>
      </Tabs>

      <Dialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit commission rule</DialogTitle>
            <DialogDescription>
              Update the name, category, or percentage for this rule.
            </DialogDescription>
          </DialogHeader>
          {ruleFormFields}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
