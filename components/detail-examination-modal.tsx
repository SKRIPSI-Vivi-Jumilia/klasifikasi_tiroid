'use client'

import * as React from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { HugeiconsIcon } from '@hugeicons/react'
import { 
  MedicalFileIcon, 
  UserGroupIcon, 
  Clock01Icon, 
  CalculatorIcon,
  CheckmarkCircle02Icon,
  Alert01Icon
} from '@hugeicons/core-free-icons'

interface DetailExaminationModalProps {
  examination: any | null
  isOpen: boolean
  onClose: () => void
}

export function DetailExaminationModal({ examination, isOpen, onClose }: DetailExaminationModalProps) {
  if (!examination) return null

  const isNormal = examination.hasil_klasifikasi?.toLowerCase() === 'normal'
  const isHypo = examination.hasil_klasifikasi?.toLowerCase().includes('hypo')
  const isHyper = examination.hasil_klasifikasi?.toLowerCase().includes('hyper')

  const getColorClass = () => {
    if (isNormal) return 'text-emerald-500 bg-emerald-500/10'
    if (isHyper) return 'text-amber-500 bg-amber-500/10'
    if (isHypo) return 'text-rose-500 bg-rose-500/10'
    return 'text-blue-500 bg-blue-500/10'
  }

  const getIcon = () => {
    if (isNormal) return CheckmarkCircle02Icon
    if (isHyper || isHypo) return Alert01Icon
    return MedicalFileIcon
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card/50 backdrop-blur-2xl border-none shadow-2xl p-0 overflow-hidden">
        <div className="h-2 w-full bg-gradient-to-r from-purple-600 to-blue-600" />
        
        <div className="p-8">
          <DialogHeader className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600 rounded-lg shadow-lg shadow-purple-500/20">
                  <HugeiconsIcon icon={MedicalFileIcon} className="h-5 w-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold">Detail Pemeriksaan</DialogTitle>
                  <DialogDescription>ID: {examination.id.substring(0, 8)}...</DialogDescription>
                </div>
              </div>
              <Badge variant="outline" className={`px-3 py-1 font-bold ${getColorClass()}`}>
                {examination.hasil_klasifikasi}
              </Badge>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Informasi Pasien */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <HugeiconsIcon icon={UserGroupIcon} className="h-3 w-3" />
                Informasi Pasien
              </div>
              <div className="space-y-3 bg-muted/30 p-4 rounded-2xl border border-border/50">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Nama</span>
                  <span className="text-sm font-semibold">{examination.pasien?.nama || 'Anonim'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Umur</span>
                  <span className="text-sm font-semibold">{examination.umur} Tahun</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Jenis Kelamin</span>
                  <span className="text-sm font-semibold">{examination.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider pt-2">
                <HugeiconsIcon icon={Clock01Icon} className="h-3 w-3" />
                Waktu Pemeriksaan
              </div>
              <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                <div className="text-sm font-semibold">
                  {new Date(examination.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div className="text-xs text-muted-foreground">
                  Pukul {new Date(examination.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                </div>
              </div>
            </div>

            {/* Parameter Lab */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <HugeiconsIcon icon={CalculatorIcon} className="h-3 w-3" />
                Parameter Laboratorium
              </div>
              <div className="space-y-2">
                {[
                  { label: 'TSH', value: examination.tsh, unit: 'mU/L' },
                  { label: 'T3', value: examination.t3, unit: 'nmol/L' },
                  { label: 'TT4', value: examination.tt4, unit: 'nmol/L' },
                  { label: 'T4U', value: examination.t4u, unit: 'Ratio' },
                  { label: 'FTI', value: examination.fti, unit: 'Unit' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/30">
                    <span className="text-sm font-medium">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-purple-500">{item.value}</span>
                      <span className="text-[10px] text-muted-foreground">{item.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator className="my-8 opacity-50" />

          <div className={`p-4 rounded-2xl flex items-center gap-4 ${getColorClass()}`}>
            <HugeiconsIcon icon={getIcon()} className="h-6 w-6 shrink-0" />
            <div>
              <div className="text-sm font-bold">Confidence Score: {(examination.confidence * 100).toFixed(1)}%</div>
              <p className="text-[11px] opacity-80">Data ini diproses menggunakan model XGBoost dengan tingkat akurasi tinggi.</p>
            </div>
          </div>
        </div>

        <DialogFooter className="bg-muted/50 p-6">
          <Button variant="outline" onClick={onClose} className="rounded-xl">Tutup Detail</Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl">Cetak Laporan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
