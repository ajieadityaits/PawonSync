import { PackagePlus } from "lucide-react";
import { BuyerOrderForm } from "@/components/BuyerOrderForm";
import { MobileAppShell } from "@/components/MobileAppShell";

export default function BuyerAddOrderPage() {
  return (
    <MobileAppShell showBack title="Tambah Pesanan">
      <section className="px-4 pt-5">
        <div className="rounded-2xl border border-cocoa-100 bg-white p-4 shadow-sm">
          <p className="flex items-center gap-2 text-xs font-black uppercase text-orange-700">
            <PackagePlus size={16} />
            Form pesanan baru
          </p>
          <h1 className="mt-2 text-2xl font-black leading-tight text-cocoa-900">Pesan katering</h1>
          <p className="mt-2 text-sm font-semibold leading-6 text-cocoa-500">
            Isi detail acara, menu, jadwal antar, dan catatan khusus untuk seller.
          </p>
        </div>
      </section>

      <section className="mt-5 px-4">
        <BuyerOrderForm />
      </section>
    </MobileAppShell>
  );
}
