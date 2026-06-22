import { BuyerOrderTrackingClient } from "@/components/BuyerOrderTrackingClient";
import { getOrder } from "@/lib/orders";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BuyerOrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return <BuyerOrderTrackingClient initialOrder={order} />;
}
