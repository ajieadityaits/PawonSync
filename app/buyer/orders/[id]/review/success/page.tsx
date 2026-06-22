import Link from "next/link";
import { notFound } from "next/navigation";
import { ThumbsUp } from "lucide-react";
import { MobileAppShell } from "@/components/MobileAppShell";
import { getOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function BuyerReviewSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <MobileAppShell hideBottomNav showBack title="Beri Ulasan">
      <section className="min-h-[calc(100vh-64px)] bg-cocoa-900/35 px-4 py-10">
        <article className="mt-20 rounded-[24px] border border-cocoa-100 bg-white p-7 text-center shadow-soft">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border-2 border-cocoa-300 bg-cream-50 text-cocoa-900">
            <ThumbsUp size={33} />
          </div>
          <h2 className="mt-6 text-xl font-black uppercase text-cocoa-900">Terima Kasih!</h2>
          <p className="mx-auto mt-2 max-w-[260px] text-sm font-semibold leading-6 text-cocoa-500">
            Ulasanmu untuk {order.cateringName} membantu seller untuk terus berkembang.
          </p>
          <Link className="mt-7 flex h-12 items-center justify-center rounded-2xl bg-cocoa-800 text-sm font-black text-white" href="/buyer/dashboard">
            Kembali ke Beranda
          </Link>
        </article>
      </section>
    </MobileAppShell>
  );
}
