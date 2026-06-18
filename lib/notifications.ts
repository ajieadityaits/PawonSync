import { buyerNotifications, type BuyerNotification } from "./data";
import { isSupabaseConfigured, supabase } from "./supabaseClient";

type DbNotification = {
  id: string;
  order_id: string | null;
  buyer_id: string | null;
  title: string;
  description: string;
  is_read: boolean;
  created_at: string;
};

export type NotificationInput = {
  orderId: string;
  buyerId?: string;
  title: string;
  description: string;
};

const notificationFields = "id,order_id,buyer_id,title,description,is_read,created_at";

function formatNotificationTime(value: string) {
  const date = new Date(value);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  const time = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(".", ":");

  if (isToday) return `${time} WIB`;

  const day = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

  return `${day} - ${time} WIB`;
}

function mapDbNotification(row: DbNotification): BuyerNotification {
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

function friendlyNotificationError(error: { message?: string }) {
  const message = error.message ?? "Notifikasi gagal diproses.";

  if (message.toLowerCase().includes("notifications")) {
    return new Error("Tabel notifications belum ada. Jalankan ulang supabase/schema.sql di SQL Editor.");
  }

  if (message.toLowerCase().includes("row-level security")) {
    return new Error("Policy RLS untuk notifications belum aktif. Jalankan ulang supabase/schema.sql di SQL Editor.");
  }

  return new Error(message);
}

export async function getBuyerNotifications() {
  if (!isSupabaseConfigured) return buyerNotifications;

  const { data, error } = await supabase
    .from("notifications")
    .select(notificationFields)
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Gagal membaca notifications dari Supabase:", error.message);
    return buyerNotifications;
  }

  const notifications = (data ?? []).map((row) => mapDbNotification(row as DbNotification));
  return notifications.length ? notifications : buyerNotifications;
}

export async function createBuyerNotification(payload: NotificationInput) {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase.from("notifications").insert({
    order_id: payload.orderId,
    buyer_id: payload.buyerId || null,
    title: payload.title,
    description: payload.description,
    is_read: false,
  });

  if (error) throw friendlyNotificationError(error);
}
