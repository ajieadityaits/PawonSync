import Link from "next/link";
import { Logo } from "./Navbar";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export function Sidebar({ items, active }: { items: NavItem[]; active: string }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-cocoa-100 bg-white/90 px-5 py-6 backdrop-blur lg:block">
      <Logo />
      <nav className="mt-8 grid gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.href || active.startsWith(`${item.href}/`);

          return (
            <Link
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold transition",
                isActive ? "bg-cocoa-800 text-white shadow-soft" : "text-cocoa-600 hover:bg-cream-100 hover:text-cocoa-900",
              )}
              href={item.href}
              key={item.href}
            >
              <Icon size={19} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-6 left-5 right-5 rounded-xl bg-sage-50 p-4 text-sm text-sage-900 ring-1 ring-sage-100">
        <p className="font-bold">Mode Prototype</p>
        <p className="mt-1 text-sage-700">Data dummy aktif untuk kebutuhan user testing.</p>
      </div>
    </aside>
  );
}
