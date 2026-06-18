import Link from "next/link";
import { Camera, Clock3, MapPin, PackageCheck, Truck } from "lucide-react";
import { MobileAppShell } from "@/components/MobileAppShell";
import { sellerMilestones } from "@/lib/data";
import { getOrder } from "@/lib/orders";
import { cn, formatDate } from "@/lib/utils";

function currentMilestoneIndex(status: string) {
  if (status === "pesanan_masuk" || status === "diproses") return 0;
  if (status === "dimasak") return 1;
  if (status === "dikemas") return 2;
  return 3;
}

export const dynamic = "force-dynamic";

export default async function SellerOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  const activeIndex = currentMilestoneIndex(order.status);
  const readyToDepart = activeIndex >= 3;

  return (
    <MobileAppShell role="seller" showBack title="Detail Pesanan">
      <section className="px-4 pt-5">
        <article className="rounded-2xl border border-cocoa-100 bg-white p-4 shadow-sm">
          <h2 className="font-black text-cocoa-900">
            {order.eventName} — Bu {order.buyerName}
          </h2>
          <div className="mt-2 grid gap-1 text-sm font-semibold leading-6 text-cocoa-500">
            <p className="flex items-center gap-2">
              <PackageCheck size={15} />
              {order.portions} porsi nasi kotak
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={15} />
              {order.venueAddress}, {formatDate(order.eventDate)}, jam {order.deliveryTime}
            </p>
          </div>
        </article>
      </section>

      <section className="mt-6 border-t border-cocoa-100 px-4 pt-6">
        <h3 className="text-xs font-black uppercase text-cocoa-500">Update Progress (X-Ray)</h3>
        <div className="mt-4">
          {sellerMilestones.map((step, index) => {
            const done = index < activeIndex;
            const current = index === activeIndex;
            const pending = index > activeIndex;

            return (
              <div className="grid grid-cols-[26px_1fr_auto] gap-3" key={step.key}>
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "mt-0.5 grid h-4 w-4 place-items-center rounded-full border-2",
                      done || current ? "border-cocoa-900 bg-cocoa-900" : "border-cocoa-200 bg-white",
                    )}
                  >
                    {done ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
                  </span>
                  {index < sellerMilestones.length - 1 ? (
                    <span className={cn("h-11 w-px", pending ? "bg-cocoa-100" : "bg-cocoa-900")} />
                  ) : null}
                </div>
                <div className={cn("pb-5", pending ? "text-cocoa-300" : "text-cocoa-900")}>
                  <p className="text-sm font-bold">
                    {step.label}
                    {current ? <span className="ml-1 text-[11px] uppercase text-cocoa-500">(Aktif)</span> : null}
                  </p>
                  <p className="mt-0.5 text-xs italic text-cocoa-400">{step.helper}</p>
                </div>
                <p className={cn("text-xs font-semibold", pending ? "text-cocoa-300" : "text-cocoa-500")}>
                  {index === 0 ? "08.00" : index === 1 ? "09.30" : index === 2 ? "10.20" : "10.45"}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-4 grid gap-3 px-4">
        {readyToDepart ? (
          <Link
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-cocoa-800 px-4 text-sm font-black text-white shadow-soft"
            href={`/seller/orders/${order.id}/depart`}
          >
            <Truck size={18} />
            Buka Departure Gate
          </Link>
        ) : (
          <Link
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-cocoa-800 px-4 text-sm font-black text-white shadow-soft"
            href={`/seller/orders/${order.id}/update`}
          >
            <Camera size={18} />
            Kirim Update Sekarang
          </Link>
        )}

        <Link
          className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-cocoa-100 bg-white px-4 text-sm font-black text-cocoa-900 shadow-sm"
          href={order.status === "dikemas" ? `/seller/orders/${order.id}/packaging` : `/seller/kitchen/${order.id}/plate`}
        >
          {order.status === "dikemas" ? <PackageCheck size={18} /> : <Clock3 size={18} />}
          {order.status === "dikemas" ? "Checklist Pengemasan" : "Lihat Panduan Dapur"}
        </Link>
      </section>

      <section className="mt-5 px-4">
        <div className="rounded-2xl border border-sage-100 bg-sage-50 p-4 text-xs font-semibold leading-5 text-sage-800">
          Buyer akan menerima notifikasi otomatis setiap kamu mengirim update milestone.
        </div>
      </section>
    </MobileAppShell>
  );
}
