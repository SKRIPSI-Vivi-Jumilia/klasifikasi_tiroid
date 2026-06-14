'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ======================================================
// FUNGSI MENGHAPUS DATA PEMERIKSAAN
// ======================================================
export async function deleteExamination(id: string) {
  const supabase = await createClient()

  // Menghapus data pada tabel pemeriksaan
  // berdasarkan id yang dipilih
  const { error } = await supabase
    .from('pemeriksaan')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting examination:', error)
    return { error: 'Gagal menghapus data pemeriksaan' }
  }

  revalidatePath('/dashboard/history') // Memperbarui halaman history agar data terbaru tampil
  revalidatePath('/dashboard')

  return { success: true }
}

// ======================================================
// FUNGSI MENGAMBIL SELURUH DATA PEMERIKSAAN
// ======================================================
export async function getExaminations() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('pemeriksaan')
    .select(`
      *,
      pasien (
        nama
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching examinations:', error)
    return { error: 'Gagal mengambil data pemeriksaan' }
  }

  return { success: true, data }
}

// ======================================================
// FUNGSI MENGAMBIL DATA PASIEN
// ======================================================
export async function getPatients() {
  const supabase = await createClient()

  // Mengambil data pasien
  const { data, error } = await supabase
    .from('pasien')
    .select('*')    // Mengambil semua kolom
    .order('nama', { ascending: true }) // Mengurutkan data berdasarkan abjad

  if (error) {
    console.error('Error fetching patients:', error)
    return { error: 'Gagal mengambil data pasien' }
  }

  return { success: true, data } // Mengirim data pasien ke frontend
}
