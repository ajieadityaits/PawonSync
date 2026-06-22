import { BuyerOrdersRealtimeList } from "@/components/BuyerOrdersRealtimeList";
import { MobileAppShell } from "@/components/MobileAppShell";
import { getOrders } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function BuyerOrdersPage() {
  const orders = await getOrders();

  return (
    <MobileAppShell showBack title="Pesanan Saya">
      <BuyerOrdersRealtimeList initialOrders={orders} />
    </MobileAppShell>
  );
}
