'use server'

// Mengambil fungsi createClient untuk terhubung ke Supabase
import { createClient } from '@/lib/supabase/server'

// Fungsi untuk mengambil seluruh data statistik dashboard
export async function getDashboardStats() {
  const supabase = await createClient() // Membuat koneksi ke sb

  try {
    // 1. menghitung Total Patients
    const { count: totalPatients } = await supabase
      .from('pasien')
      .select('*', {
        count: 'exact',  // Menghitung jumlah data
        head: true
      }) // Hanya mengambil jumlah data

    // 2. menghitung Total pemeriksaan
    const { count: totalExams } = await supabase
      .from('pemeriksaan')
      .select('*', { count: 'exact', head: true })

    // 3. Menghitung jumlah kategori hasil klasifikasi
    const { data: examsData } = await supabase
      .from('pemeriksaan')
      .select('hasil_klasifikasi') // Mengambil kolom hasil_klasifikasi saja

    // Menyiapkan objek untuk menyimpan jumlah tiap kategori
    const categoryCounts = {
      normal: 0,
      hyper: 0,
      hypo: 0,
      other: 0
    }

    examsData?.forEach(exam => { // Melakukan perulangan untuk setiap data pemeriksaan
      const result = exam.hasil_klasifikasi?.toLowerCase() || '' // Mengubah teks menjadi huruf kecil 
      if (result === 'normal') categoryCounts.normal++
      else if (result.includes('hyper') || result.includes('hiper')) categoryCounts.hyper++
      else if (result.includes('hypo') || result.includes('hipo')) categoryCounts.hypo++
      else categoryCounts.other++
    })

    // 4. Recent Examinations
    const { data: recentExams } = await supabase
      .from('pemeriksaan')  // Mengambil beberapa kolom yang dibutuhkan
      .select(` 
        id,
        created_at,
        hasil_klasifikasi,
        confidence,
        pasien (nama)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    return {
      success: true,
      data: {
        totalPatients: totalPatients || 0,
        totalExams: totalExams || 0,
        categoryCounts,
        recentExams: recentExams || []
      }
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return { success: false, error: 'Gagal mengambil statistik dashboard' }
  }
}
