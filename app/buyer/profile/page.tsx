import Link from "next/link";
import { Bell, ChevronRight, CircleHelp, ClipboardList, ShieldCheck, UserRound } from "lucide-react";
import { MobileAppShell } from "@/components/MobileAppShell";
import { SignOutButton } from "@/components/SignOutButton";
import { buyerProfile } from "@/lib/data";

const profileLinks = [
  {
    href: "/buyer/orders",
    icon: ClipboardList,
    label: "Pesanan Saya",
    description: "Pantau pesanan aktif dan riwayat catering.",
  },
  {
    href: "/buyer/notifications",
    icon: Bell,
    label: "Notifikasi",
    description: "Lihat update dari seller dan departure gate.",
  },
  {
    href: "/buyer/help",
    icon: CircleHelp,
    label: "Bantuan",
    description: "Kontak bantuan saat ada kendala pesanan.",
  },
];

export default function BuyerProfilePage() {
  return (
    <MobileAppShell role="buyer" title="Profil Buyer">
      <section className="px-4 pt-5">
        <article className="overflow-hidden rounded-3xl border border-cocoa-100 bg-white shadow-soft">
          <div className="bg-[linear-gradient(135deg,#274326_0%,#5db94b_62%,#ffd43b_100%)] px-5 pb-12 pt-6 text-white">
            <p className="text-xs font-black uppercase text-white/75">Akun pembeli</p>
            <h2 className="mt-2 text-2xl font-black">{buyerProfile.fullName}</h2>
            <p className="mt-1 text-sm font-semibold text-white/80">{buyerProfile.email}</p>
          </div>

          <div className="-mt-9 px-5 pb-5">
            <div className="flex items-end justify-between gap-4">
              <div className="grid h-20 w-20 place-items-center rounded-3xl border-4 border-white bg-cocoa-900 text-white shadow-sm">
                <UserRound size={36} />
              </div>
              <span className="mb-2 rounded-full bg-sage-50 px-4 py-1 text-xs font-black uppercase text-sage-800 ring-1 ring-sage-100">
                {buyerProfile.role}
              </span>
            </div>
            <p className="mt-4 text-sm font-semibold leading-6 text-cocoa-500">
              Profil ini dipakai untuk membuat pesanan catering, menerima notifikasi seller, dan memantau status
              pengiriman.
            </p>
          </div>
        </article>
      </section>

      <section className="mt-5 px-4">
        <div className="divide-y divide-cocoa-100 rounded-2xl bg-white px-4 shadow-sm">
          {[
            ["Nama lengkap", buyerProfile.fullName],
            ["Email", buyerProfile.email],
            ["No. HP", buyerProfile.phone],
            ["Role pengguna", buyerProfile.role],
          ].map(([label, value]) => (
            <div className="py-4" key={label}>
              <p className="text-xs font-black uppercase text-cocoa-400">{label}</p>
              <p className="mt-1 font-semibold text-cocoa-900">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 grid gap-3 px-4">
        <button
          className="flex min-h-14 items-center gap-3 rounded-2xl border border-cocoa-100 bg-white px-4 text-left text-sm font-black text-cocoa-700 shadow-sm"
          type="button"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cream-100 text-cocoa-800">
            <ShieldCheck size={18} />
          </span>
          <span>
            <span className="block">Pengaturan akun</span>
            <span className="mt-0.5 block text-xs font-semibold text-cocoa-500">Data akun prototype buyer</span>
          </span>
        </button>

        {profileLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              className="flex min-h-16 items-center gap-3 rounded-2xl border border-cocoa-100 bg-white px-4 text-cocoa-700 shadow-sm"
              href={item.href}
              key={item.href}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sage-50 text-sage-800">
                <Icon size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-black text-cocoa-800">{item.label}</span>
                <span className="mt-0.5 block text-xs font-semibold leading-5 text-cocoa-500">{item.description}</span>
              </span>
              <ChevronRight className="shrink-0 text-cocoa-300" size={18} />
            </Link>
          );
        })}

        <SignOutButton className="mt-1 w-full rounded-2xl" />
      </section>
    </MobileAppShell>
  );
}
