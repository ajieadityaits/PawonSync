import { notFound } from "next/navigation";
import { BuyerDepartureGate } from "@/components/BuyerDepartureGate";
import { getOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function BuyerDepartureGatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return <BuyerDepartureGate initialOrder={order} />;
}
