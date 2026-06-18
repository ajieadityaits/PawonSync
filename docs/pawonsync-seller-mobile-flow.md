# PawonSync Seller Mobile Flow

Dokumen ini dipakai untuk uji coba hi-fi prototype Seller versi mobile.

## Tujuan Flow

Seller dapat memantau pesanan aktif, mengirim update progress ke buyer, menghitung kebutuhan dapur, memastikan jumlah kemasan, dan mengonfirmasi kurir berangkat.

## Flow Utama Seller

1. Buka `/login`
2. Pilih `Masuk sebagai Seller`
3. Login dengan data demo apa saja
4. Masuk ke `/seller/dashboard`
5. Buka pesanan terbaru `Wisuda ITS`
6. Cek detail pesanan dan timeline progress X-Ray
7. Tap `Kirim Update Sekarang`
8. Pilih milestone aktif
9. Tap `Kirim Update ke Buyer`
10. Sistem menampilkan konfirmasi `Update Terkirim`
11. Kembali ke detail pesanan
12. Buka `Checklist Pengemasan` jika pesanan sedang dikemas
13. Hitung jumlah kotak dengan counter
14. Tap `Selesai Kemas - Kirim Update`
15. Untuk pesanan siap berangkat, tap `Buka Departure Gate`
16. Sistem menampilkan konfirmasi `Kurir Berangkat`

## Flow Dapur

1. Dari bottom nav Seller, buka tab `Dapur`
2. Pilih pesanan aktif, misalnya `Wisuda ITS - 150 porsi`
3. Lihat `Dummy Plate`
4. Cek standar bahan per 1 porsi
5. Tap `Lihat Total Bahan`
6. Cek total bahan untuk jumlah porsi
7. Tap `Simpan ke Catatan` atau kembali ke detail pesanan

## Hal yang Dicek Saat User Testing

- Seller paham pesanan mana yang perlu diprioritaskan.
- Seller bisa menemukan tombol update progress.
- Timeline X-Ray mudah dipahami.
- Form update milestone terasa jelas dan tidak terlalu panjang.
- Checklist pengemasan membantu menghitung jumlah kotak.
- Dummy plate dan kalkulasi bahan membantu kerja dapur.
- Bottom nav Seller mudah dipakai dengan satu tangan.

## Rute Prototype

- `/seller/dashboard`
- `/seller/orders`
- `/seller/orders/ord-1`
- `/seller/orders/ord-1/update`
- `/seller/orders/ord-1/packaging`
- `/seller/orders/ord-3/depart`
- `/seller/kitchen`
- `/seller/kitchen/ord-1/plate`
- `/seller/kitchen/ord-1/ingredients`

Diagram flow tersedia di `docs/pawonsync-seller-flow.html`.
