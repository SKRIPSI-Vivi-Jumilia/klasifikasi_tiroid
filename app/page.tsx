'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Hospital, 
  ArrowRight, 
  Brain, 
  Activity, 
  ShieldCheck, 
  History, 
  Sparkles,
  Database,
  Cpu,
  Clock,
  HeartPulse
} from 'lucide-react'

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 20 }
    }
  }

  const features = [
    {
      icon: <Brain className="h-6 w-6 text-purple-400" />,
      title: "XGBoost Machine Learning",
      description: "Klasifikasi penyakit tiroid menggunakan model XGBoost dengan akurasi dan presisi tinggi."
    },
    
    {
      icon: <History className="h-6 w-6 text-purple-400" />,
      title: "Riwayat Medis Terintegrasi",
      description: "Simpan dan lacak riwayat pemeriksaan pasien secara terstruktur untuk referensi medis mendatang."
    },

    {
      icon: <Cpu className="h-6 w-6 text-purple-400" />,
      title: "Analisis Instan",
      description: "Dapatkan hasil diagnosis tiroid (Normal, Hipotiroid, Hipertiroid) dalam hitungan detik setelah input data."
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden selection:bg-purple-500/30 selection:text-purple-200">
      {/* Background Magic Grid & Lights */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[600px] right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Navigation Bar */}
      <nav className="relative z-50 border-b border-slate-900 bg-slate-950/60 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Hospital className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Thyroid Classification
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors py-2 px-4"
            >
              Masuk
            </Link>
            <Link 
              href="/register" 
              className="relative inline-flex items-center gap-2 py-2.5 px-5 rounded-2xl bg-white text-slate-950 text-sm font-semibold hover:bg-slate-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
            >
              Daftar Akun
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-28 max-w-7xl mx-auto px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.1] bg-gradient-to-b from-white via-slate-100 to-slate-500 bg-clip-text text-transparent"
        >
          Klasifikasi Penyakit Tiroid Berbasis XGBoost 
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-slate-400 text-lg sm:text-xl max-w-3xl mx-auto mt-8 leading-relaxed"
        >
          Membantu masyarakat melakukan skrining awal kondisi tiroid secara cepat dan mudah menggunakan parameter klinis berbasis data.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link 
            href="/login" 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-purple-500/25 transition-all group"
          >
            Mulai Diagnosis
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link 
            href="#fitur" 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all"
          >
            Pelajari Fitur
          </Link>
        </motion.div>

        {/* Dashboard Mockup Preview */}
        
      </section>

      {/* Feature Section */}
      <section id="fitur" className="relative z-10 py-16 border-t border-slate-900 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-5xl font-bold bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
              Fitur Utama Thyroid Classification
            </h2>
            <p className="text-slate-400 text-lg mt-4">
              Dirancang dengan integrasi teknologi modern untuk mempermudah alur kerja diagnosis klinis.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="group relative rounded-3xl border border-slate-900 bg-slate-950 p-8 hover:border-slate-800 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)]"
              >
                <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats/Highlight Section */}
      <section className="relative z-10 py-24 border-t border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-2">
            <div className="text-5xl font-extrabold text-purple-500 flex items-center justify-center">
              <Clock className="h-8 w-8 text-purple-400 mr-2" />
              &lt; 2s
            </div>
            <h4 className="text-lg font-bold">Waktu Diagnosis</h4>
            <p className="text-slate-400 text-sm">Klasifikasi instan setelah parameter diinputkan.</p>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-extrabold text-indigo-500">98.4%</div>
            <h4 className="text-lg font-bold">Akurasi XGBoost</h4>
            <p className="text-slate-400 text-sm">Dilatih menggunakan dataset klinis yang tervalidasi.</p>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-extrabold text-purple-500">100%</div>
            <h4 className="text-lg font-bold">Keamanan Data</h4>
            <p className="text-slate-400 text-sm">Sertifikat enkripsi SSL dan row-level security Supabase.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-28 border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-3xl blur-3xl pointer-events-none -z-10" />
          
          <h2 className="text-3xl sm:text-5xl font-bold bg-gradient-to-b from-white to-slate-350 bg-clip-text text-transparent">
            Siap Mengoptimalkan Diagnosis Klinis?
          </h2>
          <p className="text-slate-400 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
            Daftarkan akun medis Anda sekarang dan nikmati kemudahan melakukan analisis tiroid pasien dengan model klasifikasi terbaik.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/register" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-white text-slate-950 font-bold hover:bg-slate-100 transition-all shadow-[0_0_25px_rgba(255,255,255,0.15)]"
            >
              Registrasi Sekarang
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link 
              href="/login" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all"
            >
              Masuk Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950 py-12 text-center text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Hospital className="h-5 w-5 text-slate-600" />
            <span className="font-semibold text-slate-400">Thyroid classification</span>
          </div>
          <p className="text-slate-600">
            &copy; {new Date().getFullYear()} Thyroid Classification. All rights reserved. Hubungi admin untuk akses khusus.
          </p>
        </div>
      </footer>
    </div>
  )
}
