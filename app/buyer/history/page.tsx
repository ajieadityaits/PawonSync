import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { StatusBadge } from "@/components/StatusBadge";
import { getOrders } from "@/lib/orders";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BuyerHistoryPage() {
  const orders = await getOrders();
  const historyOrders = orders.filter((order) => order.status === "selesai");

  return (
    <AppShell role="buyer">
      <header>
        <p className="text-sm font-black uppercase text-orange-700">Riwayat</p>
        <h1 className="mt-1 text-3xl font-black text-cocoa-900">Riwayat pesanan buyer</h1>
        <p className="mt-2 text-cocoa-500">Daftar pesanan sebelumnya dan status akhirnya.</p>
      </header>

      <section className="mt-6 grid gap-4">
        {historyOrders.length ? historyOrders.map((order) => (
          <article className="rounded-xl border border-cocoa-100 bg-white p-4 shadow-soft" key={order.id}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-black text-cocoa-900">{order.cateringName}</h2>
                <p className="mt-1 font-semibold text-cocoa-700">{order.menuName}</p>
                <p className="mt-1 text-sm text-cocoa-500">Tanggal pesanan: {formatDate(order.createdAt)}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="mt-4 flex justify-end">
              <Button href={`/buyer/orders/${order.id}`} size="sm" variant="ghost">
                Lihat Detail
              </Button>
            </div>
          </article>
        )) : (
          <article className="rounded-xl border border-cocoa-100 bg-white p-5 text-sm font-semibold text-cocoa-500 shadow-soft">
            Pesanan yang sudah selesai akan masuk ke riwayat ini.
          </article>
        )}
      </section>
    </AppShell>
  );
}
