import Link from "next/link";
import { PackagePlus, Search } from "lucide-react";
import { MobileAppShell } from "@/components/MobileAppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { getOrders } from "@/lib/orders";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BuyerOrdersPage() {
  const orders = await getOrders();
  const activeOrders = orders.filter((order) => order.status !== "selesai").slice(0, 2);
  const historyOrders = orders.filter((order) => order.status === "selesai").concat(orders.slice(2, 3));

  return (
    <MobileAppShell showBack title="Pesanan Saya">
      <section className="px-4 pt-5">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cocoa-300" size={19} />
          <input
            className="h-12 w-full rounded-2xl border border-cocoa-100 bg-white pl-12 pr-4 text-sm font-semibold text-cocoa-900 shadow-sm outline-none transition placeholder:text-cocoa-300 focus:border-cocoa-400 focus:ring-4 focus:ring-orange-100"
            placeholder="Cari pesanan..."
            type="search"
          />
        </label>

        <div className="mt-4 grid grid-cols-2 rounded-2xl bg-white p-1 text-sm font-black shadow-sm">
          <button className="h-10 rounded-xl bg-cocoa-800 text-white" type="button">
            Aktif
          </button>
          <button className="h-10 rounded-xl text-cocoa-400" type="button">
            Riwayat
          </button>
        </div>

        <Link
          className="mt-4 flex h-12 items-center justify-center gap-2 rounded-2xl bg-cocoa-800 px-4 text-sm font-black text-white shadow-sm"
          href="/buyer/orders/new"
        >
          <PackagePlus size={18} />
          Tambah Pesanan
        </Link>
      </section>

      <section className="mt-6 px-4">
        <h2 className="text-xs font-black uppercase text-cocoa-500">Pesanan Aktif</h2>
        <div className="mt-3 grid gap-3">
          {activeOrders.map((order) => (
            <Link
              className="block rounded-2xl border border-cocoa-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
              href={`/buyer/orders/${order.id}`}
              key={order.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-black text-cocoa-900">{order.eventName}</h3>
                  <p className="mt-1 text-xs font-semibold leading-5 text-cocoa-500">
                    {order.cateringName} • {order.portions} porsi
                    <br />
                    Antar jam {order.deliveryTime} • {formatDate(order.eventDate)}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-7 px-4">
        <h2 className="text-xs font-black uppercase text-cocoa-500">Riwayat</h2>
        <div className="mt-3 grid gap-3">
          {historyOrders.map((order) => (
            <Link className="block rounded-2xl border border-cocoa-100 bg-white/75 p-4 shadow-sm" href={`/buyer/orders/${order.id}`} key={order.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-black text-cocoa-800">{order.eventName}</h3>
                  <p className="mt-1 text-xs font-semibold text-cocoa-500">{order.portions} porsi • {formatDate(order.eventDate)}</p>
                </div>
                <StatusBadge status={order.status === "selesai" ? order.status : "selesai"} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </MobileAppShell>
  );
}
