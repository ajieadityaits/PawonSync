"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays, ChevronRight, Clock3, PackageCheck, PackagePlus, Truck } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { buyerProfile, menus as demoMenus, type MenuItem, type Order } from "@/lib/data";
import { getMenus } from "@/lib/menus";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { formatCurrency, formatDate, statusProgress } from "@/lib/utils";
import { mapDbOrder, orderFields, type DbOrder } from "@/lib/orders";

function sortOrders(orders: Order[]) {
  return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function BuyerDashboardClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(() => sortOrders(initialOrders));
  const [menuItems, setMenuItems] = useState<MenuItem[]>(demoMenus);
  const activeOrder = orders.find((order) => order.status !== "selesai") ?? orders[0];
  const secondaryOrders = orders.slice(0, 3);
  const featuredMenus = menuItems.filter((menu) => menu.isActive).slice(0, 2);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    async function fetchOrders() {
      const { data, error } = await supabase.from("orders").select(orderFields).order("created_at", { ascending: false });
      if (!error) setOrders(sortOrders((data ?? []).map((row) => mapDbOrder(row as DbOrder))));
    }

    async function fetchMenus() {
      setMenuItems(await getMenus());
    }

    const channel = supabase
      .channel("buyer-dashboard-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        void fetchOrders();
      })
      .subscribe();

    const menuChannel = supabase
      .channel("buyer-dashboard-menus")
      .on("postgres_changes", { event: "*", schema: "public", table: "menus" }, () => {
        void fetchMenus();
      })
      .subscribe();

    const pollingId = window.setInterval(fetchOrders, 6000);
    void fetchMenus();

    return () => {
      window.clearInterval(pollingId);
      void supabase.removeChannel(channel);
      void supabase.removeChannel(menuChannel);
    };
  }, []);

  return (
    <>
      <section className="px-4 pt-5">
        <article className="overflow-hidden rounded-[24px] border border-cocoa-100 bg-white shadow-soft">
          <div className="relative h-36">
            <Image
              alt="Pilihan catering hangat untuk acara"
              className="object-cover"
              fill
              priority
              sizes="430px"
              src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=900&q=80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-cocoa-950/80 via-cocoa-900/35 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-xs font-black uppercase text-cream-100">Halo, Bu {buyerProfile.fullName}</p>
              <h1 className="mt-1 text-2xl font-black leading-tight">Pesan catering langsung ke Pawon Lestari</h1>
            </div>
          </div>
          <div className="grid gap-3 p-4">
            <p className="text-sm font-semibold leading-6 text-cocoa-500">
              Buat pesanan dari beranda, lalu seller akan melihat order baru ini di dashboard dan dapur.
            </p>
            <Link
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-cocoa-800 px-4 text-sm font-black text-white"
              href="/buyer/orders/new"
            >
              <PackagePlus size={18} />
              Buat Pesanan ke Catering
            </Link>
          </div>
        </article>
      </section>

      <section className="mt-6 px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase text-cocoa-900">Menu Bisa Dipesan</h2>
          <Link className="text-xs font-black text-orange-700" href="/buyer/orders/new">
            Pilih Menu
          </Link>
        </div>
        <div className="mt-3 grid gap-3">
          {featuredMenus.map((menu) => (
            <Link
              className="grid grid-cols-[86px_1fr_auto] items-center gap-3 rounded-2xl border border-cocoa-100 bg-white p-3 shadow-sm"
              href={`/buyer/orders/new?menu=${encodeURIComponent(menu.name)}`}
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

      <section className="mt-6 px-4">
        <h2 className="text-sm font-black uppercase text-cocoa-900">Info Catering Hari Ini</h2>
        <div className="mt-3 grid gap-3">
          {[
            { icon: CalendarDays, title: "Booking Acara", text: "Pesan minimal H-1 agar dapur punya waktu menyiapkan bahan." },
            { icon: Truck, title: "Pengiriman", text: "Departure gate akan aktif saat seller mengonfirmasi kurir berangkat." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article className="rounded-2xl border border-cocoa-100 bg-white p-4 shadow-sm" key={item.title}>
                <p className="flex items-center gap-2 text-sm font-black text-cocoa-900">
                  <Icon size={17} />
                  {item.title}
                </p>
                <p className="mt-2 text-xs font-semibold leading-5 text-cocoa-500">{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-6 px-4">
        <article className="overflow-hidden rounded-[24px] border border-cocoa-100 bg-white shadow-soft">
          {activeOrder ? (
            <>
              <div className="bg-[linear-gradient(135deg,#fffbea_0%,#dff3d2_100%)] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase text-orange-700">Pesanan aktif</p>
                    <h2 className="mt-2 text-2xl font-black leading-tight text-cocoa-900">{activeOrder.eventName}</h2>
                    <p className="mt-1 text-sm font-semibold text-cocoa-600">
                      {activeOrder.menuName} • {activeOrder.portions} porsi • {formatDate(activeOrder.eventDate)}
                    </p>
                  </div>
                  <StatusBadge status={activeOrder.status} />
                </div>

                <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full bg-sage-600" style={{ width: `${statusProgress(activeOrder.status)}%` }} />
                </div>
                <p className="mt-2 text-xs font-bold text-cocoa-500">Status tersinkron dari seller</p>
              </div>

              <div className="grid gap-3 p-4">
                <Link
                  className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-cocoa-800 px-4 text-sm font-black text-white"
                  href={`/buyer/orders/${activeOrder.id}`}
                >
                  Lihat Status Pesanan
                  <ChevronRight size={18} />
                </Link>
                <Link
                  className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-sage-100 bg-sage-50 px-4 text-sm font-black text-sage-800"
                  href={`/buyer/orders/${activeOrder.id}/depart`}
                >
                  <Truck size={18} />
                  Pantau Departure Gate
                </Link>
              </div>
            </>
          ) : (
            <div className="p-5 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-cocoa-900 text-white">
                <PackagePlus size={25} />
              </div>
              <p className="mt-4 text-xs font-black uppercase text-orange-700">Belum ada pesanan</p>
              <h2 className="mt-2 text-2xl font-black text-cocoa-900">Mulai pesan catering</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-cocoa-500">
                Setelah form dikirim, pesanan akan muncul di dashboard seller dan daftar pesananmu.
              </p>
            </div>
          )}
        </article>
      </section>

      <section className="mt-6 px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-normal text-cocoa-900">Pesanan Saya</h2>
          <Link className="text-xs font-black text-orange-700" href="/buyer/orders">
            Lihat Semua
          </Link>
        </div>

        <div className="mt-3 grid gap-3">
          {secondaryOrders.length ? secondaryOrders.map((order) => (
            <Link
              className="flex items-center justify-between gap-3 rounded-2xl border border-cocoa-100 bg-white p-4 shadow-sm"
              href={`/buyer/orders/${order.id}`}
              key={order.id}
            >
              <div className="min-w-0">
                <h3 className="truncate font-black text-cocoa-900">{order.eventName}</h3>
                <p className="mt-1 text-xs font-semibold text-cocoa-500">{formatDate(order.eventDate)} • {order.deliveryTime} WIB</p>
              </div>
              <StatusBadge status={order.status} />
            </Link>
          )) : (
            <p className="rounded-2xl border border-cocoa-100 bg-white p-4 text-sm font-semibold leading-6 text-cocoa-500 shadow-sm">
              Pesanan yang kamu buat akan muncul otomatis di sini.
            </p>
          )}
        </div>
      </section>

      {activeOrder ? (
        <section className="mt-6 px-4">
          <article className="rounded-2xl border border-sage-100 bg-sage-50 p-4">
            <p className="flex items-center gap-2 text-sm font-black text-cocoa-900">
              <Clock3 size={17} />
              Estimasi terbaru
            </p>
            <p className="mt-2 text-sm leading-6 text-cocoa-600">
              Pesanan {activeOrder.eventName} diperkirakan sampai <strong>{activeOrder.estimatedArrival}</strong>.
            </p>
          </article>
        </section>
      ) : null}

      {activeOrder ? (
        <section className="mt-6 px-4">
          <Link
            className="flex items-center justify-between rounded-2xl border border-cocoa-100 bg-white p-4 text-sm font-bold text-cocoa-700 shadow-sm"
            href={`/buyer/orders/${activeOrder.id}/confirm`}
          >
            <span className="flex items-center gap-2">
              <PackageCheck size={18} />
              Konfirmasi pesanan tiba
            </span>
            <ChevronRight size={18} />
          </Link>
        </section>
      ) : null}
    </>
  );
}
