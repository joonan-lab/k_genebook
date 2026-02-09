import { useMemo, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { useGeneData } from "@/hooks/useGeneData"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { useTheme } from "@/context/ThemeContext"
import { MODEL_ORGANISMS, getPmidCount, type GeneData } from "@/lib/gene-utils"

function getColor(count: number, max: number, dark: boolean): string {
  if (count === 0) return dark ? "#1e293b" : "#f8fafc"
  const intensity = Math.min(count / max, 1)
  if (dark) {
    const r = Math.round(30 + intensity * 100)
    const g = Math.round(41 + intensity * 40)
    const b = Math.round(59 + intensity * 196)
    return `rgb(${r},${g},${b})`
  }
  const r = Math.round(255 - intensity * 186)
  const g = Math.round(255 - intensity * 186)
  const b = 255
  return `rgb(${r},${g},${b})`
}

export function HeatmapPage() {
  const { data, loading, error } = useGeneData()
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "total">("total")
  const [maxGenes, setMaxGenes] = useState(50)
  const { theme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)

  const genesWithStudies = useMemo(() => {
    return data
      .map((g) => {
        const counts: Record<string, number> = {}
        let total = 0
        for (const model of MODEL_ORGANISMS) {
          const c = getPmidCount(g[model as keyof GeneData] as string)
          counts[model] = c
          total += c
        }
        return { gene: g.gene, counts, total }
      })
      .filter((g) => g.total > 0)
  }, [data])

  const filtered = useMemo(() => {
    let list = genesWithStudies
    if (search) {
      const kw = search.toLowerCase()
      list = list.filter((g) => g.gene.toLowerCase().includes(kw))
    }
    if (sortBy === "total") {
      list = [...list].sort((a, b) => b.total - a.total)
    } else {
      list = [...list].sort((a, b) => a.gene.localeCompare(b.gene))
    }
    return list.slice(0, maxGenes)
  }, [genesWithStudies, search, sortBy, maxGenes])

  const maxCount = useMemo(() => {
    let m = 1
    for (const g of filtered) {
      for (const model of MODEL_ORGANISMS) {
        m = Math.max(m, g.counts[model])
      }
    }
    return m
  }, [filtered])

  const isDark = theme === "dark"

  if (loading) return <div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>
  if (error) return <div className="flex items-center justify-center py-20 text-destructive">Error: {error}</div>

  const cellSize = 32
  const labelWidth = 90
  const headerHeight = 100

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Model Organism Heatmap</h1>
        <p className="text-sm text-muted-foreground">
          Gene x Model organism heatmap — color intensity shows number of PMIDs
          ({genesWithStudies.length} genes with at least one study)
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search gene..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value as "name" | "total")} className="w-36">
          <option value="total">Sort by total PMIDs</option>
          <option value="name">Sort by name</option>
        </Select>
        <Select value={String(maxGenes)} onChange={(e) => setMaxGenes(Number(e.target.value))} className="w-28">
          {[30, 50, 100, 200].map((n) => (
            <option key={n} value={n}>Top {n}</option>
          ))}
        </Select>

        {/* Legend */}
        <div className="flex items-center gap-1 ml-auto text-xs text-muted-foreground">
          <span>0</span>
          <div className="flex h-4">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className="w-3 h-full"
                style={{ backgroundColor: getColor(((i + 1) / 10) * maxCount, maxCount, isDark) }}
              />
            ))}
          </div>
          <span>{maxCount}</span>
        </div>
      </div>

      <Card>
        <CardContent className="pt-4 overflow-x-auto" ref={containerRef}>
          <svg
            width={labelWidth + filtered.length * cellSize + 10}
            height={headerHeight + MODEL_ORGANISMS.length * cellSize + 10}
          >
            {/* Column headers (genes) */}
            {filtered.map((g, gi) => (
              <text
                key={g.gene}
                x={labelWidth + gi * cellSize + cellSize / 2}
                y={headerHeight - 6}
                textAnchor="end"
                transform={`rotate(-45, ${labelWidth + gi * cellSize + cellSize / 2}, ${headerHeight - 6})`}
                fontSize={10}
                fill={theme === "dark" ? "#cbd5e1" : "#334155"}
              >
                {g.gene}
              </text>
            ))}

            {/* Row labels (models) + cells */}
            {MODEL_ORGANISMS.map((model, mi) => (
              <g key={model}>
                <text
                  x={labelWidth - 6}
                  y={headerHeight + mi * cellSize + cellSize / 2 + 4}
                  textAnchor="end"
                  fontSize={11}
                  fill={theme === "dark" ? "#cbd5e1" : "#334155"}
                >
                  {model}
                </text>
                {filtered.map((g, gi) => {
                  const count = g.counts[model]
                  return (
                    <g key={g.gene}>
                      <rect
                        x={labelWidth + gi * cellSize}
                        y={headerHeight + mi * cellSize}
                        width={cellSize - 1}
                        height={cellSize - 1}
                        rx={3}
                        fill={getColor(count, maxCount, isDark)}
                        stroke={isDark ? "#334155" : "#e2e8f0"}
                        strokeWidth={0.5}
                      />
                      {count > 0 && (
                        <text
                          x={labelWidth + gi * cellSize + cellSize / 2 - 0.5}
                          y={headerHeight + mi * cellSize + cellSize / 2 + 4}
                          textAnchor="middle"
                          fontSize={9}
                          fill={count / maxCount > 0.5 ? "#fff" : (isDark ? "#cbd5e1" : "#334155")}
                        >
                          {count}
                        </text>
                      )}
                    </g>
                  )
                })}
              </g>
            ))}
          </svg>
        </CardContent>
      </Card>

      {filtered.length > 0 && (
        <div className="text-xs text-muted-foreground">
          Click a gene name in the table to view details:{" "}
          {filtered.slice(0, 10).map((g, i) => (
            <span key={g.gene}>
              {i > 0 && ", "}
              <Link to={`/gene/${g.gene}`} className="text-primary hover:underline">{g.gene}</Link>
            </span>
          ))}
          {filtered.length > 10 && " ..."}
        </div>
      )}
    </div>
  )
}
