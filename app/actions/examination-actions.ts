'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteExamination(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('pemeriksaan')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting examination:', error)
    return { error: 'Gagal menghapus data pemeriksaan' }
  }

  revalidatePath('/dashboard/history')
  revalidatePath('/dashboard')
  
  return { success: true }
}

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

export async function getPatients() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('pasien')
    .select('*')
    .order('nama', { ascending: true })

  if (error) {
    console.error('Error fetching patients:', error)
    return { error: 'Gagal mengambil data pasien' }
  }

  return { success: true, data }
}
