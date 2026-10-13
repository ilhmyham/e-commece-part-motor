# Proyek: E-commerce spare part motor (B2C, solo dev, tujuan belajar)

## Stack
Next.js (App Router), React, TypeScript, Tailwind, shadcn/ui,
Better Auth, Drizzle ORM, PostgreSQL, Zod, React Hook Form. Package manager: pnpm.

## Struktur folder
- src/app/            route: (shop) publik, (account) perlu login, admin/, api/
- src/components/ui/  komponen shadcn (jangan diedit manual kecuali perlu)
- src/components/     komponen fitur (product-card, vehicle-picker, dst.)
- src/db/schema/      skema Drizzle: auth.ts, catalog.ts, commerce.ts
- src/db/seed/        script seed
- src/lib/            auth.ts (server), auth-client.ts, utils.ts
- src/server/queries/ fungsi BACA data
- src/server/actions/ Server Actions (tulis data)
- src/server/services/ logika bisnis (payment, shipping, order)
- src/validators/     skema Zod bersama

## Aturan wajib
- Komponen UI TIDAK boleh query DB langsung; lewat src/server/
- Harga = integer Rupiah (tanpa desimal)
- Order menyimpan SNAPSHOT alamat dan harga produk
- Cart tidak menyimpan harga; harga selalu dari tabel product
- Fitment: tabel product_fitment (product_id, variant_id); jangan pakai kolom teks bebas
- Semua input dari user divalidasi dengan Zod
- Cek role/sesi di server (action/route), bukan hanya di UI
- Webhook pembayaran harus idempotent dan memverifikasi signature

## Batasan
- Jangan ubah src/db/schema/ tanpa saya minta; bila perlu, usulkan dulu
- Jangan install dependency baru tanpa tanya
- Jangan menyentuh file di luar lingkup tugas
- Jangan membaca atau menampilkan isi file .env

## Perintah
- pnpm dev            jalankan app
- pnpm lint           ESLint
- pnpm typecheck      cek TypeScript
- pnpm db:generate    buat migrasi dari perubahan skema
- pnpm db:migrate     terapkan migrasi
- pnpm db:studio      lihat data lewat Drizzle Studio
- pnpm db:seed        isi data awal
- docker compose up -d   jalankan Postgres lokal

## Cara kerja
- Satu tugas per sesi. Selesai, jalankan typecheck dan lint, lalu berhenti dan ringkas.
- Ikuti pola yang sudah ada (contoh: src/server/queries/products.ts) untuk penamaan dan struktur.
- Kode dan nama variabel dalam bahasa Inggris; teks UI dalam bahasa Indonesia.
- Jawaban singkat. Tidak perlu menjelaskan hal dasar kecuali diminta.

## Status
- Selesai: setup proyek, skema + migrasi, seed (113 produk), query katalog di src/server/queries.
- Belum: UI, Better Auth, keranjang, checkout (Midtrans sandbox), admin, gambar produk, "Garasiku".
- Catatan: product_image masih kosong. Variant ID adalah UUID acak tiap seed, jangan di-hardcode.
- Pilihan motor disimpan di URL (?variant=<uuid>).