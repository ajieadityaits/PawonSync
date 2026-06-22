"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, CheckCircle2 } from "lucide-react";
import { type BuyerNotification } from "@/lib/data";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";

type DbNotification = {
  id: string;
  order_id: string | null;
  title: string;
  description: string;
  is_read: boolean;
  created_at: string;
};

const notificationFields = "id,order_id,title,description,is_read,created_at";

function formatNotificationTime(value: string) {
  const date = new Date(value);
  const time = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(".", ":");

  if (date.toDateString() === new Date().toDateString()) return `${time} WIB`;

  const day = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

  return `${day} - ${time} WIB`;
}

function mapNotification(row: DbNotification): BuyerNotification {
  return {
    id: row.id,
    orderId: row.order_id ?? undefined,
    title: row.title,
    description: row.description,
    time: formatNotificationTime(row.created_at),
    isRead: row.is_read,
    createdAt: row.created_at,
  };
}

export function BuyerNotificationsClient({ initialNotifications }: { initialNotifications: BuyerNotification[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const today = notifications.slice(0, 3);
  const older = notifications.slice(3);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    async function fetchNotifications() {
      const { data, error } = await supabase
        .from("notifications")
        .select(notificationFields)
        .order("created_at", { ascending: false });

      if (!error) setNotifications((data ?? []).map((row) => mapNotification(row as DbNotification)));
    }

    const channel = supabase
      .channel("buyer-notifications")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, () => {
        void fetchNotifications();
      })
      .subscribe();

    const pollingId = window.setInterval(fetchNotifications, 6000);

    return () => {
      window.clearInterval(pollingId);
      void supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
      <section className="px-4 pt-5">
        <h2 className="text-xs font-black uppercase text-cocoa-500">Hari Ini</h2>
        <div className="mt-3 grid gap-3">
          {today.length ? today.map((notification) => (
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
          )) : (
            <p className="rounded-2xl border border-cocoa-100 bg-white p-4 text-sm font-semibold leading-6 text-cocoa-500 shadow-sm">
              Belum ada notifikasi dari database. Update status seller akan muncul di sini.
            </p>
          )}
        </div>
      </section>

      {older.length ? (
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
      ) : null}
    </>
  );
}
