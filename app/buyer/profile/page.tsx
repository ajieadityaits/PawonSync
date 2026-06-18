import { Bell, CircleHelp, ShieldCheck, UserRound } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SignOutButton } from "@/components/SignOutButton";
import { buyerProfile } from "@/lib/data";

export default function BuyerProfilePage() {
  return (
    <AppShell role="buyer">
      <header>
        <p className="text-sm font-black uppercase text-orange-700">Profil</p>
        <h1 className="mt-1 text-3xl font-black text-cocoa-900">Akun buyer</h1>
      </header>

      <section className="mt-6 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-xl border border-cocoa-100 bg-white p-6 text-center shadow-soft">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-2xl bg-sage-700 text-white">
            <UserRound size={42} />
          </div>
          <h2 className="mt-4 text-2xl font-black text-cocoa-900">{buyerProfile.fullName}</h2>
          <p className="mt-1 font-semibold text-cocoa-500">{buyerProfile.email}</p>
          <span className="mt-4 inline-flex rounded-full bg-sage-50 px-4 py-1 text-sm font-black text-sage-800">
            Role pengguna: {buyerProfile.role}
          </span>
        </div>
        <div className="rounded-xl border border-cocoa-100 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-black text-cocoa-900">Informasi akun</h2>
          <div className="mt-5 grid gap-3">
            {[
              ["Nama pengguna", buyerProfile.fullName],
              ["Email / No. HP", buyerProfile.email],
              ["No. HP", buyerProfile.phone],
              ["Role pengguna", buyerProfile.role],
            ].map(([label, value]) => (
              <div className="rounded-lg bg-cream-50 p-4" key={label}>
                <p className="text-xs font-black uppercase text-cocoa-400">{label}</p>
                <p className="mt-1 font-semibold text-cocoa-900">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, label: "Pengaturan akun" },
              { icon: Bell, label: "Notifikasi" },
              { icon: CircleHelp, label: "Bantuan" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button className="flex items-center gap-2 rounded-lg border border-cocoa-100 bg-white p-3 text-sm font-bold text-cocoa-700 hover:bg-cream-50" key={item.label}>
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="mt-5">
            <SignOutButton />
          </div>
        </div>
      </section>
    </AppShell>
  );
}
