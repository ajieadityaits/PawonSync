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

type DbOrder = {
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

const orderFields =
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

function mapDbOrder(row: DbOrder): Order {
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
    return demoOrders;
  }

  const { data, error } = result;

  if (error) {
    console.warn("Gagal membaca orders dari Supabase:", error.message);
    return demoOrders;
  }

  const dbOrders = (data ?? []).map((row) => mapDbOrder(row as DbOrder));
  const dbIds = new Set(dbOrders.map((order) => order.id));
  return [...dbOrders, ...demoOrders.filter((order) => !dbIds.has(order.id))];
}

export async function getOrder(id: string) {
  const demoOrder = demoOrders.find((order) => order.id === id);

  if (!isSupabaseConfigured) return demoOrder ?? demoOrders[0];

  const result = await withTimeout(supabase.from("orders").select(orderFields).eq("id", id).maybeSingle());

  if (!result) {
    console.warn("Timeout membaca detail order dari Supabase.");
    return demoOrder ?? demoOrders[0];
  }

  const { data, error } = result;

  if (error) {
    console.warn("Gagal membaca detail order dari Supabase:", error.message);
    return demoOrder ?? demoOrders[0];
  }

  return data ? mapDbOrder(data as DbOrder) : demoOrder ?? demoOrders[0];
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
  const { error } = await supabase.from("orders").update({ status: nextStatus }).eq("id", id);

  if (error) throw friendlyOrderError(error);

  await supabase.from("order_status_logs").insert({
    order_id: id,
    status: nextStatus,
    description: `Status diubah menjadi ${statusMeta[nextStatus].label}`,
  });

  const order = await getOrder(id);
  await createBuyerNotification({
    orderId: id,
    buyerId: order.buyerId,
    title: `${order.eventName} diperbarui`,
    description: `Status pesanan berubah menjadi ${statusMeta[nextStatus].label}.`,
  });

  return nextStatus;
}
