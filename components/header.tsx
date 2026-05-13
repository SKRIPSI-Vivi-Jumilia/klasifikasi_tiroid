'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import { Search01Icon, Notification03Icon, UserCircleIcon } from '@hugeicons/core-free-icons'
import { ModeToggle } from '@/components/mode-toggle'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-border bg-background/50 backdrop-blur-xl px-8 lg:ml-72">
      <div className="flex-1 max-w-md relative">
        <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Cari pasien atau ID pemeriksaan..." 
          className="bg-muted/50 border-border pl-10 h-11 text-foreground placeholder:text-muted-foreground focus:border-purple-500 transition-colors rounded-xl"
        />
      </div>

      <div className="ml-auto flex items-center gap-4">
        <ModeToggle />
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl h-11 w-11">
          <HugeiconsIcon icon={Notification03Icon} className="h-5 w-5" />
        </Button>
        
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
