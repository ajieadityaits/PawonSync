import Image from "next/image";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { menus } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default function SellerMenuPage() {
  return (
    <AppShell role="seller">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-orange-700">Kelola Menu</p>
          <h1 className="mt-1 text-3xl font-black text-cocoa-900">Menu katering</h1>
          <p className="mt-2 text-cocoa-500">Tambah, edit, hapus, dan aktifkan menu yang bisa dipesan buyer.</p>
        </div>
        <Button icon={<Plus size={18} />}>Tambah Menu</Button>
      </header>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        {menus.map((menu) => (
          <article className="overflow-hidden rounded-xl border border-cocoa-100 bg-white shadow-soft" key={menu.id}>
            <div className="relative h-44 w-full">
              <Image alt={menu.name} className="object-cover" fill sizes="(min-width: 1024px) 33vw, 100vw" src={menu.imageUrl} />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-black text-cocoa-900">{menu.name}</h2>
                <span className={menu.isActive ? "rounded-full bg-sage-50 px-3 py-1 text-xs font-black text-sage-700" : "rounded-full bg-cocoa-50 px-3 py-1 text-xs font-black text-cocoa-500"}>
                  {menu.isActive ? "Aktif" : "Nonaktif"}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-cocoa-500">{menu.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-cream-50 p-3">
                <div>
                  <p className="text-xs font-black uppercase text-cocoa-400">Harga per porsi</p>
                  <p className="mt-1 font-black text-cocoa-900">{formatCurrency(menu.price)}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-cocoa-400">Minimal order</p>
                  <p className="mt-1 font-black text-cocoa-900">{menu.minimumOrder} porsi</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <Button size="sm" variant="ghost" icon={<Edit3 size={16} />}>
                  Edit
                </Button>
                <Button size="sm" variant="secondary">
                  {menu.isActive ? "Nonaktif" : "Aktifkan"}
                </Button>
                <Button size="sm" variant="danger" icon={<Trash2 size={16} />}>
                  Hapus
                </Button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
