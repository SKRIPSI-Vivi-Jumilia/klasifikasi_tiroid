'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import { Search01Icon, Notification03Icon, UserCircleIcon } from '@hugeicons/core-free-icons'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl px-8 lg:ml-72">
      <div className="flex-1 max-w-md relative">
        <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <Input 
          placeholder="Cari pasien atau ID pemeriksaan..." 
          className="bg-slate-900/50 border-slate-800 pl-10 h-11 text-slate-300 placeholder:text-slate-600 focus:border-purple-500 transition-colors rounded-xl"
        />
      </div>

      <div className="ml-auto flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl h-11 w-11">
          <HugeiconsIcon icon={Notification03Icon} className="h-5 w-5" />
        </Button>
        
        <div className="h-10 w-[1px] bg-slate-800 mx-2" />

        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">dr. Vivi Jumilia</p>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Endokrinolog</p>
          </div>
          <div className="h-11 w-11 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center group-hover:border-purple-500 transition-all">
            <HugeiconsIcon icon={UserCircleIcon} className="h-6 w-6 text-slate-400 group-hover:text-purple-400" />
          </div>
        </div>
      </div>
    </header>
  )
}
