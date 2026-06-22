import Link from "next/link";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { MobileAppShell } from "@/components/MobileAppShell";
import { getOrder } from "@/lib/orders";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BuyerReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <MobileAppShell hideBottomNav showBack title="Beri Ulasan">
      <section className="px-4 pt-5">
        <article className="rounded-2xl border border-cocoa-100 bg-white p-4 shadow-sm">
          <h2 className="font-black text-cocoa-900">{order.eventName} — {order.cateringName}</h2>
          <p className="mt-1 text-sm font-semibold text-cocoa-500">{order.portions} porsi • {formatDate(order.eventDate)}</p>
        </article>
      </section>

      <section className="mt-6 px-4">
        <h3 className="text-sm font-black text-cocoa-900">Bagaimana pesananmu?</h3>
        <div className="mt-3 flex gap-2 text-orange-500">
          {[0, 1, 2, 3, 4].map((item) => (
            <Star fill={item < 4 ? "currentColor" : "none"} key={item} size={31} strokeWidth={2.4} />
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-5 px-4">
        <div>
          <h3 className="text-xs font-black uppercase text-cocoa-500">Ketepatan Waktu</h3>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button className="h-11 rounded-2xl bg-cocoa-800 text-sm font-black text-white" type="button">Tepat Waktu</button>
            <button className="h-11 rounded-2xl border border-cocoa-100 bg-white text-sm font-black text-cocoa-900" type="button">Terlambat</button>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-black uppercase text-cocoa-500">Kualitas Porsi</h3>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button className="h-11 rounded-2xl bg-cocoa-800 text-sm font-black text-white" type="button">Sesuai</button>
            <button className="h-11 rounded-2xl border border-cocoa-100 bg-white text-sm font-black text-cocoa-900" type="button">Tidak Sesuai</button>
          </div>
        </div>

        <label className="grid gap-2 text-sm font-black text-cocoa-900">
          Komentar (opsional)
          <textarea
            className="min-h-28 rounded-2xl border border-cocoa-100 bg-white p-4 text-sm font-semibold text-cocoa-900 outline-none transition placeholder:text-cocoa-300 focus:border-cocoa-400 focus:ring-4 focus:ring-orange-100"
            placeholder="Tulis pengalamanmu di sini..."
          />
        </label>
      </section>

      <section className="mt-6 px-4">
        <Link className="flex h-12 items-center justify-center rounded-2xl bg-cocoa-800 text-sm font-black text-white" href={`/buyer/orders/${order.id}/review/success`}>
          Kirim Ulasan
        </Link>
      </section>
    </MobileAppShell>
  );
}
