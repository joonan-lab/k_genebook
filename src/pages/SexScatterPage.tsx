import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ZAxis, ReferenceLine, Cell,
} from "recharts"
import { useGeneData } from "@/hooks/useGeneData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/context/ThemeContext"
import { negLog10 } from "@/lib/gene-utils"

interface ScatterPoint {
  gene: string
  femaleLog: number
  maleLog: number
  quadrant: "both" | "female-only" | "male-only" | "neither"
}

const THRESHOLD = -Math.log10(0.05) // ~1.301

function getQuadrant(femaleLog: number, maleLog: number): ScatterPoint["quadrant"] {
  const fSig = femaleLog >= THRESHOLD
  const mSig = maleLog >= THRESHOLD
  if (fSig && mSig) return "both"
  if (fSig) return "female-only"
  if (mSig) return "male-only"
  return "neither"
}

const QUADRANT_COLORS: Record<ScatterPoint["quadrant"], string> = {
  both: "#8b5cf6",
  "female-only": "#f43f5e",
  "male-only": "#3b82f6",
  neither: "#94a3b8",
}

export function SexScatterPage() {
  const { data, loading, error } = useGeneData()
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<ScatterPoint | null>(null)
  const { theme } = useTheme()

  const textColor = theme === "dark" ? "#e2e8f0" : "#1e293b"
  const gridColor = theme === "dark" ? "#334155" : "#e2e8f0"

  const points = useMemo(() => {
    return data
      .filter((g) => g.ASD_female_qval !== null && g.ASD_male_qval !== null
        && g.ASD_female_qval! > 0 && g.ASD_male_qval! > 0)
      .map((g) => {
        const femaleLog = negLog10(g.ASD_female_qval)
        const maleLog = negLog10(g.ASD_male_qval)
        return {
          gene: g.gene,
          femaleLog,
          maleLog,
          quadrant: getQuadrant(femaleLog, maleLog),
        }
      })
  }, [data])

  const filtered = useMemo(() => {
    if (!search) return points
    const kw = search.toLowerCase()
    return points.filter((p) => p.gene.toLowerCase().includes(kw))
  }, [points, search])

  const quadrantCounts = useMemo(() => {
    const counts = { both: 0, "female-only": 0, "male-only": 0, neither: 0 }
    for (const p of points) counts[p.quadrant]++
    return counts
  }, [points])

  if (loading) return <div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>
  if (error) return <div className="flex items-center justify-center py-20 text-destructive">Error: {error}</div>

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Female vs Male ASD Risk</h1>
        <p className="text-sm text-muted-foreground">
          Scatter plot comparing -log10(q-value) for female and male ASD enrichment.
          Dashed lines show significance threshold (q = 0.05).
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Search gene..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex flex-wrap gap-3">
          {(Object.entries(QUADRANT_COLORS) as [ScatterPoint["quadrant"], string][]).map(([q, color]) => (
            <div key={q} className="flex items-center gap-1.5 text-xs">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
              {q} ({quadrantCounts[q]})
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            -log10(Female q) vs -log10(Male q) — {filtered.length} genes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={550}>
            <ScatterChart margin={{ bottom: 20, left: 10, right: 20, top: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                type="number" dataKey="femaleLog" name="-log10(Female q)"
                tick={{ fill: textColor }}
                label={{ value: "-log10(Female q-val)", position: "insideBottom", offset: -10, fill: textColor }}
              />
              <YAxis
                type="number" dataKey="maleLog" name="-log10(Male q)"
                tick={{ fill: textColor }}
                label={{ value: "-log10(Male q-val)", angle: -90, position: "insideLeft", fill: textColor }}
              />
              <ZAxis range={[20, 20]} />
              <ReferenceLine x={THRESHOLD} stroke="#ef4444" strokeDasharray="5 5" label={{ value: "q=0.05", fill: "#ef4444", fontSize: 10 }} />
              <ReferenceLine y={THRESHOLD} stroke="#ef4444" strokeDasharray="5 5" />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1e293b" : "#fff",
                  border: "1px solid " + gridColor, color: textColor,
                }}
                content={({ payload }) => {
                  if (!payload || payload.length === 0) return null
                  const d = payload[0]?.payload as ScatterPoint
                  return (
                    <div className="rounded border bg-card p-2 text-xs shadow">
                      <div className="font-bold">{d.gene}</div>
                      <div>Female: {d.femaleLog.toFixed(2)}</div>
                      <div>Male: {d.maleLog.toFixed(2)}</div>
                      <Badge variant={d.quadrant === "neither" ? "secondary" : "success"} className="mt-1">
                        {d.quadrant}
                      </Badge>
                    </div>
                  )
                }}
              />
              <Scatter
                data={filtered}
                cursor="pointer"
                onClick={(point) => {
                  if (point) setSelected(point as unknown as ScatterPoint)
                }}
              >
                {filtered.map((entry, i) => (
                  <Cell key={i} fill={QUADRANT_COLORS[entry.quadrant]} fillOpacity={entry.quadrant === "neither" ? 0.3 : 0.7} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {selected && (
        <Card>
          <CardContent className="pt-4 flex items-center gap-4">
            <div>
              <Link to={`/gene/${selected.gene}`} className="font-bold text-primary hover:underline text-lg">
                {selected.gene}
              </Link>
              <div className="text-xs text-muted-foreground mt-1">
                Female -log10(q): {selected.femaleLog.toFixed(4)} | Male -log10(q): {selected.maleLog.toFixed(4)}
              </div>
            </div>
            <Badge variant={selected.quadrant === "neither" ? "secondary" : "success"}>
              {selected.quadrant}
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
