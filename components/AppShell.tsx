"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { buyerNavItems, sellerNavItems } from "@/lib/data";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";

export function AppShell({ role, children }: { role: "seller" | "buyer"; children: ReactNode }) {
  const pathname = usePathname();
  const items = role === "seller" ? sellerNavItems : buyerNavItems;

  return (
    <div className="min-h-screen bg-cream-50">
      <Sidebar items={items} active={pathname} />
      <main className="pb-24 lg:ml-72 lg:pb-0">
        <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </main>
      <BottomNav items={items} />
    </div>
  );
}
