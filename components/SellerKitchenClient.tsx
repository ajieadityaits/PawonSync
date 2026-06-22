"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Camera, ChevronRight, Edit3, Info, PackagePlus, Soup, Utensils } from "lucide-react";
import { menus, type Order } from "@/lib/data";
import { mapDbOrder, orderFields, type DbOrder } from "@/lib/orders";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { formatCurrency, formatDate } from "@/lib/utils";

function sortOrders(orders: Order[]) {
  return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function SellerKitchenClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(() => sortOrders(initialOrders));
  const [activeMenuCount, setActiveMenuCount] = useState(() => menus.filter((menu) => menu.isActive).length);
  const kitchenOrders = orders.filter((order) => order.status !== "selesai");

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    async function fetchOrders() {
      const { data, error } = await supabase.from("orders").select(orderFields).order("created_at", { ascending: false });
      if (!error) setOrders(sortOrders((data ?? []).map((row) => mapDbOrder(row as DbOrder))));
    }

    async function fetchMenus() {
      const { count, error } = await supabase
        .from("menus")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true);

      if (!error && typeof count === "number") setActiveMenuCount(count);
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

      <section className="mt-7 border-t border-cocoa-100 px-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase text-cocoa-500">Menu Management</h2>
          <button className="inline-flex h-9 items-center gap-2 rounded-xl bg-cocoa-900 px-3 text-xs font-black text-white" type="button">
            <PackagePlus size={15} />
            Tambah
          </button>
        </div>
        <div className="mt-3 grid gap-3">
          {menus.map((menu) => (
            <article className="overflow-hidden rounded-2xl border border-cocoa-100 bg-white shadow-sm" key={menu.id}>
              <div className="grid grid-cols-[96px_1fr] gap-3 p-3">
                <div className="relative h-24 overflow-hidden rounded-xl bg-cream-50">
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
                  <p className="mt-1 text-[11px] font-semibold leading-4 text-cocoa-400">Min. {menu.minimumOrder} porsi • {menu.dailyNote}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 border-t border-cocoa-100 p-3">
                <button className="flex h-10 items-center justify-center gap-1 rounded-xl border border-cocoa-100 bg-white text-xs font-black text-cocoa-800" type="button">
                  <Edit3 size={14} />
                  Edit
                </button>
                <label className="flex h-10 cursor-pointer items-center justify-center gap-1 rounded-xl border border-cocoa-100 bg-white text-xs font-black text-cocoa-800">
                  <input accept="image/*" capture="environment" className="sr-only" type="file" />
                  <Camera size={14} />
                  Gambar
                </label>
                <Link
                  className="flex h-10 items-center justify-center gap-1 rounded-xl bg-cocoa-900 text-xs font-black text-white"
                  href={`/seller/kitchen/menu/${menu.id}/plate`}
                >
                  <Utensils size={14} />
                  Plate
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6 px-4">
        <div className="rounded-xl border border-cocoa-100 bg-white p-4 text-xs font-semibold leading-5 text-cocoa-600 shadow-sm">
          <p className="flex items-start gap-2">
            <Info className="mt-0.5 shrink-0" size={16} />
            Untuk prototype, menu masih memakai data lokal. Order dapur sudah realtime dari tabel orders Supabase.
          </p>
        </div>
      </section>
    </>
  );
}
