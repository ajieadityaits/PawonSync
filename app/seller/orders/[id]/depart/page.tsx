import { notFound } from "next/navigation";
import { MobileAppShell } from "@/components/MobileAppShell";
import { SellerDepartureGate } from "@/components/SellerDepartureGate";
import { getOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function SellerDeparturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <MobileAppShell role="seller" hideBottomNav showBack title="Departure Gate">
      <SellerDepartureGate order={order} />
    </MobileAppShell>
  );
}
