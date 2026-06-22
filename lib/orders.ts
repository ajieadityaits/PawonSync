import {
  buyerProfile,
  orderStatuses,
  orders as demoOrders,
  sellerProfile,
  statusMeta,
  type Order,
  type OrderStatus,
} from "./data";
import { createBuyerNotification } from "./notifications";
import { isSupabaseConfigured, supabase } from "./supabaseClient";

export type DbOrder = {
  id: string;
  seller_id: string | null;
  buyer_id: string | null;
  event_name?: string | null;
  buyer_name: string;
  buyer_phone: string | null;
  menu_name: string;
  portions: number;
  event_date: string;
  delivery_time: string;
  venue_address: string;
  notes: string | null;
  status: OrderStatus;
  estimated_arrival: string | null;
  created_at: string;
};

export type BuyerOrderInput = {
  eventName: string;
  buyerName: string;
  buyerPhone: string;
  menuName: string;
  portions: number;
  eventDate: string;
  deliveryTime: string;
  venueAddress: string;
  notes?: string;
};

export const orderFields =
  "id,seller_id,buyer_id,event_name,buyer_name,buyer_phone,menu_name,portions,event_date,delivery_time,venue_address,notes,status,estimated_arrival,created_at";

async function withTimeout<T>(request: PromiseLike<T>) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      request,
      new Promise<null>((resolve) => {
        timeoutId = setTimeout(() => resolve(null), 5000);
      }),
    ]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

function displayTime(value: string) {
  return value.slice(0, 5);
}

export function mapDbOrder(row: DbOrder): Order {
  return {
    id: row.id,
    sellerId: row.seller_id ?? sellerProfile.id,
    buyerId: row.buyer_id ?? buyerProfile.id,
    eventName: row.event_name || `Pesanan ${row.menu_name}`,
    buyerName: row.buyer_name,
    buyerPhone: row.buyer_phone ?? buyerProfile.phone,
    cateringName: sellerProfile.cateringName,
    menuName: row.menu_name,
    portions: row.portions,
    eventDate: row.event_date,
    deliveryTime: displayTime(row.delivery_time),
    venueAddress: row.venue_address,
    notes: row.notes ?? "",
    status: row.status,
    estimatedArrival: row.estimated_arrival ?? `${displayTime(row.delivery_time)} WIB`,
    createdAt: row.created_at,
  };
}

function friendlyOrderError(error: { message?: string }) {
  const message = error.message ?? "Data pesanan gagal diproses.";

  if (message.toLowerCase().includes("row-level security")) {
    return new Error("Pesanan belum bisa disimpan karena policy RLS Supabase untuk tabel orders belum diaktifkan. Jalankan ulang supabase/schema.sql di SQL Editor.");
  }

  if (message.toLowerCase().includes("event_name")) {
    return new Error("Kolom event_name belum ada di tabel orders. Jalankan ulang supabase/schema.sql di SQL Editor.");
  }

  return new Error(message);
}

export async function getOrders() {
  if (!isSupabaseConfigured) return demoOrders;

  const result = await withTimeout(supabase.from("orders").select(orderFields).order("created_at", { ascending: false }));

  if (!result) {
    console.warn("Timeout membaca orders dari Supabase.");
    return [];
  }

  const { data, error } = result;

  if (error) {
    console.warn("Gagal membaca orders dari Supabase:", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapDbOrder(row as DbOrder));
}

export async function getOrder(id: string) {
  const demoOrder = demoOrders.find((order) => order.id === id);

  if (!isSupabaseConfigured) return demoOrder ?? demoOrders[0];

  const result = await withTimeout(supabase.from("orders").select(orderFields).eq("id", id).maybeSingle());

  if (!result) {
    console.warn("Timeout membaca detail order dari Supabase.");
    return undefined;
  }

  const { data, error } = result;

  if (error) {
    console.warn("Gagal membaca detail order dari Supabase:", error.message);
    return undefined;
  }

  return data ? mapDbOrder(data as DbOrder) : undefined;
}

export async function createBuyerOrder(payload: BuyerOrderInput) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY dulu.");
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({
      event_name: payload.eventName.trim(),
      buyer_name: payload.buyerName.trim(),
      buyer_phone: payload.buyerPhone.trim(),
      menu_name: payload.menuName.trim(),
      portions: payload.portions,
      event_date: payload.eventDate,
      delivery_time: payload.deliveryTime,
      venue_address: payload.venueAddress.trim(),
      notes: payload.notes?.trim() || null,
      status: "pesanan_masuk",
      estimated_arrival: `${payload.deliveryTime} WIB`,
    })
    .select(orderFields)
    .single();

  if (error) throw friendlyOrderError(error);
  return mapDbOrder(data as DbOrder);
}

export function nextOrderStatus(status: OrderStatus) {
  const index = orderStatuses.indexOf(status);
  return orderStatuses[Math.min(index + 1, orderStatuses.length - 1)];
}

export async function updateOrderToNextStatus(id: string, currentStatus: OrderStatus) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase belum dikonfigurasi, jadi update status belum bisa disimpan.");
  }

  const nextStatus = nextOrderStatus(currentStatus);
  const { data, error } = await supabase.from("orders").update({ status: nextStatus }).eq("id", id).select(orderFields).single();

  if (error) throw friendlyOrderError(error);

  const order = mapDbOrder(data as DbOrder);
  const sideEffects = await Promise.allSettled([
    supabase.from("order_status_logs").insert({
      order_id: id,
      status: nextStatus,
      description: `Status diubah menjadi ${statusMeta[nextStatus].label}`,
    }),
    createBuyerNotification({
      orderId: id,
      buyerId: order.buyerId,
      title: `${order.eventName} diperbarui`,
      description: `Status pesanan berubah menjadi ${statusMeta[nextStatus].label}.`,
    }),
  ]);

  sideEffects.forEach((result) => {
    if (result.status === "rejected") {
      console.warn("Status pesanan tersimpan, tetapi log/notifikasi gagal dibuat:", result.reason);
      return;
    }

    if (result.value && "error" in result.value && result.value.error) {
      console.warn("Status pesanan tersimpan, tetapi log gagal dibuat:", result.value.error.message);
    }
  });

  return nextStatus;
}

export async function completeBuyerOrder(id: string) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase belum dikonfigurasi, jadi konfirmasi pesanan belum bisa disimpan.");
  }

  const completedStatus: OrderStatus = "selesai";
  const { error } = await supabase.from("orders").update({ status: completedStatus }).eq("id", id);

  if (error) throw friendlyOrderError(error);

  await supabase.from("order_status_logs").insert({
    order_id: id,
    status: completedStatus,
    description: "Buyer mengonfirmasi pesanan sudah sampai.",
  });

  return completedStatus;
}

export async function markOrderDeparted(id: string, currentStatus: OrderStatus) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase belum dikonfigurasi, jadi departure gate belum bisa disimpan.");
  }

  const departedStatus: OrderStatus = "dikirim";
  if (currentStatus === "selesai") return departedStatus;

  const { data, error } = await supabase
    .from("orders")
    .update({
      status: departedStatus,
      estimated_arrival: "Dalam perjalanan",
    })
    .eq("id", id)
    .select(orderFields)
    .single();

  if (error) throw friendlyOrderError(error);

  const order = mapDbOrder(data as DbOrder);
  const sideEffects = await Promise.allSettled([
    supabase.from("order_status_logs").insert({
      order_id: id,
      status: departedStatus,
      description: "Seller mengaktifkan departure gate. Kurir mulai berangkat ke venue.",
    }),
    createBuyerNotification({
      orderId: id,
      buyerId: order.buyerId,
      title: `${order.eventName} mulai dikirim`,
      description: "Kurir sudah berangkat dari dapur menuju venue.",
    }),
  ]);

  sideEffects.forEach((result) => {
    if (result.status === "rejected") {
      console.warn("Departure gate aktif, tetapi log/notifikasi gagal dibuat:", result.reason);
      return;
    }

    if (result.value && "error" in result.value && result.value.error) {
      console.warn("Departure gate aktif, tetapi log gagal dibuat:", result.value.error.message);
    }
  });

  return departedStatus;
}

export async function deleteOrder(id: string) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase belum dikonfigurasi, jadi riwayat pesanan belum bisa dihapus permanen.");
  }

  const { error } = await supabase.from("orders").delete().eq("id", id);

  if (error) throw friendlyOrderError(error);
}
