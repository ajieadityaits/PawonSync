import { Bell } from "lucide-react";
import { MobileAppShell } from "@/components/MobileAppShell";
import { SellerDashboardClient } from "@/components/SellerDashboardClient";
import { getOrders } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function SellerDashboardPage() {
  const orders = await getOrders();

  return (
    <MobileAppShell
      role="seller"
      rightAction={
        <button className="grid h-10 w-10 place-items-center rounded-xl border border-cocoa-100 bg-white text-cocoa-800 shadow-sm" type="button">
          <Bell size={19} />
        </button>
      }
      title="Beranda Seller"
    >
      <SellerDashboardClient initialOrders={orders} />
    </MobileAppShell>
  );
}
