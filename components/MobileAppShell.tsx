"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowLeft, ChefHat } from "lucide-react";
import { buyerNavItems, sellerMobileNavItems } from "@/lib/data";
import { cn } from "@/lib/utils";

type MobileAppShellProps = {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  hideBottomNav?: boolean;
  rightAction?: ReactNode;
  className?: string;
  role?: "buyer" | "seller";
};

export function MobileAppShell({
  children,
  title,
  showBack = false,
  hideBottomNav = false,
  rightAction,
  className,
  role = "buyer",
}: MobileAppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const navItems = role === "seller" ? sellerMobileNavItems : buyerNavItems;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffbea_0%,#dff3d2_100%)] text-cocoa-900 lg:grid lg:place-items-center lg:py-8">
      <div className="min-h-screen w-full bg-cream-50 shadow-none lg:min-h-[860px] lg:max-w-[430px] lg:overflow-hidden lg:rounded-[28px] lg:border lg:border-cocoa-100 lg:bg-white lg:shadow-soft">
        {title ? (
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-cocoa-100 bg-white/95 px-4 backdrop-blur">
            <div className="flex min-w-0 items-center gap-3">
              {showBack ? (
                <button
                  aria-label="Kembali"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-cocoa-800 transition hover:bg-cream-100"
                  onClick={() => router.back()}
                  type="button"
                >
                  <ArrowLeft size={21} />
                </button>
              ) : (
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cocoa-800 text-white">
                  <ChefHat size={20} />
                </div>
              )}
              <h1 className="truncate text-base font-black">{title}</h1>
            </div>
            {rightAction ? <div className="shrink-0">{rightAction}</div> : <div className="h-10 w-10" />}
          </header>
        ) : null}

        <div className={cn(hideBottomNav ? "pb-6" : "pb-24", className)}>{children}</div>

        {!hideBottomNav ? (
          <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-cocoa-100 bg-white/95 px-2 pb-2 pt-2 shadow-[0_-12px_30px_rgba(72,44,23,0.08)] backdrop-blur lg:left-1/2 lg:w-[430px] lg:-translate-x-1/2">
            <div className="mx-auto grid max-w-[430px] grid-cols-4 gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    className={cn(
                      "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[11px] font-bold transition",
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
        ) : null}
      </div>
    </main>
  );
}
