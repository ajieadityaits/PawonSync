import Link from "next/link";
import { Check } from "lucide-react";
import { MobileAppShell } from "@/components/MobileAppShell";
import { findOrder } from "@/lib/data";

export default async function BuyerConfirmArrivalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = findOrder(id);

  return (
    <MobileAppShell hideBottomNav showBack title="Detail Pesanan">
      <section className="min-h-[calc(100vh-64px)] bg-cocoa-900/35 px-4 py-10">
        <article className="mt-16 rounded-[24px] border border-cocoa-100 bg-white p-6 text-center shadow-soft">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border-2 border-cocoa-800 text-cocoa-900">
            <Check size={34} strokeWidth={2.5} />
          </div>
          <h2 className="mt-6 text-xl font-black text-cocoa-900">Pesanan Tiba!</h2>
          <p className="mx-auto mt-2 max-w-[260px] text-sm font-semibold leading-6 text-cocoa-500">
            Pesanan {order.eventName} dari <strong>{order.cateringName}</strong> sudah tiba.
            <br />
            Tiba pukul 10.58 WIB
          </p>

          <div className="mt-7 grid gap-3">
            <Link className="flex h-12 items-center justify-center rounded-2xl bg-cocoa-800 text-sm font-black text-white" href={`/buyer/orders/${order.id}/review`}>
              Konfirmasi & Beri Ulasan
            </Link>
            <Link className="flex h-12 items-center justify-center rounded-2xl border border-cocoa-100 bg-white text-sm font-black text-cocoa-900" href={`/buyer/orders/${order.id}`}>
              Nanti Saja
            </Link>
          </div>
        </article>
      </section>
    </MobileAppShell>
  );
}
