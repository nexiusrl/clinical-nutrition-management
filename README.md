# Jurnal Asuhan Gizi Klinis (Clinical Nutrition Management Ledger)

Aplikasi asuhan gizi klinis mandiri terintegrasi Next.js (App Router), Tailwind CSS v4, Supabase (Cloud Sync), dan FatSecret API (Pencarian Jurnal Makanan Real-Time). 

Aplikasi ini menggunakan pendekatan **Clinical Editorial / Neo-Sanatorium Passport** untuk antarmuka pengguna yang terinspirasi dari buku rekam medis fisik, lembar data biokimia, dan paspor rekam medis sanatorium klasik.

---

## ✨ Fitur Utama

1. **Otorisasi Akun Pasien & Rujukan Diet**: Registrasi akun pasen dan pilihan regimen gizi utama secara langsung (`General Wellness`, `Chronic Kidney Disease (CKD)`, `Hypertension DASH Diet`, atau `Gout & Asam Urat`).
2. **Pencarian Jurnal Makanan Real-Time (FatSecret)**: Debounced food search query calling `/api/foods/search` dan pencarian gram porsi detail via `/api/foods/get`.
3. **Penyelarasan Data Awan Hibrida (Supabase)**: Data profil kesehatan, log makanan harian, histori berat badan, log hidrasi, lab biokimia, dan checklist harian disinkronkan secara real-time.
4. **Resiliensi Luring (Offline-First)**: Jika kredensial API atau koneksi database awan tidak tersedia, aplikasi secara otomatis beralih ke **Secure Local Storage Sandbox** dengan indikator badge yang dinamis (`Cloud Sync: Aktif` / `Offline: Lokal`).
5. **Jurnal Laboratorium Biokimia**: Kalkulasi status klinis otomatis untuk Asam Urat, Kreatinin, Ureum, Kalium, Natrium, dan Fosfor berdasarkan ambang batas batas gender pasien.

---

## 🛠️ Tech Stack & Spesifikasi

- **Framework**: Next.js 16.2.6 (App Router)
- **Library Rendering**: React 19.2.4
- **Styling**: Tailwind CSS v4
- **Database / Auth**: Supabase JS Client (^2.106.1)
- **API Makanan**: Platform FatSecret REST API
- **Icon Set**: Lucide Icons
- **Tipografi**: 
  - *Plus Jakarta Sans* untuk clinical tables, data log, input, dan UI text.
  - *Newsreader* (Serif) untuk tajuk utama medis dan teks editorial klinis.

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Prasyarat & Instalasi
Kloning repositori ini dan instal semua dependensi:
```bash
npm install
```

### 2. Konfigurasi Lingkungan (`.env.local`)
Buat berkas `.env.local` di direktori utama proyek Anda berdasarkan template `.env.example`:
```env
# Supabase Project settings (Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# FatSecret API Credentials (platform.fatsecret.com)
FATSECRET_CLIENT_ID=your-fatsecret-client-id
FATSECRET_CLIENT_SECRET=your-fatsecret-client-secret
```

### 3. Inisialisasi Database
Jalankan isi SQL dari berkas `supabase_schema.sql` di SQL Editor pada Dashboard Supabase Anda untuk membuat tabel:
- `profiles` (data antropometri & target gizi)
- `meals` (log asupan makanan harian)
- `weight_history` (histori berat badan jangka panjang)
- `fluids` (tracker volume air harian)
- `checklists` ( checklist kebiasaan gizi harian)
- `labs` (kadar biokimia laboratorium)

### 4. Jalankan Development Server
Jalankan dev server secara lokal:
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 🔬 Verifikasi Kode & Produksi

Verifikasi sintaksis dan routing Next.js sebelum build:
- **Typecheck**: `npx tsc --noEmit`
- **Lint**: `npm run lint`
- **Production Build**: `npm run build`
