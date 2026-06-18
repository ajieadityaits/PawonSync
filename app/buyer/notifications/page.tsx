import { Bell, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { MobileAppShell } from "@/components/MobileAppShell";
import { getBuyerNotifications } from "@/lib/notifications";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BuyerNotificationsPage() {
  const buyerNotifications = await getBuyerNotifications();
  const today = buyerNotifications.slice(0, 3);
  const older = buyerNotifications.slice(3);

  return (
    <MobileAppShell title="Notifikasi">
      <section className="px-4 pt-5">
        <h2 className="text-xs font-black uppercase text-cocoa-500">Hari Ini</h2>
        <div className="mt-3 grid gap-3">
          {today.map((notification) => (
            <Link
              className={cn(
                "block rounded-2xl border p-4 shadow-sm",
                notification.isRead ? "border-cocoa-100 bg-white/70 text-cocoa-400" : "border-cocoa-100 bg-white text-cocoa-900",
              )}
              href={notification.orderId ? `/buyer/orders/${notification.orderId}` : "/buyer/notifications"}
              key={notification.id}
            >
              <div className="flex items-start gap-3">
                <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl", notification.isRead ? "bg-cream-100" : "bg-orange-soft text-cocoa-900")}>
                  {notification.isRead ? <CheckCircle2 size={18} /> : <Bell size={18} />}
                </span>
                <div>
                  <h3 className="text-sm font-black">{notification.title}</h3>
                  <p className="mt-1 text-xs font-semibold leading-5 text-cocoa-500">{notification.description}</p>
                  <p className="mt-1 text-[11px] font-bold text-cocoa-300">{notification.time}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-7 px-4">
        <h2 className="text-xs font-black uppercase text-cocoa-500">Sebelumnya</h2>
        <div className="mt-3 grid gap-3">
          {older.map((notification) => (
            <Link
              className="block rounded-2xl border border-cocoa-100 bg-white/75 p-4 text-cocoa-500 shadow-sm"
              href={notification.orderId ? `/buyer/orders/${notification.orderId}` : "/buyer/notifications"}
              key={notification.id}
            >
              <h3 className="text-sm font-black">{notification.title}</h3>
              <p className="mt-1 text-xs font-semibold leading-5">{notification.description}</p>
              <p className="mt-1 text-[11px] font-bold text-cocoa-300">{notification.time}</p>
            </Link>
          ))}
        </div>
      </section>
    </MobileAppShell>
  );
}
