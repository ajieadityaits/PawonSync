import Link from "next/link";
import { Info, Minus, Plus } from "lucide-react";
import { MobileAppShell } from "@/components/MobileAppShell";
import { findOrder, packagingChecklist } from "@/lib/data";

export default async function SellerPackagingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = findOrder(id);
  const progress = Math.round((packagingChecklist.packed / packagingChecklist.target) * 100);

  return (
    <MobileAppShell role="seller" hideBottomNav showBack title="Pengemasan">
      <section className="px-4 pt-5 text-center">
        <p className="text-xs font-bold text-cocoa-500">
          {order.eventName} — Target: {order.portions} kotak
        </p>
      </section>

      <section className="mt-6 border-y border-cocoa-100 px-4 py-5">
        <h2 className="text-xs font-black uppercase text-cocoa-500">Progress Pengemasan</h2>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-cocoa-100">
          <div className="h-full rounded-full bg-cocoa-900" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-right text-sm font-black text-cocoa-900">
          {packagingChecklist.packed} / {order.portions} kotak
        </p>
      </section>

      <section className="mt-7 px-4">
        <h2 className="text-xs font-black uppercase text-cocoa-500">Counter Kotak</h2>
        <div className="mt-6 grid grid-cols-[56px_1fr_56px] items-center gap-3">
          <button className="grid h-12 w-12 place-items-center rounded-full border border-cocoa-900 bg-white text-cocoa-900" type="button">
            <Minus size={22} />
          </button>
          <p className="text-center text-6xl font-black text-cocoa-900">{packagingChecklist.packed}</p>
          <button className="grid h-12 w-12 place-items-center rounded-full border border-cocoa-900 bg-white text-cocoa-900" type="button">
            <Plus size={22} />
          </button>
        </div>
      </section>

      <section className="mt-7 px-4">
        <div className="rounded-xl bg-cocoa-50 p-4 text-xs font-semibold leading-5 text-cocoa-600">
          <p className="flex items-start gap-2">
            <Info className="mt-0.5 shrink-0" size={16} />
            {packagingChecklist.remainingNote}
          </p>
        </div>
      </section>

      <section className="fixed inset-x-0 bottom-0 z-20 bg-cream-50 px-4 pb-5 pt-3 lg:left-1/2 lg:w-[430px] lg:-translate-x-1/2">
        <Link
          className="flex h-12 items-center justify-center rounded-2xl bg-cocoa-900 px-4 text-xs font-black uppercase text-white shadow-soft"
          href={`/seller/orders/${order.id}/update?sent=1`}
        >
          Selesai Kemas — Kirim Update
        </Link>
      </section>
    </MobileAppShell>
  );
}
