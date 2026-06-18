import Image from "next/image";
import Link from "next/link";
import { Camera, Info } from "lucide-react";
import { MobileAppShell } from "@/components/MobileAppShell";
import { findOrder, progressPhotos } from "@/lib/data";
import { cn } from "@/lib/utils";

export default async function BuyerProgressPhotoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = findOrder(id);
  const photos = progressPhotos.filter((photo) => photo.orderId === order.id);
  const featuredPhoto = photos.find((photo) => photo.isAvailable);

  return (
    <MobileAppShell hideBottomNav showBack title="Foto Progres">
      <section className="px-4 pt-4 text-center">
        <p className="text-xs font-semibold text-cocoa-500">{order.eventName} • Tahap: <strong>Sedang Dikemas</strong></p>
      </section>

      <section className="px-4 pt-4">
        <article className="overflow-hidden rounded-2xl border border-dashed border-cocoa-300 bg-white shadow-sm">
          {featuredPhoto?.imageUrl ? (
            <div className="relative aspect-[4/3] w-full">
              <Image alt={featuredPhoto.stage} className="object-cover" fill sizes="430px" src={featuredPhoto.imageUrl} />
            </div>
          ) : (
            <div className="grid aspect-[4/3] place-items-center">
              <div className="text-center text-cocoa-500">
                <Camera className="mx-auto" size={36} />
                <p className="mt-2 text-sm font-black">Foto dari Seller</p>
              </div>
            </div>
          )}
        </article>
        <p className="mt-2 text-center text-xs font-semibold italic text-cocoa-400">Dikirim oleh Pawon Lestari - 10.15 WIB</p>
      </section>

      <section className="mt-7 px-4">
        <h2 className="text-xs font-black uppercase text-cocoa-500">Semua Foto Progres</h2>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {photos.map((photo) => (
            <article key={photo.id}>
              <div
                className={cn(
                  "relative grid aspect-square place-items-center overflow-hidden rounded-2xl border border-dashed text-cocoa-400",
                  photo.isAvailable ? "border-cocoa-200 bg-white" : "border-cocoa-200 bg-cream-100",
                )}
              >
                {photo.imageUrl ? (
                  <Image alt={photo.stage} className="object-cover" fill sizes="120px" src={photo.imageUrl} />
                ) : (
                  <Camera size={20} />
                )}
                {photo.title === "Dikemas" ? (
                  <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-cocoa-900 text-[10px] font-black text-white">✓</span>
                ) : null}
              </div>
              <p className="mt-2 text-center text-[11px] font-bold text-cocoa-500">{photo.title}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6 px-4">
        <div className="rounded-2xl border border-cocoa-100 bg-white p-4 text-xs font-semibold leading-5 text-cocoa-500 shadow-sm">
          <Info className="mb-2 text-sage-700" size={18} />
          Foto dikirim otomatis oleh seller di setiap tahap penting untuk menjaga kualitas pesanan Anda.
        </div>
      </section>

      <section className="mt-6 px-4">
        <Link className="flex h-12 items-center justify-center rounded-2xl bg-cocoa-800 text-sm font-black text-white" href={`/buyer/orders/${order.id}`}>
          Kembali ke Status Pesanan
        </Link>
      </section>
    </MobileAppShell>
  );
}
