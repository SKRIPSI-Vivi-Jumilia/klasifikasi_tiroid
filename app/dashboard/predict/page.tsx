'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import { 
  StatusIcon, 
  LeftToRightListDashIcon,
  HelpCircleIcon
} from '@hugeicons/core-free-icons'

import { PredictionForm } from '@/components/prediction-form'
import { PredictionResultDisplay } from '@/components/prediction-result'
import { PredictionResult } from '@/app/actions/prediction'

export default function PredictPage() {
  const [result, setResult] = React.useState<PredictionResult | null>(null)

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
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
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" />
              </div>
            ))}
            <div className="h-10 w-10 rounded-full border-2 border-background bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold">
              +12
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold">Tim Medis Terhubung</div>
            <div className="text-[10px] text-green-500 font-medium flex items-center justify-end gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Sistem Aktif
            </div>
          </div>
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
                <PredictionForm onSuccess={setResult} />
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
            transition={{ delay: 0.2 }}
            className="p-6 rounded-3xl bg-purple-600/5 border border-purple-500/10 space-y-4"
          >
            <div className="flex items-center gap-3 text-purple-500">
              <HugeiconsIcon icon={StatusIcon} className="h-5 w-5" />
              <h3 className="font-bold">Cara Kerja AI</h3>
            </div>
            <div className="space-y-3">
              {[
                'Input parameter klinis hasil laboratorium.',
                'Model XGBoost memproses fitur secara non-linear.',
                'Sistem membandingkan dengan 10.000+ data historis.',
                'Hasil diagnosis ditampilkan beserta tingkat kepercayaan.'
              ].map((step, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <div className="h-5 w-5 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>
          </motion.div>

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
              Pastikan satuan parameter sudah sesuai: <br/>
              - <strong>TSH</strong>: mU/L <br/>
              - <strong>T3/TT4</strong>: nmol/L <br/>
              - <strong>T4U</strong>: Unit ratio
            </p>
            <button className="flex items-center gap-2 text-xs font-bold text-blue-500 hover:underline">
              <HugeiconsIcon icon={HelpCircleIcon} className="h-4 w-4" />
              Lihat Dokumentasi Lengkap
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
