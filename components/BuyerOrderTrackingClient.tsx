"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Camera, CheckCircle2, MessageCircle, PackageCheck, Truck } from "lucide-react";
import { MobileAppShell } from "@/components/MobileAppShell";
import { orderStatuses, statusMeta, type Order, type OrderStatus } from "@/lib/data";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { cn, formatDate } from "@/lib/utils";

type RealtimeOrderRow = {
  status?: OrderStatus;
  estimated_arrival?: string | null;
};

export function BuyerOrderTrackingClient({ initialOrder }: { initialOrder: Order }) {
  const [order, setOrder] = useState(initialOrder);
  const activeIndex = orderStatuses.indexOf(order.status);
  const isDeparted = order.status === "dikirim" || order.status === "selesai";

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    function applyOrderUpdate(row: RealtimeOrderRow | null | undefined) {
      if (!row?.status) return;

      setOrder((current) => ({
        ...current,
        status: row.status ?? current.status,
        estimatedArrival: row.estimated_arrival ?? current.estimatedArrival,
      }));
    }

    async function fetchLatestStatus() {
      const { data, error } = await supabase
        .from("orders")
        .select("status,estimated_arrival")
        .eq("id", initialOrder.id)
        .maybeSingle();

      if (!error) applyOrderUpdate(data as RealtimeOrderRow | null);
    }

    const channel = supabase
      .channel(`buyer-order-xray-${initialOrder.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${initialOrder.id}`,
        },
        (payload) => applyOrderUpdate(payload.new as RealtimeOrderRow),
      )
      .subscribe();

    const pollingId = window.setInterval(fetchLatestStatus, 6000);
    void fetchLatestStatus();

    return () => {
      window.clearInterval(pollingId);
      void supabase.removeChannel(channel);
    };
  }, [initialOrder.id]);

  return (
    <MobileAppShell showBack title="Detail Pesanan">
      <section className="px-4 pt-5">
        <article className="rounded-2xl border border-cocoa-100 bg-white p-4 shadow-sm">
          <h2 className="font-black text-cocoa-900">
            {order.eventName} — {order.cateringName}
          </h2>
          <p className="mt-1 text-sm font-semibold leading-6 text-cocoa-500">
            {order.portions} porsi nasi kotak
            <br />
            {order.venueAddress}, {formatDate(order.eventDate)}, jam {order.deliveryTime}
          </p>
        </article>
      </section>

      <section className="mt-6 border-t border-cocoa-100 px-4 pt-6">
        <h3 className="text-xs font-black uppercase text-cocoa-500">Status Pesanan (X-Ray)</h3>
        <div className="mt-4 space-y-0">
          {orderStatuses.map((status, index) => {
            const done = index < activeIndex;
            const current = index === activeIndex;
            const pending = index > activeIndex;

            return (
              <div className="grid grid-cols-[26px_1fr_auto] gap-3" key={status}>
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "mt-0.5 grid h-4 w-4 place-items-center rounded-full border-2",
                      done || current ? "border-cocoa-900 bg-cocoa-900" : "border-cocoa-200 bg-white",
                    )}
                  >
                    {done ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
                  </span>
                  {index < orderStatuses.length - 1 ? (
                    <span className={cn("h-10 w-px", pending ? "bg-cocoa-100" : "bg-cocoa-900")} />
                  ) : null}
                </div>
                <div className={cn("pb-5", pending ? "text-cocoa-300" : "text-cocoa-900")}>
                  <p className="text-sm font-bold">{statusMeta[status].label}</p>
                  <p className="mt-0.5 text-xs italic text-cocoa-400">
                    {current ? "Status aktif sekarang" : statusMeta[status].description}
                  </p>
                </div>
                <p className={cn("text-xs font-semibold", pending ? "text-cocoa-300" : "text-cocoa-500")}>
                  {index === 0 ? order.deliveryTime : "-"}
                </p>
              </div>
            );
          })}
        </div>

        <Link
          className="mt-1 flex items-center gap-3 rounded-2xl border border-dashed border-cocoa-300 bg-white p-3 text-sm font-semibold text-cocoa-600 transition hover:bg-cream-50"
          href={`/buyer/orders/${order.id}/photo`}
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-cocoa-800 text-white">
            <Camera size={19} />
          </span>
          <span>
            Foto dikirim seller
            <span className="block text-xs font-medium text-cocoa-400">Tap untuk lihat semua foto progres</span>
          </span>
        </Link>
      </section>

      <section className="mt-6 px-4">
        <h3 className="text-xs font-black uppercase text-cocoa-500">Estimasi Kedatangan</h3>
        <article className="mt-3 rounded-2xl border border-cocoa-100 bg-white p-5 text-center shadow-sm">
          <p className="text-3xl font-black text-cocoa-900">{order.estimatedArrival}</p>
          <p className="mt-2 text-xs font-semibold leading-5 text-cocoa-400">
            Estimasi tiba berdasarkan lokasi seller
            <br />
            {isDeparted ? "Kurir sedang menuju venue" : "Belum berangkat"}
          </p>
        </article>
      </section>

      <section className="mt-5 grid gap-3 px-4">
        <Link
          className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-sage-100 bg-sage-50 px-4 text-sm font-black text-sage-800 shadow-sm"
          href={`/buyer/orders/${order.id}/depart`}
        >
          <Truck size={18} />
          Buka Departure Gate
        </Link>
        <Link
          className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-cocoa-100 bg-white px-4 text-sm font-black text-cocoa-900 shadow-sm"
          href={`/buyer/orders/${order.id}/contact`}
        >
          <MessageCircle size={18} />
          Hubungi Seller
        </Link>
        <Link
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-cocoa-800 px-4 text-sm font-black text-white shadow-sm"
          href={`/buyer/orders/${order.id}/confirm`}
        >
          <CheckCircle2 size={18} />
          Konfirmasi Pesanan Tiba
        </Link>
      </section>

      <section className="mt-5 px-4">
        <div className="rounded-2xl border border-sage-100 bg-sage-50 p-4 text-xs font-semibold leading-5 text-sage-800">
          <PackageCheck className="mb-2" size={18} />
          Status akan otomatis diperbarui oleh seller dari dashboard PawonSync. Buyer cukup memantau halaman ini saat user testing.
        </div>
      </section>
    </MobileAppShell>
  );
}
