import { MobileAppShell } from "@/components/MobileAppShell";
import { SellerKitchenClient } from "@/components/SellerKitchenClient";
import { getOrders } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function SellerKitchenPage() {
  const orders = await getOrders();

  return (
    <MobileAppShell role="seller" title="Dapur & Menu">
      <SellerKitchenClient initialOrders={orders} />
    </MobileAppShell>
  );
}
