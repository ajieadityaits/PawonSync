import { findMenuById, menus as demoMenus, type MenuItem } from "./data";
import { isSupabaseConfigured, supabase } from "./supabaseClient";

const defaultMenuImage =
  "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=900&q=80";
const defaultPlateImage =
  "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=900&q=80";

export type DbMenu = {
  id: string;
  seller_id: string | null;
  name: string;
  description: string | null;
  price: number;
  minimum_order: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
};

export type CreateMenuInput = {
  name: string;
  description?: string;
  price: number;
  minimumOrder: number;
  imageUrl?: string;
  isActive: boolean;
};

export const menuFields = "id,seller_id,name,description,price,minimum_order,image_url,is_active,created_at";

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

export function mapDbMenu(row: DbMenu): MenuItem {
  const description = row.description?.trim() || "Menu catering siap dipesan untuk kebutuhan acara.";

  return {
    id: row.id,
    name: row.name,
    category: "Menu Catering",
    description,
    price: row.price,
    minimumOrder: row.minimum_order,
    imageUrl: row.image_url || defaultMenuImage,
    plateImageUrl: row.image_url || defaultPlateImage,
    prepTime: "90 menit",
    dailyNote: description,
    portionGuide: [
      { item: "Menu utama", amount: "1 paket" },
      { item: "Minimal order", amount: `${row.minimum_order} porsi` },
      { item: "Catatan", amount: "Sesuaikan kebutuhan buyer" },
    ],
    isActive: row.is_active,
  };
}

function friendlyMenuError(error: { message?: string }) {
  const message = error.message ?? "Data menu gagal diproses.";

  if (message.toLowerCase().includes("row-level security")) {
    return new Error("Menu belum bisa disimpan karena policy RLS Supabase untuk tabel menus belum aktif. Jalankan ulang supabase/schema.sql di SQL Editor.");
  }

  if (message.toLowerCase().includes("relation") && message.toLowerCase().includes("menus")) {
    return new Error("Tabel menus belum ada di Supabase. Jalankan supabase/schema.sql di SQL Editor dulu.");
  }

  return new Error(message);
}

export async function getMenus() {
  if (!isSupabaseConfigured) return demoMenus;

  const result = await withTimeout(supabase.from("menus").select(menuFields).order("created_at", { ascending: false }));

  if (!result) {
    console.warn("Timeout membaca menus dari Supabase.");
    return demoMenus;
  }

  const { data, error } = result;

  if (error) {
    console.warn("Gagal membaca menus dari Supabase:", error.message);
    return demoMenus;
  }

  return (data ?? []).length ? (data ?? []).map((row) => mapDbMenu(row as DbMenu)) : demoMenus;
}

export async function getMenu(id: string) {
  const demoMenu = findMenuById(id);
  if (demoMenu || !isSupabaseConfigured) return demoMenu;

  const result = await withTimeout(supabase.from("menus").select(menuFields).eq("id", id).maybeSingle());

  if (!result) return undefined;

  const { data, error } = result;
  if (error) {
    console.warn("Gagal membaca detail menu dari Supabase:", error.message);
    return undefined;
  }

  return data ? mapDbMenu(data as DbMenu) : undefined;
}

export async function createMenu(payload: CreateMenuInput) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY dulu.");
  }

  if (!payload.name.trim()) throw new Error("Nama menu wajib diisi.");
  if (!Number.isFinite(payload.price) || payload.price < 0) throw new Error("Harga menu tidak valid.");
  if (!Number.isFinite(payload.minimumOrder) || payload.minimumOrder < 1) throw new Error("Minimal order harus lebih dari 0.");

  const { data, error } = await supabase
    .from("menus")
    .insert({
      name: payload.name.trim(),
      description: payload.description?.trim() || null,
      price: payload.price,
      minimum_order: payload.minimumOrder,
      image_url: payload.imageUrl?.trim() || null,
      is_active: payload.isActive,
    })
    .select(menuFields)
    .single();

  if (error) throw friendlyMenuError(error);
  return mapDbMenu(data as DbMenu);
}
