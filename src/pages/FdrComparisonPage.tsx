import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ZAxis, ReferenceLine, Cell,
} from "recharts"
import { useGeneData } from "@/hooks/useGeneData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/context/ThemeContext"
import { negLog10 } from "@/lib/gene-utils"

type CompareMode = "asd-vs-dd" | "asd-vs-ndd" | "dd-vs-ndd"

const COMPARE_OPTIONS: { value: CompareMode; label: string; xKey: string; yKey: string; xLabel: string; yLabel: string }[] = [
  { value: "asd-vs-dd", label: "ASD vs DD", xKey: "FDR_TADA_ASD", yKey: "FDR_TADA_DD", xLabel: "-log10(FDR ASD)", yLabel: "-log10(FDR DD)" },
  { value: "asd-vs-ndd", label: "ASD vs NDD", xKey: "FDR_TADA_ASD", yKey: "FDR_TADA_NDD", xLabel: "-log10(FDR ASD)", yLabel: "-log10(FDR NDD)" },
  { value: "dd-vs-ndd", label: "DD vs NDD", xKey: "FDR_TADA_DD", yKey: "FDR_TADA_NDD", xLabel: "-log10(FDR DD)", yLabel: "-log10(FDR NDD)" },
]

const THRESHOLD = -Math.log10(0.05)

interface FdrPoint {
  gene: string
  xVal: number
  yVal: number
  bothSig: boolean
}

export function FdrComparisonPage() {
  const { data, loading, error } = useGeneData()
  const [mode, setMode] = useState<CompareMode>("asd-vs-dd")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<FdrPoint | null>(null)
  const { theme } = useTheme()

  const textColor = theme === "dark" ? "#e2e8f0" : "#1e293b"
  const gridColor = theme === "dark" ? "#334155" : "#e2e8f0"

  const config = COMPARE_OPTIONS.find((c) => c.value === mode)!

  const points = useMemo(() => {
    return data
      .filter((g) => {
        const xRaw = g[config.xKey as keyof typeof g] as number | null
        const yRaw = g[config.yKey as keyof typeof g] as number | null
        return xRaw !== null && yRaw !== null && xRaw > 0 && yRaw > 0
      })
      .map((g) => {
        const xRaw = g[config.xKey as keyof typeof g] as number
        const yRaw = g[config.yKey as keyof typeof g] as number
        const xVal = negLog10(xRaw)
        const yVal = negLog10(yRaw)
        return {
          gene: g.gene,
          xVal,
          yVal,
          bothSig: xVal >= THRESHOLD && yVal >= THRESHOLD,
        }
      })
  }, [data, config])

  const filtered = useMemo(() => {
    if (!search) return points
    const kw = search.toLowerCase()
    return points.filter((p) => p.gene.toLowerCase().includes(kw))
  }, [points, search])

  if (loading) return <div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>
  if (error) return <div className="flex items-center justify-center py-20 text-destructive">Error: {error}</div>

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">FDR Comparison</h1>
        <p className="text-sm text-muted-foreground">
          Compare FDR TADA values across ASD, DD, and NDD. Dashed lines = FDR 0.05 threshold.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={mode} onChange={(e) => { setMode(e.target.value as CompareMode); setSelected(null) }} className="w-40">
          {COMPARE_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </Select>
        <Input
          placeholder="Search gene..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-purple-500" />
            Both significant ({filtered.filter((p) => p.bothSig).length})
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-slate-400" />
            Other ({filtered.filter((p) => !p.bothSig).length})
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            {config.xLabel} vs {config.yLabel} — {filtered.length} genes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={550}>
            <ScatterChart margin={{ bottom: 20, left: 10, right: 20, top: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                type="number" dataKey="xVal" name={config.xLabel}
                tick={{ fill: textColor }}
                label={{ value: config.xLabel, position: "insideBottom", offset: -10, fill: textColor }}
              />
              <YAxis
                type="number" dataKey="yVal" name={config.yLabel}
                tick={{ fill: textColor }}
                label={{ value: config.yLabel, angle: -90, position: "insideLeft", fill: textColor }}
              />
              <ZAxis range={[20, 20]} />
              <ReferenceLine x={THRESHOLD} stroke="#ef4444" strokeDasharray="5 5" />
              <ReferenceLine y={THRESHOLD} stroke="#ef4444" strokeDasharray="5 5" />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1e293b" : "#fff",
                  border: "1px solid " + gridColor, color: textColor,
                }}
                content={({ payload }) => {
                  if (!payload || payload.length === 0) return null
                  const d = payload[0]?.payload as FdrPoint
                  return (
                    <div className="rounded border bg-card p-2 text-xs shadow">
                      <div className="font-bold">{d.gene}</div>
                      <div>{config.xLabel}: {d.xVal.toFixed(2)}</div>
                      <div>{config.yLabel}: {d.yVal.toFixed(2)}</div>
                    </div>
                  )
                }}
              />
              <Scatter
                data={filtered}
                cursor="pointer"
                onClick={(point) => { if (point) setSelected(point as unknown as FdrPoint) }}
              >
                {filtered.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.bothSig ? "#8b5cf6" : "#94a3b8"}
                    fillOpacity={entry.bothSig ? 0.7 : 0.3}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {selected && (
        <Card>
          <CardContent className="pt-4 flex items-center gap-4">
            <Link to={`/gene/${selected.gene}`} className="font-bold text-primary hover:underline text-lg">
              {selected.gene}
            </Link>
            <span className="text-xs text-muted-foreground">
              {config.xLabel}: {selected.xVal.toFixed(4)} | {config.yLabel}: {selected.yVal.toFixed(4)}
            </span>
            <Badge variant={selected.bothSig ? "success" : "secondary"}>
              {selected.bothSig ? "Both Sig." : "Not both sig."}
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
