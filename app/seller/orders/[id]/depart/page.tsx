import Link from "next/link";
import { Rocket } from "lucide-react";
import { MobileAppShell } from "@/components/MobileAppShell";
import { findOrder } from "@/lib/data";

export default async function SellerDeparturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = findOrder(id);

  return (
    <MobileAppShell role="seller" hideBottomNav showBack title="Kirim Update">
      <div className="min-h-[calc(100vh-64px)] bg-cocoa-900/80 px-5 pt-20">
        <section className="rounded-3xl bg-white p-7 text-center shadow-soft">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-cocoa-900 text-cocoa-900">
            <Rocket size={30} />
          </div>
          <h2 className="mt-5 text-lg font-black uppercase text-cocoa-900">Kurir Berangkat!</h2>
          <p className="mt-2 text-xs font-semibold leading-5 text-cocoa-500">
            Pembeli mendapat notifikasi ETA dan live location untuk pesanan {order.eventName}.
          </p>
          <Link
            className="mt-6 flex h-12 items-center justify-center rounded-2xl bg-cocoa-900 px-4 text-sm font-black uppercase text-white"
            href={`/seller/orders/${order.id}`}
          >
            Pantau Pengiriman
          </Link>
          <Link className="mt-4 block text-xs font-black uppercase text-cocoa-400" href="/seller/dashboard">
            Kembali ke Beranda
          </Link>
        </section>
      </div>
    </MobileAppShell>
  );
}
