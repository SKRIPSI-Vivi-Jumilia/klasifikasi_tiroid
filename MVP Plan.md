# Perencanaan Pengembangan MVP - Sistem Informasi Klasifikasi Tiroid

Dokumen ini merinci rencana pengembangan (milestones) yang berfokus pada **pembangunan platform web** (frontend & backend) untuk sistem klasifikasi tiroid. Pengembangan model XGBoost dianggap sebagai komponen eksternal yang akan diintegrasikan.

## 🚀 Ringkasan Proyek
Membangun dashboard medis yang modern, responsif, dan fungsional untuk mengelola data pasien dan menyajikan hasil diagnosis tiroid secara real-time.

---

## 📅 Milestones Pengembangan (Fokus Web)

### Milestone 1: Arsitektur Dasar & Keamanan (Minggu 1)
Membangun fondasi sistem yang aman dan struktur database.
- [x] **Setup Project**: Konfigurasi Next.js (App Router), Tailwind CSS 4, dan integrasi library UI (Shadcn).
- [x] **Database & Auth (Supabase)**:
    - Inisialisasi project Supabase.
    - Implementasi tabel `pasien`, `pemeriksaan`, dan `users` (dengan RLS - Row Level Security).
    - Halaman Login & Proteksi Rute (Middleware).
- [x] **Global Layout**: Sidebar navigasi premium, Header dengan profil user, dan tema (Dark/Light mode).

### Milestone 2: Antarmuka Prediksi & Integrasi API (Minggu 2)
Fokus pada pengalaman pengguna saat menginput data klinis.
- [ ] **Form Input Medis**:
    - Pengembangan form numerik dengan validasi ketat (Zod).
    - Komponen UI untuk input parameter: TSH, T3, TT4, T4U, Umur, Jenis Kelamin.
- [ ] **Integrasi API Klasifikasi**:
    - Pembuatan Server Action untuk memanggil model XGBoost (melalui API eksternal).
    - Implementasi *Skeleton Loading* saat menunggu hasil prediksi.
- [ ] **Display Hasil Diagnosis**:
    - Kartu hasil diagnosis dengan visualisasi *Confidence Level* (Progress bar/Circular).
    - Feedback visual instan (Normal = Hijau, Hiper/Hipo = Oranye/Merah).

### Milestone 3: Manajemen Data Pasien & Riwayat (Minggu 3)
Fokus pada pengelolaan data (CRUD) dan kemudahan pencarian.
- [ ] **Halaman Riwayat (Data Pasien)**:
    - Tabel interaktif menggunakan `@tanstack/react-table`.
    - Fitur **Pencarian** (berdasarkan nama) dan **Filter** (berdasarkan kategori diagnosis).
- [ ] **Manajemen Pemeriksaan (CRUD)**:
    - Fitur Edit data pemeriksaan yang salah input.
    - Fitur Hapus data dengan modal konfirmasi.
- [ ] **Detail Pemeriksaan**: Halaman/Modal khusus untuk melihat riwayat parameter klinis lengkap pasien.

### Milestone 4: Dashboard, Admin & Pelaporan (Minggu 4)
Penyelesaian fitur administrasi dan estetika akhir.
- [ ] **Dashboard Utama (Beranda)**:
    - Visualisasi statistik (Recharts): Jumlah kasus per kategori.
    - Widget ringkasan total data dan edukasi tiroid.
- [ ] **Manajemen User (Admin Panel)**:
    - Halaman daftar pengguna sistem.
    - Modal tambah user baru untuk tenaga medis tambahan.
- [ ] **Fitur Pelaporan**:
    - Optimasi halaman untuk cetak laporan (Print-friendly CSS).
    - Tombol "Cetak Hasil" pada setiap baris data pemeriksaan.

---

## 🛠️ Stack Teknologi (Web Focus)
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4, Shadcn UI, Framer Motion (untuk animasi).
- **Database/Auth**: Supabase (PostgreSQL).
- **Data Fetching**: Server Actions & React Query.
- **Icons**: Hugeicons React.

## 📋 Kriteria Kualitas Web
1. **Aesthetics**: Desain premium dengan micro-animations dan layout yang bersih.
2. **Responsiveness**: Berjalan sempurna di resolusi Desktop, Laptop, dan Tablet.
3. **Speed**: LCP (Largest Contentful Paint) < 2.5 detik.
4. **Security**: Password terenkripsi dan akses data terproteksi per level user.
