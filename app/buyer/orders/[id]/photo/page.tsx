import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Camera, CheckCircle2, Clock3, Info } from "lucide-react";
import { MobileAppShell } from "@/components/MobileAppShell";
import { getLatestAvailableProgressPhoto, getProgressPhotosForOrder, statusMeta } from "@/lib/data";
import { getOrder } from "@/lib/orders";
import { cn } from "@/lib/utils";

export default async function BuyerProgressPhotoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();
  const photos = getProgressPhotosForOrder(order);
  const featuredPhoto = getLatestAvailableProgressPhoto(order);
  const availablePhotos = photos.filter((photo) => photo.isAvailable);

  return (
    <MobileAppShell hideBottomNav showBack title="Foto Progres">
      <section className="px-4 pt-4 text-center">
        <p className="text-xs font-semibold text-cocoa-500">
          {order.eventName} • Tahap: <strong>{statusMeta[order.status].label}</strong>
        </p>
      </section>

      <section className="px-4 pt-4">
        <article
          className={cn(
            "overflow-hidden rounded-2xl bg-white shadow-sm",
            featuredPhoto?.imageUrl ? "border border-cocoa-100" : "border border-dashed border-cocoa-300",
          )}
        >
          {featuredPhoto?.imageUrl ? (
            <div className="relative aspect-[4/3] w-full">
              <Image alt={featuredPhoto.stage} className="object-cover" fill sizes="430px" src={featuredPhoto.imageUrl} />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cocoa-950/85 to-transparent p-4 text-left text-white">
                <p className="text-xs font-bold opacity-85">{featuredPhoto.time}</p>
                <h2 className="mt-1 text-base font-black">{featuredPhoto.stage}</h2>
                <p className="mt-1 text-xs font-semibold leading-5 opacity-90">{featuredPhoto.note}</p>
              </div>
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
        <p className="mt-2 text-center text-xs font-semibold italic text-cocoa-400">
          {featuredPhoto
            ? `Dikirim oleh ${order.cateringName} - ${featuredPhoto.time}`
            : `Menunggu foto dari ${order.cateringName}`}
        </p>
      </section>

      <section className="mt-7 px-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xs font-black uppercase text-cocoa-500">Semua Foto Progres</h2>
          <p className="shrink-0 text-[11px] font-black text-cocoa-400">
            {availablePhotos.length}/{photos.length} tahap
          </p>
        </div>
        <div className="mt-3 grid gap-3">
          {photos.map((photo) => (
            <article className="grid grid-cols-[84px_1fr] gap-3 rounded-2xl border border-cocoa-100 bg-white p-3 shadow-sm" key={photo.id}>
              <div
                className={cn(
                  "relative grid h-20 w-20 place-items-center overflow-hidden rounded-xl border text-cocoa-400",
                  photo.isAvailable ? "border-cocoa-100 bg-white" : "border-dashed border-cocoa-200 bg-cream-100",
                )}
              >
                {photo.imageUrl ? (
                  <Image alt={photo.stage} className="object-cover" fill sizes="84px" src={photo.imageUrl} />
                ) : (
                  <Camera size={20} />
                )}
                {photo.isAvailable ? (
                  <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-cocoa-900 text-white">
                    <CheckCircle2 size={12} />
                  </span>
                ) : null}
              </div>
              <div className="min-w-0 py-0.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className={cn("truncate text-sm font-black", photo.isAvailable ? "text-cocoa-900" : "text-cocoa-300")}>
                      {photo.title}
                    </p>
                    <p className={cn("mt-0.5 truncate text-xs font-bold", photo.isAvailable ? "text-cocoa-500" : "text-cocoa-300")}>
                      {photo.stage}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "grid h-6 w-6 shrink-0 place-items-center rounded-full",
                      photo.isAvailable ? "bg-sage-50 text-sage-800" : "bg-cream-100 text-cocoa-300",
                    )}
                  >
                    {photo.isAvailable ? <CheckCircle2 size={14} /> : <Clock3 size={14} />}
                  </span>
                </div>
                <p className={cn("mt-1 line-clamp-2 text-[11px] font-semibold leading-4", photo.isAvailable ? "text-cocoa-500" : "text-cocoa-300")}>
                  {photo.note}
                </p>
                <p className={cn("mt-1 text-[11px] font-black", photo.isAvailable ? "text-cocoa-700" : "text-cocoa-300")}>
                  {photo.time}
                </p>
              </div>
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
