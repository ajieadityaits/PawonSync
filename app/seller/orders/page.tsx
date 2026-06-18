import Link from "next/link";
import { CalendarDays, Search } from "lucide-react";
import { MobileAppShell } from "@/components/MobileAppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { getOrders } from "@/lib/orders";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SellerOrdersPage() {
  const orders = await getOrders();
  const todayOrders = orders.slice(0, 2);
  const upcomingOrders = orders.slice(1, 3);

  return (
    <MobileAppShell role="seller" showBack title="Pesanan Aktif">
      <section className="px-4 pt-5">
        <label className="flex h-12 items-center gap-3 rounded-xl border border-cocoa-100 bg-white px-4 text-sm text-cocoa-500 shadow-sm">
          <Search size={18} />
          <span>Cari pesanan...</span>
        </label>
      </section>

      <section className="mt-5 px-4">
        <h2 className="text-xs font-black uppercase text-cocoa-500">Hari Ini</h2>
        <div className="mt-3 grid gap-3">
          {todayOrders.map((order) => (
            <Link
              className="rounded-2xl border border-cocoa-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
              href={`/seller/orders/${order.id}`}
              key={order.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-black text-cocoa-900">{order.eventName}</h3>
                  <p className="mt-1 text-sm font-bold text-cocoa-700">Bu {order.buyerName} • {order.portions} porsi</p>
                  <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-cocoa-400">
                    <CalendarDays size={13} />
                    Antar jam {order.deliveryTime}
                  </p>
                </div>
                <StatusBadge compact status={order.status} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 px-4">
        <h2 className="text-xs font-black uppercase text-cocoa-500">Mendatang</h2>
        <div className="mt-3 grid gap-3">
          {upcomingOrders.map((order) => (
            <Link
              className="rounded-2xl border border-cocoa-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
              href={`/seller/orders/${order.id}`}
              key={order.id}
            >
              <h3 className="font-black text-cocoa-900">{order.eventName}</h3>
              <p className="mt-1 text-sm font-semibold text-cocoa-500">
                {order.portions} porsi • {formatDate(order.eventDate)}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </MobileAppShell>
  );
}
