import { Badge } from "@/components/ui/badge";

const statusMap: Record<
  string,
  {
    label: string;
    variant: "success" | "warning" | "danger" | "info" | "muted" | "secondary";
  }
> = {
  active: { label: "Active", variant: "success" },
  approved: { label: "Approved", variant: "success" },
  published: { label: "Published", variant: "success" },
  completed: { label: "Completed", variant: "success" },
  delivered: { label: "Delivered", variant: "success" },
  confirmed: { label: "Confirmed", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  processing: { label: "Processing", variant: "warning" },
  shipped: { label: "Shipped", variant: "info" },
  scheduled: { label: "Scheduled", variant: "info" },
  draft: { label: "Draft", variant: "muted" },
  inactive: { label: "Inactive", variant: "muted" },
  expired: { label: "Expired", variant: "muted" },
  disabled: { label: "Disabled", variant: "muted" },
  archived: { label: "Archived", variant: "muted" },
  rejected: { label: "Rejected", variant: "danger" },
  suspended: { label: "Suspended", variant: "danger" },
  blocked: { label: "Blocked", variant: "danger" },
  cancelled: { label: "Cancelled", variant: "danger" },
  failed: { label: "Failed", variant: "danger" },
  refunded: { label: "Refunded", variant: "secondary" },
  partially_refunded: { label: "Partial Refund", variant: "secondary" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusMap[status] ?? { label: status, variant: "muted" as const };
  return (
    <Badge variant={config.variant} className="gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {config.label}
    </Badge>
  );
}
