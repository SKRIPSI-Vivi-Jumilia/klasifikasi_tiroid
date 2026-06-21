'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type PredictionData = { // Mendefinisikan struktur data yang akan dikirim
  nama_pasien: string
  umur: number
  jenis_kelamin: 'L' | 'P'
  tsh: number
  t3: number
  tt4: number
  fti: number
}

export type PredictionResult = { // Mendefinisikan tipedata hasil prediksi
  diagnosis: string
  confidence: number
  timestamp: string
}

// ======================================================
// FUNGSI PREDIKSI PENYAKIT TIROID
// ======================================================
export async function predictThyroid(data: PredictionData) { // Menerima data pasien
  // Nilai default jika prediksi gagal
  let diagnosis = 'Normal'
  let confidence = 0.95
  const mlApiUrl = process.env.ML_API_URL || 'https://vivijumilia-model-xgboost.hf.space'

  // mengirim data ke API FLASK
  try {
    const response = await fetch(`${mlApiUrl}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        age: data.umur, // Mengirim data umur
        sex: data.jenis_kelamin === 'L' ? 1 : 0, // Mengubah jenis kelamin menjadi 1 atau 0
        TSH: data.tsh,
        T3: data.t3,
        TT4: data.tt4,
        FTI: data.fti,
      }),
    })

    // Jika API mengembalikan error, tampilkan pesan error
    if (!response.ok) {
      const errText = await response.text()
      console.error('Flask API error response:', errText)
      return { error: 'Gagal memproses prediksi dari server Machine Learning' }
    }

    // Mengambil data dari Flask API
    const resData = await response.json()
    if (resData.error) {
      console.error('Model Error response:', resData.error)
      return { error: `Model Error: ${resData.error}` }
    }

    diagnosis = resData.result // menyimpan hasil klasifikasi "Normal" | "Hipotiroid" | "Hipertiroid"
    confidence = resData.confidence // menyimpan nilai kecocokan model  


    // Print output to terminal log as requested
    console.log('=== DATA PREDIKSI DARI ML API ===')
    console.log('Nama Pasien   :', data.nama_pasien)
    console.log('Umur          :', data.umur)
    console.log('Jenis Kelamin :', data.jenis_kelamin)
    console.log('TSH           :', data.tsh)
    console.log('T3            :', data.t3)
    console.log('TT4           :', data.tt4)
    console.log('FTI           :', data.fti)
    console.log('---------------------------------')
    console.log('Hasil Model   :', diagnosis)
    console.log('Confidence    :', confidence)
    console.log('=================================')

  } catch (apiErr) {
    console.error('Error connecting to Flask API:', apiErr)
    return { error: 'Gagal menghubungi server Machine Learning. Pastikan server BE ML aktif.' }
  }

  // =================================================
  // MENYIMPAN HASIL KE SUPABASE
  // =================================================
  const supabase = await createClient()

  // 1. Create patient record
  const { data: newPatient, error: patientError } = await supabase
    .from('pasien')
    .insert({
      nama: data.nama_pasien,
      jenis_kelamin: data.jenis_kelamin,
      tanggal_lahir: new Date(new Date().getFullYear() - data.umur, 0, 1).toISOString(),
    })
    .select()
    .single()

  if (patientError) {
    console.error('Error creating patient:', patientError)
    return { error: 'Gagal membuat data pasien' }
  }

  // 2. Simpan catatan pemeriksaan yang terkait dengan pasien
  const { data: examination, error } = await supabase
    .from('pemeriksaan')
    .insert({ //   Memasukkan data ke tabel pemeriksaan 
      pasien_id: newPatient.id, // ID pasien yang baru dibuat
      umur: data.umur,
      jenis_kelamin: data.jenis_kelamin,
      tsh: data.tsh,
      t3: data.t3,
      tt4: data.tt4,
      fti: data.fti,
      hasil_klasifikasi: diagnosis,
      confidence: confidence
    })
    .select()
    .single()

  if (error) {
    console.error('Error saving examination:', error)
    return { error: 'Gagal menyimpan hasil pemeriksaan' }
  }

  // Memperbarui halaman dashboard dan history
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/history')

  //Mengirim data hasil prediksi ke frontend
  return {
    success: true,
    data: {
      diagnosis,
      confidence,
      timestamp: new Date().toISOString()
    }
  }
}
