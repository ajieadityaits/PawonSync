import Link from "next/link";
import { notFound } from "next/navigation";
import { Info, MessageSquareText, Phone, Store } from "lucide-react";
import { MobileAppShell } from "@/components/MobileAppShell";
import { sellerProfile } from "@/lib/data";
import { getOrder } from "@/lib/orders";

export default async function BuyerContactSellerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <MobileAppShell hideBottomNav showBack title="Hubungi Seller">
      <section className="px-4 pt-5">
        <article className="rounded-2xl border border-cocoa-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cocoa-800 text-white">
              <Store size={22} />
            </span>
            <div>
              <h2 className="font-black text-cocoa-900">{sellerProfile.cateringName}</h2>
              <p className="text-xs font-semibold text-cocoa-500">Seller pesanan {order.eventName}</p>
            </div>
          </div>
        </article>
      </section>

      <section className="mt-6 px-4">
        <h3 className="text-xs font-black uppercase text-cocoa-500">Pilih Cara Menghubungi</h3>
        <div className="mt-3 grid gap-3">
          <a className="flex items-center gap-3 rounded-2xl border border-cocoa-100 bg-white p-4 shadow-sm" href={`tel:${sellerProfile.phone}`}>
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-sage-50 text-sage-800">
              <Phone size={20} />
            </span>
            <span>
              <span className="block text-sm font-black text-cocoa-900">Telepon</span>
              <span className="block text-xs font-semibold text-cocoa-500">Hubungi langsung via telepon</span>
            </span>
          </a>
          <Link className="flex items-center gap-3 rounded-2xl border border-cocoa-100 bg-white p-4 shadow-sm" href={`/buyer/orders/${order.id}`}>
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-soft text-cocoa-900">
              <MessageSquareText size={20} />
            </span>
            <span>
              <span className="block text-sm font-black text-cocoa-900">Chat di Aplikasi</span>
              <span className="block text-xs font-semibold text-cocoa-500">Kirim pesan teks ke seller</span>
            </span>
          </Link>
        </div>
      </section>

      <section className="mt-7 px-4">
        <div className="rounded-2xl border border-cocoa-100 bg-cream-100 p-4 text-xs font-semibold leading-5 text-cocoa-600">
          <Info className="mb-2 text-cocoa-800" size={18} />
          Gunakan fitur ini hanya jika ada kendala. Status pesanan sudah otomatis diperbarui melalui halaman detail.
        </div>
      </section>
    </MobileAppShell>
  );
}
