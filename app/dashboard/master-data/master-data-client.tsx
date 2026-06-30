'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Dna, 
  Cpu, 
  UserCheck, 
  UserMinus, 
  ShieldAlert, 
  ShieldCheck,
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  Calendar, 
  Percent, 
  CheckCircle,
  Database,
  Search,
  Activity,
  Upload,
  RefreshCcw
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { toggleUserStatus, changeUserRole } from '@/app/actions/user-actions'
import { upsertReferenceValue, deleteReferenceValue, addModelConfig } from '@/app/actions/master-data-actions'

interface MasterDataClientProps {
  users: any[]
  references: any[]
  modelConfigs: any[]
}

export function MasterDataClient({ users, references, modelConfigs }: MasterDataClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'users' | 'references' | 'model'>('users')
  const [searchUser, setSearchUser] = useState('')
  const [isPending, setIsPending] = useState(false)

  // Dialog State for Reference Value
  const [isOpenRefDialog, setIsOpenRefDialog] = useState(false)
  const [editingRef, setEditingRef] = useState<any>(null)
  const [refForm, setRefForm] = useState({
    parameter: '',
    nama_parameter: '',
    nilai_min: '',
    nilai_max: '',
    satuan: ''
  })

  // Model Training State
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isTraining, setIsTraining] = useState(false)
  const [trainingResult, setTrainingResult] = useState<{
    accuracy: number
    precision: number
    recall: number
    f1_score: number
  } | null>(null)

  // Handlers for User Management
  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    setIsPending(true)
    const res = await toggleUserStatus(userId, currentStatus)
    setIsPending(false)
    if (res.success) {
      toast.success('Status pengguna berhasil diperbarui')
      router.refresh()
    } else {
      toast.error('Gagal memperbarui status: ' + res.error)
    }
  }

  const handleChangeRole = async (userId: string, currentRole: string) => {
    setIsPending(true)
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    const res = await changeUserRole(userId, newRole)
    setIsPending(false)
    if (res.success) {
      toast.success(`Role pengguna berhasil diubah menjadi ${newRole}`)
      router.refresh()
    } else {
      toast.error('Gagal mengubah role: ' + res.error)
    }
  }

  // Handlers for Reference Values
  const handleOpenAddRef = () => {
    setEditingRef(null)
    setRefForm({
      parameter: '',
      nama_parameter: '',
      nilai_min: '',
      nilai_max: '',
      satuan: ''
    })
    setIsOpenRefDialog(true)
  }

  const handleOpenEditRef = (ref: any) => {
    setEditingRef(ref)
    setRefForm({
      parameter: ref.parameter,
      nama_parameter: ref.nama_parameter,
      nilai_min: ref.nilai_min.toString(),
      nilai_max: ref.nilai_max.toString(),
      satuan: ref.satuan
    })
    setIsOpenRefDialog(true)
  }

  const handleSaveRef = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!refForm.parameter || !refForm.nama_parameter || !refForm.nilai_min || !refForm.nilai_max || !refForm.satuan) {
      toast.error('Harap isi semua kolom data referensi')
      return
    }

    setIsPending(true)
    const res = await upsertReferenceValue({
      id: editingRef?.id,
      parameter: refForm.parameter,
      nama_parameter: refForm.nama_parameter,
      nilai_min: parseFloat(refForm.nilai_min),
      nilai_max: parseFloat(refForm.nilai_max),
      satuan: refForm.satuan
    })
    setIsPending(false)

    if (res.success) {
      toast.success(editingRef ? 'Data referensi diperbarui' : 'Referensi baru ditambahkan')
      setIsOpenRefDialog(false)
      router.refresh()
    } else {
      toast.error('Gagal menyimpan referensi: ' + res.error)
    }
  }

  const handleDeleteRef = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus parameter referensi ini?')) return

    setIsPending(true)
    const res = await deleteReferenceValue(id)
    setIsPending(false)

    if (res.success) {
      toast.success('Referensi berhasil dihapus')
      router.refresh()
    } else {
      toast.error('Gagal menghapus referensi: ' + res.error)
    }
  }

  // Filtering users
  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchUser.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchUser.toLowerCase())
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
      setTrainingResult(null)
    }
  }

  const handleStartTraining = async () => {
    if (!selectedFile) {
      toast.error('Harap pilih file dataset (.csv)')
      return
    }

    setIsTraining(true)
    setTrainingResult(null)
    
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('http://localhost:5000/train-model', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Gagal melakukan training model')
      }

      const data = await response.json()
      
      if (data.success) {
        setTrainingResult({
          accuracy: data.accuracy,
          precision: data.precision,
          recall: data.recall,
          f1_score: data.f1_score
        })
        
        toast.success('Model berhasil diperbarui')

        const currentVersion = modelConfigs.length > 0 ? parseFloat(modelConfigs[0].versi.replace('v', '')) : 0
        const newVersion = `v${(currentVersion + 0.1).toFixed(1)}`

        await addModelConfig({
          versi: newVersion,
          akurasi: data.accuracy
        })
        
        setSelectedFile(null)
        router.refresh()
      } else {
        throw new Error(data.error || 'Terjadi kesalahan saat training')
      }
    } catch (error: any) {
      toast.error(error.message || 'Gagal terhubung ke server Flask')
    } finally {
      setIsTraining(false)
    }
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent tracking-tight">
            Master Data & Settings
          </h1>
          <p className="text-muted-foreground text-sm">
            Panel administratif untuk mengelola pengguna, parameter normal medis, dan model klasifikasi tiroid.
          </p>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex bg-card/40 backdrop-blur-xl border border-border/50 p-1.5 rounded-2xl max-w-lg">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
            activeTab === 'users'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="h-4 w-4" />
          Pengguna
        </button>

        {/* start button menu lab referensi */}
        {/* <button
          onClick={() => setActiveTab('references')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
            activeTab === 'references'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Dna className="h-4 w-4" />
          Lab Referensi
        </button> */}
        {/* end button menu lab refrensi */}

        <button
          onClick={() => setActiveTab('model')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
            activeTab === 'model'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Cpu className="h-4 w-4" />
          Model Config
        </button>
      </div>

      {/* Tab Contents */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border-none shadow-2xl bg-card/30 backdrop-blur-xl">
                <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl font-bold">Manajemen Pengguna</CardTitle>
                    <CardDescription>Aktifkan/nonaktifkan akun petugas medis dan perbarui hak akses role mereka.</CardDescription>
                  </div>
                  <div className="relative w-full md:w-72">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari nama atau email..."
                      value={searchUser}
                      onChange={e => setSearchUser(e.target.value)}
                      className="pl-10 bg-background/50 border-border/50 text-sm"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-2xl border border-border/40 overflow-hidden bg-background/20">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead className="font-bold">Pengguna</TableHead>
                          <TableHead className="font-bold">Role</TableHead>
                          <TableHead className="font-bold">Status</TableHead>
                          <TableHead className="font-bold">Terdaftar</TableHead>
                          <TableHead className="text-right font-bold">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <TableRow key={user.id} className="hover:bg-muted/10 transition-colors">
                              <TableCell className="py-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 bg-purple-500/10 text-purple-500 font-black rounded-xl flex items-center justify-center uppercase border border-purple-500/10">
                                    {user.full_name ? user.full_name[0] : 'U'}
                                  </div>
                                  <div>
                                    <div className="font-bold text-sm text-foreground">{user.full_name || 'No Name'}</div>
                                    <div className="text-xs text-muted-foreground">{user.email || 'No Email'}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {user.role === 'admin' ? (
                                  <Badge className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border border-purple-500/20 text-[10px] font-black uppercase tracking-wider px-2.5 py-1">
                                    Admin
                                  </Badge>
                                ) : (
                                  <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border border-blue-500/20 text-[10px] font-black uppercase tracking-wider px-2.5 py-1">
                                    User
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {user.status === 'active' ? (
                                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-500 font-semibold">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Aktif
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                                    Nonaktif
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID') : '-'}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={isPending}
                                    onClick={() => handleChangeRole(user.id, user.role)}
                                    className="h-8 text-xs font-bold border-border/50 bg-background/50 hover:bg-muted"
                                  >
                                    {user.role === 'admin' ? (
                                      <>
                                        <UserMinus className="h-3 w-3 mr-1" />
                                        Downgrade
                                      </>
                                    ) : (
                                      <>
                                        <UserCheck className="h-3 w-3 mr-1 text-purple-500" />
                                        Make Admin
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant={user.status === 'active' ? 'destructive' : 'default'}
                                    disabled={isPending}
                                    onClick={() => handleToggleStatus(user.id, user.status)}
                                    className={`h-8 text-xs font-bold ${
                                      user.status === 'active' 
                                        ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20'
                                        : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20'
                                    }`}
                                  >
                                    {user.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground text-sm">
                              Tidak ada data pengguna ditemukan.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'references' && (
            <motion.div
              key="references"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {/* start isi menu lab referensi */}
              {/* <Card className="border-none shadow-2xl bg-card/30 backdrop-blur-xl">
                <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Database className="h-5 w-5 text-purple-500" />
                      Parameter Nilai Referensi Lab
                    </CardTitle>
                    <CardDescription>
                      Atur ambang batas minimum dan maksimum nilai rujukan klinis untuk diagnosis tiroid.
                    </CardDescription>
                  </div>
                  <Button onClick={handleOpenAddRef} className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider py-5 rounded-xl shadow-lg shadow-purple-500/20">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Parameter
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="rounded-2xl border border-border/40 overflow-hidden bg-background/20">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead className="font-bold">Parameter</TableHead>
                          <TableHead className="font-bold">Nama Lengkap</TableHead>
                          <TableHead className="font-bold">Batas Min</TableHead>
                          <TableHead className="font-bold">Batas Max</TableHead>
                          <TableHead className="font-bold">Satuan</TableHead>
                          <TableHead className="text-right font-bold">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {references.length > 0 ? (
                          references.map((ref) => (
                            <TableRow key={ref.id} className="hover:bg-muted/10 transition-colors">
                              <TableCell className="font-black text-sm text-purple-500">{ref.parameter}</TableCell>
                              <TableCell className="font-semibold text-sm">{ref.nama_parameter}</TableCell>
                              <TableCell className="text-sm font-bold">{ref.nilai_min}</TableCell>
                              <TableCell className="text-sm font-bold">{ref.nilai_max}</TableCell>
                              <TableCell className="text-xs font-semibold text-muted-foreground uppercase">{ref.satuan}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleOpenEditRef(ref)}
                                    className="h-8 w-8 p-0 border-border/50 bg-background/50 hover:bg-muted"
                                  >
                                    <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteRef(ref.id)}
                                    className="h-8 w-8 p-0 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground text-sm">
                              Belum ada data referensi. Silakan tambahkan baru.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card> */}
              {/* end isi menu halaman lab refrensi */}

              {/* Add/Edit Modal */}
              <Dialog open={isOpenRefDialog} onOpenChange={setIsOpenRefDialog}>
                <DialogContent className="bg-card/95 border border-border/50 backdrop-blur-xl max-w-md rounded-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                      {editingRef ? 'Edit Parameter Referensi' : 'Tambah Parameter Referensi'}
                    </DialogTitle>
                    <DialogDescription>
                      Masukkan detail parameter rujukan laboratorium klinis.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSaveRef} className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="parameter">Kode Parameter</Label>
                        <Input
                          id="parameter"
                          placeholder="e.g. TSH"
                          value={refForm.parameter}
                          disabled={!!editingRef}
                          onChange={e => setRefForm({ ...refForm, parameter: e.target.value })}
                          className="bg-background/50 border-border/50 text-sm font-bold uppercase"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="satuan">Satuan</Label>
                        <Input
                          id="satuan"
                          placeholder="e.g. mU/L"
                          value={refForm.satuan}
                          onChange={e => setRefForm({ ...refForm, satuan: e.target.value })}
                          className="bg-background/50 border-border/50 text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nama_parameter">Nama Parameter</Label>
                      <Input
                        id="nama_parameter"
                        placeholder="e.g. Thyroid Stimulating Hormone"
                        value={refForm.nama_parameter}
                        onChange={e => setRefForm({ ...refForm, nama_parameter: e.target.value })}
                        className="bg-background/50 border-border/50 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nilai_min">Batas Minimum</Label>
                        <Input
                          id="nilai_min"
                          type="number"
                          step="0.01"
                          placeholder="0.3"
                          value={refForm.nilai_min}
                          onChange={e => setRefForm({ ...refForm, nilai_min: e.target.value })}
                          className="bg-background/50 border-border/50 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nilai_max">Batas Maksimum</Label>
                        <Input
                          id="nilai_max"
                          type="number"
                          step="0.01"
                          placeholder="5.0"
                          value={refForm.nilai_max}
                          onChange={e => setRefForm({ ...refForm, nilai_max: e.target.value })}
                          className="bg-background/50 border-border/50 text-sm"
                        />
                      </div>
                    </div>
                    <DialogFooter className="pt-4 flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOpenRefDialog(false)}
                        className="flex-1 border-border/50 text-xs font-bold"
                      >
                        Batal
                      </Button>
                      <Button
                        type="submit"
                        disabled={isPending}
                        className="flex-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                      >
                        <Save className="h-3.5 w-3.5 mr-2" />
                        Simpan Perubahan
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </motion.div>
          )}

          {activeTab === 'model' && (
            <motion.div
              key="model"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Model Summary Card */}
                <Card className="lg:col-span-2 border-none shadow-2xl bg-card/30 backdrop-blur-xl relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />
                  <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Activity className="h-5 w-5 text-emerald-500 animate-pulse" />
                      Status Model XGBoost Aktif
                    </CardTitle>
                    <CardDescription>Metrik evaluasi dan informasi siklus rilis machine learning model saat ini.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {modelConfigs.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Algoritma</span>
                            <h3 className="text-2xl font-black text-foreground">Extreme Gradient Boosting</h3>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Versi Model</span>
                            <h3 className="text-xl font-black text-purple-500">{modelConfigs[0].versi}</h3>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Tanggal Rilis / Training</span>
                            <div className="flex items-center gap-2 text-sm font-semibold mt-1">
                              <Calendar className="h-4 w-4 text-purple-400" />
                              {new Date(modelConfigs[0].tanggal_training).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Radial Gauge or Accuracy Display */}
                        <div className="flex flex-col items-center justify-center p-6 bg-purple-500/5 rounded-3xl border border-purple-500/10">
                          <div className="relative h-28 w-28 flex items-center justify-center">
                            {/* Simple border-based ring */}
                            <div className="absolute inset-0 rounded-full border-[10px] border-purple-500/10" />
                            <div className="absolute inset-0 rounded-full border-[10px] border-purple-500 border-t-transparent border-r-transparent animate-[spin_3s_linear_infinite]" />
                            <div className="text-center z-10">
                              <span className="text-3xl font-black tracking-tighter">{(modelConfigs[0].akurasi * 100).toFixed(1)}</span>
                              <span className="text-xs text-muted-foreground font-black">%</span>
                            </div>
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest text-purple-400 mt-4">Akurasi Model</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">Tidak ada model yang aktif ditemukan.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Status Server Flask master data */}
                <Card className="border-none shadow-2xl bg-card/30 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-purple-500" />
                      Flask API Engine
                    </CardTitle>
                    <CardDescription>Konektivitas backend prediksi.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                      <span className="text-xs font-bold text-muted-foreground">Koneksi Server</span>
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-500 font-extrabold uppercase">
                        <CheckCircle className="h-4 w-4" />
                        Online
                      </span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">Endpoint URL</span>
                      <code className="text-xs px-2.5 py-1.5 rounded-lg bg-background/50 border border-border/50 block font-mono overflow-x-auto">
                        http://localhost:5000/predict
                      </code>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">Fitur Input Model</span>
                      <p className="text-xs text-muted-foreground">
                        Model menghitung diagnosa berdasarkan 6 fitur klinis primer: Umur, Jenis Kelamin, TSH, T3, TT4, FTI.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                {/* end card server ml aktif */}
              </div>

              {/* Re-Training Model */}
              <Card className="border-none shadow-2xl bg-card/30 backdrop-blur-xl mt-6">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <RefreshCcw className={`h-5 w-5 text-purple-500 ${isTraining ? 'animate-spin' : ''}`} />
                    Re-Training Model
                  </CardTitle>
                  <CardDescription>Upload dataset CSV terbaru untuk melatih ulang model XGBoost.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-2 w-full">
                      <Label htmlFor="dataset">Upload Dataset (.csv)</Label>
                      <Input 
                        id="dataset" 
                        type="file" 
                        accept=".csv" 
                        onChange={handleFileChange}
                        disabled={isTraining}
                        className="bg-background/50 border-border/50 text-sm cursor-pointer"
                      />
                      {selectedFile && (
                        <p className="text-xs text-muted-foreground mt-1">
                          File terpilih: <span className="font-bold">{selectedFile.name}</span> ({(selectedFile.size / 1024).toFixed(1)} KB)
                        </p>
                      )}
                    </div>
                    <Button 
                      onClick={handleStartTraining} 
                      disabled={!selectedFile || isTraining}
                      className="w-full md:w-auto bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider py-5 rounded-xl shadow-lg shadow-purple-500/20"
                    >
                      {isTraining ? (
                        <>
                          <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Mulai Training
                        </>
                      )}
                    </Button>
                  </div>

                  {trainingResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-4"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                        <h4 className="font-bold text-emerald-500">Model berhasil diperbarui</h4>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-background/50 p-4 rounded-xl border border-border/50">
                          <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block mb-1">Accuracy</span>
                          <span className="text-xl font-black text-foreground">{(trainingResult.accuracy * 100).toFixed(2)}%</span>
                        </div>
                        <div className="bg-background/50 p-4 rounded-xl border border-border/50">
                          <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block mb-1">Precision</span>
                          <span className="text-xl font-black text-foreground">{(trainingResult.precision * 100).toFixed(2)}%</span>
                        </div>
                        <div className="bg-background/50 p-4 rounded-xl border border-border/50">
                          <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block mb-1">Recall</span>
                          <span className="text-xl font-black text-foreground">{(trainingResult.recall * 100).toFixed(2)}%</span>
                        </div>
                        <div className="bg-background/50 p-4 rounded-xl border border-border/50">
                          <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block mb-1">F1 Score</span>
                          <span className="text-xl font-black text-foreground">{(trainingResult.f1_score * 100).toFixed(2)}%</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Version History Table */}
              <div className="mt-8">
                <Card className="border-none shadow-2xl bg-card/30 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Riwayat Rilis Model</CardTitle>
                    <CardDescription>Daftar riwayat model klasifikasi tiroid yang pernah dideploy.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-2xl border border-border/40 overflow-hidden bg-background/20">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead className="font-bold">Versi</TableHead>
                            <TableHead className="font-bold">Akurasi</TableHead>
                            <TableHead className="font-bold">Tanggal Training</TableHead>
                            <TableHead className="font-bold">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {modelConfigs.map((config) => (
                            <TableRow key={config.id} className="hover:bg-muted/10 transition-colors">
                              <TableCell className="font-bold text-sm text-foreground">{config.versi}</TableCell>
                              <TableCell className="text-sm font-bold">{(config.akurasi * 100).toFixed(1)}%</TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {new Date(config.tanggal_training).toLocaleDateString('id-ID')}
                              </TableCell>
                              <TableCell>
                                {config.aktif ? (
                                  <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider">
                                    Aktif
                                  </Badge>
                                ) : (
                                  <Badge className="bg-slate-500/10 text-slate-500 border border-slate-500/20 text-[10px] font-black uppercase tracking-wider">
                                    Arsip
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
