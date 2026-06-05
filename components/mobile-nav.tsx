'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { HugeiconsIcon } from '@hugeicons/react'
import { 
  DashboardCircleIcon, 
  MedicalFileIcon, 
  Database01Icon 
} from '@hugeicons/core-free-icons'
import { motion } from 'framer-motion'

const navigation = [
  { name: 'Beranda', href: '/dashboard', icon: DashboardCircleIcon },
  { name: 'Prediksi', href: '/dashboard/predict', icon: MedicalFileIcon },
  { name: 'Riwayat', href: '/dashboard/history', icon: Database01Icon },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md lg:hidden no-print">
      <div className="flex items-center justify-around py-3 px-4 rounded-3xl bg-card/65 backdrop-blur-xl border border-border/40 shadow-[0_8px_32px_0_rgba(139,92,246,0.15)]">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative flex flex-col items-center gap-1 py-1 px-3 min-w-[70px] text-center"
            >
              {isActive && (
                <motion.div
                  layoutId="active-mobile-pill"
                  className="absolute inset-0 rounded-2xl bg-purple-600/10 border border-purple-500/20"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <HugeiconsIcon 
                icon={item.icon}
                className={cn(
                  'h-5 w-5 transition-transform duration-200 relative z-10',
                  isActive ? 'text-purple-500 scale-110' : 'text-muted-foreground'
                )} 
              />
              <span 
                className={cn(
                  'text-[10px] font-semibold tracking-wide relative z-10 transition-colors duration-200',
                  isActive ? 'text-purple-500 font-bold' : 'text-muted-foreground'
                )}
              >
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
