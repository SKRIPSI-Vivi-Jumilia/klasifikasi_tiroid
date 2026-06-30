'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 1. Get Reference Values
export async function getReferenceValues() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('referensi_nilai')
    .select('*')
    .order('parameter', { ascending: true })

  return { data, error: error?.message }
}

// 2. Upsert Reference Value
export async function upsertReferenceValue(data: {
  id?: string
  parameter: string
  nama_parameter: string
  nilai_min: number
  nilai_max: number
  satuan: string
}) {
  const supabase = await createClient()

  const payload = {
    parameter: data.parameter,
    nama_parameter: data.nama_parameter,
    nilai_min: data.nilai_min,
    nilai_max: data.nilai_max,
    satuan: data.satuan,
    updated_at: new Date().toISOString(),
  }

  let result
  if (data.id) {
    result = await supabase
      .from('referensi_nilai')
      .update(payload)
      .eq('id', data.id)
  } else {
    result = await supabase
      .from('referensi_nilai')
      .insert([payload])
  }

  if (!result.error) {
    revalidatePath('/dashboard/master-data')
  }

  return { success: !result.error, error: result.error?.message }
}

// 3. Delete Reference Value
export async function deleteReferenceValue(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('referensi_nilai')
    .delete()
    .eq('id', id)

  if (!error) {
    revalidatePath('/dashboard/master-data')
  }

  return { success: !error, error: error?.message }
}

// 4. Get Model Configurations
export async function getModelConfig() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('konfigurasi_model')
    .select('*')
    .order('created_at', { ascending: false })

  return { data, error: error?.message }
}

// 5. Add Model Configuration
export async function addModelConfig(data: {
  versi: string
  akurasi: number
}) {
  const supabase = await createClient()

  // Set all existing models to inactive
  await supabase
    .from('konfigurasi_model')
    .update({ aktif: false })
    .eq('aktif', true)

  // Insert new model
  const payload = {
    versi: data.versi,
    akurasi: data.akurasi,
    tanggal_training: new Date().toISOString(),
    aktif: true
  }

  const { error } = await supabase
    .from('konfigurasi_model')
    .insert([payload])

  if (!error) {
    revalidatePath('/dashboard/master-data')
  }

  return { success: !error, error: error?.message }
}
