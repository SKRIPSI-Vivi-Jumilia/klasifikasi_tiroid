//halaman Riwayat Pemeriksaan
import { getExaminations } from '@/app/actions/examination-actions' //Mengimpor fungsi untuk mengambil data pemeriksaan
import { HistoryTable } from '@/components/history-table' // Mengimpor komponen tabel riwayat pemeriksaan
import { HugeiconsIcon } from '@hugeicons/react' // Mengimpor ikon dari Hugeicons
import { Database01Icon } from '@hugeicons/core-free-icons' //Mengimpor ikon dari Hugeicons 

// =====================================================
// HALAMAN RIWAYAT PEMERIKSAAN
// =====================================================
export default async function HistoryPage() { // mengambil seluruh data pemeriksaan
  const { data = [], error } = await getExaminations() //dari server action examination-actions

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* Header Section */}
      <div className="flex flex-col space-y-1">
        <div className="flex items-center gap-2 text-purple-500 font-bold text-xs uppercase tracking-[0.2em] mb-2">
          <span className="h-1 w-8 bg-purple-500 rounded-full" />
          Archive
        </div>
        <h1 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
          Riwayat <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Pemeriksaan</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Daftar lengkap riwayat klasifikasi tiroid yang telah dilakukan.
        </p>
      </div>


      {/* Menampilkan data riwayat pemeriksaan */}
      <HistoryTable data={data || []} />
    </div>
  )
}
