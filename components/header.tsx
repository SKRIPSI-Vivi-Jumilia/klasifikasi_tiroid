'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import { UserCircleIcon } from '@hugeicons/core-free-icons'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  profile: any
}

export function Header({ profile }: HeaderProps) {
  const fullName = profile?.full_name || 'Petugas Medis'
  const email = profile?.email || ''
  const role = profile?.role || 'user'

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-border bg-background/50 backdrop-blur-xl px-8 lg:ml-72">
      <div className="ml-auto flex items-center gap-4">
        <ModeToggle />

        <div className="h-10 w-[1px] bg-border mx-2" />

        <div className="flex items-center gap-3 pl-2 group">
          <div className="text-right hidden sm:block">
            <div className="flex items-center gap-2 justify-end">
              <p className="text-sm font-semibold text-foreground group-hover:text-purple-500 transition-colors">
                {fullName}
              </p>
              {role === 'admin' ? (
                <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md bg-purple-500/10 text-purple-500 border border-purple-500/20 shadow-[0_0_8px_rgba(168,85,247,0.1)]">
                  Admin
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  User
                </span>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{email}</p>
          </div>
          <div className="h-11 w-11 bg-muted border border-border rounded-xl flex items-center justify-center group-hover:border-purple-500 transition-all">
            <HugeiconsIcon icon={UserCircleIcon} className="h-6 w-6 text-muted-foreground group-hover:text-purple-500" />
          </div>
        </div>
      </div>
    </header>
  )
}
