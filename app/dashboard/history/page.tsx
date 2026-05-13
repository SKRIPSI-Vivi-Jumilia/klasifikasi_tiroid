import { getExaminations } from '@/app/actions/examination-actions'
import { HistoryTable } from '@/components/history-table'
import { HugeiconsIcon } from '@hugeicons/react'
import { Database01Icon, InformationCircleIcon } from '@hugeicons/core-free-icons'

export default async function HistoryPage() {
  const { data = [], error } = await getExaminations()

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

      <div className="flex items-center gap-4 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 mb-8">
        <HugeiconsIcon icon={InformationCircleIcon} className="h-5 w-5 text-blue-500 shrink-0" />
        <p className="text-xs text-blue-700/80 dark:text-blue-400/80 leading-relaxed">
          Semua data di bawah ini disimpan secara aman di database medis. Anda dapat melihat detail klinis lengkap dengan mengklik tombol "Lihat Detail" pada setiap baris data.
        </p>
      </div>

      <HistoryTable data={data || []} />
    </div>
  )
}
