"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Camera, Check, Info } from "lucide-react";
import Link from "next/link";
import { MobileAppShell } from "@/components/MobileAppShell";
import { orderStatuses, statusMeta, type Order } from "@/lib/data";
import { nextOrderStatus, updateOrderToNextStatus } from "@/lib/orders";
import { cn } from "@/lib/utils";

export function SellerUpdateStatusForm({ order, sent }: { order: Order; sent?: string }) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nextStatus = nextOrderStatus(order.status);
  const canUpdate = order.status !== "selesai";

  async function handleUpdate() {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await updateOrderToNextStatus(order.id, order.status);
      router.push(`/seller/orders/${order.id}/update?sent=1`);
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Status pesanan gagal diperbarui.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <MobileAppShell role="seller" hideBottomNav showBack title="Kirim Update">
      <section className="px-4 pt-5">
        <div className="rounded-2xl bg-cocoa-50 p-4 text-xs font-semibold leading-5 text-cocoa-600">
          <p className="flex items-start gap-2">
            <Info className="mt-0.5 shrink-0" size={16} />
            Update ini akan mengubah status pesanan dan bisa langsung dipantau oleh buyer.
          </p>
        </div>
      </section>

      <section className="mt-7 px-4">
        <h2 className="text-xs font-black uppercase text-cocoa-500">Status Pesanan</h2>
        <div className="mt-3 grid gap-3">
          {orderStatuses.map((status) => {
            const selected = status === order.status;
            const next = status === nextStatus && canUpdate;
            return (
              <div
                className={cn(
                  "flex min-h-14 items-center gap-3 rounded-xl border px-4 py-3 text-sm font-black uppercase",
                  selected
                    ? "border-cocoa-800 bg-white text-cocoa-900 shadow-sm"
                    : next
                      ? "border-sage-200 bg-sage-50 text-sage-800"
                      : "border-cocoa-100 bg-white/70 text-cocoa-300",
                )}
                key={status}
              >
                <span className={cn("grid h-5 w-5 place-items-center rounded-full border", selected ? "border-cocoa-900 bg-cocoa-900" : "border-cocoa-200")}>
                  {selected ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
                </span>
                <span>
                  {statusMeta[status].label}
                  {next ? <span className="block text-[10px] normal-case text-sage-700">Status berikutnya</span> : null}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-7 px-4">
        <h2 className="text-xs font-black uppercase text-cocoa-500">Foto Bukti (Opsional)</h2>
        <div className="mt-3 grid h-28 place-items-center rounded-xl border border-dashed border-cocoa-200 bg-white text-cocoa-300">
          <div className="text-center text-xs font-black uppercase">
            <Camera className="mx-auto mb-2" size={24} />
            Tambah Foto
          </div>
        </div>
      </section>

      {errorMessage ? (
        <section className="mt-5 px-4">
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{errorMessage}</p>
        </section>
      ) : null}

      <section className="fixed inset-x-0 bottom-0 z-20 grid gap-2 bg-cream-50 px-4 pb-5 pt-3 lg:left-1/2 lg:w-[430px] lg:-translate-x-1/2">
        <button
          className="flex h-12 items-center justify-center rounded-2xl bg-cocoa-800 px-4 text-sm font-black uppercase text-white shadow-soft disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!canUpdate || isSubmitting}
          onClick={handleUpdate}
          type="button"
        >
          {isSubmitting ? "Mengirim..." : canUpdate ? `Ubah ke ${statusMeta[nextStatus].label}` : "Pesanan Selesai"}
        </button>
        <Link
          className="flex h-11 items-center justify-center rounded-2xl border border-cocoa-100 bg-white px-4 text-sm font-black text-cocoa-900 shadow-sm"
          href={`/seller/orders/${order.id}`}
        >
          Kembali
        </Link>
      </section>

      {sent === "1" ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-cocoa-900/55 px-7 backdrop-blur-sm">
          <div className="w-full rounded-2xl bg-white p-7 text-center shadow-soft">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-cocoa-900 text-white">
              <Check size={30} />
            </div>
            <h2 className="mt-5 text-sm font-black uppercase text-cocoa-900">Update Terkirim!</h2>
            <p className="mt-2 text-xs font-semibold leading-5 text-cocoa-500">
              Status pesanan sudah diperbarui dan buyer bisa memantaunya dari halaman detail.
            </p>
            <Link
              className="mt-5 flex h-12 items-center justify-center rounded-xl bg-cocoa-900 px-4 text-xs font-black uppercase text-white"
              href={`/seller/orders/${order.id}`}
            >
              Kembali ke Detail Pesanan
            </Link>
          </div>
        </div>
      ) : null}
    </MobileAppShell>
  );
}
