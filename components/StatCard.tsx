import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  helper,
  icon: Icon,
}: {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-xl border border-cocoa-100 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-cocoa-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-cocoa-900">{value}</p>
        </div>
        <div className="rounded-lg bg-sage-100 p-2 text-sage-700">
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-3 text-xs font-medium text-cocoa-400">{helper}</p>
    </div>
  );
}
