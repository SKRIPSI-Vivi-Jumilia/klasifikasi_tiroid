'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { HugeiconsIcon } from '@hugeicons/react'
import { 
  StatusIcon, 
  UserGroupIcon, 
  CalculatorIcon,
  InformationCircleIcon
} from '@hugeicons/core-free-icons'
import { motion } from 'framer-motion'

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

interface PredictionFormProps {
  onSuccess: (result: PredictionResult) => void
}

export function PredictionForm({ onSuccess }: PredictionFormProps) {
  const [isPending, setIsPending] = React.useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jenis_kelamin: 'L',
    },
  })

  const onSubmit = async (values: FormValues) => {
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
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-600 rounded-lg shadow-lg shadow-purple-500/20">
            <HugeiconsIcon icon={StatusIcon} className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Data Klinis Pasien</CardTitle>
        </div>
        <CardDescription>
          Masukkan parameter laboratorium pasien untuk memulai klasifikasi otomatis.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    {...register('umur')}
                    className="bg-background/50"
                  />
                  {errors.umur && <p className="text-xs text-destructive">{errors.umur.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                  <Select onValueChange={(value) => setValue('jenis_kelamin', value as 'L' | 'P')}>
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
                  <Input id="tsh" type="number" step="0.01" {...register('tsh')} className="bg-background/50" />
                  {errors.tsh && <p className="text-xs text-destructive">{errors.tsh.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="t3">T3</Label>
                  <Input id="t3" type="number" step="0.01" {...register('t3')} className="bg-background/50" />
                  {errors.t3 && <p className="text-xs text-destructive">{errors.t3.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tt4">TT4</Label>
                  <Input id="tt4" type="number" step="0.01" {...register('tt4')} className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fti">FTI</Label>
                  <Input id="fti" type="number" step="0.01" {...register('fti')} className="bg-background/50" />
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
            className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/20"
            disabled={isPending}
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
            ) : (
              'Analisis Sekarang'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
