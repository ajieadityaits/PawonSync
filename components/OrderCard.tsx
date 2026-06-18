import { CalendarClock, MapPin, Phone, UsersRound } from "lucide-react";
import type { Order } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { Button } from "./Button";
import { StatusBadge } from "./StatusBadge";

export function OrderCard({
  order,
  role = "seller",
  compact = false,
}: {
  order: Order;
  role?: "seller" | "buyer";
  compact?: boolean;
}) {
  const detailHref = role === "seller" ? `/seller/orders/${order.id}` : `/buyer/orders/${order.id}`;

  return (
    <article className="rounded-xl border border-cocoa-100 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-cocoa-900">{role === "seller" ? order.buyerName : order.cateringName}</h3>
            <StatusBadge status={order.status} />
          </div>
          <p className="mt-1 font-semibold text-cocoa-700">{order.menuName}</p>
          <p className="mt-1 text-sm text-cocoa-500">{order.portions} porsi • Estimasi tiba {order.estimatedArrival}</p>
        </div>
        <Button href={detailHref} size="sm" variant="ghost">
          Detail
        </Button>
      </div>

      {!compact ? (
        <div className="mt-4 grid gap-3 text-sm text-cocoa-600 sm:grid-cols-2">
          <span className="flex items-center gap-2">
            <UsersRound size={16} className="text-cocoa-400" />
            {order.portions} porsi
          </span>
          <span className="flex items-center gap-2">
            <CalendarClock size={16} className="text-cocoa-400" />
            {formatDate(order.eventDate)}, {order.deliveryTime} WIB
          </span>
          <span className="flex items-center gap-2">
            <Phone size={16} className="text-cocoa-400" />
            {role === "seller" ? order.buyerPhone : "081298765432"}
          </span>
          <span className="flex items-center gap-2 sm:col-span-2">
            <MapPin size={16} className="text-cocoa-400" />
            {order.venueAddress}
          </span>
        </div>
      ) : null}
    </article>
  );
}
