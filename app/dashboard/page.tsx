import { getDashboardStats } from '@/app/actions/dashboard-actions'
import { DashboardStatsClient } from '@/components/dashboard-stats-client'
import { HugeiconsIcon } from '@hugeicons/react'
import { HospitalIcon, ActivityIcon } from '@hugeicons/core-free-icons'

export default async function DashboardPage() {
  const { data: stats, error } = await getDashboardStats()

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <HugeiconsIcon icon={ActivityIcon} className="h-12 w-12 text-destructive opacity-20" />
        <p className="text-muted-foreground font-medium">Gagal memuat data statistik.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-500 font-bold text-xs uppercase tracking-[0.2em] mb-2">
            <span className="h-1 w-8 bg-purple-500 rounded-full" />
            Medical Overview
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
            Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Statistik</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Pantau ringkasan data klinis dan hasil klasifikasi secara real-time.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-3 p-4 bg-purple-500/5 rounded-2xl border border-purple-500/10">
          <HugeiconsIcon icon={HospitalIcon} className="h-5 w-5 text-purple-500" />
          <div className="text-xs">
            <div className="font-bold">Klinik Tiroid Utama</div>
            <div className="text-muted-foreground">Sistem Aktif • {new Date().toLocaleDateString('id-ID')}</div>
          </div>
        </div>
      </div>

      <DashboardStatsClient stats={stats} />
    </div>
  )
}
