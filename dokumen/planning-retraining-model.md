# Planning - Re-Training Model

## Objective

Tambahkan fitur **Re-Training Model** pada tab **Model Config** tanpa mengubah fitur yang sudah ada.

---

# ============================
# STEP 1 - BACKEND REFACTOR
# Jalankan STEP ini terlebih dahulu.
# Jangan mengerjakan STEP berikutnya.
# Setelah selesai, hentikan proses dan tunggu instruksi selanjutnya.
# ============================

## Backend

1. Buat endpoint baru:

```
POST /train-model
```

2. Endpoint menerima file CSV (multipart/form-data).

3. Refactor logika training yang saat ini berada pada `preprocessing.ipynb` dan `modeling_xgboost.ipynb` ke dalam file Python baru (`train_model.py`) agar dapat dipanggil oleh Flask API. Jangan mengubah notebook asli, karena notebook tetap digunakan sebagai dokumentasi penelitian.

4. Fungsi `train_model()` harus menjalankan proses:

- Load dataset
- Preprocessing
- Data splitting
- SMOTE
- Training XGBoost
- Evaluasi model
- Simpan model terbaru (`model/model_xgboost_dengan_smote.pkl`)

5. Endpoint mengembalikan response JSON:

```json
{
  "success": true,
  "accuracy": 0.98,
  "precision": 0.98,
  "recall": 0.98,
  "f1_score": 0.98
}
```

6. Endpoint `/predict` harus otomatis menggunakan model terbaru tanpa perubahan cara kerja.

---

# ============================
# STEP 2 - FRONTEND IMPLEMENTATION
# Jalankan STEP ini setelah STEP 1 selesai.
# Jangan mengubah backend yang telah selesai dibuat.
# Setelah selesai, hentikan proses dan tunggu instruksi selanjutnya.
# ============================

## Frontend

Tambahkan fitur pada:

```
Master Data
→ Model Config
```

Jangan membuat menu sidebar baru.

Tambahkan card **Re-Training Model** yang berisi:

- Upload Dataset (.csv)
- Informasi file yang dipilih
- Tombol **Mulai Training**

Saat tombol ditekan:

- Upload dataset ke endpoint `POST /train-model`
- Tampilkan loading selama proses training
- Setelah selesai tampilkan:
  - Accuracy
  - Precision
  - Recall
  - F1 Score
  - Status **Model berhasil diperbarui**

Perbarui informasi model aktif menggunakan hasil training terbaru.

---

# ============================
# STEP 3 - FINAL VALIDATION
# Jalankan STEP ini setelah STEP 2 selesai.
# Pastikan frontend dan backend telah terintegrasi dengan baik.
# ============================

## Rules

- Jangan mengubah layout dashboard.
- Jangan mengubah sidebar.
- Jangan mengubah routing.
- Jangan mengubah halaman lain.
- Jangan mengubah endpoint `/predict`.
- Gunakan Tailwind CSS dan komponen yang sudah ada.
- Implementasikan fitur secara incremental tanpa merusak fitur yang sudah berjalan.