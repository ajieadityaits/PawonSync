import Image from "next/image";
import { ArrowRight, CalendarDays, ChefHat, ClipboardList, PackageCheck, Truck, UsersRound } from "lucide-react";
import { Button } from "@/components/Button";
import { Navbar } from "@/components/Navbar";
import { featureItems } from "@/lib/data";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-cream-50">
      <Navbar />
      <section className="relative isolate overflow-hidden" id="beranda">
        <Image
          alt="Meja katering dengan sajian hangat"
          className="absolute inset-0 h-full w-full object-cover"
          fill
          priority
          sizes="100vw"
          src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1800&q=85"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cocoa-950/82 via-cocoa-900/56 to-cocoa-700/20" />
        <div className="relative mx-auto flex min-h-[82vh] max-w-7xl flex-col justify-center px-4 pb-20 pt-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/14 px-4 py-2 text-sm font-bold ring-1 ring-white/25 backdrop-blur">
              <ChefHat size={18} />
              PawonSync
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Kelola Pesanan Katering Lebih Mudah dengan PawonSync
            </h1>
            <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-cream-100 sm:text-lg">
              Dari dapur hingga venue, PawonSync membantu seller dan buyer memantau pesanan katering secara lebih rapi,
              cepat, dan transparan.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/login/seller" size="lg" variant="secondary" icon={<ArrowRight size={19} />}>
                Masuk sebagai Seller
              </Button>
              <Button href="/login/buyer" size="lg" variant="ghost" icon={<UsersRound size={19} />}>
                Masuk sebagai Buyer
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-12 max-w-7xl px-4 pb-16 sm:px-6 lg:px-8" id="fitur">
        <div className="relative z-10 grid gap-3 rounded-2xl border border-cocoa-100 bg-white p-4 shadow-soft sm:grid-cols-2 lg:grid-cols-5">
          {featureItems.map((feature) => {
            const Icon = feature.icon;
            return (
              <article className="rounded-xl bg-cream-50 p-4" key={feature.title}>
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-sage-100 text-sage-700">
                  <Icon size={20} />
                </div>
                <h2 className="mt-4 font-black text-cocoa-900">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-cocoa-500">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8" id="tentang">
        <div>
          <p className="text-sm font-black uppercase text-orange-700">Manfaat PawonSync</p>
          <h2 className="mt-3 text-3xl font-black text-cocoa-900 sm:text-4xl">
            Satu alur kerja untuk seller katering dan buyer.
          </h2>
          <p className="mt-4 leading-8 text-cocoa-600">
            Seller bisa melihat prioritas pesanan, mengatur menu, dan memperbarui status. Buyer mendapatkan timeline
            yang mudah dipahami, estimasi tiba, serta akses kontak seller tanpa menunggu balasan manual.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: ClipboardList, label: "Pesanan tertata", value: "1 dashboard" },
            { icon: PackageCheck, label: "Status transparan", value: "6 tahapan" },
            { icon: CalendarDays, label: "Jadwal jelas", value: "Per hari" },
            { icon: Truck, label: "Pengiriman", value: "Terpantau" },
            { icon: ChefHat, label: "Menu katering", value: "Aktif/nonaktif" },
            { icon: UsersRound, label: "Role akses", value: "Seller & Buyer" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div className="rounded-xl border border-cocoa-100 bg-white p-5 shadow-soft" key={item.label}>
                <Icon className="text-cocoa-500" size={22} />
                <p className="mt-4 text-2xl font-black text-cocoa-900">{item.value}</p>
                <p className="mt-1 text-sm font-semibold text-cocoa-500">{item.label}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
