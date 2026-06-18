import type { OrderStatus } from "@/lib/data";
import { statusMeta } from "@/lib/data";
import { cn } from "@/lib/utils";

export function StatusBadge({ status, compact = false }: { status: OrderStatus; compact?: boolean }) {
  const meta = statusMeta[status];

  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ring-1", meta.tone)}>
      <span className={cn("h-2 w-2 rounded-full", meta.dot)} />
      {compact ? meta.shortLabel : meta.label}
    </span>
  );
}
