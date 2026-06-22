import { CalendarDays, Clock, MapPin } from "lucide-react";
import { MobileAppShell } from "@/components/MobileAppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { getOrders } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function SellerSchedulePage() {
  const dates = Array.from({ length: 14 }, (_, index) => index + 18);
  const orders = await getOrders();
  const scheduledOrders = orders.filter((order) => order.status !== "selesai");

  return (
    <MobileAppShell role="seller" showBack title="Jadwal">
      <section className="px-4 pt-5">
        <p className="text-sm font-black uppercase text-orange-700">Jadwal Pengiriman</p>
        <h1 className="mt-1 text-2xl font-black text-cocoa-900">Kalender pengiriman</h1>
        <p className="mt-2 text-sm font-semibold leading-6 text-cocoa-500">
          Pantau jam, buyer, menu, jumlah porsi, lokasi, dan status pengiriman.
        </p>
      </section>

      <section className="mt-5 grid gap-5 px-4">
        <div className="rounded-2xl border border-cocoa-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-cocoa-900">Juni 2026</h2>
            <CalendarDays className="text-cocoa-500" size={20} />
          </div>
          <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-black text-cocoa-400">
            {["S", "S", "R", "K", "J", "S", "M"].map((day, index) => (
              <span key={`${day}-${index}`}>{day}</span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {dates.map((date) => (
              <button
                className={date === 20 ? "aspect-square rounded-lg bg-cocoa-800 text-sm font-black text-white" : "aspect-square rounded-lg bg-cream-50 text-sm font-bold text-cocoa-700 hover:bg-orange-soft"}
                key={date}
                type="button"
              >
                {date}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-cocoa-100 bg-white p-5 shadow-sm">
          <h2 className="text-base font-black text-cocoa-900">List jadwal pengiriman hari ini</h2>
          <div className="mt-4 grid gap-3">
            {scheduledOrders.length ? scheduledOrders.map((order) => (
              <article className="rounded-xl bg-cream-50 p-4" key={order.id}>
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="flex items-center gap-2 font-black text-cocoa-900">
                      <Clock size={17} />
                      {order.deliveryTime} WIB • {order.buyerName}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-cocoa-600">{order.menuName} • {order.portions} porsi</p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-cocoa-500">
                      <MapPin size={16} />
                      {order.venueAddress}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              </article>
            )) : (
              <p className="rounded-xl bg-cream-50 p-4 text-sm font-semibold leading-6 text-cocoa-500">
                Belum ada jadwal pengiriman dari database. Jadwal akan muncul setelah buyer membuat pesanan.
              </p>
            )}
          </div>
        </div>
      </section>
    </MobileAppShell>
  );
}
