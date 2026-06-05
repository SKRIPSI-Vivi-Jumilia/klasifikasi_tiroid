'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import { UserCircleIcon } from '@hugeicons/core-free-icons'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-border bg-background/50 backdrop-blur-xl px-8 lg:ml-72">


      <div className="ml-auto flex items-center gap-4">
        <ModeToggle />

        
        <div className="h-10 w-[1px] bg-border mx-2" />

        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-foreground group-hover:text-purple-500 transition-colors">dr. Vivi Jumilia</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Endokrinolog</p>
          </div>
          <div className="h-11 w-11 bg-muted border border-border rounded-xl flex items-center justify-center group-hover:border-purple-500 transition-all">
            <HugeiconsIcon icon={UserCircleIcon} className="h-6 w-6 text-muted-foreground group-hover:text-purple-500" />
          </div>
        </div>
      </div>
    </header>
  )
}
