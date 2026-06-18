"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Info, Minus, Plus } from "lucide-react";
import { type Order } from "@/lib/data";
import { updateOrderToNextStatus } from "@/lib/orders";

export function PackagingCounter({
  order,
  initialPacked,
  note,
}: {
  order: Order;
  initialPacked: number;
  note: string;
}) {
  const router = useRouter();
  const [packed, setPacked] = useState(initialPacked);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const progress = Math.round((packed / order.portions) * 100);

  function decreasePacked() {
    setPacked((current) => Math.max(0, current - 1));
  }

  function increasePacked() {
    setPacked((current) => Math.min(order.portions, current + 1));
  }

  async function handleFinish() {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await updateOrderToNextStatus(order.id, order.status);
      router.push(`/seller/orders/${order.id}/update?sent=1`);
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Update pengemasan gagal dikirim.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <section className="mt-6 border-y border-cocoa-100 px-4 py-5">
        <h2 className="text-xs font-black uppercase text-cocoa-500">Progress Pengemasan</h2>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-cocoa-100">
          <div className="h-full rounded-full bg-cocoa-900" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-right text-sm font-black text-cocoa-900">
          {packed} / {order.portions} kotak
        </p>
      </section>

      <section className="mt-7 px-4">
        <h2 className="text-xs font-black uppercase text-cocoa-500">Counter Kotak</h2>
        <div className="mt-6 grid grid-cols-[56px_1fr_56px] items-center gap-3">
          <button
            aria-label="Kurangi jumlah kotak"
            className="grid h-12 w-12 place-items-center rounded-full border border-cocoa-900 bg-white text-cocoa-900 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={packed <= 0}
            onClick={decreasePacked}
            type="button"
          >
            <Minus size={22} />
          </button>
          <p className="text-center text-6xl font-black text-cocoa-900">{packed}</p>
          <button
            aria-label="Tambah jumlah kotak"
            className="grid h-12 w-12 place-items-center rounded-full border border-cocoa-900 bg-white text-cocoa-900 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={packed >= order.portions}
            onClick={increasePacked}
            type="button"
          >
            <Plus size={22} />
          </button>
        </div>
      </section>

      <section className="mt-7 px-4">
        <div className="rounded-xl bg-cocoa-50 p-4 text-xs font-semibold leading-5 text-cocoa-600">
          <p className="flex items-start gap-2">
            <Info className="mt-0.5 shrink-0" size={16} />
            {note}
          </p>
        </div>
      </section>

      {errorMessage ? (
        <section className="mt-5 px-4">
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{errorMessage}</p>
        </section>
      ) : null}

      <section className="fixed inset-x-0 bottom-0 z-20 bg-cream-50 px-4 pb-5 pt-3 lg:left-1/2 lg:w-[430px] lg:-translate-x-1/2">
        <button
          className="flex h-12 w-full items-center justify-center rounded-2xl bg-cocoa-900 px-4 text-xs font-black uppercase text-white shadow-soft disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          onClick={handleFinish}
          type="button"
        >
          {isSubmitting ? "Mengirim..." : "Selesai Kemas — Kirim Update"}
        </button>
      </section>
    </>
  );
}
