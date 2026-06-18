import type { OrderStatus } from "./data";
import { orderStatuses } from "./data";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function statusProgress(status: OrderStatus) {
  const index = orderStatuses.indexOf(status);
  return Math.max(0, Math.round(((index + 1) / orderStatuses.length) * 100));
}
