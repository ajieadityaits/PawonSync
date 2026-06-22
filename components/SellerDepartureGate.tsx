"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, MapPin, Rocket, Truck } from "lucide-react";
import { type Order } from "@/lib/data";
import { markOrderDeparted } from "@/lib/orders";

export function SellerDepartureGate({ order }: { order: Order }) {
  const router = useRouter();
  const [isDeparted, setIsDeparted] = useState(order.status === "dikirim" || order.status === "selesai");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleDepart() {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await markOrderDeparted(order.id, order.status);
      setIsDeparted(true);
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Departure gate gagal diaktifkan.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-cocoa-900/80 px-5 pt-12">
      <section className="rounded-3xl bg-white p-6 text-center shadow-soft">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-cocoa-900 text-cocoa-900">
          {isDeparted ? <CheckCircle2 size={31} /> : <Rocket size={30} />}
        </div>
        <p className="mt-5 text-xs font-black uppercase text-orange-700">Departure Gate</p>
        <h2 className="mt-1 text-lg font-black uppercase text-cocoa-900">
          {isDeparted ? "Kurir Berangkat" : "Siap Berangkat"}
        </h2>
        <p className="mt-2 text-xs font-semibold leading-5 text-cocoa-500">
          {order.eventName} menuju {order.venueAddress}. Buyer akan melihat status ini dari halaman tracking.
        </p>

        <div className="mt-5 grid gap-3 rounded-2xl bg-cream-50 p-4 text-left text-xs font-semibold text-cocoa-600">
          <p className="flex items-start gap-2">
            <Truck className="mt-0.5 shrink-0 text-cocoa-900" size={17} />
            Status pengiriman: <strong>{isDeparted ? "Dalam perjalanan" : "Menunggu aktivasi seller"}</strong>
          </p>
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 shrink-0 text-cocoa-900" size={17} />
            Tujuan: {order.venueAddress}
          </p>
        </div>

        {errorMessage ? (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-left text-sm font-semibold text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <button
          className="mt-6 flex h-12 w-full items-center justify-center rounded-2xl bg-cocoa-900 px-4 text-sm font-black uppercase text-white disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isDeparted || isSubmitting}
          onClick={handleDepart}
          type="button"
        >
          {isSubmitting ? "Mengaktifkan..." : isDeparted ? "Departure Gate Aktif" : "Aktifkan Departure Gate"}
        </button>
        <Link className="mt-4 block text-xs font-black uppercase text-cocoa-400" href={`/seller/orders/${order.id}`}>
          Kembali ke Detail Pesanan
        </Link>
      </section>
    </div>
  );
}
