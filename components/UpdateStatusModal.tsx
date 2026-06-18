"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { orderStatuses, statusMeta, type OrderStatus } from "@/lib/data";
import { Button } from "./Button";
import { StatusBadge } from "./StatusBadge";

export function UpdateStatusModal({ currentStatus }: { currentStatus: OrderStatus }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<OrderStatus>(currentStatus);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Ubah Status Pesanan</Button>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-end bg-cocoa-950/40 p-0 backdrop-blur-sm sm:place-items-center sm:p-4">
          <div className="w-full max-w-lg rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-orange-700">Update Status</p>
                <h2 className="mt-1 text-xl font-black text-cocoa-900">Ubah status pesanan</h2>
                <p className="mt-1 text-sm text-cocoa-500">Pilih progress terakhir agar buyer melihat informasi terbaru.</p>
              </div>
              <button
                aria-label="Tutup modal"
                className="rounded-lg px-3 py-2 text-sm font-bold text-cocoa-500 hover:bg-cream-100"
                onClick={() => setOpen(false)}
              >
                Tutup
              </button>
            </div>

            <div className="mt-5 grid gap-2">
              {orderStatuses.map((status) => (
                <button
                  className="flex items-center justify-between rounded-xl border border-cocoa-100 p-3 text-left transition hover:bg-cream-100"
                  key={status}
                  onClick={() => setSelected(status)}
                >
                  <span>
                    <StatusBadge status={status} />
                    <span className="mt-2 block text-sm text-cocoa-500">{statusMeta[status].description}</span>
                  </span>
                  {selected === status ? <CheckCircle2 className="text-sage-700" size={22} /> : null}
                </button>
              ))}
            </div>

            <div className="mt-5 flex gap-2">
              <Button className="flex-1" onClick={() => setOpen(false)}>
                Simpan Perubahan
              </Button>
              <Button className="flex-1" onClick={() => setOpen(false)} variant="ghost">
                Batal
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
