'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type PredictionData = {
  nama_pasien: string
  umur: number
  jenis_kelamin: 'L' | 'P'
  tsh: number
  t3: number
  tt4: number
  fti: number
}

export type PredictionResult = {
  diagnosis: string
  confidence: number
  timestamp: string
}

export async function predictThyroid(data: PredictionData) {
  let diagnosis = 'Normal'
  let confidence = 0.95

  try {
    const response = await fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        age: data.umur,
        sex: data.jenis_kelamin === 'L' ? 1 : 0,
        TSH: data.tsh,
        T3: data.t3,
        TT4: data.tt4,
        FTI: data.fti,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Flask API error response:', errText)
      return { error: 'Gagal memproses prediksi dari server Machine Learning' }
    }

    const resData = await response.json()
    if (resData.error) {
      return { error: `Model Error: ${resData.error}` }
    }

    diagnosis = resData.result // "Normal" | "Hipotiroid" | "Hipertiroid"
    confidence = resData.confidence
  } catch (apiErr) {
    console.error('Error connecting to Flask API:', apiErr)
    return { error: 'Gagal menghubungi server Machine Learning. Pastikan server BE ML aktif.' }
  }

  // Save to Supabase
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
  
  // 2. Save examination record linked to the patient
  const { data: examination, error } = await supabase
    .from('pemeriksaan')
    .insert({
      pasien_id: newPatient.id,
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

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/history')
  
  return {
    success: true,
    data: {
      diagnosis,
      confidence,
      timestamp: new Date().toISOString()
    }
  }
}
