import Link from "next/link";
import { Bell, ChevronRight, Clock3, PackageCheck } from "lucide-react";
import { MobileAppShell } from "@/components/MobileAppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { buyerProfile } from "@/lib/data";
import { getOrders } from "@/lib/orders";
import { formatDate, statusProgress } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BuyerDashboardPage() {
  const orders = await getOrders();
  const activeOrder = orders[0];
  const secondaryOrders = orders.slice(0, 2);

  return (
    <MobileAppShell
      rightAction={
        <Link className="grid h-10 w-10 place-items-center rounded-xl border border-cocoa-100 bg-white text-cocoa-800 shadow-sm" href="/buyer/notifications">
          <Bell size={19} />
        </Link>
      }
      title={`Halo, Bu ${buyerProfile.fullName}`}
    >
      <section className="px-4 pt-5">
        <article className="overflow-hidden rounded-[24px] border border-cocoa-100 bg-white shadow-soft">
          <div className="bg-[linear-gradient(135deg,#fffbea_0%,#dff3d2_100%)] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase text-orange-700">Pesanan aktif</p>
                <h2 className="mt-2 text-2xl font-black leading-tight text-cocoa-900">{activeOrder.eventName}</h2>
                <p className="mt-1 text-sm font-semibold text-cocoa-600">
                  {activeOrder.portions} porsi nasi kotak • {formatDate(activeOrder.eventDate)}
                </p>
              </div>
              <StatusBadge status={activeOrder.status} />
            </div>

            <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-sage-600" style={{ width: `${statusProgress(activeOrder.status)}%` }} />
            </div>
            <p className="mt-2 text-xs font-bold text-cocoa-500">2 dari 4 tahap selesai</p>
          </div>

          <div className="grid gap-3 p-4">
            <Link
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-cocoa-800 px-4 text-sm font-black text-white transition hover:bg-cocoa-900"
              href={`/buyer/orders/${activeOrder.id}`}
            >
              Lihat Status Pesanan
              <ChevronRight size={18} />
            </Link>
          </div>
        </article>
      </section>

      <section className="mt-6 px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-normal text-cocoa-900">Pesanan Saya</h2>
          <Link className="text-xs font-black text-orange-700" href="/buyer/orders">
            Lihat Semua
          </Link>
        </div>

        <div className="mt-3 grid gap-3">
          {secondaryOrders.map((order) => (
            <Link
              className="flex items-center justify-between gap-3 rounded-2xl border border-cocoa-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
              href={`/buyer/orders/${order.id}`}
              key={order.id}
            >
              <div className="min-w-0">
                <h3 className="truncate font-black text-cocoa-900">{order.eventName}</h3>
                <p className="mt-1 text-xs font-semibold text-cocoa-500">{formatDate(order.eventDate)}</p>
              </div>
              <StatusBadge status={order.status} />
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 px-4">
        <article className="rounded-2xl border border-sage-100 bg-sage-50 p-4">
          <p className="flex items-center gap-2 text-sm font-black text-cocoa-900">
            <Clock3 size={17} />
            Estimasi terbaru
          </p>
          <p className="mt-2 text-sm leading-6 text-cocoa-600">
            Pesanan {activeOrder.eventName} diperkirakan sampai pukul <strong>{activeOrder.estimatedArrival}</strong>. Foto progres baru akan muncul otomatis saat seller memperbarui tahap.
          </p>
        </article>
      </section>

      <section className="mt-6 px-4">
        <Link
          className="flex items-center justify-between rounded-2xl border border-cocoa-100 bg-white p-4 text-sm font-bold text-cocoa-700 shadow-sm"
          href={`/buyer/orders/${activeOrder.id}/confirm`}
        >
          <span className="flex items-center gap-2">
            <PackageCheck size={18} />
            Simulasi konfirmasi pesanan tiba
          </span>
          <ChevronRight size={18} />
        </Link>
      </section>
    </MobileAppShell>
  );
}
