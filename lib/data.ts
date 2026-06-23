import {
  Bell,
  CalendarDays,
  ClipboardList,
  CookingPot,
  Home,
  LayoutDashboard,
  PackageCheck,
  PackagePlus,
  Settings,
  Soup,
  Truck,
  UserRound,
  Utensils,
} from "lucide-react";

export type UserRole = "seller" | "buyer";

export type OrderStatus =
  | "pesanan_masuk"
  | "diproses"
  | "dimasak"
  | "dikemas"
  | "dikirim"
  | "selesai";

export type Order = {
  id: string;
  sellerId: string;
  buyerId: string;
  eventName: string;
  buyerName: string;
  buyerPhone: string;
  cateringName: string;
  menuName: string;
  portions: number;
  eventDate: string;
  deliveryTime: string;
  venueAddress: string;
  notes: string;
  status: OrderStatus;
  estimatedArrival: string;
  createdAt: string;
};

export type ProgressPhoto = {
  id: string;
  orderId: string;
  title: string;
  stage: string;
  time: string;
  imageUrl: string;
  isAvailable: boolean;
};

export type BuyerNotification = {
  id: string;
  orderId?: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  createdAt?: string;
};

export type MenuIngredient = {
  item: string;
  quantity: number;
  unit: string;
};

export type MenuPortionGuide = {
  item: string;
  amount: string;
};

export type MenuItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  minimumOrder: number;
  imageUrl: string;
  plateImageUrl: string;
  prepTime: string;
  dailyNote: string;
  ingredients: MenuIngredient[];
  portionGuide: MenuPortionGuide[];
  isActive: boolean;
};

export const sellerProfile = {
  id: "seller-1",
  cateringName: "Pawon Lestari",
  ownerName: "Naomy",
  email: "pawonlestari@email.com",
  phone: "081298765432",
  role: "Seller",
};

export const buyerProfile = {
  id: "buyer-1",
  fullName: "Diana",
  email: "diana@email.com",
  phone: "081234567890",
  role: "Buyer",
};

export const orderStatuses: OrderStatus[] = [
  "pesanan_masuk",
  "diproses",
  "dimasak",
  "dikemas",
  "dikirim",
  "selesai",
];

export const statusMeta: Record<
  OrderStatus,
  { label: string; shortLabel: string; tone: string; dot: string; description: string }
> = {
  pesanan_masuk: {
    label: "Pesanan Masuk",
    shortLabel: "Baru",
    tone: "bg-orange-50 text-orange-700 ring-orange-200",
    dot: "bg-orange-500",
    description: "Pesanan diterima oleh seller katering.",
  },
  diproses: {
    label: "Diproses",
    shortLabel: "Diproses",
    tone: "bg-amber-50 text-amber-800 ring-amber-200",
    dot: "bg-amber-500",
    description: "Detail pesanan sedang dicek dan disiapkan.",
  },
  dimasak: {
    label: "Sedang Dimasak",
    shortLabel: "Dimasak",
    tone: "bg-yellow-50 text-yellow-800 ring-yellow-200",
    dot: "bg-yellow-500",
    description: "Tim dapur sedang memasak menu pesanan.",
  },
  dikemas: {
    label: "Dikemas",
    shortLabel: "Dikemas",
    tone: "bg-sky-50 text-sky-700 ring-sky-200",
    dot: "bg-sky-500",
    description: "Pesanan sedang dikemas sebelum dikirim.",
  },
  dikirim: {
    label: "Dikirim",
    shortLabel: "Dikirim",
    tone: "bg-sage-50 text-sage-800 ring-sage-200",
    dot: "bg-sage-600",
    description: "Pesanan sedang dalam perjalanan ke venue.",
  },
  selesai: {
    label: "Selesai",
    shortLabel: "Selesai",
    tone: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-600",
    description: "Pesanan sudah diterima buyer.",
  },
};

export const sellerNavItems = [
  { label: "Dashboard", href: "/seller/dashboard", icon: LayoutDashboard },
  { label: "Pesanan", href: "/seller/orders", icon: ClipboardList },
  { label: "Dapur & Menu", href: "/seller/kitchen", icon: Soup },
  { label: "Jadwal", href: "/seller/schedule", icon: CalendarDays },
  { label: "Profil", href: "/seller/profile", icon: UserRound },
];

export const sellerMobileNavItems = [
  { label: "Beranda", href: "/seller/dashboard", icon: Home },
  { label: "Pesanan", href: "/seller/orders", icon: ClipboardList },
  { label: "Dapur & Menu", href: "/seller/kitchen", icon: CookingPot },
  { label: "Profil", href: "/seller/profile", icon: UserRound },
];

export const buyerNavItems = [
  { label: "Beranda", href: "/buyer/dashboard", icon: Home },
  { label: "Pesanan", href: "/buyer/orders", icon: ClipboardList },
  { label: "Notifikasi", href: "/buyer/notifications", icon: Bell },
  { label: "Profil", href: "/buyer/profile", icon: UserRound },
];

export const featureItems = [
  {
    title: "Kelola Pesanan",
    description: "Catat buyer, menu, porsi, alamat venue, dan catatan khusus dalam satu dashboard.",
    icon: PackagePlus,
  },
  {
    title: "Update Status Pesanan",
    description: "Seller bisa memperbarui status dari pesanan masuk sampai selesai secara jelas.",
    icon: Settings,
  },
  {
    title: "Pantau Pesanan",
    description: "Buyer melihat progress pesanan tanpa perlu bertanya manual berkali-kali.",
    icon: ClipboardList,
  },
  {
    title: "Riwayat Pesanan",
    description: "Pesanan sebelumnya tersimpan rapi untuk evaluasi dan pemesanan ulang.",
    icon: PackageCheck,
  },
  {
    title: "Jadwal Pengiriman",
    description: "Seller dapat melihat daftar pengiriman harian berdasarkan jam dan lokasi.",
    icon: Truck,
  },
];

export const orders: Order[] = [
  {
    id: "ord-1",
    sellerId: "seller-1",
    buyerId: "buyer-1",
    eventName: "Wisuda ITS",
    buyerName: "Diana",
    buyerPhone: "081234567890",
    cateringName: "Pawon Lestari",
    menuName: "Nasi Box Ayam Bakar",
    portions: 150,
    eventDate: "2026-06-12",
    deliveryTime: "11:00",
    venueAddress: "Gedung Serbaguna Melati, Surabaya",
    notes: "Sambal dipisah, tambah sendok dan tisu.",
    status: "dimasak",
    estimatedArrival: "11:00 WIB",
    createdAt: "2026-06-18",
  },
  {
    id: "ord-2",
    sellerId: "seller-1",
    buyerId: "buyer-2",
    eventName: "Arisan RT 05",
    buyerName: "Budi",
    buyerPhone: "081245670123",
    cateringName: "Pawon Lestari",
    menuName: "Paket Prasmanan Hemat",
    portions: 50,
    eventDate: "2026-06-15",
    deliveryTime: "12:30",
    venueAddress: "Aula Kampus A, Malang",
    notes: "Siapkan label menu dan perlengkapan prasmanan.",
    status: "dikemas",
    estimatedArrival: "13.00 WIB",
    createdAt: "2026-06-18",
  },
  {
    id: "ord-3",
    sellerId: "seller-1",
    buyerId: "buyer-3",
    eventName: "Seminar FEB",
    buyerName: "Rina",
    buyerPhone: "081377780001",
    cateringName: "Pawon Lestari",
    menuName: "Snack Box Premium",
    portions: 80,
    eventDate: "2026-06-20",
    deliveryTime: "14:30",
    venueAddress: "Kantor Dinas Kesehatan, Sidoarjo",
    notes: "Tidak menggunakan kacang pada kue basah.",
    status: "dikirim",
    estimatedArrival: "15.00 WIB",
    createdAt: "2026-06-18",
  },
  {
    id: "ord-4",
    sellerId: "seller-1",
    buyerId: "buyer-4",
    eventName: "Ulang Tahun Nadia",
    buyerName: "Nadia",
    buyerPhone: "081222331111",
    cateringName: "Pawon Lestari",
    menuName: "Nasi Box Ayam Bakar",
    portions: 35,
    eventDate: "2026-06-21",
    deliveryTime: "09:00",
    venueAddress: "Rumah Acara Keluarga, Gresik",
    notes: "Porsi anak dibuat tidak pedas.",
    status: "pesanan_masuk",
    estimatedArrival: "09.30 WIB",
    createdAt: "2026-06-18",
  },
];

function formatQuantity(value: number) {
  if (!Number.isFinite(value)) return "0";

  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatIngredientAmount(ingredient: MenuIngredient) {
  return `${formatQuantity(ingredient.quantity)} ${ingredient.unit}`.trim();
}

export function buildPortionGuide(ingredients: MenuIngredient[]): MenuPortionGuide[] {
  return ingredients.map((ingredient) => ({
    item: ingredient.item,
    amount: formatIngredientAmount(ingredient),
  }));
}

export function buildIngredientTotals(menu: MenuItem, portions: number) {
  return menu.ingredients.map((ingredient) => ({
    item: ingredient.item,
    amount: `${formatQuantity(ingredient.quantity * portions)} ${ingredient.unit}`.trim(),
  }));
}

const nasiBoxIngredients: MenuIngredient[] = [
  { item: "Nasi", quantity: 200, unit: "g" },
  { item: "Ayam bakar", quantity: 100, unit: "g" },
  { item: "Tumis sayur", quantity: 80, unit: "g" },
  { item: "Sambal", quantity: 20, unit: "g" },
  { item: "Buah", quantity: 1, unit: "cup kecil" },
];

const prasmananIngredients: MenuIngredient[] = [
  { item: "Nasi putih", quantity: 180, unit: "g" },
  { item: "Lauk utama", quantity: 120, unit: "g" },
  { item: "Sayur kuah", quantity: 120, unit: "ml" },
  { item: "Kerupuk", quantity: 2, unit: "pcs" },
  { item: "Air mineral", quantity: 1, unit: "botol" },
];

const snackBoxIngredients: MenuIngredient[] = [
  { item: "Kue basah", quantity: 2, unit: "pcs" },
  { item: "Pastry mini", quantity: 1, unit: "pcs" },
  { item: "Air mineral", quantity: 1, unit: "botol" },
  { item: "Kartu ucapan", quantity: 1, unit: "lembar" },
];

export const menus: MenuItem[] = [
  {
    id: "menu-1",
    name: "Nasi Box Ayam Bakar",
    category: "Nasi Box",
    description: "Nasi, ayam bakar madu, lalapan, sambal, tumis sayur, dan buah.",
    price: 28000,
    minimumOrder: 25,
    imageUrl:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80",
    plateImageUrl:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80",
    prepTime: "90 menit",
    dailyNote: "Cek stok ayam marinasi, lalapan, dan sambal sebelum jam 09.00.",
    ingredients: nasiBoxIngredients,
    portionGuide: buildPortionGuide(nasiBoxIngredients),
    isActive: true,
  },
  {
    id: "menu-2",
    name: "Paket Prasmanan Hemat",
    category: "Prasmanan",
    description: "Paket lengkap untuk acara keluarga, kantor, dan komunitas.",
    price: 45000,
    minimumOrder: 80,
    imageUrl:
      "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=900&q=80",
    plateImageUrl:
      "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=900&q=80",
    prepTime: "150 menit",
    dailyNote: "Pastikan chafing dish, sendok saji, dan label menu sudah siap.",
    ingredients: prasmananIngredients,
    portionGuide: buildPortionGuide(prasmananIngredients),
    isActive: true,
  },
  {
    id: "menu-3",
    name: "Snack Box Premium",
    category: "Snack Box",
    description: "Aneka kue basah, pastry mini, air mineral, dan kartu ucapan.",
    price: 18000,
    minimumOrder: 40,
    imageUrl:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80",
    plateImageUrl:
      "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=900&q=80",
    prepTime: "60 menit",
    dailyNote: "Pisahkan snack basah dan pastry agar tekstur tetap bagus saat dikirim.",
    ingredients: snackBoxIngredients,
    portionGuide: buildPortionGuide(snackBoxIngredients),
    isActive: false,
  },
];

export const sellerDailyBriefs = [
  {
    title: "Stok Dapur",
    value: "Ayam & beras aman",
    helper: "Bahan utama cukup untuk 2 pesanan besar hari ini.",
  },
  {
    title: "Prioritas Packing",
    value: "Menunggu order aktif",
    helper: "Pesanan dari buyer akan menjadi prioritas begitu masuk ke database.",
  },
  {
    title: "Catatan Buyer",
    value: "2 catatan khusus",
    helper: "Ada request sambal dipisah dan alergi kacang.",
  },
];

export const timelineSteps = orderStatuses.map((status) => ({
  status,
  title: statusMeta[status].label,
  description: statusMeta[status].description,
}));

export const buyerTimelineSteps = [
  {
    label: "Pesanan Diterima",
    time: "08.00",
    status: "done",
    helper: "Pawon Lestari menerima pesananmu.",
  },
  {
    label: "Bahan Siap Dimasak",
    time: "09.30",
    status: "done",
    helper: "Bahan utama sudah dicek dapur.",
  },
  {
    label: "Sedang Dimasak",
    time: "10.15",
    status: "current",
    helper: "Sedang berlangsung",
  },
  {
    label: "Dikemas",
    time: "10.30",
    status: "pending",
    helper: "Menunggu konfirmasi seller.",
  },
  {
    label: "Diantar",
    time: "10.40",
    status: "pending",
    helper: "Belum berangkat.",
  },
];

export const progressPhotos: ProgressPhoto[] = [
  {
    id: "photo-1",
    orderId: "ord-1",
    title: "Bahan Siap",
    stage: "Bahan siap dimasak",
    time: "09.30 WIB",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80",
    isAvailable: true,
  },
  {
    id: "photo-2",
    orderId: "ord-1",
    title: "Dikemas",
    stage: "Nasi box sedang dikemas",
    time: "10.15 WIB",
    imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
    isAvailable: true,
  },
  {
    id: "photo-3",
    orderId: "ord-1",
    title: "Diantar",
    stage: "Menunggu foto pengantaran",
    time: "Belum ada",
    imageUrl: "",
    isAvailable: false,
  },
];

export const sellerMilestones = [
  {
    key: "diterima",
    label: "Pesanan diterima",
    helper: "Order masuk dan detail sudah dicek.",
  },
  {
    key: "bahan",
    label: "Bahan siap dimasak",
    helper: "Bahan utama siap masuk dapur.",
  },
  {
    key: "dikemas",
    label: "Sedang dikemas",
    helper: "Kotak sedang dihitung dan disegel.",
  },
  {
    key: "berangkat",
    label: "Siap berangkat",
    helper: "Kurir siap menuju venue.",
  },
];

export const packagingChecklist = {
  orderId: "ord-1",
  packed: 90,
  target: 150,
  remainingNote: "Setiap kali 1 kotak selesai dikemas, tambah + untuk menghitung.",
};

export const kitchenGuide = {
  standards: [
    { item: "Nasi", amount: "200 g" },
    { item: "Ayam goreng", amount: "1 potong (100 g)" },
    { item: "Sayur", amount: "80 g" },
    { item: "Telur", amount: "1 butir" },
  ],
  totals: [
    { item: "Beras", amount: "30 kg" },
    { item: "Ayam", amount: "15 kg" },
    { item: "Sayur", amount: "12 kg" },
    { item: "Telur", amount: "150 butir" },
  ],
};

export function findMenuByName(name: string) {
  return menus.find((menu) => menu.name.toLowerCase() === name.toLowerCase()) ?? menus[0];
}

export function findMenuById(id: string) {
  return menus.find((menu) => menu.id === id);
}

export function getMenuGuideForOrder(order: Pick<Order, "menuName" | "portions">) {
  const menu = findMenuByName(order.menuName);
  return {
    menu,
    standards: menu.portionGuide,
    totals: buildIngredientTotals(menu, order.portions),
  };
}

export const buyerNotifications: BuyerNotification[] = [
  {
    id: "notif-1",
    title: "Pesanan Wisuda ITS diperbarui",
    description: "Seller mengonfirmasi: bahan siap dimasak.",
    time: "10.15 WIB",
    isRead: false,
  },
  {
    id: "notif-2",
    title: "Foto progres baru tersedia",
    description: "Seller mengirim foto tahap pengemasan.",
    time: "11.00 WIB",
    isRead: false,
  },
  {
    id: "notif-3",
    title: "Pesanan Wisuda ITS dikonfirmasi",
    description: "Pawon Lestari menerima pesananmu.",
    time: "08.00 WIB",
    isRead: true,
  },
  {
    id: "notif-4",
    title: "Pesanan Arisan RT 05 dibuat",
    description: "Pesanan untuk 15 Juni 2026 sudah masuk.",
    time: "14 Jun 2026 - 15.30 WIB",
    isRead: true,
  },
];

export const scheduleItems = [
  { time: "10.30", buyer: "Diana", menu: "Nasi Box Ayam Bakar", portions: 50, location: "Surabaya", status: "dimasak" as OrderStatus },
  { time: "12.30", buyer: "Budi", menu: "Paket Prasmanan Hemat", portions: 120, location: "Malang", status: "dikemas" as OrderStatus },
  { time: "14.30", buyer: "Rina", menu: "Snack Box Premium", portions: 80, location: "Sidoarjo", status: "dikirim" as OrderStatus },
];

export const statCards = [
  { label: "Pesanan Baru", value: "6", helper: "2 perlu dicek", icon: ClipboardList },
  { label: "Diproses", value: "9", helper: "Aktif hari ini", icon: CookingPot },
  { label: "Siap Dikirim", value: "3", helper: "Dalam antrean", icon: PackageCheck },
  { label: "Selesai", value: "18", helper: "Minggu ini", icon: Utensils },
];

export function findOrder(id: string) {
  return orders.find((order) => order.id === id) ?? orders[0];
}
