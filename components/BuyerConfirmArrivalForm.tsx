"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { type Order } from "@/lib/data";
import { completeBuyerOrder } from "@/lib/orders";

export function BuyerConfirmArrivalForm({ order }: { order: Order }) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleConfirm() {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      if (order.status !== "selesai") {
        await completeBuyerOrder(order.id);
      }

      router.push(`/buyer/orders/${order.id}/review`);
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Konfirmasi pesanan gagal disimpan.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-7 grid gap-3">
      {errorMessage ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-left text-sm font-semibold text-red-700">
          {errorMessage}
        </p>
      ) : null}
      <button
        className="flex h-12 items-center justify-center rounded-2xl bg-cocoa-800 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        onClick={handleConfirm}
        type="button"
      >
        {isSubmitting ? "Menyimpan..." : "Konfirmasi & Beri Ulasan"}
      </button>
      <Link
        className="flex h-12 items-center justify-center rounded-2xl border border-cocoa-100 bg-white text-sm font-black text-cocoa-900"
        href={`/buyer/orders/${order.id}`}
      >
        Nanti Saja
      </Link>
    </div>
  );
}
