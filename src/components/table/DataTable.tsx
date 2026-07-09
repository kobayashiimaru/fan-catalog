import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import type { Fan } from '@/types/fan'
import { Button } from '@/components/ui/button'
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu'
import { useComparisonStore } from '@/store/comparisonStore'
import { ExportButton } from './ExportButton'
import { getFanIcon } from '@/assets/fanIcons'

interface DataTableProps {
  fans: Fan[]
  loading: boolean
  onFanClick: (fan: Fan) => void
}

export function DataTable({ fans, loading, onFanClick }: DataTableProps) {
  const { t } = useTranslation()
  const { addFan } = useComparisonStore()
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const columns = useMemo<ColumnDef<Fan>[]>(
    () => [
      { id: 'id', header: t('table.id'), accessorKey: 'id' },
      {
        id: 'model',
        header: t('table.model'),
        accessorKey: 'model',
        cell: ({ row }) => {
          const Icon = getFanIcon(row.original.fanType)
          return (
            <div className="flex items-center gap-2">
              <Icon className="h-6 w-6 text-primary" />
              <span className="font-medium">{row.original.model}</span>
            </div>
          )
        },
      },
      { id: 'motorType', header: t('table.motorType'), accessorKey: 'motorType' },
      { id: 'size', header: t('table.size'), accessorKey: 'size', cell: ({ row }) => `${row.original.size}mm` },
      { id: 'supply', header: t('table.supply'), accessorKey: 'supply' },
      { id: 'voltage', header: t('table.voltage'), accessorKey: 'voltage', cell: ({ row }) => `${row.original.voltage}V` },
      { id: 'power', header: t('table.power'), accessorKey: 'power', cell: ({ row }) => `${row.original.power}kW` },
      { id: 'airflow', header: t('table.airflow'), accessorKey: 'airflow', cell: ({ row }) => `${row.original.airflow} m3/h` },
      { id: 'speed', header: t('table.speed'), accessorKey: 'speed', cell: ({ row }) => `${row.original.speed} RPM` },
      { id: 'noise', header: t('table.noise'), accessorKey: 'noise', cell: ({ row }) => `${row.original.noise} dB(A)` },
    ],
    [t],
  )

  const table = useReactTable({
    data: fans,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  if (loading) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-2 text-sm text-[var(--text-muted)]">Loading...</p>
      </div>
    )
  }

  if (fans.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-sm text-[var(--text-muted)]">{t('table.noData')}</p>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] px-4 py-3">
        <span className="text-sm text-[var(--text-secondary)]">
          {fans.length} {t('table.selected')}
        </span>
        <ExportButton fans={fans} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider cursor-pointer select-none hover:text-[var(--text-primary)]"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <ContextMenu key={row.id}>
                <ContextMenuTrigger asChild>
                  <tr
                    className="border-b border-[var(--border-color)] transition-colors hover:bg-[var(--table-hover)] cursor-pointer"
                    onClick={() => onFanClick(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-sm text-[var(--text-primary)] whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => addFan(row.original.id)}>
                    {t('table.contextAddCompare')}
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--border-color)] px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <span>
            {t('table.rowsPerPage')}: 10
          </span>
          <span>
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              fans.length,
            )}{' '}
            {t('table.of')} {fans.length}
          </span>
        </div>
        <div className="flex gap-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}