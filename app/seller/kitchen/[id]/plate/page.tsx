import Link from "next/link";
import { MobileAppShell } from "@/components/MobileAppShell";
import { findOrder, kitchenGuide } from "@/lib/data";

export default async function SellerDummyPlatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = findOrder(id);

  return (
    <MobileAppShell role="seller" hideBottomNav showBack title="Dummy Plate">
      <section className="px-4 pt-7 text-center">
        <p className="text-xs font-black uppercase text-cocoa-700">
          {order.eventName} - {order.portions} porsi
        </p>

        <div className="mx-auto mt-7 grid h-44 w-44 place-items-center rounded-full border-4 border-cocoa-200 bg-white shadow-sm">
          <div className="relative h-36 w-36 overflow-hidden rounded-full border border-cocoa-300 bg-cream-50">
            <div className="absolute inset-x-0 top-0 grid h-1/2 place-items-center border-b border-cocoa-300 text-xs font-black text-cocoa-800">
              Nasi
            </div>
            <div className="absolute bottom-0 left-0 grid h-1/2 w-1/2 place-items-center border-r border-cocoa-300 text-xs font-black text-cocoa-800">
              Ayam
            </div>
            <div className="absolute bottom-0 right-0 grid h-1/2 w-1/2 place-items-center text-xs font-black text-cocoa-800">
              Sayur
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {["Nasi", "Ayam", "Sayur"].map((item) => (
            <span className="rounded border border-cocoa-200 bg-white px-3 py-1 text-[10px] font-black uppercase text-cocoa-600" key={item}>
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-7 border-t border-cocoa-100 px-4 pt-5">
        <h2 className="text-xs font-black uppercase text-cocoa-500">Standar 1 Porsi</h2>
        <div className="mt-4 divide-y divide-cocoa-100 rounded-2xl bg-white px-4 shadow-sm">
          {kitchenGuide.standards.map((item) => (
            <div className="flex items-center justify-between py-4 text-sm" key={item.item}>
              <span className="font-semibold text-cocoa-700">{item.item}</span>
              <span className="font-black text-cocoa-900">{item.amount}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="fixed inset-x-0 bottom-0 z-20 bg-cream-50 px-4 pb-5 pt-3 lg:left-1/2 lg:w-[430px] lg:-translate-x-1/2">
        <Link
          className="flex h-12 items-center justify-center rounded-2xl bg-cocoa-900 px-4 text-xs font-black uppercase text-white shadow-soft"
          href={`/seller/kitchen/${order.id}/ingredients`}
        >
          Lihat Total Bahan
        </Link>
      </section>
    </MobileAppShell>
  );
}
