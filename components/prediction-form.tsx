'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import * as z from 'zod'
import { HugeiconsIcon } from '@hugeicons/react'
import { 
  StatusIcon, 
  UserGroupIcon, 
  CalculatorIcon,
  InformationCircleIcon,
  WifiConnected01Icon,
  WifiError01Icon,
} from '@hugeicons/core-free-icons'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { predictThyroid, PredictionResult } from '@/app/actions/prediction'
import { toast } from 'sonner'

const formSchema = z.object({
  nama_pasien: z.string().min(2, 'Nama pasien minimal 2 karakter'),
  umur: z.coerce.number().min(0).max(120),
  jenis_kelamin: z.enum(['L', 'P']),
  tsh: z.coerce.number().min(0),
  t3: z.coerce.number().min(0),
  tt4: z.coerce.number().min(0),
  fti: z.coerce.number().min(0),
})

type FormValues = z.infer<typeof formSchema>

type ApiStatus = 'checking' | 'online' | 'offline'

interface PredictionFormProps {
  onSuccess: (result: PredictionResult) => void
  apiStatus: ApiStatus
}

export function PredictionForm({ onSuccess, apiStatus }: PredictionFormProps) {
  const [isPending, setIsPending] = React.useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.input<typeof formSchema>, any, FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jenis_kelamin: 'L',
    },
  })

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (apiStatus !== 'online') {
      toast.error('Server Machine Learning tidak tersedia. Pastikan server BE aktif.')
      return
    }
    setIsPending(true)
    try {
      const result = await predictThyroid(values)
      if (result.success && result.data) {
        toast.success('Diagnosis berhasil diproses')
        onSuccess(result.data)
      } else {
        toast.error(result.error || 'Terjadi kesalahan saat memproses diagnosis')
      }
    } catch (error) {
      toast.error('Gagal menghubungi server')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card className="border-none shadow-2xl bg-card/30 backdrop-blur-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 border-b border-border/50 pb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600 rounded-lg shadow-lg shadow-purple-500/20">
              <HugeiconsIcon icon={StatusIcon} className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Data Klinis Pasien</CardTitle>
          </div>

          {/* API Status Badge */}
          <AnimatePresence mode="wait">
            {apiStatus === 'checking' && (
              <motion.div
                key="checking"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60 border border-border/50 text-xs font-semibold text-muted-foreground"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                  className="h-3 w-3 border-2 border-muted-foreground border-t-transparent rounded-full"
                />
                Memeriksa...
              </motion.div>
            )}
            {apiStatus === 'online' && (
              <motion.div
                key="online"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-500"
              >
                <motion.div
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="h-2 w-2 rounded-full bg-emerald-500"
                />
                <HugeiconsIcon icon={WifiConnected01Icon} className="h-3.5 w-3.5" />
                Server ML Online
              </motion.div>
            )}
            {apiStatus === 'offline' && (
              <motion.div
                key="offline"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-xs font-semibold text-rose-500"
              >
                <div className="h-2 w-2 rounded-full bg-rose-500" />
                <HugeiconsIcon icon={WifiError01Icon} className="h-3.5 w-3.5" />
                Server ML Offline
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <CardDescription>
          Masukkan parameter laboratorium pasien untuk memulai klasifikasi otomatis.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-8">

        {/* Offline warning banner */}
        <AnimatePresence>
          {apiStatus === 'offline' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600">
                <HugeiconsIcon icon={WifiError01Icon} className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">Server Machine Learning tidak aktif</p>
                  <p className="text-xs mt-0.5 opacity-80">
                    Prediksi tidak dapat dilakukan. Jalankan server dengan perintah{' '}
                    <code className="bg-rose-500/20 px-1 py-0.5 rounded font-mono">python app.py</code>{' '}
                    di direktori Model-XGBOOST.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-300 ${apiStatus === 'offline' ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* Informasi Dasar */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-purple-500 uppercase tracking-wider mb-2">
                <HugeiconsIcon icon={UserGroupIcon} className="h-4 w-4" />
                Informasi Dasar
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nama_pasien">Nama Lengkap Pasien</Label>
                <Input 
                  id="nama_pasien" 
                  placeholder="Contoh: Budi Santoso" 
                  required
                  {...register('nama_pasien')}
                  className="bg-background/50"
                />
                {errors.nama_pasien && <p className="text-xs text-destructive">{errors.nama_pasien.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="umur">Umur</Label>
                  <Input 
                    id="umur" 
                    type="number"
                    required
                    {...register('umur')}
                    className="bg-background/50"
                  />
                  {errors.umur && <p className="text-xs text-destructive">{errors.umur.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                  <Select 
                    defaultValue="L"
                    onValueChange={(value) => setValue('jenis_kelamin', value as 'L' | 'P')}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Pilih" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Laki-laki</SelectItem>
                      <SelectItem value="P">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Parameter Lab */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-500 uppercase tracking-wider mb-2">
                <HugeiconsIcon icon={CalculatorIcon} className="h-4 w-4" />
                Parameter Laboratorium
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tsh">TSH</Label>
                  <Input id="tsh" type="number" step="0.01" required {...register('tsh')} className="bg-background/50" />
                  {errors.tsh && <p className="text-xs text-destructive">{errors.tsh.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="t3">T3</Label>
                  <Input id="t3" type="number" step="0.01" required {...register('t3')} className="bg-background/50" />
                  {errors.t3 && <p className="text-xs text-destructive">{errors.t3.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tt4">TT4</Label>
                  <Input id="tt4" type="number" step="0.01" required {...register('tt4')} className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fti">FTI</Label>
                  <Input id="fti" type="number" step="0.01" required {...register('fti')} className="bg-background/50" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-2xl border border-border/50">
            <HugeiconsIcon icon={InformationCircleIcon} className="h-5 w-5 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground">
              Pastikan semua data laboratorium sudah sesuai dengan hasil tes fisik untuk akurasi prediksi model XGBoost.
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={isPending || apiStatus !== 'online'}
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                />
                Memproses Klasifikasi...
              </div>
            ) : apiStatus === 'offline' ? (
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={WifiError01Icon} className="h-4 w-4" />
                Server ML Tidak Tersedia
              </div>
            ) : apiStatus === 'checking' ? (
              'Memeriksa Koneksi...'
            ) : (
              'Analisis Sekarang'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
