# Planning: Perubahan Role Sistem & Halaman Master Data Admin
**Aplikasi:** ThyroScan — Klasifikasi Tiroid  
**Tanggal:** 21 Juni 2026  
**Status:** 📋 Draft — Menunggu Persetujuan

---

## Latar Belakang

Saat ini sistem hanya memiliki satu role fungsional yaitu **dokter**, yang merangkap semua tanggung jawab mulai dari melakukan prediksi hingga mengelola pengguna. Perubahan ini bertujuan memisahkan tanggung jawab menjadi dua role yang lebih terstruktur:

| Role Lama | Role Baru | Tanggung Jawab |
|---|---|---|
| `dokter` | `user` | Melakukan prediksi, melihat riwayat pribadi |
| `dokter` (admin panel) | `admin` | Mengelola pengguna, data master, laporan sistem |

---

## Ringkasan Perubahan

### 1. Sistem Role
- Kolom `role` pada tabel `profiles` di Supabase diubah dari nilai `'dokter'` menjadi `'user'` atau `'admin'`
- Middleware Next.js diperbarui untuk membaca role dari tabel `profiles` dan melakukan redirect berbasis role
- Route `/dashboard/users` dikunci khusus untuk `admin`

### 2. Fitur per Role

#### 👤 Role: `user` (Pengguna / Dokter / Tenaga Medis)
| Fitur | Akses |
|---|---|
| Dashboard / Beranda | ✅ |
| Prediksi Baru | ✅ |
| Riwayat Prediksi (milik sendiri) | ✅ |
| Manajemen Pengguna | ❌ |
| Master Data | ❌ |
| Laporan Sistem | ❌ |

#### 🛡️ Role: `admin` (Administrator)
| Fitur | Akses |
|---|---|
| Dashboard / Beranda | ✅ |
| Prediksi Baru | ✅ |
| Riwayat Prediksi (semua pengguna) | ✅ |
| Manajemen Pengguna | ✅ |
| **Master Data** | ✅ (Baru) |
| Laporan Sistem | ✅ |

### 3. Halaman Master Data (Admin Only)
Halaman baru di `/dashboard/master-data` dengan sub-section:
- **Tab 1 — Manajemen Pengguna** — CRUD user, ubah role
- **Tab 2 — Data Referensi Pemeriksaan** — nilai normal TSH, T3, T4, dll
- **Tab 3 — Konfigurasi Model** — versi & akurasi model XGBoost aktif

---

## Detail Perubahan per File

---

### 🗄️ Database (Supabase)

#### [MODIFY] Tabel `profiles`
```sql
-- Ubah constraint nilai role
ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles 
  ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('user', 'admin'));

-- Migrate data lama: set semua 'dokter' menjadi 'user'
UPDATE profiles SET role = 'user' WHERE role = 'dokter' OR role IS NULL;

-- Jadikan satu akun sebagai admin (ganti dengan email/id yang sesuai)
UPDATE profiles SET role = 'admin' WHERE email = 'admin@example.com';
```

#### [MODIFY] Row Level Security (RLS) Policies
```sql
-- Policy: user hanya bisa lihat riwayat milik sendiri
CREATE POLICY "user_see_own_history" ON pemeriksaan
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Policy: hanya admin yang bisa akses tabel profiles semua user
CREATE POLICY "admin_manage_profiles" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

---

### 🔒 Middleware & Auth

#### [MODIFY] `lib/supabase/middleware.ts`
Tambahkan logika baca role dari `profiles` dan guard berbasis role:

```typescript
// Setelah mendapatkan user, fetch role-nya dari profiles
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single()

const role = profile?.role ?? 'user'

// Guard: hanya admin yang boleh akses /dashboard/users dan /dashboard/master-data
if (
  role !== 'admin' &&
  (request.nextUrl.pathname.startsWith('/dashboard/users') ||
   request.nextUrl.pathname.startsWith('/dashboard/master-data'))
) {
  const url = request.nextUrl.clone()
  url.pathname = '/dashboard'
  return NextResponse.redirect(url)
}
```

---

### 🧩 Components

#### [MODIFY] `components/sidebar.tsx`
Sidebar dinamis berdasarkan role user yang sedang login:

```typescript
// Navigasi user biasa:
const userNavigation = [
  { name: 'Beranda', href: '/dashboard', icon: DashboardCircleIcon },
  { name: 'Prediksi Baru', href: '/dashboard/predict', icon: MedicalFileIcon },
  { name: 'Riwayat Medis', href: '/dashboard/history', icon: Database01Icon },
]

// Navigasi tambahan admin:
const adminNavigation = [
  ...userNavigation,
  { name: 'Manajemen Pengguna', href: '/dashboard/users', icon: UserGroupIcon },
  { name: 'Master Data', href: '/dashboard/master-data', icon: Folder01Icon },
]
```

**Strategi:**  
`dashboard/layout.tsx` (Server Component) fetch role → pass sebagai prop ke `<Sidebar role={role} />`

#### [MODIFY] `components/header.tsx`
- Tampilkan badge role (`👤 User` atau `🛡️ Admin`) di area header kanan

---

### 📄 Pages & Routes

#### [MODIFY] `app/dashboard/layout.tsx`
Ubah menjadi async Server Component untuk fetch role dari database:

```typescript
export default async function DashboardLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, email')
    .eq('id', user?.id)
    .single()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar role={profile?.role ?? 'user'} userProfile={profile} />
      {/* ... */}
    </div>
  )
}
```

#### [MODIFY] `app/dashboard/users/page.tsx`
- Tambahkan server-side guard role check
- Perbaiki fitur: tambah user, ubah role, nonaktifkan akun (functional)
- Tampilkan badge `admin` / `user` yang dibedakan warna

#### [NEW] `app/dashboard/master-data/page.tsx`
Halaman master data untuk admin dengan tab-based layout:

**Tab 1: Manajemen Pengguna**
- Tabel semua user (`profiles`)
- Kolom: Nama, Email, Role, Status, Tanggal Daftar, Aksi
- Aksi: Ubah Role (user ↔ admin), Nonaktifkan/Aktifkan

**Tab 2: Data Referensi Pemeriksaan**
- Tabel referensi nilai normal pemeriksaan tiroid (TSH, T3, T4, FT4, dll)
- CRUD: tambah, edit, hapus referensi nilai

**Tab 3: Konfigurasi Model**
- Info versi model XGBoost yang aktif
- Tanggal training terakhir
- Akurasi model (read-only display)

#### [NEW] `app/dashboard/master-data/layout.tsx`
Guard tambahan di server: jika role bukan `admin`, redirect ke `/dashboard`

---

### ⚙️ Server Actions

#### [MODIFY] `app/actions/user-actions.ts`
Tambahkan fungsi baru:

```typescript
// Fungsi mengubah role pengguna (admin only)
export async function changeUserRole(userId: string, newRole: 'user' | 'admin') { ... }

// Fungsi mengambil profil user yang sedang login (untuk sidebar)
export async function getCurrentUserProfile() { ... }
```

#### [NEW] `app/actions/master-data-actions.ts`
Server actions khusus master data:

```typescript
export async function getReferenceValues() { ... }
export async function upsertReferenceValue(data: ReferenceValueInput) { ... }
export async function deleteReferenceValue(id: string) { ... }
export async function getModelConfig() { ... }
```

---

## Diagram Alur Role

```
Login
  └─ Fetch role dari tabel profiles
       │
       ├─ role = 'user'
       │     ├─ ✅ Dashboard
       │     ├─ ✅ Prediksi Baru
       │     ├─ ✅ Riwayat (milik sendiri)
       │     ├─ ❌ /dashboard/users       → redirect ke /dashboard
       │     └─ ❌ /dashboard/master-data → redirect ke /dashboard
       │
       └─ role = 'admin'
             ├─ ✅ Dashboard
             ├─ ✅ Prediksi Baru
             ├─ ✅ Riwayat (semua user)
             ├─ ✅ /dashboard/users
             └─ ✅ /dashboard/master-data
                     ├─ Tab 1: Manajemen User
                     ├─ Tab 2: Data Referensi Pemeriksaan
                     └─ Tab 3: Konfigurasi Model
```

---

## Urutan Pengerjaan

- [ ] **Step 1 — Database**
  - [ ] Migrasi kolom `role` di tabel `profiles` (`dokter` → `user`)
  - [ ] Update RLS policies di Supabase
  - [ ] Set akun admin di tabel `profiles`

- [ ] **Step 2 — Middleware & Route Guard**
  - [ ] Update `lib/supabase/middleware.ts` untuk baca role dan guard admin routes
  - [ ] Tambah guard di `app/dashboard/master-data/layout.tsx`

- [ ] **Step 3 — Layout & Sidebar Dinamis**
  - [ ] Ubah `app/dashboard/layout.tsx` menjadi async Server Component
  - [ ] Update `components/sidebar.tsx` untuk menerima prop `role`

- [ ] **Step 4 — Server Actions**
  - [ ] Update `user-actions.ts` (tambah `changeUserRole`, `getCurrentUserProfile`)
  - [ ] Buat `master-data-actions.ts`

- [ ] **Step 5 — Halaman Master Data**
  - [ ] Buat `app/dashboard/master-data/page.tsx` dengan layout tab
  - [ ] Implementasi Tab 1: Manajemen User
  - [ ] Implementasi Tab 2: Data Referensi Pemeriksaan
  - [ ] Implementasi Tab 3: Konfigurasi Model

- [ ] **Step 6 — Update Halaman Users**
  - [ ] Perbaiki `app/dashboard/users/page.tsx` dengan fitur lengkap + badge role baru

- [ ] **Step 7 — Verifikasi & Testing**
  - [ ] Test login sebagai `user`: tidak bisa akses admin routes
  - [ ] Test login sebagai `admin`: semua fitur admin dapat diakses
  - [ ] Cek sidebar tampil sesuai role masing-masing

---

## Pertanyaan Terbuka

> **[PENTING]** Apakah halaman `/dashboard/users` akan dipindahkan ke dalam `/dashboard/master-data` sebagai Tab 1, atau tetap sebagai halaman terpisah?

> **[SARAN]** Disarankan menempatkan Manajemen Pengguna sebagai Tab 1 di Master Data agar admin panel lebih terpusat. Route `/dashboard/users` bisa redirect ke `/dashboard/master-data`.

> **[CATATAN]** Apakah pengguna baru yang mendaftar otomatis mendapat role `user`? Pastikan ada `DEFAULT 'user'` pada kolom `role` di tabel `profiles`.
