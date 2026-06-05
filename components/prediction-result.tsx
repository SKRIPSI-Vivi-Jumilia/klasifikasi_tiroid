'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import { 
  Trophy, 
  Alert01Icon, 
  CheckmarkCircle02Icon,
  Clock01Icon,
  ArrowRight01Icon,
  RefreshIcon
} from '@hugeicons/core-free-icons'
import { PredictionResult } from '@/app/actions/prediction'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PredictionResultDisplayProps {
  result: PredictionResult | null
  onReset: () => void
}

export function PredictionResultDisplay({ result, onReset }: PredictionResultDisplayProps) {
  const router = useRouter()

  if (!result) return null

  const isNormal = result.diagnosis.toLowerCase() === 'normal'
  const isHypo = result.diagnosis.toLowerCase().includes('hypo') || result.diagnosis.toLowerCase().includes('hipo')
  const isHyper = result.diagnosis.toLowerCase().includes('hyper') || result.diagnosis.toLowerCase().includes('hiper')

  const getColorClass = () => {
    if (isNormal) return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5'
    if (isHyper) return 'text-rose-500 border-rose-500/20 bg-rose-500/5'
    if (isHypo) return 'text-amber-500 border-amber-500/20 bg-amber-500/5'
    return 'text-blue-500 border-blue-500/20 bg-blue-500/5'
  }

  const getGradient = () => {
    if (isNormal) return 'from-emerald-600/20 to-teal-600/20'
    if (isHyper) return 'from-rose-600/20 to-red-600/20'
    if (isHypo) return 'from-amber-600/20 to-orange-600/20'
    return 'from-purple-600/20 to-blue-600/20'
  }

  const getIcon = () => {
    if (isNormal) return CheckmarkCircle02Icon
    if (isHyper || isHypo) return Alert01Icon
    return Trophy
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full h-full"
      >
        <Card className="border-none shadow-2xl bg-card/30 backdrop-blur-xl overflow-hidden h-full flex flex-col">
          <div className={`h-2 w-full bg-gradient-to-r ${getGradient().replace('/20', '')}`} />
          <CardContent className="flex-1 flex flex-col p-8 items-center text-center justify-center">
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className={`p-6 rounded-full mb-6 ${getColorClass().replace('text-', 'bg-').replace('border-', 'shadow-').replace('/20', '/10')}`}
            >
              <HugeiconsIcon icon={getIcon()} className={`h-16 w-16 ${getColorClass().split(' ')[0]}`} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge variant="outline" className={`mb-4 px-4 py-1 text-xs font-bold uppercase tracking-widest ${getColorClass()}`}>
                Hasil Klasifikasi AI
              </Badge>
              <h2 className="text-5xl font-black mb-4 tracking-tighter text-foreground">
                {result.diagnosis}
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
                Berdasarkan analisis model XGBoost, pasien diklasifikasikan sebagai <span className={`font-bold ${getColorClass().split(' ')[0]}`}>{result.diagnosis}</span> dengan tingkat kepercayaan yang tinggi.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-10">
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 text-left">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-3 w-3" />
                  Confidence Level
                </div>
                <div className="text-2xl font-bold">{(result.confidence * 100).toFixed(1)}%</div>
                <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${getGradient().replace('/20', '')}`}
                  />
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 text-left">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <HugeiconsIcon icon={Clock01Icon} className="h-3 w-3" />
                  Waktu Analisis
                </div>
                <div className="text-sm font-semibold mt-1">
                  {new Date(result.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  {new Date(result.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>

            <div className="flex gap-4 w-full max-w-md">
              <Button 
                onClick={onReset}
                variant="outline" 
                className="flex-1 h-12 rounded-xl hover:bg-muted/50 gap-2 border-border/50"
              >
                <HugeiconsIcon icon={RefreshIcon} className="h-4 w-4" />
                Input Baru
              </Button>
              <Button 
                onClick={() => router.push('/dashboard/history')}
                className="flex-1 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-xl gap-2 shadow-lg shadow-purple-500/20"
              >
                Detail Pasien
                <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
