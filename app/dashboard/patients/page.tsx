import { getPatients } from '@/app/actions/examination-actions'
import { HugeiconsIcon } from '@hugeicons/react'
import { UserGroupIcon, UserAdd01Icon, Search01Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export default async function PatientsPage() {
  const { data = [], error } = await getPatients()

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-500 font-bold text-xs uppercase tracking-[0.2em] mb-2">
            <span className="h-1 w-8 bg-purple-500 rounded-full" />
            Registry
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Data <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Pasien</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Manajemen daftar pasien yang terdaftar dalam sistem.
          </p>
        </div>

        <Button className="h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl gap-2 px-6 shadow-lg shadow-purple-500/20 transition-all duration-300">
          <HugeiconsIcon icon={UserAdd01Icon} className="h-5 w-5" />
          Tambah Pasien
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-card/30 backdrop-blur-xl border border-border/50 shadow-xl shadow-purple-500/5">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Total Pasien</div>
          <div className="text-3xl font-black">{data?.length || 0}</div>
          <div className="mt-2 text-[10px] text-green-500 font-bold">+2 Baru bulan ini</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <HugeiconsIcon icon={Search01Icon} className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Cari nama atau ID pasien..." 
          className="pl-12 bg-card/30 border-none shadow-inner h-12 rounded-2xl focus-visible:ring-purple-500/20"
        />
      </div>

      {/* Patient Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.length ? (
          data.map((patient: any) => (
            <div key={patient.id} className="group p-6 rounded-3xl bg-card/30 backdrop-blur-xl border border-border/50 hover:border-purple-500/30 transition-all duration-300 shadow-xl shadow-purple-500/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-purple-100 text-purple-600">
                  <HugeiconsIcon icon={Search01Icon} className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-purple-500/20">
                  {patient.nama[0]}
                </div>
                <div>
                  <h3 className="font-bold text-foreground leading-tight">{patient.nama}</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">ID: {patient.id.substring(0, 8)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Jenis Kelamin</span>
                  <span className="font-semibold">{patient.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Tanggal Lahir</span>
                  <span className="font-semibold">{patient.tanggal_lahir ? new Date(patient.tanggal_lahir).toLocaleDateString('id-ID') : '-'}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border/50">
                <Button variant="outline" className="w-full rounded-xl h-10 text-xs font-bold border-border/50 hover:bg-purple-500/[0.02] hover:text-purple-600 transition-colors">
                  Lihat Riwayat Medis
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full h-64 flex flex-col items-center justify-center gap-4 text-muted-foreground bg-card/10 rounded-3xl border border-dashed border-border/50">
            <HugeiconsIcon icon={UserGroupIcon} className="h-10 w-10 opacity-20" />
            <div className="text-center">
              <p className="font-bold">Belum ada data pasien</p>
              <p className="text-xs">Klik "Tambah Pasien" untuk mulai mendaftarkan.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
