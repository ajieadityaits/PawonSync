import Link from "next/link";
import { Bell } from "lucide-react";
import { BuyerDashboardClient } from "@/components/BuyerDashboardClient";
import { MobileAppShell } from "@/components/MobileAppShell";
import { buyerProfile } from "@/lib/data";
import { getOrders } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function BuyerDashboardPage() {
  const orders = await getOrders();

  return (
    <MobileAppShell
      rightAction={
        <Link className="grid h-10 w-10 place-items-center rounded-xl border border-cocoa-100 bg-white text-cocoa-800 shadow-sm" href="/buyer/notifications">
          <Bell size={19} />
        </Link>
      }
      title={`Halo, Bu ${buyerProfile.fullName}`}
    >
      <BuyerDashboardClient initialOrders={orders} />
    </MobileAppShell>
  );
}
