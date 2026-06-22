import { BuyerNotificationsClient } from "@/components/BuyerNotificationsClient";
import { MobileAppShell } from "@/components/MobileAppShell";
import { getBuyerNotifications } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export default async function BuyerNotificationsPage() {
  const buyerNotifications = await getBuyerNotifications();

  return (
    <MobileAppShell title="Notifikasi">
      <BuyerNotificationsClient initialNotifications={buyerNotifications} />
    </MobileAppShell>
  );
}
