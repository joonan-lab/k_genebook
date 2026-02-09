import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { formatScientific, getPmidCount, type GeneData } from "@/lib/gene-utils"
import { FilterPanel } from "./FilterPanel"
import { DownloadButton } from "./DownloadButton"

interface GeneTableProps {
  data: GeneData[]
}

function NumericCell({ value }: { value: number | null }) {
  return <span className="font-mono text-xs">{formatScientific(value)}</span>
}

function PmidCountCell({ value }: { value: string }) {
  const count = getPmidCount(value)
  if (count === 0) return <span className="text-muted-foreground">-</span>
  return <span className="text-xs">{count}</span>
}

export function GeneTable({ data }: GeneTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [advancedFilter, setAdvancedFilter] = useState<((data: GeneData[]) => GeneData[]) | null>(null)

  const filteredData = useMemo(() => {
    if (!advancedFilter) return data
    return advancedFilter(data)
  }, [data, advancedFilter])

  const columns = useMemo<ColumnDef<GeneData>[]>(
    () => [
      {
        accessorKey: "gene",
        header: ({ column }) => (
          <Button variant="ghost" size="sm" onClick={() => column.toggleSorting()}>
            Gene <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
        ),
        cell: ({ row }) => (
          <Link
            to={`/gene/${row.original.gene}`}
            className="font-medium text-primary hover:underline"
          >
            {row.original.gene}
          </Link>
        ),
      },
      {
        accessorKey: "ASD_female_qval",
        header: ({ column }) => (
          <Button variant="ghost" size="sm" onClick={() => column.toggleSorting()}>
            Female q-val <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
        ),
        cell: ({ row }) => <NumericCell value={row.original.ASD_female_qval} />,
        sortingFn: (a, b) => {
          const va = a.original.ASD_female_qval
          const vb = b.original.ASD_female_qval
          if (va === null && vb === null) return 0
          if (va === null) return 1
          if (vb === null) return -1
          return va - vb
        },
      },
      {
        accessorKey: "ASD_male_qval",
        header: ({ column }) => (
          <Button variant="ghost" size="sm" onClick={() => column.toggleSorting()}>
            Male q-val <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
        ),
        cell: ({ row }) => <NumericCell value={row.original.ASD_male_qval} />,
        sortingFn: (a, b) => {
          const va = a.original.ASD_male_qval
          const vb = b.original.ASD_male_qval
          if (va === null && vb === null) return 0
          if (va === null) return 1
          if (vb === null) return -1
          return va - vb
        },
      },
      {
        accessorKey: "FDR_TADA_ASD",
        header: ({ column }) => (
          <Button variant="ghost" size="sm" onClick={() => column.toggleSorting()}>
            FDR ASD <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
        ),
        cell: ({ row }) => <NumericCell value={row.original.FDR_TADA_ASD} />,
        sortingFn: (a, b) => {
          const va = a.original.FDR_TADA_ASD
          const vb = b.original.FDR_TADA_ASD
          if (va === null && vb === null) return 0
          if (va === null) return 1
          if (vb === null) return -1
          return va - vb
        },
      },
      {
        accessorKey: "FDR_TADA_DD",
        header: ({ column }) => (
          <Button variant="ghost" size="sm" onClick={() => column.toggleSorting()}>
            FDR DD <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
        ),
        cell: ({ row }) => <NumericCell value={row.original.FDR_TADA_DD} />,
        sortingFn: (a, b) => {
          const va = a.original.FDR_TADA_DD
          const vb = b.original.FDR_TADA_DD
          if (va === null && vb === null) return 0
          if (va === null) return 1
          if (vb === null) return -1
          return va - vb
        },
      },
      {
        accessorKey: "FDR_TADA_NDD",
        header: ({ column }) => (
          <Button variant="ghost" size="sm" onClick={() => column.toggleSorting()}>
            FDR NDD <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
        ),
        cell: ({ row }) => <NumericCell value={row.original.FDR_TADA_NDD} />,
        sortingFn: (a, b) => {
          const va = a.original.FDR_TADA_NDD
          const vb = b.original.FDR_TADA_NDD
          if (va === null && vb === null) return 0
          if (va === null) return 1
          if (vb === null) return -1
          return va - vb
        },
      },
      {
        accessorKey: "Mouse",
        header: "Mouse",
        cell: ({ row }) => <PmidCountCell value={row.original.Mouse} />,
      },
      {
        accessorKey: "Drosophila",
        header: "Drosophila",
        cell: ({ row }) => <PmidCountCell value={row.original.Drosophila} />,
      },
      {
        accessorKey: "Zebrafish",
        header: "Zebrafish",
        cell: ({ row }) => <PmidCountCell value={row.original.Zebrafish} />,
      },
      {
        accessorKey: "Rat",
        header: "Rat",
        cell: ({ row }) => <PmidCountCell value={row.original.Rat} />,
      },
      {
        accessorKey: "Primate",
        header: "Primate",
        cell: ({ row }) => <PmidCountCell value={row.original.Primate} />,
      },
      {
        accessorKey: "Organoid",
        header: "Organoid",
        cell: ({ row }) => <PmidCountCell value={row.original.Organoid} />,
      },
      {
        accessorKey: "Human cell",
        header: "Human cell",
        cell: ({ row }) => <PmidCountCell value={row.original["Human cell"]} />,
      },
    ],
    []
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      return row.original.gene.toLowerCase().includes(filterValue.toLowerCase())
    },
    initialState: {
      pagination: { pageSize: 25 },
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search genes..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-xs"
        />
        <FilterPanel
          onFilter={(fn) => setAdvancedFilter(() => fn)}
        />
        <DownloadButton data={table.getFilteredRowModel().rows.map((r) => r.original)} />
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="whitespace-nowrap px-2 py-2 text-left font-medium">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t hover:bg-muted/30 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-2 py-1.5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} genes
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={String(table.getState().pagination.pageSize)}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="w-20"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </span>
          <Button
            variant="outline"
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
