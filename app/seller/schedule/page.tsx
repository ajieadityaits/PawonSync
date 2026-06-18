import { CalendarDays, Clock, MapPin } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { scheduleItems } from "@/lib/data";

export default function SellerSchedulePage() {
  const dates = Array.from({ length: 14 }, (_, index) => index + 18);

  return (
    <AppShell role="seller">
      <header>
        <p className="text-sm font-black uppercase text-orange-700">Jadwal Pengiriman</p>
        <h1 className="mt-1 text-3xl font-black text-cocoa-900">Kalender pengiriman</h1>
        <p className="mt-2 text-cocoa-500">Pantau jam, buyer, menu, jumlah porsi, lokasi, dan status pengiriman.</p>
      </header>

      <section className="mt-6 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-xl border border-cocoa-100 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-cocoa-900">Juni 2026</h2>
            <CalendarDays className="text-cocoa-500" size={20} />
          </div>
          <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-black text-cocoa-400">
            {["S", "S", "R", "K", "J", "S", "M"].map((day, index) => (
              <span key={`${day}-${index}`}>{day}</span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {dates.map((date) => (
              <button
                className={date === 20 ? "aspect-square rounded-lg bg-cocoa-800 text-sm font-black text-white" : "aspect-square rounded-lg bg-cream-50 text-sm font-bold text-cocoa-700 hover:bg-orange-soft"}
                key={date}
              >
                {date}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-cocoa-100 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-black text-cocoa-900">List jadwal pengiriman hari ini</h2>
          <div className="mt-4 grid gap-3">
            {scheduleItems.map((item) => (
              <article className="rounded-xl bg-cream-50 p-4" key={`${item.time}-${item.buyer}`}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="flex items-center gap-2 font-black text-cocoa-900">
                      <Clock size={17} />
                      {item.time} WIB • {item.buyer}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-cocoa-600">{item.menu} • {item.portions} porsi</p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-cocoa-500">
                      <MapPin size={16} />
                      {item.location}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
