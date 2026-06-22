import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Camera, ChevronRight, Utensils } from "lucide-react";
import { MobileAppShell } from "@/components/MobileAppShell";
import { findMenuById } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default async function SellerMenuPlatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const menu = findMenuById(id);

  if (!menu) notFound();

  return (
    <MobileAppShell role="seller" hideBottomNav showBack title="Plate Menu">
      <section className="px-4 pt-5">
        <article className="overflow-hidden rounded-3xl border border-cocoa-100 bg-white shadow-soft">
          <div className="relative aspect-[4/3] w-full">
            <Image alt={`Dummy plate ${menu.name}`} className="object-cover" fill priority sizes="430px" src={menu.plateImageUrl} />
            <div className="absolute inset-0 bg-gradient-to-t from-cocoa-950/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-xs font-black uppercase text-cream-100">{menu.category}</p>
              <h1 className="mt-1 text-2xl font-black leading-tight">{menu.name}</h1>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4">
            <div className="rounded-2xl bg-cream-50 p-3">
              <p className="text-xs font-black uppercase text-cocoa-400">Harga</p>
              <p className="mt-1 font-black text-cocoa-900">{formatCurrency(menu.price)}</p>
            </div>
            <div className="rounded-2xl bg-sage-50 p-3">
              <p className="text-xs font-black uppercase text-cocoa-400">Minimal</p>
              <p className="mt-1 font-black text-cocoa-900">{menu.minimumOrder} porsi</p>
            </div>
          </div>
        </article>
      </section>

      <section className="mt-6 px-4">
        <h2 className="text-xs font-black uppercase text-cocoa-500">Standar 1 Porsi</h2>
        <div className="mt-3 divide-y divide-cocoa-100 rounded-2xl bg-white px-4 shadow-sm">
          {menu.portionGuide.map((item) => (
            <div className="flex items-center justify-between gap-3 py-4 text-sm" key={item.item}>
              <span className="font-semibold text-cocoa-700">{item.item}</span>
              <span className="text-right font-black text-cocoa-900">{item.amount}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 px-4">
        <div className="rounded-2xl border border-cocoa-100 bg-white p-4 shadow-sm">
          <p className="flex items-center gap-2 text-sm font-black text-cocoa-900">
            <Utensils size={18} />
            Catatan produksi
          </p>
          <p className="mt-2 text-xs font-semibold leading-5 text-cocoa-500">{menu.dailyNote}</p>
        </div>
      </section>

      <section className="fixed inset-x-0 bottom-0 z-20 grid gap-2 bg-cream-50 px-4 pb-5 pt-3 lg:left-1/2 lg:w-[430px] lg:-translate-x-1/2">
        <label className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-cocoa-100 bg-white px-4 text-sm font-black text-cocoa-900 shadow-sm">
          <input accept="image/*" capture="environment" className="sr-only" type="file" />
          <Camera size={18} />
          Ubah Gambar Plate
        </label>
        <Link
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-cocoa-900 px-4 text-sm font-black text-white shadow-soft"
          href="/seller/kitchen"
        >
          Kembali ke Dapur & Menu
          <ChevronRight size={18} />
        </Link>
      </section>
    </MobileAppShell>
  );
}
