"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { banners as initialBanners } from "@/lib/mock-data";
import { formatDate, formatNumber, formatPercent } from "@/lib/utils";
import type { Banner } from "@/types";

const POSITIONS = [
  "Homepage Hero",
  "Sidebar",
  "Top Bar",
  "Category Banner",
  "Checkout Banner",
];

function ctr(clicks: number, impressions: number) {
  if (!impressions) return 0;
  return (clicks / impressions) * 100;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [createOpen, setCreateOpen] = useState(false);
  const [editBanner, setEditBanner] = useState<Banner | null>(null);
  const [deleteBanner, setDeleteBanner] = useState<Banner | null>(null);
  const [form, setForm] = useState({
    title: "",
    position: "Homepage Hero",
    status: "active" as Banner["status"],
    startsAt: "",
    endsAt: "",
  });

  function resetForm() {
    setForm({
      title: "",
      position: "Homepage Hero",
      status: "active",
      startsAt: new Date().toISOString().slice(0, 10),
      endsAt: "",
    });
  }

  function openCreate() {
    resetForm();
    setCreateOpen(true);
  }

  function openEdit(banner: Banner) {
    setForm({
      title: banner.title,
      position: banner.position,
      status: banner.status,
      startsAt: banner.startsAt,
      endsAt: banner.endsAt,
    });
    setEditBanner(banner);
  }

  function handleCreate() {
    if (!form.title.trim()) {
      toast.error("Banner title is required");
      return;
    }
    const next: Banner = {
      id: `b${Date.now()}`,
      title: form.title.trim(),
      position: form.position,
      status: form.status,
      startsAt: form.startsAt || new Date().toISOString().slice(0, 10),
      endsAt: form.endsAt || form.startsAt || new Date().toISOString().slice(0, 10),
      clicks: 0,
      impressions: 0,
    };
    setBanners((prev) => [next, ...prev]);
    setCreateOpen(false);
    toast.success("Banner created");
  }

  function handleEdit() {
    if (!editBanner || !form.title.trim()) {
      toast.error("Banner title is required");
      return;
    }
    setBanners((prev) =>
      prev.map((b) =>
        b.id === editBanner.id
          ? {
              ...b,
              title: form.title.trim(),
              position: form.position,
              status: form.status,
              startsAt: form.startsAt,
              endsAt: form.endsAt,
            }
          : b
      )
    );
    setEditBanner(null);
    toast.success("Banner updated");
  }

  function handleDelete() {
    if (!deleteBanner) return;
    setBanners((prev) => prev.filter((b) => b.id !== deleteBanner.id));
    setDeleteBanner(null);
    toast.success("Banner deleted");
  }

  const formFields = (
    <div className="grid gap-4 py-2">
      <div className="grid gap-2">
        <Label htmlFor="banner-title">Title</Label>
        <Input
          id="banner-title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="Banner title"
        />
      </div>
      <div className="grid gap-2">
        <Label>Position</Label>
        <Select
          value={form.position}
          onValueChange={(value) => setForm((f) => ({ ...f, position: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {POSITIONS.map((pos) => (
              <SelectItem key={pos} value={pos}>
                {pos}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label>Status</Label>
        <Select
          value={form.status}
          onValueChange={(value: Banner["status"]) =>
            setForm((f) => ({ ...f, status: value }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-2">
          <Label htmlFor="banner-start">Starts</Label>
          <Input
            id="banner-start"
            type="date"
            value={form.startsAt}
            onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="banner-end">Ends</Label>
          <Input
            id="banner-end"
            type="date"
            value={form.endsAt}
            onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))}
          />
        </div>
      </div>
    </div>
  );

  const columns: ColumnDef<Banner>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.title}</span>
      ),
    },
    {
      accessorKey: "position",
      header: "Position",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "dateRange",
      header: "Date range",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.original.startsAt)} – {formatDate(row.original.endsAt)}
        </span>
      ),
    },
    {
      accessorKey: "clicks",
      header: "Clicks",
      cell: ({ row }) => formatNumber(row.original.clicks),
    },
    {
      accessorKey: "impressions",
      header: "Impressions",
      cell: ({ row }) => formatNumber(row.original.impressions),
    },
    {
      id: "ctr",
      header: "CTR",
      cell: ({ row }) => {
        const rate = ctr(row.original.clicks, row.original.impressions);
        return (
          <span className="font-medium">
            {rate === 0 ? "0%" : formatPercent(rate).replace("+", "")}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => openEdit(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => setDeleteBanner(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Banners"
        description="Manage promotional banners and placements"
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Create Banner
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={banners}
        searchKey="title"
        searchPlaceholder="Search banners..."
      />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Banner</DialogTitle>
            <DialogDescription>
              Schedule a new promotional banner for the storefront.
            </DialogDescription>
          </DialogHeader>
          {formFields}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editBanner} onOpenChange={(open) => !open && setEditBanner(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
            <DialogDescription>Update banner placement and schedule.</DialogDescription>
          </DialogHeader>
          {formFields}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditBanner(null)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteBanner}
        onOpenChange={(open) => !open && setDeleteBanner(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Banner</DialogTitle>
            <DialogDescription>
              Delete <strong>{deleteBanner?.title}</strong>? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteBanner(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
