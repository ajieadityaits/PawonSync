"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Camera, ChevronRight, Edit3, Info, Minus, PackagePlus, Plus, Soup, Trash2, Utensils, X } from "lucide-react";
import { menus as demoMenus, type MenuIngredient, type MenuItem, type Order } from "@/lib/data";
import { createMenu, deleteMenu, getMenus, updateMenu, type CreateMenuInput } from "@/lib/menus";
import { mapDbOrder, orderFields, type DbOrder } from "@/lib/orders";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { formatCurrency, formatDate } from "@/lib/utils";

function sortOrders(orders: Order[]) {
  return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

const emptyIngredient: MenuIngredient = { item: "", quantity: 1, unit: "g" };

function MenuForm({
  initialMenu,
  isSubmitting,
  onCancel,
  onSubmit,
}: {
  initialMenu?: MenuItem;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (payload: CreateMenuInput, form: HTMLFormElement) => Promise<void>;
}) {
  const [ingredients, setIngredients] = useState<MenuIngredient[]>(
    initialMenu?.ingredients.length ? initialMenu.ingredients : [emptyIngredient],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    await onSubmit(
      {
        name: String(formData.get("name") ?? ""),
        description: String(formData.get("description") ?? ""),
        price: Number(formData.get("price")),
        minimumOrder: Number(formData.get("minimumOrder")),
        imageUrl: String(formData.get("imageUrl") ?? ""),
        ingredients,
        isActive: formData.get("isActive") === "on",
      },
      form,
    );
  }

  function updateIngredient(index: number, patch: Partial<MenuIngredient>) {
    setIngredients((current) => current.map((ingredient, itemIndex) => (itemIndex === index ? { ...ingredient, ...patch } : ingredient)));
  }

  return (
    <form
      className={initialMenu ? "grid min-w-0 gap-3" : "mt-3 grid min-w-0 gap-3 rounded-2xl border border-cocoa-100 bg-white p-4 shadow-sm"}
      onSubmit={handleSubmit}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-black text-cocoa-900">{initialMenu ? "Edit Menu" : "Tambah Menu Baru"}</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-cocoa-500">
            Atur data menu, standar bahan per porsi, dan status tampil di buyer.
          </p>
        </div>
        <button
          aria-label={initialMenu ? "Tutup form edit menu" : "Tutup form tambah menu"}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cream-50 text-cocoa-700"
          onClick={onCancel}
          type="button"
        >
          <X size={16} />
        </button>
      </div>

      <label className="grid min-w-0 gap-2 text-xs font-black uppercase text-cocoa-500">
        Nama menu
        <input
          className="h-11 w-full min-w-0 rounded-xl border border-cocoa-100 bg-white px-3 text-sm font-semibold normal-case text-cocoa-900 outline-none focus:border-cocoa-400 focus:ring-4 focus:ring-orange-100"
          defaultValue={initialMenu?.name}
          name="name"
          placeholder="Contoh: Nasi Box Ayam Bakar"
          required
        />
      </label>

      <label className="grid min-w-0 gap-2 text-xs font-black uppercase text-cocoa-500">
        Deskripsi / catatan dapur
        <textarea
          className="min-h-24 w-full min-w-0 resize-none rounded-xl border border-cocoa-100 bg-white px-3 py-3 text-sm font-semibold normal-case text-cocoa-900 outline-none placeholder:text-cocoa-300 focus:border-cocoa-400 focus:ring-4 focus:ring-orange-100"
          defaultValue={initialMenu?.description}
          name="description"
          placeholder="Isi menu, catatan produksi, atau detail paket."
        />
      </label>

      <div className="grid min-w-0 gap-3 sm:grid-cols-2">
        <label className="grid min-w-0 gap-2 text-xs font-black uppercase text-cocoa-500">
          Harga per porsi
          <input
            className="h-11 w-full min-w-0 rounded-xl border border-cocoa-100 bg-white px-3 text-sm font-semibold normal-case text-cocoa-900 outline-none focus:border-cocoa-400 focus:ring-4 focus:ring-orange-100"
            defaultValue={initialMenu?.price}
            min={0}
            name="price"
            placeholder="28000"
            required
            type="number"
          />
        </label>

        <label className="grid min-w-0 gap-2 text-xs font-black uppercase text-cocoa-500">
          Minimal order
          <input
            className="h-11 w-full min-w-0 rounded-xl border border-cocoa-100 bg-white px-3 text-sm font-semibold normal-case text-cocoa-900 outline-none focus:border-cocoa-400 focus:ring-4 focus:ring-orange-100"
            defaultValue={initialMenu?.minimumOrder}
            min={1}
            name="minimumOrder"
            placeholder="25"
            required
            type="number"
          />
        </label>
      </div>

      <label className="grid min-w-0 gap-2 text-xs font-black uppercase text-cocoa-500">
        URL gambar menu
        <input
          className="h-11 w-full min-w-0 truncate rounded-xl border border-cocoa-100 bg-white px-3 text-sm font-semibold normal-case text-cocoa-900 outline-none focus:border-cocoa-400 focus:ring-4 focus:ring-orange-100"
          defaultValue={initialMenu?.imageUrl}
          name="imageUrl"
          placeholder="https://..."
          type="url"
        />
      </label>

      <div className="grid min-w-0 gap-2">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <p className="text-xs font-black uppercase text-cocoa-500">Bahan per porsi</p>
          <button
            className="inline-flex h-8 shrink-0 items-center gap-1 rounded-xl border border-cocoa-100 bg-white px-2 text-[11px] font-black text-cocoa-800"
            onClick={() => setIngredients((current) => [...current, { ...emptyIngredient }])}
            type="button"
          >
            <Plus size={13} />
            Bahan
          </button>
        </div>
        <div className="grid min-w-0 gap-2">
          {ingredients.map((ingredient, index) => (
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_64px_58px_40px] gap-2 sm:grid-cols-[minmax(0,1fr)_78px_72px_40px]" key={index}>
              <input
                aria-label={`Nama bahan ${index + 1}`}
                className="h-10 w-full min-w-0 rounded-xl border border-cocoa-100 bg-white px-3 text-xs font-semibold text-cocoa-900 outline-none focus:border-cocoa-400 focus:ring-4 focus:ring-orange-100"
                onChange={(event) => updateIngredient(index, { item: event.target.value })}
                placeholder="Beras"
                required
                value={ingredient.item}
              />
              <input
                aria-label={`Kuantitas bahan ${index + 1}`}
                className="h-10 w-full min-w-0 rounded-xl border border-cocoa-100 bg-white px-2 text-xs font-semibold text-cocoa-900 outline-none focus:border-cocoa-400 focus:ring-4 focus:ring-orange-100"
                min={0.01}
                onChange={(event) => updateIngredient(index, { quantity: Number(event.target.value) })}
                placeholder="200"
                required
                step="0.01"
                type="number"
                value={ingredient.quantity}
              />
              <input
                aria-label={`Satuan bahan ${index + 1}`}
                className="h-10 w-full min-w-0 rounded-xl border border-cocoa-100 bg-white px-2 text-xs font-semibold text-cocoa-900 outline-none focus:border-cocoa-400 focus:ring-4 focus:ring-orange-100"
                onChange={(event) => updateIngredient(index, { unit: event.target.value })}
                placeholder="g"
                required
                value={ingredient.unit}
              />
              <button
                aria-label={`Hapus bahan ${index + 1}`}
                className="grid h-10 w-full place-items-center rounded-xl border border-cocoa-100 bg-white text-cocoa-700 disabled:opacity-40"
                disabled={ingredients.length === 1}
                onClick={() => setIngredients((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                type="button"
              >
                <Minus size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <label className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-cocoa-100 bg-cream-50 px-3 text-sm font-black text-cocoa-800">
        Menu aktif
        <input className="h-5 w-5 accent-cocoa-800" defaultChecked={initialMenu?.isActive ?? true} name="isActive" type="checkbox" />
      </label>

      <div className="grid min-w-0 grid-cols-2 gap-2">
        <button
          className="flex h-11 min-w-0 items-center justify-center gap-2 rounded-xl bg-cocoa-900 px-3 text-sm font-black text-white disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          <PackagePlus className="shrink-0" size={16} />
          <span className="truncate">{isSubmitting ? "Menyimpan..." : initialMenu ? "Simpan Edit" : "Simpan Menu"}</span>
        </button>
        <button
          className="h-11 min-w-0 rounded-xl border border-cocoa-100 bg-white px-3 text-sm font-black text-cocoa-800"
          onClick={onCancel}
          type="button"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

export function SellerKitchenClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(() => sortOrders(initialOrders));
  const [menuItems, setMenuItems] = useState<MenuItem[]>(demoMenus);
  const [isAddingMenu, setIsAddingMenu] = useState(false);
  const [isSubmittingMenu, setIsSubmittingMenu] = useState(false);
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [deletingMenuId, setDeletingMenuId] = useState<string | null>(null);
  const [menuError, setMenuError] = useState("");
  const [menuSuccess, setMenuSuccess] = useState("");
  const kitchenOrders = orders.filter((order) => order.status !== "selesai");
  const activeMenuCount = menuItems.filter((menu) => menu.isActive).length;

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    async function fetchOrders() {
      const { data, error } = await supabase.from("orders").select(orderFields).order("created_at", { ascending: false });
      if (!error) setOrders(sortOrders((data ?? []).map((row) => mapDbOrder(row as DbOrder))));
    }

    async function fetchMenus() {
      const nextMenus = await getMenus();
      setMenuItems(nextMenus);
    }

    const channel = supabase
      .channel("seller-kitchen-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        void fetchOrders();
      })
      .subscribe();

    const menuChannel = supabase
      .channel("seller-kitchen-menus")
      .on("postgres_changes", { event: "*", schema: "public", table: "menus" }, () => {
        void fetchMenus();
      })
      .subscribe();

    const pollingId = window.setInterval(fetchOrders, 6000);
    const menuPollingId = window.setInterval(fetchMenus, 8000);
    void fetchMenus();

    return () => {
      window.clearInterval(pollingId);
      window.clearInterval(menuPollingId);
      void supabase.removeChannel(channel);
      void supabase.removeChannel(menuChannel);
    };
  }, []);

  async function handleCreateMenu(payload: CreateMenuInput, form: HTMLFormElement) {
    setMenuError("");
    setMenuSuccess("");
    setIsSubmittingMenu(true);

    try {
      const menu = await createMenu(payload);

      setMenuItems((current) => [menu, ...current.filter((item) => item.id !== menu.id)]);
      setMenuSuccess(`${menu.name} berhasil ditambahkan.`);
      form.reset();
      setIsAddingMenu(false);
    } catch (error) {
      setMenuError(error instanceof Error ? error.message : "Menu gagal ditambahkan.");
    } finally {
      setIsSubmittingMenu(false);
    }
  }

  async function handleUpdateMenu(menuId: string, payload: CreateMenuInput) {
    setMenuError("");
    setMenuSuccess("");
    setIsSubmittingMenu(true);

    try {
      const menu = await updateMenu(menuId, payload);
      setMenuItems((current) => current.map((item) => (item.id === menu.id ? menu : item)));
      setMenuSuccess(`${menu.name} berhasil diperbarui.`);
      setEditingMenuId(null);
    } catch (error) {
      setMenuError(error instanceof Error ? error.message : "Menu gagal diperbarui.");
    } finally {
      setIsSubmittingMenu(false);
    }
  }

  async function handleDeleteMenu(menu: MenuItem) {
    if (!window.confirm(`Hapus menu "${menu.name}"? Menu yang sudah dihapus tidak tampil lagi di buyer.`)) return;

    setMenuError("");
    setMenuSuccess("");
    setDeletingMenuId(menu.id);

    try {
      await deleteMenu(menu.id);
      setMenuItems((current) => current.filter((item) => item.id !== menu.id));
      setMenuSuccess(`${menu.name} berhasil dihapus.`);
      if (editingMenuId === menu.id) setEditingMenuId(null);
    } catch (error) {
      setMenuError(error instanceof Error ? error.message : "Menu gagal dihapus.");
    } finally {
      setDeletingMenuId(null);
    }
  }

  return (
    <>
      <section className="px-4 pt-5">
        <article className="rounded-3xl border border-cocoa-100 bg-white p-4 shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-orange-700">Kitchen Control</p>
              <h1 className="mt-1 text-2xl font-black leading-tight text-cocoa-900">Menu dan dapur dalam satu tempat</h1>
              <p className="mt-2 text-xs font-semibold leading-5 text-cocoa-500">
                Data order dapur tersinkron realtime dengan database dan dashboard beranda seller.
              </p>
            </div>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cocoa-900 text-white">
              <Soup size={23} />
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-cream-50 p-3">
              <p className="text-2xl font-black text-cocoa-900">{activeMenuCount}</p>
              <p className="text-[11px] font-black uppercase text-cocoa-500">Menu aktif</p>
            </div>
            <div className="rounded-2xl bg-sage-50 p-3">
              <p className="text-2xl font-black text-cocoa-900">{kitchenOrders.length}</p>
              <p className="text-[11px] font-black uppercase text-cocoa-500">Order dapur</p>
            </div>
          </div>
        </article>
      </section>

      <section className="mt-7 border-t border-cocoa-100 px-4 pt-6">
        <h2 className="text-xs font-black uppercase text-cocoa-500">Pesanan dari Buyer</h2>
        <div className="mt-3 grid gap-3">
          {kitchenOrders.length ? kitchenOrders.map((order, index) => (
            <Link
              className={index === 0 ? "rounded-2xl bg-cocoa-900 p-4 text-white shadow-soft" : "rounded-2xl border border-cocoa-100 bg-white p-4 text-cocoa-700 shadow-sm"}
              href={`/seller/kitchen/${order.id}/plate`}
              key={order.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className={index === 0 ? "text-[11px] font-black uppercase text-cream-100" : "text-[11px] font-black uppercase text-orange-700"}>
                    Siap dibuatkan dummy plate
                  </p>
                  <h3 className="mt-1 truncate text-sm font-black">{order.eventName}</h3>
                  <p className={index === 0 ? "mt-1 text-xs font-semibold text-cream-100" : "mt-1 text-xs font-semibold text-cocoa-500"}>
                    {order.menuName} • {order.portions} porsi • {formatDate(order.eventDate)}
                  </p>
                </div>
                <ChevronRight size={18} />
              </div>
            </Link>
          )) : (
            <p className="rounded-xl border border-cocoa-100 bg-white px-4 py-4 text-sm font-semibold text-cocoa-500 shadow-sm">
              Pesanan baru dari buyer akan muncul otomatis di sini.
            </p>
          )}
        </div>
      </section>

      <section className="mt-7 min-w-0 border-t border-cocoa-100 px-4 pt-6">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <h2 className="text-xs font-black uppercase text-cocoa-500">Menu Management</h2>
          <button
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-xl bg-cocoa-900 px-3 text-xs font-black text-white"
            onClick={() => {
              setIsAddingMenu((value) => !value);
              setEditingMenuId(null);
              setMenuError("");
              setMenuSuccess("");
            }}
            type="button"
          >
            <PackagePlus size={15} />
            Tambah
          </button>
        </div>

        {isAddingMenu ? (
          <MenuForm
            isSubmitting={isSubmittingMenu}
            onCancel={() => setIsAddingMenu(false)}
            onSubmit={handleCreateMenu}
          />
        ) : null}

        {menuSuccess && !isAddingMenu && !editingMenuId ? (
          <p className="mt-3 rounded-xl border border-sage-100 bg-sage-50 px-3 py-3 text-xs font-semibold leading-5 text-sage-800">{menuSuccess}</p>
        ) : null}
        {menuError && !isAddingMenu && !editingMenuId ? (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-xs font-semibold leading-5 text-red-700">{menuError}</p>
        ) : null}

        <div className="mt-3 grid min-w-0 gap-3">
          {menuItems.map((menu) => (
            <article className="overflow-hidden rounded-2xl border border-cocoa-100 bg-white shadow-sm" key={menu.id}>
              <div className="grid min-w-0 grid-cols-[90px_minmax(0,1fr)] gap-3 p-3 sm:grid-cols-[96px_minmax(0,1fr)]">
                <div className="relative h-[90px] overflow-hidden rounded-xl bg-cream-50 sm:h-24">
                  <Image alt={menu.name} className="object-cover" fill sizes="96px" src={menu.imageUrl} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-cocoa-900">{menu.name}</p>
                      <p className="mt-1 text-xs font-semibold text-cocoa-500">{menu.category} • {menu.prepTime}</p>
                    </div>
                    <span className={menu.isActive ? "rounded-full bg-sage-50 px-2 py-1 text-[10px] font-black text-sage-800" : "rounded-full bg-cocoa-50 px-2 py-1 text-[10px] font-black text-cocoa-500"}>
                      {menu.isActive ? "Aktif" : "Off"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-black text-orange-700">{formatCurrency(menu.price)}</p>
                  <p className="mt-1 line-clamp-2 text-[11px] font-semibold leading-4 text-cocoa-400">Min. {menu.minimumOrder} porsi • {menu.dailyNote}</p>
                  {menu.portionGuide.length ? (
                    <p className="mt-2 line-clamp-2 text-[11px] font-semibold leading-4 text-cocoa-500">
                      Bahan: {menu.portionGuide.slice(0, 3).map((item) => `${item.item} ${item.amount}`).join(", ")}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="grid min-w-0 grid-cols-2 gap-2 border-t border-cocoa-100 p-3 sm:grid-cols-4">
                <button
                  className="flex h-10 min-w-0 items-center justify-center gap-1 rounded-xl border border-cocoa-100 bg-white px-2 text-xs font-black text-cocoa-800"
                  onClick={() => {
                    setEditingMenuId((current) => (current === menu.id ? null : menu.id));
                    setIsAddingMenu(false);
                    setMenuError("");
                    setMenuSuccess("");
                  }}
                  type="button"
                >
                  <Edit3 className="shrink-0" size={14} />
                  <span className="truncate">Edit</span>
                </button>
                <label className="flex h-10 min-w-0 cursor-pointer items-center justify-center gap-1 rounded-xl border border-cocoa-100 bg-white px-2 text-xs font-black text-cocoa-800">
                  <input accept="image/*" capture="environment" className="sr-only" type="file" />
                  <Camera className="shrink-0" size={14} />
                  <span className="truncate">Gambar</span>
                </label>
                <Link
                  className="flex h-10 min-w-0 items-center justify-center gap-1 rounded-xl bg-cocoa-900 px-2 text-xs font-black text-white"
                  href={`/seller/kitchen/menu/${menu.id}/plate`}
                >
                  <Utensils className="shrink-0" size={14} />
                  <span className="truncate">Plate</span>
                </Link>
                <button
                  className="flex h-10 min-w-0 items-center justify-center gap-1 rounded-xl border border-red-100 bg-red-50 px-2 text-xs font-black text-red-700 disabled:opacity-60"
                  disabled={deletingMenuId === menu.id}
                  onClick={() => void handleDeleteMenu(menu)}
                  type="button"
                >
                  <Trash2 className="shrink-0" size={14} />
                  <span className="truncate">{deletingMenuId === menu.id ? "..." : "Hapus"}</span>
                </button>
              </div>
              {editingMenuId === menu.id ? (
                <div className="min-w-0 border-t border-cocoa-100 p-3">
                  {menuError ? (
                    <p className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-xs font-semibold leading-5 text-red-700">{menuError}</p>
                  ) : null}
                  <MenuForm
                    initialMenu={menu}
                    isSubmitting={isSubmittingMenu}
                    onCancel={() => setEditingMenuId(null)}
                    onSubmit={(payload) => handleUpdateMenu(menu.id, payload)}
                  />
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6 px-4">
        <div className="rounded-xl border border-cocoa-100 bg-white p-4 text-xs font-semibold leading-5 text-cocoa-600 shadow-sm">
          <p className="flex items-start gap-2">
            <Info className="mt-0.5 shrink-0" size={16} />
            Menu management tersambung ke tabel menus Supabase. Jika tabel database masih kosong, tampilan memakai contoh menu lokal.
          </p>
        </div>
      </section>
    </>
  );
}
