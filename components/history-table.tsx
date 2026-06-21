'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { 
  MoreVerticalCircle01Icon, 
  Search01Icon,
  EyeIcon,
  Delete02Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  FilterIcon,
  MedicalFileIcon
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Badge } from '@/components/ui/badge'
import { DetailExaminationModal } from './detail-examination-modal'
import { deleteExamination } from '@/app/actions/examination-actions'
import { toast } from 'sonner'

interface HistoryTableProps {
  data: any[]
}

export function HistoryTable({ data }: HistoryTableProps) {
  const router = useRouter()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [selectedExamine, setSelectedExamine] = React.useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'created_at',
      header: 'Tanggal',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">
            {new Date(row.original.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase">
            {new Date(row.original.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'pasien.nama',
      header: 'Pasien',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">
            {(row.original.pasien?.nama || 'A')[0]}
          </div>
          <span className="font-semibold text-sm">{row.original.pasien?.nama || 'Anonim'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'hasil_klasifikasi',
      header: 'Diagnosis',
      cell: ({ row }) => {
        const value = row.getValue('hasil_klasifikasi') as string
        const lowerValue = value?.toLowerCase() || ''
        const isNormal = lowerValue === 'normal'
        const isHyper = lowerValue.includes('hyper') || lowerValue.includes('hiper')
        const isHypo = lowerValue.includes('hypo') || lowerValue.includes('hipo')
        
        let colorClass = 'text-blue-500 bg-blue-500/5 border-blue-500/20'
        if (isNormal) colorClass = 'text-emerald-500 bg-emerald-500/5 border-emerald-500/20'
        else if (isHyper) colorClass = 'text-rose-500 bg-rose-500/5 border-rose-500/20'
        else if (isHypo) colorClass = 'text-amber-500 bg-amber-500/5 border-amber-500/20'

        return (
          <Badge 
            variant="outline" 
            className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${colorClass}`}
          >
            {value}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'confidence',
      header: 'Confidence',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 rounded-full" 
              style={{ width: `${(row.getValue('confidence') as number) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium">
            {((row.getValue('confidence') as number) * 100).toFixed(1)}%
          </span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 hover:bg-purple-100/50 text-purple-600 rounded-full"
              title="Lihat Detail"
              onClick={() => {
                setSelectedExamine(row.original)
                setIsModalOpen(true)
              }}
            >
              <HugeiconsIcon icon={EyeIcon} className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 hover:bg-rose-100/50 text-rose-600 rounded-full"
              title="Hapus Data"
              onClick={async () => {
                if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
                  const res = await deleteExamination(row.original.id)
                  if (res.success) {
                    toast.success('Data berhasil dihapus')
                    router.refresh()
                  } else {
                    toast.error(res.error)
                  }
                }
              }}
            >
              <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  const exportToCSV = () => {
  const rows = table.getFilteredRowModel().rows

  const headers = [
    'Tanggal',
    'Waktu',
    'Nama Pasien',
    'Umur',
    'Jenis Kelamin',
    'TSH',
    'T3',
    'TT4',
    'FTI',
    'Diagnosis',
    'Confidence'
  ]

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => {
      const date = new Date(row.original.created_at).toLocaleDateString('id-ID')
      const time = new Date(row.original.created_at).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      })

      return [
        date,
        time,
        `"${row.original.pasien?.nama ?? 'Anonim'}"`,
        row.original.umur ?? '',
        row.original.jenis_kelamin ?? '',
        row.original.tsh ?? '',
        row.original.t3 ?? '',
        row.original.tt4 ?? '',
        row.original.fti ?? '',
        row.original.hasil_klasifikasi ?? '',
        `${((Number(row.original.confidence) || 0) * 100).toFixed(1)}%`
      ].join(',')
    })
  ].join('\n')

  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;'
  })

  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.setAttribute(
    'download',
    `riwayat_tiroid_${new Date().toISOString().split('T')[0]}.csv`
  )

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari pasien..."
            value={(table.getColumn('pasien_nama')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('pasien_nama')?.setFilterValue(event.target.value)
            }
            className="pl-10 bg-card/30 border-none shadow-inner h-11 rounded-2xl focus-visible:ring-purple-500/20"
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-2xl h-11 border-none shadow-sm bg-card/30 gap-2">
                <HugeiconsIcon icon={FilterIcon} className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl bg-card/80 backdrop-blur-xl border-border/50">
              <DropdownMenuItem onClick={() => table.getColumn('hasil_klasifikasi')?.setFilterValue('')}>Semua Diagnosis</DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn('hasil_klasifikasi')?.setFilterValue('Normal')}>Normal</DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn('hasil_klasifikasi')?.setFilterValue('Hipertiroid')}>Hipertiroid</DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn('hasil_klasifikasi')?.setFilterValue('Hipotiroid')}>Hipotiroid</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            onClick={exportToCSV}
            variant="outline" 
            className="rounded-2xl h-11 border-none shadow-sm bg-card/30 hover:bg-purple-500/10 hover:text-purple-600 transition-colors"
          >
            Export CSV
          </Button>
        </div>
      </div>

      <div className="rounded-3xl border border-border/50 bg-card/30 backdrop-blur-xl overflow-hidden shadow-2xl shadow-purple-500/5">
        <Table>
          <TableHeader className="bg-muted/30">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-border/50 hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-xs font-bold uppercase tracking-widest py-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="border-border/50 hover:bg-purple-500/[0.02] transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <div className="p-3 bg-muted rounded-full">
                      <HugeiconsIcon icon={MedicalFileIcon} className="h-6 w-6" />
                    </div>
                    <p className="font-medium">Belum ada riwayat pemeriksaan</p>
                    <p className="text-xs">Mulai dengan membuat prediksi baru.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-xs text-muted-foreground font-medium">
          Menampilkan {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} - {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, data.length)} dari {data.length} data
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-xl h-9 px-4 border-border/50"
          >
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-xl h-9 px-4 border-border/50"
          >
            Selanjutnya
          </Button>
        </div>
      </div>

      <DetailExaminationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        examination={selectedExamine} 
      />
    </div>
  )
}
