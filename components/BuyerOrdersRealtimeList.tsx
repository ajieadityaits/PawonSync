"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, Trash2, Truck } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { type Order } from "@/lib/data";
import { deleteOrder, mapDbOrder, orderFields, type DbOrder } from "@/lib/orders";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { formatDate } from "@/lib/utils";

function sortOrders(orders: Order[]) {
  return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function BuyerOrdersRealtimeList({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(() => sortOrders(initialOrders));
  const [deletingId, setDeletingId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const activeOrders = orders.filter((order) => order.status !== "selesai");
  const historyOrders = orders.filter((order) => order.status === "selesai");

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    async function fetchOrders() {
      const { data, error } = await supabase.from("orders").select(orderFields).order("created_at", { ascending: false });
      if (!error) setOrders(sortOrders((data ?? []).map((row) => mapDbOrder(row as DbOrder))));
    }

    const channel = supabase
      .channel("buyer-orders-page")
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

  async function handleDeleteHistory(order: Order) {
    const confirmed = window.confirm(`Hapus riwayat pesanan "${order.eventName}"?`);
    if (!confirmed) return;

    setErrorMessage("");
    setDeletingId(order.id);

    try {
      await deleteOrder(order.id);
      setOrders((current) => current.filter((item) => item.id !== order.id));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Riwayat pesanan gagal dihapus.");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <>
      <section className="px-4 pt-5">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cocoa-300" size={19} />
          <input
            className="h-12 w-full rounded-2xl border border-cocoa-100 bg-white pl-12 pr-4 text-sm font-semibold text-cocoa-900 shadow-sm outline-none transition placeholder:text-cocoa-300 focus:border-cocoa-400 focus:ring-4 focus:ring-orange-100"
            placeholder="Cari pesanan..."
            type="search"
          />
        </label>

        <div className="mt-4 rounded-2xl border border-sage-100 bg-sage-50 p-4 text-xs font-semibold leading-5 text-sage-800">
          Pesanan baru dibuat dari Beranda. Halaman ini akan ikut berubah saat buyer membuat pesanan atau seller memperbarui status.
        </div>
      </section>

      <section className="mt-6 px-4">
        <h2 className="text-xs font-black uppercase text-cocoa-500">Pesanan Aktif</h2>
        <div className="mt-3 grid gap-3">
          {activeOrders.length ? activeOrders.map((order) => (
            <article
              className="rounded-2xl border border-cocoa-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
              key={order.id}
            >
              <Link className="block" href={`/buyer/orders/${order.id}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-black text-cocoa-900">{order.eventName}</h3>
                    <p className="mt-1 text-xs font-semibold leading-5 text-cocoa-500">
                      {order.cateringName} • {order.menuName} • {order.portions} porsi
                      <br />
                      Antar jam {order.deliveryTime} • {formatDate(order.eventDate)}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              </Link>
              <Link
                className="mt-3 flex h-10 items-center justify-center gap-2 rounded-xl border border-sage-100 bg-sage-50 text-xs font-black text-sage-800"
                href={`/buyer/orders/${order.id}/depart`}
              >
                <Truck size={15} />
                Departure Gate
              </Link>
            </article>
          )) : (
            <p className="rounded-2xl border border-cocoa-100 bg-white p-4 text-sm font-semibold text-cocoa-500 shadow-sm">
              Belum ada pesanan aktif dari database.
            </p>
          )}
        </div>
      </section>

      <section className="mt-7 px-4">
        <h2 className="text-xs font-black uppercase text-cocoa-500">Riwayat</h2>
        {errorMessage ? (
          <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {errorMessage}
          </p>
        ) : null}
        <div className="mt-3 grid gap-3">
          {historyOrders.length ? historyOrders.map((order) => (
            <article className="rounded-2xl border border-cocoa-100 bg-white/75 p-4 shadow-sm" key={order.id}>
              <Link className="block" href={`/buyer/orders/${order.id}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black text-cocoa-800">{order.eventName}</h3>
                    <p className="mt-1 text-xs font-semibold text-cocoa-500">{order.portions} porsi • {formatDate(order.eventDate)}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              </Link>
              <button
                className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-xs font-black text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={deletingId === order.id}
                onClick={() => void handleDeleteHistory(order)}
                type="button"
              >
                <Trash2 size={15} />
                {deletingId === order.id ? "Menghapus..." : "Hapus Riwayat"}
              </button>
            </article>
          )) : (
            <p className="rounded-2xl border border-cocoa-100 bg-white/75 p-4 text-sm font-semibold text-cocoa-500 shadow-sm">
              Riwayat pesanan selesai akan muncul di sini.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
