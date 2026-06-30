'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { HugeiconsIcon } from '@hugeicons/react'
import { 
  DashboardCircleIcon, 
  MedicalFileIcon, 
  Settings02Icon, 
  Database01Icon,
  Logout01Icon,
  HospitalIcon,
  Folder01Icon
} from '@hugeicons/core-free-icons'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function Sidebar({ role = 'user' }: { role?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const baseNavigation = [
    { name: 'Beranda', href: '/dashboard', icon: DashboardCircleIcon },
    { name: 'Prediksi Baru', href: '/dashboard/predict', icon: MedicalFileIcon },
    { name: 'Riwayat Pemeriksaan', href: '/dashboard/history', icon: Database01Icon },
  ]

  const navigation = role === 'admin' 
    ? [
        ...baseNavigation,
        { name: 'Master Data', href: '/dashboard/master-data', icon: Folder01Icon },
      ]
    : baseNavigation

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast.success('Berhasil keluar dari sistem')
      router.push('/login')
      router.refresh()
    } catch (err: any) {
      toast.error('Gagal keluar: ' + err.message)
    }
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-72 border-r border-sidebar-border bg-sidebar/50 backdrop-blur-xl hidden lg:block">
      <div className="flex h-full flex-col px-4 py-6">
        <div className="mb-10 px-4 flex items-center gap-3">
          <div className="h-10 w-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <HugeiconsIcon icon={HospitalIcon} className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">Thyroid Classification</h2>
            <p className="text-[10px] text-purple-400 font-medium uppercase tracking-widest">Medical Intelligence</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-2xl transition-all duration-200',
                  isActive 
                    ? 'bg-purple-600/10 text-purple-500' 
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <HugeiconsIcon 
                  icon={item.icon}
                  className={cn(
                    'h-5 w-5 transition-colors',
                    isActive ? 'text-purple-500' : 'text-muted-foreground group-hover:text-accent-foreground'
                  )} 
                />
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="ml-auto h-1.5 w-1.5 rounded-full bg-purple-500"
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto border-t border-sidebar-border pt-6 px-2">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-2xl transition-all duration-200 group"
          >
            <HugeiconsIcon icon={Logout01Icon} className="h-5 w-5 text-muted-foreground group-hover:text-destructive" />
            Keluar Sistem
          </button>
        </div>
      </div>
    </aside>
  )
}
