import { notFound } from "next/navigation";
import { MobileAppShell } from "@/components/MobileAppShell";
import { PackagingCounter } from "@/components/PackagingCounter";
import { packagingChecklist } from "@/lib/data";
import { getOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function SellerPackagingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();
  const initialPacked = order.id === packagingChecklist.orderId ? Math.min(packagingChecklist.packed, order.portions) : 0;

  return (
    <MobileAppShell role="seller" hideBottomNav showBack title="Pengemasan">
      <section className="px-4 pt-5 text-center">
        <p className="text-xs font-bold text-cocoa-500">
          {order.eventName} — Target: {order.portions} kotak
        </p>
      </section>

      <PackagingCounter order={order} initialPacked={initialPacked} note={packagingChecklist.remainingNote} />
    </MobileAppShell>
  );
}
