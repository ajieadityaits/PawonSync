import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MobileAppShell } from "@/components/MobileAppShell";
import { getMenuGuideForOrder } from "@/lib/data";
import { getOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function SellerDummyPlatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();
  const guide = getMenuGuideForOrder(order);

  return (
    <MobileAppShell role="seller" hideBottomNav showBack title="Dummy Plate">
      <section className="px-4 pt-7 text-center">
        <p className="text-xs font-black uppercase text-cocoa-700">
          {order.eventName} - {order.portions} porsi
        </p>
        <h1 className="mt-2 text-2xl font-black text-cocoa-900">{guide.menu.name}</h1>

        <div className="mx-auto mt-7 grid h-56 w-56 place-items-center rounded-full border-4 border-cocoa-200 bg-white p-3 shadow-sm">
          <div className="relative h-full w-full overflow-hidden rounded-full border border-cocoa-200 bg-cream-50">
            <Image
              alt={`Dummy plate ${guide.menu.name}`}
              className="object-cover"
              fill
              sizes="224px"
              src={guide.menu.plateImageUrl}
            />
            <div className="absolute inset-x-4 bottom-4 rounded-full bg-white/90 px-3 py-2 text-xs font-black text-cocoa-900 shadow-sm">
              Preview sajian
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {guide.standards.slice(0, 4).map((item) => (
            <span className="rounded border border-cocoa-200 bg-white px-3 py-1 text-[10px] font-black uppercase text-cocoa-600" key={item.item}>
              {item.item}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-7 border-t border-cocoa-100 px-4 pt-5">
        <h2 className="text-xs font-black uppercase text-cocoa-500">Standar 1 Porsi</h2>
        <div className="mt-4 divide-y divide-cocoa-100 rounded-2xl bg-white px-4 shadow-sm">
          {guide.standards.map((item) => (
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
