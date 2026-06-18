# Flow Prototype Mobile PawonSync

Dokumen ini merangkum flow HI-FI mobile berdasarkan lo-fi buyer yang diterapkan ke project PawonSync.

## Entry Flow

1. Splash / pilih role: `/login`
2. Login Seller: `/login/seller`
3. Login Buyer: `/login/buyer`
4. Register: `/register`

## Buyer Main Flow

1. Buyer masuk dari `/login/buyer`.
2. Setelah login, buyer diarahkan ke `/buyer/dashboard`.
3. Buyer melihat pesanan aktif `Wisuda ITS`.
4. Buyer tap `Lihat Status Pesanan`.
5. Sistem membuka `/buyer/orders/ord-1`.
6. Buyer membaca status X-Ray, estimasi kedatangan, dan opsi bantuan.

## Buyer Detail Flow

1. Dari detail pesanan, buyer tap area foto progres.
2. Sistem membuka `/buyer/orders/ord-1/photo`.
3. Buyer melihat foto dari seller dan daftar tahap foto.
4. Buyer tap `Kembali ke Status Pesanan`.

## Notification Flow

1. Buyer tap ikon notifikasi di dashboard atau menu bawah `Notifikasi`.
2. Sistem membuka `/buyer/notifications`.
3. Buyer melihat pembaruan pesanan hari ini dan kemarin.

## Contact Seller Flow

1. Buyer membuka `/buyer/orders/ord-1`.
2. Buyer tap `Hubungi Seller`.
3. Sistem membuka `/buyer/orders/ord-1/contact`.
4. Buyer memilih `Telepon` atau `Chat di Aplikasi`.

## Arrival and Review Flow

1. Buyer membuka detail pesanan.
2. Buyer tap `Konfirmasi Pesanan Tiba`.
3. Sistem membuka modal konfirmasi di `/buyer/orders/ord-1/confirm`.
4. Buyer tap `Konfirmasi & Beri Ulasan`.
5. Sistem membuka `/buyer/orders/ord-1/review`.
6. Buyer memilih rating, ketepatan waktu, kualitas porsi, dan komentar.
7. Buyer tap `Kirim Ulasan`.
8. Sistem membuka `/buyer/orders/ord-1/review/success`.
9. Buyer tap `Kembali ke Beranda`.

## Bottom Navigation Buyer

- Beranda: `/buyer/dashboard`
- Pesanan: `/buyer/orders`
- Notifikasi: `/buyer/notifications`
- Profil: `/buyer/profile`

## Skenario User Testing Singkat

1. Minta user login sebagai Buyer.
2. Minta user mencari status pesanan `Wisuda ITS`.
3. Minta user membuka foto progres seller.
4. Minta user mengecek estimasi kedatangan.
5. Minta user mencari cara menghubungi seller.
6. Minta user melakukan konfirmasi pesanan tiba dan mengirim ulasan.

