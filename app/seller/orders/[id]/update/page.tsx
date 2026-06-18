import { SellerUpdateStatusForm } from "@/components/SellerUpdateStatusForm";
import { getOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function SellerUpdateMilestonePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sent?: string }>;
}) {
  const { id } = await params;
  const { sent } = await searchParams;
  const order = await getOrder(id);

  return <SellerUpdateStatusForm order={order} sent={sent} />;
}
