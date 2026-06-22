"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, ClipboardList, CookingPot, Soup, Sparkles } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { menus, sellerDailyBriefs, sellerProfile, type Order } from "@/lib/data";
import { mapDbOrder, orderFields, type DbOrder } from "@/lib/orders";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { formatCurrency, formatDate } from "@/lib/utils";

function sortOrders(orders: Order[]) {
  return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function SellerDashboardClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(() => sortOrders(initialOrders));
  const newestOrders = orders.slice(0, 3);
  const activeMenus = menus.filter((menu) => menu.isActive);
  const activeCount = orders.filter((order) => order.status !== "selesai").length;
  const shippingToday = orders.filter((order) => order.status === "dikirim").length;

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    async function fetchOrders() {
      const { data, error } = await supabase.from("orders").select(orderFields).order("created_at", { ascending: false });
      if (!error) setOrders(sortOrders((data ?? []).map((row) => mapDbOrder(row as DbOrder))));
    }

    const channel = supabase
      .channel("seller-dashboard-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        void fetchOrders();
      })
      .subscribe();

    const pollingId = window.setInterval(fetchOrders, 6000);

    return () => {
      window.clearInterval(pollingId);
      void supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
      <section className="px-4 pt-5">
        <article className="overflow-hidden rounded-3xl border border-cocoa-100 bg-white shadow-soft">
          <div className="relative h-32">
            <Image
              alt="Suasana dapur katering Pawon Lestari"
              className="object-cover"
              fill
              priority
              sizes="430px"
              src="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-cocoa-950/80 via-cocoa-900/35 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-xs font-black uppercase text-cream-100">Selamat datang, {sellerProfile.ownerName}</p>
              <h1 className="mt-1 text-2xl font-black leading-tight">{sellerProfile.cateringName}</h1>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4">
            <div className="rounded-2xl bg-cream-50 p-4">
              <p className="text-3xl font-black text-cocoa-900">{activeCount}</p>
              <p className="mt-1 text-[11px] font-black uppercase text-cocoa-500">Pesanan aktif</p>
            </div>
            <div className="rounded-2xl bg-sage-50 p-4">
              <p className="text-3xl font-black text-cocoa-900">{shippingToday}</p>
              <p className="mt-1 text-[11px] font-black uppercase text-cocoa-500">Sedang dikirim</p>
            </div>
          </div>
        </article>
      </section>

      <section className="mt-5 px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase text-cocoa-900">Update Harian</h2>
          <Sparkles className="text-orange-700" size={18} />
        </div>
        <div className="mt-3 grid gap-3">
          {sellerDailyBriefs.map((item) => (
            <article className="rounded-2xl border border-cocoa-100 bg-white p-4 shadow-sm" key={item.title}>
              <p className="text-[11px] font-black uppercase text-orange-700">{item.title}</p>
              <h3 className="mt-1 text-base font-black text-cocoa-900">{item.value}</h3>
              <p className="mt-1 text-xs font-semibold leading-5 text-cocoa-500">{item.helper}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6 px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase text-cocoa-900">Pesanan Masuk dari Buyer</h2>
          <Link className="text-xs font-black text-orange-700" href="/seller/orders">
            Lihat Semua
          </Link>
        </div>

        <div className="mt-3 grid gap-3">
          {newestOrders.length ? newestOrders.map((order) => (
            <Link
              className="rounded-2xl border border-cocoa-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
              href={`/seller/orders/${order.id}`}
              key={order.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="mb-1 inline-flex rounded-full bg-orange-50 px-2 py-1 text-[10px] font-black uppercase text-orange-700">
                    Request buyer
                  </p>
                  <h3 className="truncate font-black text-cocoa-900">{order.eventName}</h3>
                  <p className="mt-1 text-xs font-semibold leading-5 text-cocoa-500">
                    {order.portions} porsi • {formatDate(order.eventDate)}
                  </p>
                </div>
                <StatusBadge compact status={order.status} />
              </div>
            </Link>
          )) : (
            <p className="rounded-2xl border border-cocoa-100 bg-white p-4 text-sm font-semibold leading-6 text-cocoa-500 shadow-sm">
              Belum ada pesanan dari buyer di database. Pesanan baru akan muncul otomatis setelah buyer membuat order.
            </p>
          )}
        </div>
      </section>

      <section className="mt-6 px-4">
        <Link
          className="flex min-h-24 items-center justify-between gap-3 rounded-2xl border border-dashed border-cocoa-300 bg-white p-4 text-sm font-black text-cocoa-900 shadow-sm"
          href="/seller/kitchen"
        >
          <span className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-cocoa-800 text-white">
              <Soup size={20} />
            </span>
            <span>
              Dapur & Menu Management
              <span className="block text-xs font-semibold text-cocoa-500">Order dapur realtime dari database.</span>
            </span>
          </span>
          <ChevronRight size={18} />
        </Link>
      </section>

      <section className="mt-5 px-4">
        <h2 className="text-sm font-black uppercase text-cocoa-900">Menu Aktif</h2>
        <div className="mt-3 grid gap-3">
          {activeMenus.slice(0, 2).map((menu) => (
            <Link
              className="grid grid-cols-[82px_1fr_auto] items-center gap-3 rounded-2xl border border-cocoa-100 bg-white p-3 shadow-sm"
              href="/seller/kitchen"
              key={menu.id}
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-cream-50">
                <Image alt={menu.name} className="object-cover" fill sizes="80px" src={menu.imageUrl} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-cocoa-900">{menu.name}</p>
                <p className="mt-1 text-xs font-semibold text-cocoa-500">{menu.category} • min. {menu.minimumOrder} porsi</p>
                <p className="mt-1 text-xs font-black text-orange-700">{formatCurrency(menu.price)}</p>
              </div>
              <ChevronRight className="text-cocoa-300" size={18} />
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-3 px-4">
        <Link
          className="flex items-center justify-between rounded-2xl border border-sage-100 bg-sage-50 p-4 text-sm font-bold text-sage-800"
          href="/seller/kitchen"
        >
          <span className="flex items-center gap-2">
            <CookingPot size={18} />
            Lihat panduan dapur hari ini
          </span>
          <ChevronRight size={18} />
        </Link>
        <div className="rounded-2xl border border-cocoa-100 bg-white p-4 text-sm leading-6 text-cocoa-600 shadow-sm">
          <p className="flex items-center gap-2 font-black text-cocoa-900">
            <ClipboardList size={17} />
            Prioritas
          </p>
          <p className="mt-2">
            {newestOrders[0] ? (
              <>
                {newestOrders[0].eventName} perlu update progres sebelum jam pengiriman <strong>{newestOrders[0].deliveryTime} WIB</strong>.
              </>
            ) : (
              "Belum ada prioritas pesanan. Fokuskan pada persiapan menu aktif dan bahan dapur."
            )}
          </p>
        </div>
      </section>
    </>
  );
}
