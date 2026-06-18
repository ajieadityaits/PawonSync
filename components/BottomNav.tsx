"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export function BottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-cocoa-100 bg-white/95 px-2 pb-2 pt-2 shadow-[0_-12px_30px_rgba(72,44,23,0.08)] backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-md gap-1" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg px-1 text-[11px] font-bold transition",
                active ? "bg-cocoa-800 text-white" : "text-cocoa-500 hover:bg-cream-100",
              )}
              href={item.href}
              key={item.href}
            >
              <Icon size={19} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
