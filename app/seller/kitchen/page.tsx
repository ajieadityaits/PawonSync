import Link from "next/link";
import { ChevronRight, Info } from "lucide-react";
import { MobileAppShell } from "@/components/MobileAppShell";
import { getOrders } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function SellerKitchenPage() {
  const orders = await getOrders();
  const kitchenOrders = orders.filter((order) => order.status !== "selesai");

  return (
    <MobileAppShell role="seller" title="Dapur">
      <section className="px-4 pt-5">
        <h2 className="text-xs font-black uppercase text-cocoa-500">Pesanan Aktif Hari Ini</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {kitchenOrders.length ? kitchenOrders.map((order) => (
            <article className="rounded-2xl border border-cocoa-100 bg-white p-4 shadow-sm" key={order.id}>
              <h3 className="text-xs font-black uppercase text-cocoa-700">{order.eventName}</h3>
              <p className="mt-2 text-3xl font-black text-cocoa-900">{order.portions}</p>
              <p className="text-xs font-bold text-cocoa-500">porsi</p>
            </article>
          )) : (
            <p className="col-span-2 rounded-2xl border border-cocoa-100 bg-white p-4 text-sm font-semibold text-cocoa-500 shadow-sm">
              Belum ada pesanan aktif untuk dapur.
            </p>
          )}
        </div>
      </section>

      <section className="mt-7 border-t border-cocoa-100 px-4 pt-6">
        <h2 className="text-xs font-black uppercase text-cocoa-500">Pilih Pesanan untuk Panduan Dapur</h2>
        <div className="mt-3 grid gap-3">
          {kitchenOrders.length ? kitchenOrders.map((order, index) => (
            <Link
              className={index === 0 ? "flex h-14 items-center justify-between rounded-xl bg-cocoa-900 px-4 text-sm font-black text-white shadow-soft" : "flex h-14 items-center justify-between rounded-xl border border-cocoa-100 bg-white px-4 text-sm font-black text-cocoa-700 shadow-sm"}
              href={`/seller/kitchen/${order.id}/plate`}
              key={order.id}
            >
              {order.eventName} — {order.portions} porsi
              <ChevronRight size={18} />
            </Link>
          )) : (
            <p className="rounded-xl border border-cocoa-100 bg-white px-4 py-4 text-sm font-semibold text-cocoa-500 shadow-sm">
              Pesanan baru dari buyer akan muncul otomatis di sini.
            </p>
          )}
        </div>
      </section>

      <section className="mt-6 px-4">
        <div className="rounded-xl border border-cocoa-100 bg-white p-4 text-xs font-semibold leading-5 text-cocoa-600 shadow-sm">
          <p className="flex items-start gap-2">
            <Info className="mt-0.5 shrink-0" size={16} />
            Pilih pesanan untuk melihat dummy plate dan kalkulasi bahan otomatis.
          </p>
        </div>
      </section>
    </MobileAppShell>
  );
}
