'use server'

import { createClient } from '@/lib/supabase/server'

export async function getDashboardStats() {
  const supabase = await createClient()

  try {
    // 1. Total Patients
    const { count: totalPatients } = await supabase
      .from('pasien')
      .select('*', { count: 'exact', head: true })

    // 2. Total Examinations
    const { count: totalExams } = await supabase
      .from('pemeriksaan')
      .select('*', { count: 'exact', head: true })

    // 3. Count per category
    const { data: examsData } = await supabase
      .from('pemeriksaan')
      .select('hasil_klasifikasi')

    const categoryCounts = {
      normal: 0,
      hyper: 0,
      hypo: 0,
      other: 0
    }

    examsData?.forEach(exam => {
      const result = exam.hasil_klasifikasi?.toLowerCase() || ''
      if (result === 'normal') categoryCounts.normal++
      else if (result.includes('hyper') || result.includes('hiper')) categoryCounts.hyper++
      else if (result.includes('hypo') || result.includes('hipo')) categoryCounts.hypo++
      else categoryCounts.other++
    })

    // 4. Recent Examinations
    const { data: recentExams } = await supabase
      .from('pemeriksaan')
      .select(`
        id,
        created_at,
        hasil_klasifikasi,
        confidence,
        pasien:id_pasien (nama)
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
