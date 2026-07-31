"use client";

import { useMemo, useState } from "react";
import { Plus, Shield, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { roles as initialRoles, permissions } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

function permKey(module: string, action: string) {
  return `${module.toLowerCase()}.${action}`;
}

function buildPermissionSet(role: Role): Set<string> {
  if (role.permissions.includes("*")) {
    const all = new Set<string>();
    permissions.forEach((p) => {
      p.actions.forEach((action) => all.add(permKey(p.module, action)));
    });
    return all;
  }
  return new Set(role.permissions);
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [selectedId, setSelectedId] = useState(initialRoles[0]?.id ?? "");
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  const selectedRole = roles.find((r) => r.id === selectedId) ?? roles[0];

  const selectedPerms = useMemo(
    () => (selectedRole ? buildPermissionSet(selectedRole) : new Set<string>()),
    [selectedRole]
  );

  const allActions = useMemo(() => {
    const set = new Set<string>();
    permissions.forEach((p) => p.actions.forEach((a) => set.add(a)));
    return Array.from(set);
  }, []);

  function togglePermission(module: string, action: string, checked: boolean) {
    if (!selectedRole) return;
    const key = permKey(module, action);
    setRoles((prev) =>
      prev.map((role) => {
        if (role.id !== selectedRole.id) return role;
        if (role.permissions.includes("*")) {
          const next = buildPermissionSet(role);
          if (checked) next.add(key);
          else next.delete(key);
          return { ...role, permissions: Array.from(next) };
        }
        const next = new Set(role.permissions);
        if (checked) next.add(key);
        else next.delete(key);
        return { ...role, permissions: Array.from(next) };
      })
    );
  }

  function toggleModule(module: string, actions: string[], checked: boolean) {
    if (!selectedRole) return;
    setRoles((prev) =>
      prev.map((role) => {
        if (role.id !== selectedRole.id) return role;
        const next = role.permissions.includes("*")
          ? buildPermissionSet(role)
          : new Set(role.permissions);
        actions.forEach((action) => {
          const key = permKey(module, action);
          if (checked) next.add(key);
          else next.delete(key);
        });
        return { ...role, permissions: Array.from(next) };
      })
    );
  }

  function handleCreate() {
    if (!form.name.trim()) {
      toast.error("Role name is required");
      return;
    }
    const next: Role = {
      id: `r${Date.now()}`,
      name: form.name.trim(),
      description: form.description.trim() || "Custom role",
      users: 0,
      permissions: [],
    };
    setRoles((prev) => [...prev, next]);
    setSelectedId(next.id);
    setCreateOpen(false);
    setForm({ name: "", description: "" });
    toast.success("Role created");
  }

  function savePermissions() {
    toast.success("Permissions saved", {
      description: `Updated access for ${selectedRole?.name}`,
    });
  }

  return (
    <div>
      <PageHeader
        title="Roles & Permissions"
        description="Control admin access across marketplace modules"
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Role
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {roles.map((role) => (
          <Card
            key={role.id}
            className={cn(
              "cursor-pointer transition-colors",
              selectedId === role.id && "border-primary ring-1 ring-primary/30"
            )}
            onClick={() => setSelectedId(role.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">{role.name}</CardTitle>
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                {role.users} user{role.users !== 1 ? "s" : ""}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Permission matrix</CardTitle>
            <CardDescription>
              Assign module actions for{" "}
              <span className="font-medium text-foreground">
                {selectedRole?.name}
              </span>
            </CardDescription>
          </div>
          <Button onClick={savePermissions}>Save permissions</Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[160px]">Module</TableHead>
                  {allActions.map((action) => (
                    <TableHead key={action} className="text-center capitalize">
                      {action}
                    </TableHead>
                  ))}
                  <TableHead className="text-center">All</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((perm) => {
                  const moduleKeys = perm.actions.map((a) =>
                    permKey(perm.module, a)
                  );
                  const allChecked = moduleKeys.every((k) =>
                    selectedPerms.has(k)
                  );
                  return (
                    <TableRow key={perm.id}>
                      <TableCell className="font-medium">{perm.module}</TableCell>
                      {allActions.map((action) => {
                        const available = perm.actions.includes(action);
                        const key = permKey(perm.module, action);
                        return (
                          <TableCell key={action} className="text-center">
                            {available ? (
                              <Checkbox
                                checked={selectedPerms.has(key)}
                                onCheckedChange={(checked) =>
                                  togglePermission(
                                    perm.module,
                                    action,
                                    checked === true
                                  )
                                }
                              />
                            ) : (
                              <span className="text-muted-foreground/40">—</span>
                            )}
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-center">
                        <Checkbox
                          checked={allChecked}
                          onCheckedChange={(checked) =>
                            toggleModule(
                              perm.module,
                              perm.actions,
                              checked === true
                            )
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Role</DialogTitle>
            <DialogDescription>
              Define a new admin role, then assign permissions in the matrix.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="role-name">Name</Label>
              <Input
                id="role-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Marketing Admin"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role-desc">Description</Label>
              <Textarea
                id="role-desc"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="What this role can manage"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
