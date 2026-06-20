import { BuyerOrderTrackingClient } from "@/components/BuyerOrderTrackingClient";
import { getOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function BuyerOrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);

  return <BuyerOrderTrackingClient initialOrder={order} />;
}
