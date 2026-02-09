import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getPaginationRowModel, getFilteredRowModel, flexRender,
  type ColumnDef, type SortingState,
} from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { useGeneData } from "@/hooks/useGeneData"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DownloadButton } from "@/components/DownloadButton"
import {
  isSignificant, negLog10, getPmidCount,
  MODEL_ORGANISMS, type GeneData,
} from "@/lib/gene-utils"

interface RankedGene {
  rank: number
  gene: string
  compositeScore: number
  sigCount: number
  femaleLogQ: number
  maleLogQ: number
  fdrAsdLogQ: number
  fdrDdLogQ: number
  fdrNddLogQ: number
  modelCount: number
  totalPmids: number
  raw: GeneData
}

function computeScore(g: GeneData): Omit<RankedGene, "rank"> {
  const femaleLogQ = negLog10(g.ASD_female_qval)
  const maleLogQ = negLog10(g.ASD_male_qval)
  const fdrAsdLogQ = negLog10(g.FDR_TADA_ASD)
  const fdrDdLogQ = negLog10(g.FDR_TADA_DD)
  const fdrNddLogQ = negLog10(g.FDR_TADA_NDD)

  let sigCount = 0
  if (isSignificant(g.ASD_female_qval)) sigCount++
  if (isSignificant(g.ASD_male_qval)) sigCount++
  if (isSignificant(g.FDR_TADA_ASD)) sigCount++
  if (isSignificant(g.FDR_TADA_DD)) sigCount++
  if (isSignificant(g.FDR_TADA_NDD)) sigCount++

  let modelCount = 0
  let totalPmids = 0
  for (const m of MODEL_ORGANISMS) {
    const c = getPmidCount(g[m as keyof GeneData] as string)
    if (c > 0) modelCount++
    totalPmids += c
  }

  // Composite score: weighted sum of -log10 values + model evidence
  const compositeScore =
    femaleLogQ * 1.0 +
    maleLogQ * 1.0 +
    fdrAsdLogQ * 1.5 +
    fdrDdLogQ * 1.0 +
    fdrNddLogQ * 1.0 +
    modelCount * 2.0 +
    Math.log2(totalPmids + 1) * 1.5

  return {
    gene: g.gene,
    compositeScore,
    sigCount,
    femaleLogQ,
    maleLogQ,
    fdrAsdLogQ,
    fdrDdLogQ,
    fdrNddLogQ,
    modelCount,
    totalPmids,
    raw: g,
  }
}

export function RankingPage() {
  const { data, loading, error } = useGeneData()
  const [sorting, setSorting] = useState<SortingState>([{ id: "compositeScore", desc: true }])
  const [globalFilter, setGlobalFilter] = useState("")

  const ranked = useMemo(() => {
    return data
      .map((g) => computeScore(g))
      .sort((a, b) => b.compositeScore - a.compositeScore)
      .map((g, i) => ({ ...g, rank: i + 1 }))
  }, [data])

  const columns = useMemo<ColumnDef<RankedGene>[]>(() => [
    {
      accessorKey: "rank",
      header: "#",
      cell: ({ row }) => <span className="text-muted-foreground font-mono text-xs">{row.original.rank}</span>,
      size: 50,
    },
    {
      accessorKey: "gene",
      header: "Gene",
      cell: ({ row }) => (
        <Link to={`/gene/${row.original.gene}`} className="font-medium text-primary hover:underline">
          {row.original.gene}
        </Link>
      ),
    },
    {
      accessorKey: "compositeScore",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" onClick={() => column.toggleSorting()}>
          Score <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold">{row.original.compositeScore.toFixed(1)}</span>
      ),
    },
    {
      accessorKey: "sigCount",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" onClick={() => column.toggleSorting()}>
          Sig. Tests <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const c = row.original.sigCount
        return (
          <Badge variant={c >= 4 ? "success" : c >= 2 ? "default" : "secondary"}>
            {c}/5
          </Badge>
        )
      },
    },
    {
      accessorKey: "femaleLogQ",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" onClick={() => column.toggleSorting()}>
          Female <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.femaleLogQ.toFixed(1)}</span>,
    },
    {
      accessorKey: "maleLogQ",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" onClick={() => column.toggleSorting()}>
          Male <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.maleLogQ.toFixed(1)}</span>,
    },
    {
      accessorKey: "fdrAsdLogQ",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" onClick={() => column.toggleSorting()}>
          FDR ASD <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.fdrAsdLogQ.toFixed(1)}</span>,
    },
    {
      accessorKey: "modelCount",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" onClick={() => column.toggleSorting()}>
          Models <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => <span className="text-xs">{row.original.modelCount}/7</span>,
    },
    {
      accessorKey: "totalPmids",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" onClick={() => column.toggleSorting()}>
          PMIDs <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.totalPmids}</span>,
    },
  ], [])

  const table = useReactTable({
    data: ranked,
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
    initialState: { pagination: { pageSize: 50 } },
  })

  if (loading) return <div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>
  if (error) return <div className="flex items-center justify-center py-20 text-destructive">Error: {error}</div>

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Gene Ranking</h1>
        <p className="text-sm text-muted-foreground">
          Genes ranked by composite score combining statistical significance and model organism evidence
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Scoring Formula</CardTitle>
          <CardDescription className="text-xs font-mono">
            Score = 1.0 * -log10(female_q) + 1.0 * -log10(male_q) + 1.5 * -log10(FDR_ASD) + 1.0 * -log10(FDR_DD) + 1.0 * -log10(FDR_NDD) + 2.0 * model_count + 1.5 * log2(total_PMIDs + 1)
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search genes..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-xs"
        />
        <DownloadButton data={table.getFilteredRowModel().rows.map((r) => r.original.raw)} filename="gene_ranking.csv" />
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} className="whitespace-nowrap px-2 py-2 text-left font-medium">
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
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
            {[25, 50, 100, 200].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </span>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
