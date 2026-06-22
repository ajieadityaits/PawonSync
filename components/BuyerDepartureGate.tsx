"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, MapPin, Navigation, Store, Truck } from "lucide-react";
import { MobileAppShell } from "@/components/MobileAppShell";
import { statusMeta, type Order, type OrderStatus } from "@/lib/data";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

type RealtimeOrderRow = {
  status?: OrderStatus;
  estimated_arrival?: string | null;
};

export function BuyerDepartureGate({ initialOrder }: { initialOrder: Order }) {
  const [order, setOrder] = useState(initialOrder);
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
      .channel(`buyer-departure-gate-${initialOrder.id}`)
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
    <MobileAppShell hideBottomNav showBack title="Departure Gate">
      <section className="min-h-[calc(100vh-64px)] bg-cocoa-900/80 px-5 pt-12">
        <article className="rounded-3xl bg-white p-6 text-center shadow-soft">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-cocoa-900 text-cocoa-900">
            {isDeparted ? <Truck size={31} /> : <Clock3 size={31} />}
          </div>
          <p className="mt-5 text-xs font-black uppercase text-orange-700">Status Kurir</p>
          <h1 className="mt-1 text-lg font-black uppercase text-cocoa-900">
            {isDeparted ? "Kurir Sudah Berangkat" : "Menunggu Seller Berangkat"}
          </h1>
          <p className="mt-2 text-xs font-semibold leading-5 text-cocoa-500">
            {order.eventName} dari {order.cateringName}. Halaman ini akan berubah saat seller mengaktifkan departure gate.
          </p>

          <div className="mt-5 grid gap-3 rounded-2xl bg-cream-50 p-4 text-left text-xs font-semibold text-cocoa-600">
            <p className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 shrink-0 text-cocoa-900" size={17} />
              Status: <strong>{statusMeta[order.status].label}</strong>
            </p>
            <p className="flex items-start gap-2">
              <Clock3 className="mt-0.5 shrink-0 text-cocoa-900" size={17} />
              ETA: {order.estimatedArrival}
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 shrink-0 text-cocoa-900" size={17} />
              Tujuan: {order.venueAddress}
            </p>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-cocoa-100 bg-[linear-gradient(135deg,#f4fbef_0%,#fffbea_52%,#dff3d2_100%)] p-4 text-left">
            <div className="relative h-44">
              <div className="absolute left-8 top-8 grid h-12 w-12 place-items-center rounded-2xl bg-cocoa-900 text-white shadow-soft">
                <Store size={21} />
              </div>
              <div className="absolute right-7 bottom-8 grid h-12 w-12 place-items-center rounded-2xl bg-orange-soft text-cocoa-900 shadow-soft">
                <MapPin size={22} />
              </div>
              <div className="absolute left-[72px] right-[70px] top-[82px] h-1 rounded-full bg-cocoa-200">
                <div className={isDeparted ? "h-full w-2/3 rounded-full bg-cocoa-900" : "h-full w-1/4 rounded-full bg-cocoa-400"} />
              </div>
              <div className={isDeparted ? "absolute left-[55%] top-[67px] grid h-9 w-9 place-items-center rounded-full bg-cocoa-900 text-white shadow-soft" : "absolute left-[28%] top-[67px] grid h-9 w-9 place-items-center rounded-full bg-cocoa-700 text-white shadow-soft"}>
                {isDeparted ? <Truck size={18} /> : <Navigation size={17} />}
              </div>
              <div className="absolute left-0 top-24 max-w-[120px] text-xs font-black text-cocoa-900">
                Pawon Lestari
                <span className="block text-[10px] font-semibold text-cocoa-500">Dapur seller</span>
              </div>
              <div className="absolute bottom-0 right-0 max-w-[150px] text-right text-xs font-black text-cocoa-900">
                Venue buyer
                <span className="block text-[10px] font-semibold text-cocoa-500">Tujuan pengiriman</span>
              </div>
            </div>
          </div>

          <Link
            className="mt-6 flex h-12 items-center justify-center rounded-2xl bg-cocoa-900 px-4 text-sm font-black uppercase text-white"
            href={`/buyer/orders/${order.id}`}
          >
            Kembali ke Tracking
          </Link>
        </article>
      </section>
    </MobileAppShell>
  );
}
