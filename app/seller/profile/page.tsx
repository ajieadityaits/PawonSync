import { Bell, CircleHelp, ShieldCheck, Store } from "lucide-react";
import { MobileAppShell } from "@/components/MobileAppShell";
import { SignOutButton } from "@/components/SignOutButton";
import { sellerProfile } from "@/lib/data";

export default function SellerProfilePage() {
  return (
    <MobileAppShell role="seller" title="Profil Seller">
      <section className="px-4 pt-5">
        <article className="rounded-3xl border border-cocoa-100 bg-white p-6 text-center shadow-soft">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-cocoa-900 text-white">
            <Store size={36} />
          </div>
          <h2 className="mt-4 text-2xl font-black text-cocoa-900">{sellerProfile.cateringName}</h2>
          <p className="mt-1 font-semibold text-cocoa-500">{sellerProfile.ownerName}</p>
          <span className="mt-4 inline-flex rounded-full bg-orange-soft px-4 py-1 text-xs font-black uppercase text-cocoa-900">
            {sellerProfile.role}
          </span>
        </article>
      </section>

      <section className="mt-5 px-4">
        <div className="divide-y divide-cocoa-100 rounded-2xl bg-white px-4 shadow-sm">
          {[
            ["Email", sellerProfile.email],
            ["No. HP", sellerProfile.phone],
            ["Nama katering", sellerProfile.cateringName],
            ["Nama pemilik", sellerProfile.ownerName],
          ].map(([label, value]) => (
            <div className="py-4" key={label}>
              <p className="text-xs font-black uppercase text-cocoa-400">{label}</p>
              <p className="mt-1 font-semibold text-cocoa-900">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 grid gap-3 px-4">
        {[
          { icon: ShieldCheck, label: "Pengaturan akun" },
          { icon: Bell, label: "Notifikasi" },
          { icon: CircleHelp, label: "Bantuan" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              className="flex h-12 items-center gap-3 rounded-2xl border border-cocoa-100 bg-white px-4 text-sm font-black text-cocoa-700 shadow-sm"
              key={item.label}
              type="button"
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
        <SignOutButton />
      </section>
    </MobileAppShell>
  );
}
