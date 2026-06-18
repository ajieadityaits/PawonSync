import Link from "next/link";
import { Bell, ChevronRight, CirclePlus, Clock3, PackageCheck } from "lucide-react";
import { MobileAppShell } from "@/components/MobileAppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { sellerProfile } from "@/lib/data";
import { getOrders } from "@/lib/orders";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SellerDashboardPage() {
  const orders = await getOrders();
  const newestOrders = orders.slice(0, 2);
  const activeCount = orders.filter((order) => order.status !== "selesai").length;
  const shippingToday = orders.filter((order) => order.status === "dikirim").length;

  return (
    <MobileAppShell
      role="seller"
      rightAction={
        <button className="grid h-10 w-10 place-items-center rounded-xl border border-cocoa-100 bg-white text-cocoa-800 shadow-sm" type="button">
          <Bell size={19} />
        </button>
      }
      title={`Halo, ${sellerProfile.ownerName}`}
    >
      <section className="px-4 pt-5">
        <div className="grid grid-cols-2 gap-3">
          <article className="rounded-2xl border border-cocoa-100 bg-white p-4 shadow-sm">
            <p className="text-3xl font-black text-cocoa-900">{activeCount}</p>
            <p className="mt-1 text-[11px] font-black uppercase text-cocoa-500">Pesanan aktif</p>
          </article>
          <article className="rounded-2xl border border-cocoa-100 bg-white p-4 shadow-sm">
            <p className="text-3xl font-black text-cocoa-900">{shippingToday}</p>
            <p className="mt-1 text-[11px] font-black uppercase text-cocoa-500">Kirim hari ini</p>
          </article>
        </div>
      </section>

      <section className="mt-6 px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase text-cocoa-900">Pesanan Terbaru</h2>
          <Link className="text-xs font-black text-orange-700" href="/seller/orders">
            Lihat Semua
          </Link>
        </div>

        <div className="mt-3 grid gap-3">
          {newestOrders.map((order) => (
            <Link
              className="rounded-2xl border border-cocoa-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
              href={`/seller/orders/${order.id}`}
              key={order.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-black text-cocoa-900">{order.eventName}</h3>
                  <p className="mt-1 text-xs font-semibold leading-5 text-cocoa-500">
                    {order.portions} porsi • {formatDate(order.eventDate)}
                  </p>
                </div>
                <StatusBadge compact status={order.status} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-4 px-4">
        <Link
          className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-cocoa-300 bg-white p-4 text-sm font-black text-cocoa-900 shadow-sm"
          href="/seller/orders/new"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-cocoa-800 text-white">
            <CirclePlus size={20} />
          </span>
          Buat Pesanan Baru
        </Link>
      </section>

      <section className="mt-6 grid gap-3 px-4">
        <Link
          className="flex items-center justify-between rounded-2xl border border-sage-100 bg-sage-50 p-4 text-sm font-bold text-sage-800"
          href="/seller/kitchen"
        >
          <span className="flex items-center gap-2">
            <PackageCheck size={18} />
            Lihat panduan dapur hari ini
          </span>
          <ChevronRight size={18} />
        </Link>
        <div className="rounded-2xl border border-cocoa-100 bg-white p-4 text-sm leading-6 text-cocoa-600 shadow-sm">
          <p className="flex items-center gap-2 font-black text-cocoa-900">
            <Clock3 size={17} />
            Prioritas
          </p>
          <p className="mt-2">
            Wisuda ITS perlu update progres sebelum pukul <strong>10.30 WIB</strong> agar buyer mendapat notifikasi tepat waktu.
          </p>
        </div>
      </section>
    </MobileAppShell>
  );
}
