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

  if (!error) {
    revalidatePath('/dashboard/users') // Memperbarui halaman user
    revalidatePath('/dashboard/master-data') // Memperbarui halaman master data
  }
  return { success: !error, error: error?.message } // Mengembalikan data user
}

// ======================================================
// FUNGSI UNTUK MENGUBAH ROLE USER
// ======================================================
export async function changeUserRole(userId: string, newRole: 'user' | 'admin') {
  const supabase = await createClient()

  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)

  if (!error) {
    revalidatePath('/dashboard/users')
    revalidatePath('/dashboard/master-data')
  }
  return { success: !error, error: error?.message }
}

// ======================================================
// FUNGSI UNTUK MENGAMBIL PROFIL USER AKTIF
// ======================================================
export async function getCurrentUserProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { data: null, error: 'Tidak terautentikasi' }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { data, error: error?.message }
}
