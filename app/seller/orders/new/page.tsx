import { MobileAppShell } from "@/components/MobileAppShell";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { orderStatuses, statusMeta } from "@/lib/data";

export default function SellerAddOrderPage() {
  return (
    <MobileAppShell role="seller" showBack title="Input Pesanan">
      <section className="px-4 pt-5">
        <p className="text-sm font-black uppercase text-orange-700">Tambah Pesanan</p>
        <h1 className="mt-1 text-2xl font-black text-cocoa-900">Input pesanan katering</h1>
        <p className="mt-2 text-sm font-semibold leading-6 text-cocoa-500">
          Lengkapi informasi buyer, menu, jadwal, dan catatan khusus.
        </p>
      </section>

      <form className="mx-4 mt-5 grid gap-4 rounded-2xl border border-cocoa-100 bg-white p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Nama buyer" placeholder="Diana" />
          <Input label="No. HP buyer" placeholder="081234567890" />
          <Input label="Nama paket/menu" placeholder="Nasi Box Ayam Bakar" />
          <Input label="Jumlah porsi" placeholder="50" type="number" />
          <Input label="Tanggal acara" type="date" />
          <Input label="Jam pengiriman" type="time" />
        </div>
        <Input label="Alamat/venue" placeholder="Gedung Serbaguna Melati, Surabaya" />
        <label className="grid gap-2 text-sm font-semibold text-cocoa-800">
          Catatan khusus
          <textarea
            className="min-h-28 rounded-lg border border-cocoa-100 bg-white px-4 py-3 text-sm text-cocoa-900 outline-none focus:border-cocoa-400 focus:ring-4 focus:ring-orange-100"
            placeholder="Contoh: sambal dipisah, tambah sendok, alergi kacang."
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-cocoa-800">
          Status awal pesanan
          <select className="h-12 rounded-lg border border-cocoa-100 bg-white px-4 text-sm text-cocoa-700 outline-none focus:border-cocoa-400 focus:ring-4 focus:ring-orange-100">
            {orderStatuses.map((status) => (
              <option key={status}>{statusMeta[status].label}</option>
            ))}
          </select>
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="button">Simpan Pesanan</Button>
          <Button href="/seller/orders" variant="ghost">
            Batal
          </Button>
        </div>
      </form>
    </MobileAppShell>
  );
}
