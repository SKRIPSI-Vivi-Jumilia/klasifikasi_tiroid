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
  t4u: number
  fti: number
}

export type PredictionResult = {
  diagnosis: string
  confidence: number
  timestamp: string
}

export async function predictThyroid(data: PredictionData) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock logic for prediction (XGBoost placeholder)
  // In a real scenario, you would fetch() your Python API here
  let diagnosis = 'Normal'
  let confidence = 0.95

  if (data.tsh > 4.5) {
    diagnosis = 'Hypothyroid'
    confidence = 0.88
  } else if (data.tsh < 0.4) {
    diagnosis = 'Hyperthyroid'
    confidence = 0.92
  }

  // Save to Supabase
  const supabase = await createClient()
  
  // 1. Create or find patient
  // For simplicity in this step, we'll just focus on the prediction logic
  // and saving the examination record.
  
  // Let's assume we create a guest/temporary record if no patient_id provided
  // In a full app, we'd look up the patient first.
  
  const { data: examination, error } = await supabase
    .from('pemeriksaan')
    .insert({
      umur: data.umur,
      jenis_kelamin: data.jenis_kelamin,
      tsh: data.tsh,
      t3: data.t3,
      tt4: data.tt4,
      t4u: data.t4u,
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
  
  return {
    success: true,
    data: {
      diagnosis,
      confidence,
      timestamp: new Date().toISOString()
    }
  }
}
