import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts"
import { useGeneData } from "@/hooks/useGeneData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/context/ThemeContext"
import { isSignificant, type GeneData } from "@/lib/gene-utils"

const CATEGORIES = [
  { key: "FDR_TADA_ASD" as keyof GeneData, label: "ASD", color: "#3b82f6" },
  { key: "FDR_TADA_DD" as keyof GeneData, label: "DD", color: "#f59e0b" },
  { key: "FDR_TADA_NDD" as keyof GeneData, label: "NDD", color: "#10b981" },
]

interface Intersection {
  id: string
  label: string
  sets: boolean[] // [ASD, DD, NDD]
  genes: string[]
  count: number
}

function getIntersections(data: GeneData[], threshold: number): Intersection[] {
  // 7 possible non-empty subsets of {ASD, DD, NDD}
  const combos: boolean[][] = [
    [true, false, false],
    [false, true, false],
    [false, false, true],
    [true, true, false],
    [true, false, true],
    [false, true, true],
    [true, true, true],
  ]

  return combos.map((sets) => {
    const genes = data
      .filter((g) => {
        return CATEGORIES.every((cat, i) => {
          const sig = isSignificant(g[cat.key] as number | null, threshold)
          return sets[i] ? sig : !sig
        })
      })
      .map((g) => g.gene)

    const labels = sets.map((s, i) => (s ? CATEGORIES[i].label : null)).filter(Boolean)
    return {
      id: sets.map((s) => (s ? "1" : "0")).join(""),
      label: labels.join(" & "),
      sets,
      genes,
      count: genes.length,
    }
  }).sort((a, b) => b.count - a.count)
}

const COMBO_COLORS = [
  "#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#f97316", "#6366f1",
]

export function UpsetPage() {
  const { data, loading, error } = useGeneData()
  const [threshold, setThreshold] = useState("0.05")
  const [selectedIntersection, setSelectedIntersection] = useState<Intersection | null>(null)
  const { theme } = useTheme()

  const textColor = theme === "dark" ? "#e2e8f0" : "#1e293b"
  const gridColor = theme === "dark" ? "#334155" : "#e2e8f0"

  const intersections = useMemo(() => {
    const t = parseFloat(threshold)
    if (isNaN(t) || t <= 0) return []
    return getIntersections(data, t)
  }, [data, threshold])

  // Set sizes
  const setSizes = useMemo(() => {
    const t = parseFloat(threshold)
    if (isNaN(t) || t <= 0) return []
    return CATEGORIES.map((cat) => ({
      label: cat.label,
      count: data.filter((g) => isSignificant(g[cat.key] as number | null, t)).length,
      color: cat.color,
    }))
  }, [data, threshold])

  if (loading) return <div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>
  if (error) return <div className="flex items-center justify-center py-20 text-destructive">Error: {error}</div>

  const dotRadius = 8
  const dotSpacing = 24
  const matrixWidth = 100
  const barChartHeight = 320

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Gene Set Overlap (UpSet Plot)</h1>
        <p className="text-sm text-muted-foreground">
          Shows overlapping significant genes across ASD, DD, and NDD categories.
          Click a bar to see the genes in that intersection.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">FDR threshold:</label>
          <Input
            type="number"
            step="any"
            value={threshold}
            onChange={(e) => { setThreshold(e.target.value); setSelectedIntersection(null) }}
            className="w-24"
          />
        </div>
        <div className="flex gap-4">
          {setSizes.map((s) => (
            <Badge key={s.label} variant="outline" style={{ borderColor: s.color, color: s.color }}>
              {s.label}: {s.count}
            </Badge>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Intersection Sizes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex">
            {/* Dot matrix on the left */}
            <div className="flex-shrink-0" style={{ width: matrixWidth, paddingTop: 10 }}>
              {/* Category labels */}
              <svg width={matrixWidth} height={barChartHeight}>
                {/* Labels at the bottom */}
                {CATEGORIES.map((cat, ci) => (
                  <text
                    key={cat.label}
                    x={matrixWidth - 10}
                    y={barChartHeight - 30 - ci * dotSpacing}
                    textAnchor="end"
                    fontSize={12}
                    fill={textColor}
                    dominantBaseline="middle"
                  >
                    {cat.label}
                  </text>
                ))}
              </svg>
            </div>

            {/* Bar chart + dot matrix combined */}
            <div className="flex-1 overflow-x-auto">
              <div style={{ minWidth: intersections.length * 50 }}>
                <ResponsiveContainer width="100%" height={barChartHeight - 30 - CATEGORIES.length * dotSpacing + 20}>
                  <BarChart
                    data={intersections}
                    margin={{ left: 0, right: 10, top: 5, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                    <XAxis dataKey="label" hide />
                    <YAxis tick={{ fill: textColor, fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === "dark" ? "#1e293b" : "#fff",
                        border: "1px solid " + gridColor, color: textColor,
                      }}
                      formatter={(value?: number) => [`${value ?? 0} genes`]}
                    />
                    <Bar
                      dataKey="count"
                      radius={[4, 4, 0, 0]}
                      cursor="pointer"
                      onClick={(d) => setSelectedIntersection(d as unknown as Intersection)}
                    >
                      {intersections.map((_, i) => (
                        <Cell key={i} fill={COMBO_COLORS[i % COMBO_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                {/* Dot matrix below bars */}
                <svg
                  width={Math.max(intersections.length * 50, 350)}
                  height={CATEGORIES.length * dotSpacing + 20}
                >
                  {intersections.map((inter, ii) => {
                    const cx = ii * 50 + 25 + (intersections.length <= 7 ? (350 - intersections.length * 50) / (2 * intersections.length) * (2 * ii + 1) : 0)
                    const activeDots = CATEGORIES.map((_, ci) => inter.sets[ci])
                    const activeIndices = activeDots.map((a, i) => (a ? i : -1)).filter((i) => i >= 0)

                    return (
                      <g key={inter.id}>
                        {/* Connection line */}
                        {activeIndices.length > 1 && (
                          <line
                            x1={cx}
                            y1={10 + Math.min(...activeIndices) * dotSpacing}
                            x2={cx}
                            y2={10 + Math.max(...activeIndices) * dotSpacing}
                            stroke={textColor}
                            strokeWidth={2}
                          />
                        )}
                        {/* Dots */}
                        {CATEGORIES.map((_, ci) => (
                          <circle
                            key={ci}
                            cx={cx}
                            cy={10 + ci * dotSpacing}
                            r={dotRadius}
                            fill={inter.sets[ci] ? textColor : gridColor}
                            opacity={inter.sets[ci] ? 1 : 0.3}
                          />
                        ))}
                        {/* Label */}
                        <text
                          x={cx}
                          y={10 + CATEGORIES.length * dotSpacing + 6}
                          textAnchor="middle"
                          fontSize={9}
                          fill={textColor}
                        >
                          {inter.label}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedIntersection && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {selectedIntersection.label} — {selectedIntersection.count} genes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedIntersection.genes.length === 0 ? (
              <div className="text-sm text-muted-foreground">No genes in this intersection</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedIntersection.genes.slice(0, 100).map((gene) => (
                  <Link
                    key={gene}
                    to={`/gene/${gene}`}
                    className="rounded bg-muted px-2 py-1 text-xs hover:bg-accent transition-colors"
                  >
                    {gene}
                  </Link>
                ))}
                {selectedIntersection.genes.length > 100 && (
                  <span className="text-xs text-muted-foreground">
                    ... and {selectedIntersection.genes.length - 100} more
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
