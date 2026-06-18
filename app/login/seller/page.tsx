import Link from "next/link";
import { ArrowLeft, Store } from "lucide-react";
import { AuthForm } from "@/components/AuthForm";

export default function LoginSellerPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffbea_0%,#ffef91_100%)] lg:grid lg:place-items-center lg:py-8">
      <section className="min-h-screen w-full bg-cream-50 lg:min-h-[820px] lg:max-w-[430px] lg:overflow-hidden lg:rounded-[28px] lg:border lg:border-cocoa-100 lg:bg-white lg:shadow-soft">
        <header className="flex h-16 items-center justify-between border-b border-cocoa-100 bg-white px-4">
          <Link className="grid h-10 w-10 place-items-center rounded-full text-cocoa-800 hover:bg-cream-100" href="/login">
            <ArrowLeft size={21} />
          </Link>
          <h1 className="text-base font-black text-cocoa-900">Masuk — Seller</h1>
          <div className="h-10 w-10" />
        </header>

        <div className="px-5 py-7">
          <div className="mb-7 rounded-3xl border border-cocoa-100 bg-white p-5 shadow-sm">
            <Store className="text-cocoa-800" size={32} />
            <p className="mt-3 text-sm font-semibold leading-6 text-cocoa-600">
              Kelola status pesanan, menu, dan jadwal pengiriman katering dari satu dashboard.
            </p>
          </div>
          <AuthForm
            registerLabel="Belum punya akun katering? Daftar Sekarang"
            role="seller"
            subtitle="Kelola operasional katering Anda dengan mudah di PawonSync."
            title="Masuk sebagai Seller"
          />
        </div>
      </section>
    </main>
  );
}
