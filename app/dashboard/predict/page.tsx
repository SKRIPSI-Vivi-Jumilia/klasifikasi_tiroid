'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import { 
  StatusIcon, 
  LeftToRightListDashIcon,
  WifiConnected01Icon,
  WifiError01Icon
} from '@hugeicons/core-free-icons'

import { PredictionForm } from '@/components/prediction-form'
import { PredictionResultDisplay } from '@/components/prediction-result'
import { PredictionResult } from '@/app/actions/prediction'

type ApiStatus = 'checking' | 'online' | 'offline'

export default function PredictPage() {
  const [result, setResult] = React.useState<PredictionResult | null>(null)
  const [apiStatus, setApiStatus] = React.useState<ApiStatus>('checking')

  const checkApiStatus = React.useCallback(async () => {
    try {
      const res = await fetch('/api/ml-status', { cache: 'no-store' })
      const data = await res.json()
      setApiStatus(data.connected ? 'online' : 'offline')
    } catch {
      setApiStatus('offline')
    }
  }, [])

  React.useEffect(() => {
    checkApiStatus()
    const interval = setInterval(checkApiStatus, 10_000)
    return () => clearInterval(interval)
  }, [checkApiStatus])

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <div className="flex items-center gap-2 text-purple-500 font-bold text-xs uppercase tracking-[0.2em] mb-2">
            <span className="h-1 w-8 bg-purple-500 rounded-full" />
            Diagnostic Tool
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Prediksi <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Tiroid</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Sistem klasifikasi otomatis menggunakan algoritma XGBoost.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          {/* Status API */}
          <AnimatePresence mode="wait">
            {apiStatus === 'checking' && (
              <motion.div
                key="checking"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-card border border-border/50 text-xs font-semibold text-muted-foreground shadow-sm"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                  className="h-3 w-3 border-2 border-muted-foreground border-t-transparent rounded-full"
                />
                Memeriksa Koneksi API...
              </motion.div>
            )}
            {apiStatus === 'online' && (
              <motion.div
                key="online"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-500 shadow-sm"
              >
                <motion.div
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="h-2 w-2 rounded-full bg-emerald-500"
                />
                <HugeiconsIcon icon={WifiConnected01Icon} className="h-4 w-4" />
                API Terhubung
              </motion.div>
            )}
            {apiStatus === 'offline' && (
              <motion.div
                key="offline"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs font-semibold text-rose-500 shadow-sm animate-pulse"
              >
                <div className="h-2 w-2 rounded-full bg-rose-500" />
                <HugeiconsIcon icon={WifiError01Icon} className="h-4 w-4" />
                API Terputus
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <PredictionForm onSuccess={setResult} apiStatus={apiStatus} />
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
              >
                <PredictionResultDisplay result={result} onReset={() => setResult(null)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">


          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-3xl bg-blue-600/5 border border-blue-500/10 space-y-4"
          >
            <div className="flex items-center gap-3 text-blue-500">
              <HugeiconsIcon icon={LeftToRightListDashIcon} className="h-5 w-5" />
              <h3 className="font-bold">Panduan Parameter</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              - <strong>TSH</strong>: mU/L <br/>
              - <strong>T3/TT4</strong>: nmol/L <br/>
              - <strong>FTI</strong>: Index
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
