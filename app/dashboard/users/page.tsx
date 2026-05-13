import { getUsers } from '@/app/actions/user-actions'
import { HugeiconsIcon } from '@hugeicons/react'
import { UserAdd01Icon, UserGroupIcon, ShieldIcon, Mail01Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default async function UsersPage() {
  const { data: users = [], error } = await getUsers()

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-500 font-bold text-xs uppercase tracking-[0.2em] mb-2">
            <span className="h-1 w-8 bg-purple-500 rounded-full" />
            Admin Panel
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Manajemen <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Pengguna</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Atur hak akses tenaga medis dan administrasi sistem.
          </p>
        </div>

        <Button className="h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl gap-2 px-6 shadow-lg shadow-purple-500/20 transition-all duration-300">
          <HugeiconsIcon icon={UserAdd01Icon} className="h-5 w-5" />
          Tambah User
        </Button>
      </div>

      {/* User Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users?.map((user: any) => (
          <div key={user.id} className="p-6 rounded-3xl bg-card/30 backdrop-blur-xl border border-border/50 shadow-xl shadow-purple-500/5 space-y-6 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px] font-bold">
                {user.role || 'Tenaga Medis'}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-purple-500/20">
                {user.full_name?.[0] || 'U'}
              </div>
              <div>
                <h3 className="font-bold text-foreground">{user.full_name || 'User Tanpa Nama'}</h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <HugeiconsIcon icon={Mail01Icon} className="h-3 w-3" />
                  {user.email || 'No Email'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
              <div className="space-y-1">
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Status</div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-green-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  Aktif
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Terdaftar</div>
                <div className="text-xs font-semibold">
                  {new Date(user.created_at).toLocaleDateString('id-ID')}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1 rounded-xl h-10 text-xs font-bold border-border/50">
                Edit Profil
              </Button>
              <Button variant="outline" className="h-10 w-10 p-0 rounded-xl border-border/50 text-rose-500 hover:bg-rose-500/5">
                <HugeiconsIcon icon={ShieldIcon} className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Empty State / Add Card */}
        <div className="p-6 rounded-3xl border border-dashed border-border/50 flex flex-col items-center justify-center gap-4 text-muted-foreground hover:bg-muted/10 transition-colors cursor-pointer min-h-[250px]">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <HugeiconsIcon icon={UserAdd01Icon} className="h-6 w-6 opacity-20" />
          </div>
          <p className="text-sm font-bold">Undang Tenaga Medis</p>
        </div>
      </div>
    </div>
  )
}
