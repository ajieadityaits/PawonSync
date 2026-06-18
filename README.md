# PawonSync

Prototype HI-FI web app manajemen pemesanan katering untuk Seller dan Buyer.

Tagline: **Ketengan dari Dapur hingga Venue**

## Tech Stack

- Next.js App Router
- Tailwind CSS
- Supabase Auth dan Database
- Lucide React icons

## Cara Menjalankan

```bash
npm install
npm run dev
```

Buka:

```text
http://localhost:3000
```

## Supabase

1. Salin `.env.example` menjadi `.env.local`.
2. Isi:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

3. Jalankan SQL di `supabase/schema.sql` pada Supabase SQL Editor.

Jika env Supabase belum diisi, login/register tetap berjalan sebagai mode demo prototype dan mengarahkan user sesuai role.

Register akun memakai Supabase Auth. Setelah SQL schema dijalankan, trigger `on_auth_user_created` otomatis menyalin data register ke tabel `public.profiles`.

## Route Utama

- `/` Landing page
- `/login` Pilih role
- `/login/seller` Login Seller
- `/login/buyer` Login Buyer
- `/register` Register Seller/Buyer
- `/seller/dashboard` Dashboard Seller
- `/seller/orders` Daftar pesanan Seller
- `/seller/orders/new` Tambah pesanan
- `/seller/orders/ord-1` Detail dan update status pesanan
- `/seller/menu` Kelola menu
- `/seller/schedule` Jadwal pengiriman
- `/seller/profile` Profil Seller
- `/buyer/dashboard` Dashboard Buyer
- `/buyer/orders/ord-1` Monitoring pesanan Buyer
- `/buyer/history` Riwayat pesanan
- `/buyer/help` Bantuan
- `/buyer/profile` Profil Buyer

## Data Prototype

Data dummy berada di `lib/data.ts`, termasuk:

- Seller: Pawon Lestari, Ibu Rani
- Buyer: Diana
- Pesanan contoh: Diana, Budi, Rina
- Menu contoh: Nasi Box Ayam Bakar, Paket Prasmanan Hemat, Snack Box Premium
