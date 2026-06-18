import Link from "next/link";
import { ChefHat } from "lucide-react";

export default function RoleSelectionPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffbea_0%,#dff3d2_100%)] lg:grid lg:place-items-center lg:py-8">
      <section className="flex min-h-screen w-full flex-col bg-cream-50 px-5 py-8 lg:min-h-[820px] lg:max-w-[430px] lg:rounded-[28px] lg:border lg:border-cocoa-100 lg:bg-white lg:shadow-soft">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="grid h-20 w-20 place-items-center rounded-3xl border border-cocoa-100 bg-white text-cocoa-800 shadow-sm">
            <ChefHat size={38} />
          </div>
          <h1 className="mt-5 text-3xl font-black text-cocoa-900">PawonSync</h1>
          <p className="mt-2 text-sm font-semibold text-cocoa-500">Ketengan dari Dapur hingga Venue</p>
        </div>

        <div className="grid gap-3 pb-7">
          <Link className="flex h-12 items-center justify-center rounded-2xl bg-cocoa-800 px-4 text-sm font-black text-white shadow-soft" href="/login/seller">
            Masuk sebagai Seller
          </Link>
          <Link className="flex h-12 items-center justify-center rounded-2xl border border-cocoa-100 bg-white px-4 text-sm font-black text-cocoa-900 shadow-sm" href="/login/buyer">
            Masuk sebagai Buyer
          </Link>
          <p className="pt-3 text-center text-xs font-semibold text-cocoa-500">
            Belum punya akun?{" "}
            <Link className="font-black text-orange-700" href="/register">
              Daftar
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
