'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ======================================================
// FUNGSI UNTUK MENGAMBIL SELURUH DATA USER
// ======================================================
export async function getUsers() {
  const supabase = await createClient() // Membuat koneksi ke sb

  const { data, error } = await supabase // Mengambil data user
    .from('profiles') // Menentukan tabel user
    .select('*') // Mengambil semua kolom
    .order('created_at', { ascending: false }) // Mengurutkan data berdasarkan tanggal pembuatan

  return { data, error: error?.message }
}

// ======================================================
// FUNGSI UNTUK MENGUBAH STATUS USER
// ======================================================
export async function toggleUserStatus(userId: string, currentStatus: string) {
  const supabase = await createClient() // Membuat koneksi ke sb
  const newStatus = currentStatus === 'active' ? 'inactive' : 'active' // Mengganti status user

  const { error } = await supabase // Menentukan tabel user dan memperbarui statusnya
    .from('profiles')
    .update({ status: newStatus }) // Memperbarui status user
    .eq('id', userId) // Memilih user berdasarkan ID

  if (!error) revalidatePath('/dashboard/users') // Memperbarui halaman user
  return { success: !error, error: error?.message } // Mengembalikan data user
}
