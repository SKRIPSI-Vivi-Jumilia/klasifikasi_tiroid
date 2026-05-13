'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import { 
  UserGroupIcon, 
  MedicalFileIcon, 
  ChampionIcon, 
  Alert01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon
} from '@hugeicons/core-free-icons'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DashboardStatsClientProps {
  stats: any
}

export function DashboardStatsClient({ stats }: DashboardStatsClientProps) {
  const { totalPatients, totalExams, categoryCounts, recentExams } = stats

  const pieData = [
    { name: 'Normal', value: categoryCounts.normal, color: '#10b981' },
    { name: 'Hyperthyroid', value: categoryCounts.hyper, color: '#f59e0b' },
    { name: 'Hypothyroid', value: categoryCounts.hypo, color: '#ef4444' },
    { name: 'Lainnya', value: categoryCounts.other, color: '#6366f1' },
  ].filter(d => d.value > 0)

  const barData = [
    { name: 'Normal', count: categoryCounts.normal },
    { name: 'Hyper', count: categoryCounts.hyper },
    { name: 'Hypo', count: categoryCounts.hypo },
  ]

  return (
    <div className="space-y-8 pb-20">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Pasien" 
          value={totalPatients} 
          icon={UserGroupIcon} 
          trend="+2 Baru" 
          color="purple" 
        />
        <StatCard 
          title="Total Pemeriksaan" 
          value={totalExams} 
          icon={MedicalFileIcon} 
          trend="Semua Waktu" 
          color="blue" 
        />
        <StatCard 
          title="Kasus Normal" 
          value={categoryCounts.normal} 
          icon={CheckmarkCircle02Icon} 
          trend="Status Aman" 
          color="emerald" 
        />
        <StatCard 
          title="Butuh Atensi" 
          value={categoryCounts.hyper + categoryCounts.hypo} 
          icon={Alert01Icon} 
          trend="Segera Hubungi" 
          color="amber" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chart Area */}
        <Card className="lg:col-span-8 border-none shadow-2xl bg-card/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Distribusi Diagnosis</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.5 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.5 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : index === 1 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart / Summary Area */}
        <Card className="lg:col-span-4 border-none shadow-2xl bg-card/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Persentase</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] flex flex-col items-center">
            <ResponsiveContainer width="100%" height="70%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-2 mt-4">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-bold">{Math.round((item.value / totalExams) * 100)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <HugeiconsIcon icon={Clock01Icon} className="h-5 w-5 text-purple-500" />
          Aktivitas Terbaru
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {recentExams.map((exam: any) => (
            <motion.div 
              key={exam.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-card/30 border border-border/50 flex items-center justify-between hover:bg-card/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                  {exam.pasien?.nama[0]}
                </div>
                <div>
                  <div className="font-bold text-sm">{exam.pasien?.nama}</div>
                  <div className="text-[10px] text-muted-foreground uppercase">
                    {new Date(exam.created_at).toLocaleDateString('id-ID')} • {new Date(exam.created_at).toLocaleTimeString('id-ID')}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right mr-4">
                  <div className={`text-[10px] font-black uppercase tracking-widest ${
                    exam.hasil_klasifikasi.toLowerCase() === 'normal' ? 'text-emerald-500' : 'text-rose-500'
                  }`}>
                    {exam.hasil_klasifikasi}
                  </div>
                  <div className="text-[9px] text-muted-foreground">Confidence: {(exam.confidence * 100).toFixed(1)}%</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, trend, color }: any) {
  const colorMap: any = {
    purple: 'from-purple-500/20 to-purple-500/5 text-purple-500',
    blue: 'from-blue-500/20 to-blue-500/5 text-blue-500',
    emerald: 'from-emerald-500/20 to-emerald-500/5 text-emerald-500',
    amber: 'from-amber-500/20 to-amber-500/5 text-amber-500',
  }

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`p-6 rounded-3xl bg-card/30 backdrop-blur-xl border border-border/50 shadow-xl shadow-purple-500/5 relative overflow-hidden group`}
    >
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${colorMap[color]} blur-2xl opacity-50 group-hover:opacity-80 transition-opacity`} />
      
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl bg-card/50 border border-border/50 ${colorMap[color].split(' ').pop()}`}>
          <HugeiconsIcon icon={icon} className="h-6 w-6" />
        </div>
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{trend}</div>
      </div>
      
      <div className="space-y-1">
        <div className="text-3xl font-black">{value}</div>
        <div className="text-xs text-muted-foreground font-medium">{title}</div>
      </div>
    </motion.div>
  )
}
