'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Hospital, Loader2, UserPlus, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      toast.success('Registrasi berhasil! Silakan cek email Anda untuk verifikasi.')
      router.push('/login')
    } catch (error: any) {
      toast.error(error.message || 'Terjadi kesalahan saat registrasi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-indigo-50 to-slate-100 dark:from-slate-900 dark:via-indigo-900 dark:to-slate-900 p-4 transition-colors duration-300">
      {/* Floating Back to Landing Page Button */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors bg-white/60 dark:bg-slate-950/40 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-md group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Landing Page
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-indigo-500/20">
            <Hospital className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight text-center">
            Daftar Akun Baru
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-center">
            Sistem Informasi Klasifikasi Penyakit Tiroid
          </p>
        </div>

        <Card className="border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-slate-900 dark:text-white">Buat Akun</CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Lengkapi data di bawah ini untuk mulai menggunakan sistem.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-slate-700 dark:text-slate-300">Nama Lengkap</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Muhammad Ali"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="bg-white/80 dark:bg-slate-950/50 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-indigo-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@hospital.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/80 dark:bg-slate-950/50 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-indigo-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-white/80 dark:bg-slate-950/50 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus-visible:ring-indigo-500 transition-colors"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-6">
              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-6 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Daftar Sekarang
                  </>
                )}
              </Button>
              <div className="text-sm text-center text-slate-500 dark:text-slate-400">
                Sudah punya akun?{' '}
                <Link href="/login" className="text-indigo-600 hover:text-indigo-505 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold transition-colors">
                  Login di sini
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
