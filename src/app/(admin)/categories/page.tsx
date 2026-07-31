"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { categories as initialCategories } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";
import type { Category } from "@/types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [createOpen, setCreateOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    parentId: "none",
    attributes: "",
    status: "active" as Category["status"],
  });

  const parentMap = useMemo(() => {
    const map = new Map(categories.map((c) => [c.id, c.name]));
    return map;
  }, [categories]);

  const sorted = useMemo(() => {
    const roots = categories
      .filter((c) => !c.parentId)
      .sort((a, b) => a.order - b.order);
    const result: Category[] = [];
    for (const root of roots) {
      result.push(root);
      const children = categories
        .filter((c) => c.parentId === root.id)
        .sort((a, b) => a.order - b.order);
      result.push(...children);
    }
    const orphaned = categories.filter(
      (c) => c.parentId && !categories.some((p) => p.id === c.parentId)
    );
    return [...result, ...orphaned];
  }, [categories]);

  function openCreate() {
    setForm({ name: "", slug: "", parentId: "none", attributes: "", status: "active" });
    setCreateOpen(true);
  }

  function openEdit(category: Category) {
    setForm({
      name: category.name,
      slug: category.slug,
      parentId: category.parentId ?? "none",
      attributes: (category.attributes ?? []).join(", "),
      status: category.status,
    });
    setEditCategory(category);
  }

  function handleCreate() {
    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    const parentId = form.parentId === "none" ? null : form.parentId;
    const siblings = categories.filter((c) => c.parentId === parentId);
    const maxOrder = siblings.reduce((max, c) => Math.max(max, c.order), 0);
    const next: Category = {
      id: `cat${Date.now()}`,
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      parentId,
      products: 0,
      status: form.status,
      order: maxOrder + 1,
      attributes: form.attributes
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
    };
    setCategories((prev) => [...prev, next]);
    setCreateOpen(false);
    toast.success("Category created");
  }

  function handleEdit() {
    if (!editCategory || !form.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    setCategories((prev) =>
      prev.map((c) =>
        c.id === editCategory.id
          ? {
              ...c,
              name: form.name.trim(),
              slug: form.slug.trim() || slugify(form.name),
              parentId: form.parentId === "none" ? null : form.parentId,
              status: form.status,
              attributes: form.attributes
                .split(",")
                .map((a) => a.trim())
                .filter(Boolean),
            }
          : c
      )
    );
    setEditCategory(null);
    toast.success("Category updated");
  }

  function handleDelete() {
    if (!deleteCategory) return;
    setCategories((prev) =>
      prev
        .filter((c) => c.id !== deleteCategory.id)
        .map((c) =>
          c.parentId === deleteCategory.id ? { ...c, parentId: null } : c
        )
    );
    setDeleteCategory(null);
    toast.success("Category deleted");
  }

  function moveCategory(category: Category, direction: "up" | "down") {
    const siblings = categories
      .filter((c) => c.parentId === category.parentId)
      .sort((a, b) => a.order - b.order);
    const index = siblings.findIndex((c) => c.id === category.id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= siblings.length) return;

    const current = siblings[index];
    const target = siblings[swapIndex];
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === current.id) return { ...c, order: target.order };
        if (c.id === target.id) return { ...c, order: current.order };
        return c;
      })
    );
  }

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.parentId && (
            <span className="text-muted-foreground">└</span>
          )}
          <span className={row.original.parentId ? "font-medium" : "font-semibold"}>
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }) => (
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.original.slug}</code>
      ),
    },
    {
      id: "parent",
      header: "Parent",
      cell: ({ row }) =>
        row.original.parentId
          ? parentMap.get(row.original.parentId) ?? "—"
          : "—",
    },
    {
      accessorKey: "products",
      header: "Products",
      cell: ({ row }) => formatNumber(row.original.products),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "order",
      header: "Order",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <span className="w-6 text-sm">{row.original.order}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => moveCategory(row.original, "up")}
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => moveCategory(row.original, "down")}
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
    {
      id: "attributes",
      header: "Attributes",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {(row.original.attributes ?? []).map((attr) => (
            <Badge key={attr} variant="secondary" className="text-xs">
              {attr}
            </Badge>
          ))}
          {(row.original.attributes ?? []).length === 0 && (
            <span className="text-muted-foreground">—</span>
          )}
        </div>
      ),
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
            onClick={() => setDeleteCategory(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const formFields = (
    <div className="grid gap-4 py-2">
      <div className="grid gap-2">
        <Label htmlFor="cat-name">Name</Label>
        <Input
          id="cat-name"
          value={form.name}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              name: e.target.value,
              slug: f.slug || slugify(e.target.value),
            }))
          }
          placeholder="Category name"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="cat-slug">Slug</Label>
        <Input
          id="cat-slug"
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          placeholder="category-slug"
        />
      </div>
      <div className="grid gap-2">
        <Label>Parent</Label>
        <Select
          value={form.parentId}
          onValueChange={(value) => setForm((f) => ({ ...f, parentId: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="No parent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No parent (root)</SelectItem>
            {categories
              .filter((c) => !c.parentId && c.id !== editCategory?.id)
              .map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label>Status</Label>
        <Select
          value={form.status}
          onValueChange={(value: Category["status"]) =>
            setForm((f) => ({ ...f, status: value }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="cat-attrs">Attributes</Label>
        <Input
          id="cat-attrs"
          value={form.attributes}
          onChange={(e) => setForm((f) => ({ ...f, attributes: e.target.value }))}
          placeholder="Brand, Color, Size (comma-separated)"
        />
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Organize the marketplace catalog hierarchy"
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Create Category
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={sorted}
        searchKey="name"
        searchPlaceholder="Search categories..."
      />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
            <DialogDescription>
              Add a new root or child category to the catalog.
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

      <Dialog open={!!editCategory} onOpenChange={(open) => !open && setEditCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category details and attributes.</DialogDescription>
          </DialogHeader>
          {formFields}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCategory(null)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteCategory}
        onOpenChange={(open) => !open && setDeleteCategory(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteCategory?.name}</strong>? Child categories will become
              root categories.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteCategory(null)}>
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
