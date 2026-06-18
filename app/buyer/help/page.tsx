import { CircleHelp, MessageCircle, PackageCheck, Phone } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";

export default function BuyerHelpPage() {
  return (
    <AppShell role="buyer">
      <header>
        <p className="text-sm font-black uppercase text-orange-700">Bantuan</p>
        <h1 className="mt-1 text-3xl font-black text-cocoa-900">Pusat bantuan buyer</h1>
        <p className="mt-2 text-cocoa-500">FAQ singkat untuk memantau pesanan dan menghubungi seller.</p>
      </header>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-xl border border-cocoa-100 bg-white p-5 shadow-soft">
          <h2 className="flex items-center gap-2 text-xl font-black text-cocoa-900">
            <CircleHelp size={22} />
            FAQ
          </h2>
          <div className="mt-4 grid gap-3">
            {[
              ["Cara melihat status pesanan", "Buka menu Pesanan, lalu lihat timeline status dari pesanan diterima sampai selesai."],
              ["Cara menghubungi seller", "Tekan tombol Hubungi Seller pada halaman monitoring pesanan."],
              ["Apa arti estimasi tiba?", "Estimasi tiba adalah perkiraan waktu pesanan sampai di venue acara."],
            ].map(([question, answer]) => (
              <article className="rounded-lg bg-cream-50 p-4" key={question}>
                <h3 className="font-black text-cocoa-900">{question}</h3>
                <p className="mt-2 text-sm leading-6 text-cocoa-500">{answer}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="rounded-xl border border-cocoa-100 bg-sage-50 p-5 shadow-soft">
          <PackageCheck className="text-sage-700" size={30} />
          <h2 className="mt-4 text-xl font-black text-cocoa-900">Kontak bantuan</h2>
          <p className="mt-2 text-sm leading-6 text-cocoa-600">
            Jika status pesanan tidak berubah sesuai jadwal, hubungi seller atau tim bantuan PawonSync.
          </p>
          <div className="mt-5 grid gap-2">
            <Button icon={<MessageCircle size={18} />} variant="secondary">
              Hubungi Seller
            </Button>
            <Button icon={<Phone size={18} />} variant="ghost">
              Kontak Bantuan
            </Button>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}
