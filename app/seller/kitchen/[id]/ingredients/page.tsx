import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { MobileAppShell } from "@/components/MobileAppShell";
import { findOrder, kitchenGuide } from "@/lib/data";

export default async function SellerIngredientsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = findOrder(id);

  return (
    <MobileAppShell role="seller" hideBottomNav showBack title="Total Bahan">
      <section className="px-4 pt-7 text-center">
        <h2 className="text-xs font-black uppercase text-cocoa-500">Jumlah Porsi</h2>
        <div className="mt-4 grid grid-cols-[48px_1fr_48px] items-center gap-4">
          <button className="grid h-11 w-11 place-items-center rounded-full border border-cocoa-900 bg-white text-cocoa-900" type="button">
            <Minus size={20} />
          </button>
          <p className="text-5xl font-black text-cocoa-900">{order.portions}</p>
          <button className="grid h-11 w-11 place-items-center rounded-full border border-cocoa-900 bg-white text-cocoa-900" type="button">
            <Plus size={20} />
          </button>
        </div>
        <div className="mt-5 rounded-xl bg-cocoa-50 px-4 py-3 text-xs font-semibold text-cocoa-500">
          Ubah jumlah porsi jika ada perubahan pesanan mendadak.
        </div>
      </section>

      <section className="mt-7 border-t border-cocoa-100 px-4 pt-5">
        <h2 className="text-xs font-black uppercase text-cocoa-500">Total Bahan yang Harus Disiapkan</h2>
        <div className="mt-4 divide-y divide-cocoa-100 rounded-2xl bg-white px-4 shadow-sm">
          {kitchenGuide.totals.map((item) => (
            <div className="flex items-center justify-between py-4 text-sm" key={item.item}>
              <span className="font-semibold text-cocoa-700">{item.item}</span>
              <span className="font-black text-cocoa-900">{item.amount}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] font-semibold leading-5 text-cocoa-400">
          Dihitung otomatis berdasarkan standar 1 porsi x jumlah porsi.
        </p>
      </section>

      <section className="fixed inset-x-0 bottom-0 z-20 grid gap-3 bg-cream-50 px-4 pb-5 pt-3 lg:left-1/2 lg:w-[430px] lg:-translate-x-1/2">
        <button className="h-12 rounded-2xl border border-cocoa-900 bg-white px-4 text-xs font-black uppercase text-cocoa-900" type="button">
          Simpan ke Catatan
        </button>
        <Link
          className="flex h-12 items-center justify-center rounded-2xl bg-cocoa-900 px-4 text-xs font-black uppercase text-white shadow-soft"
          href={`/seller/orders/${order.id}`}
        >
          Kembali ke Detail Pesanan
        </Link>
      </section>
    </MobileAppShell>
  );
}
