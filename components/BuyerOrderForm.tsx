"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { buyerProfile, menus } from "@/lib/data";
import { createBuyerOrder } from "@/lib/orders";

export function BuyerOrderForm({ defaultMenu }: { defaultMenu?: string }) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const portions = Number(formData.get("portions"));

    try {
      if (!Number.isFinite(portions) || portions < 1) {
        throw new Error("Jumlah porsi harus lebih dari 0.");
      }

      const order = await createBuyerOrder({
        eventName: String(formData.get("eventName") ?? ""),
        buyerName: String(formData.get("buyerName") ?? ""),
        buyerPhone: String(formData.get("buyerPhone") ?? ""),
        menuName: String(formData.get("menuName") ?? ""),
        portions,
        eventDate: String(formData.get("eventDate") ?? ""),
        deliveryTime: String(formData.get("deliveryTime") ?? ""),
        venueAddress: String(formData.get("venueAddress") ?? ""),
        notes: String(formData.get("notes") ?? ""),
      });

      router.push(`/buyer/orders/${order.id}`);
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Pesanan gagal disimpan.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <Input label="Nama acara" name="eventName" placeholder="Contoh: Wisuda Kampus" required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input defaultValue={buyerProfile.fullName} label="Nama buyer" name="buyerName" placeholder="Nama pemesan" required />
        <Input defaultValue={buyerProfile.phone} label="No. HP buyer" name="buyerPhone" placeholder="081234567890" required />
      </div>

      <label className="grid gap-2 text-sm font-semibold text-cocoa-800">
        Menu
        <select
          className="h-12 rounded-lg border border-cocoa-100 bg-white px-4 text-sm text-cocoa-900 shadow-sm outline-none transition focus:border-cocoa-400 focus:ring-4 focus:ring-orange-100"
          defaultValue={defaultMenu}
          name="menuName"
          required
        >
          {menus.filter((menu) => menu.isActive).map((menu) => (
            <option key={menu.id} value={menu.name}>
              {menu.name}
            </option>
          ))}
          <option value="Menu custom">Menu custom</option>
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Jumlah porsi" min={1} name="portions" placeholder="50" required type="number" />
        <Input label="Tanggal acara" name="eventDate" required type="date" />
        <Input label="Jam pengiriman" name="deliveryTime" required type="time" />
      </div>

      <Input label="Alamat/venue" name="venueAddress" placeholder="Gedung Serbaguna, Surabaya" required />

      <label className="grid gap-2 text-sm font-semibold text-cocoa-800">
        Catatan khusus
        <textarea
          className="min-h-28 rounded-lg border border-cocoa-100 bg-white px-4 py-3 text-sm text-cocoa-900 outline-none transition placeholder:text-cocoa-300 focus:border-cocoa-400 focus:ring-4 focus:ring-orange-100"
          name="notes"
          placeholder="Contoh: sambal dipisah, tidak pedas, tambah sendok."
        />
      </label>

      {errorMessage ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{errorMessage}</p>
      ) : null}

      <div className="grid gap-2 pb-4">
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Menyimpan..." : "Simpan Pesanan"}
        </Button>
        <Button href="/buyer/orders" variant="ghost">
          Batal
        </Button>
      </div>
    </form>
  );
}
