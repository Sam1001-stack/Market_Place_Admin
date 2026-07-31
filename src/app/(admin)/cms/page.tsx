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
import { cmsPages as initialPages } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import type { CmsPage } from "@/types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CmsPagesPage() {
  const [pages, setPages] = useState<CmsPage[]>(initialPages);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CmsPage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CmsPage | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    status: "draft" as CmsPage["status"],
  });

  function openCreate() {
    setEditing(null);
    setForm({ title: "", slug: "", status: "draft" });
    setDialogOpen(true);
  }

  function openEdit(page: CmsPage) {
    setEditing(page);
    setForm({ title: page.title, slug: page.slug, status: page.status });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    const slug = form.slug.trim() || slugify(form.title);
    if (editing) {
      setPages((prev) =>
        prev.map((p) =>
          p.id === editing.id
            ? {
                ...p,
                title: form.title.trim(),
                slug,
                status: form.status,
                updatedAt: new Date().toISOString().slice(0, 10),
              }
            : p
        )
      );
      toast.success("Page updated");
    } else {
      const next: CmsPage = {
        id: `cms${Date.now()}`,
        title: form.title.trim(),
        slug,
        status: form.status,
        updatedAt: new Date().toISOString().slice(0, 10),
        author: "Content Admin",
      };
      setPages((prev) => [next, ...prev]);
      toast.success("Page created");
    }
    setDialogOpen(false);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setPages((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.success("Page deleted");
  }

  const columns: ColumnDef<CmsPage>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.title}</span>
      ),
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }) => (
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
          /{row.original.slug}
        </code>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "updatedAt",
      header: "Updated",
      cell: ({ row }) => formatDate(row.original.updatedAt),
    },
    {
      accessorKey: "author",
      header: "Author",
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
            onClick={() => setDeleteTarget(row.original)}
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
        title="CMS Pages"
        description="Manage static content and landing pages"
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Create Page
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={pages}
        searchKey="title"
        searchPlaceholder="Search pages..."
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Page" : "Create Page"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update page title, slug, and publish status."
                : "Create a new CMS page for the storefront."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="cms-title">Title</Label>
              <Input
                id="cms-title"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    title: e.target.value,
                    slug: editing ? f.slug : slugify(e.target.value),
                  }))
                }
                placeholder="Page title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cms-slug">Slug</Label>
              <Input
                id="cms-slug"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="page-slug"
              />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(value: CmsPage["status"]) =>
                  setForm((f) => ({ ...f, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editing ? "Save changes" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Page</DialogTitle>
            <DialogDescription>
              Delete <strong>{deleteTarget?.title}</strong>? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
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
