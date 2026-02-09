import { useMemo, useState } from "react"
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ZAxis,
  Cell,
} from "recharts"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/context/ThemeContext"
import {
  MODEL_ORGANISMS,
  MODEL_COLORS,
  parsePmids,
  type GeneData,
  type ModelOrganism,
} from "@/lib/gene-utils"

interface BubblePoint {
  gene: string
  model: string
  modelIndex: number
  count: number
  pmids: string[]
}

interface ModelBubbleChartProps {
  data: GeneData[]
}

export function ModelBubbleChart({ data }: ModelBubbleChartProps) {
  const [filter, setFilter] = useState("")
  const [selectedPoint, setSelectedPoint] = useState<BubblePoint | null>(null)
  const { theme } = useTheme()

  const textColor = theme === "dark" ? "#e2e8f0" : "#1e293b"
  const gridColor = theme === "dark" ? "#334155" : "#e2e8f0"

  const bubbleData = useMemo(() => {
    const points: BubblePoint[] = []
    for (const row of data) {
      for (let i = 0; i < MODEL_ORGANISMS.length; i++) {
        const model = MODEL_ORGANISMS[i]
        const pmids = parsePmids(row[model as keyof GeneData] as string)
        if (pmids.length > 0) {
          points.push({
            gene: row.gene,
            model,
            modelIndex: i,
            count: pmids.length,
            pmids,
          })
        }
      }
    }
    return points
  }, [data])

  const filteredData = useMemo(() => {
    if (!filter) return bubbleData
    const kw = filter.toLowerCase()
    return bubbleData.filter(
      (d) => d.gene.toLowerCase().includes(kw) || d.model.toLowerCase().includes(kw)
    )
  }, [bubbleData, filter])

  const genes = useMemo(() => {
    return [...new Set(filteredData.map((d) => d.gene))]
  }, [filteredData])

  const chartData = useMemo(() => {
    return filteredData.map((d) => ({
      ...d,
      x: genes.indexOf(d.gene),
      y: d.modelIndex,
    }))
  }, [filteredData, genes])

  const maxCount = Math.max(...filteredData.map((d) => d.count), 1)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Filter by gene or model..."
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value)
            setSelectedPoint(null)
          }}
          className="max-w-xs"
        />
        <div className="flex flex-wrap gap-3">
          {MODEL_ORGANISMS.map((model) => (
            <div key={model} className="flex items-center gap-1 text-xs">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: MODEL_COLORS[model] }}
              />
              {model}
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Gene x Model Bubble Chart (size = # PMIDs)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {genes.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-muted-foreground">
              No data matches the filter
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={500}>
              <ScatterChart margin={{ bottom: 80, left: 20, right: 20, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis
                  type="number"
                  dataKey="x"
                  domain={[-0.5, genes.length - 0.5]}
                  ticks={genes.map((_, i) => i)}
                  tickFormatter={(i: number) => genes[i] ?? ""}
                  angle={-45}
                  textAnchor="end"
                  tick={{ fontSize: 10, fill: textColor }}
                  interval={0}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  domain={[-0.5, MODEL_ORGANISMS.length - 0.5]}
                  ticks={MODEL_ORGANISMS.map((_, i) => i)}
                  tickFormatter={(i: number) => MODEL_ORGANISMS[i] ?? ""}
                  tick={{ fontSize: 11, fill: textColor }}
                />
                <ZAxis
                  type="number"
                  dataKey="count"
                  range={[40, Math.min(maxCount * 25, 2000)]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1e293b" : "#fff",
                    border: "1px solid " + gridColor,
                    color: textColor,
                  }}
                  content={({ payload }) => {
                    if (!payload || payload.length === 0) return null
                    const d = payload[0]?.payload as BubblePoint & { x: number; y: number }
                    return (
                      <div className="rounded border bg-card p-2 text-xs shadow">
                        <div className="font-bold">{d.gene}</div>
                        <div>{d.model}</div>
                        <div>
                          {d.count} stud{d.count === 1 ? "y" : "ies"}
                        </div>
                      </div>
                    )
                  }}
                />
                <Scatter
                  data={chartData}
                  onClick={(point) => {
                    if (point) setSelectedPoint(point as unknown as BubblePoint)
                  }}
                  cursor="pointer"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={MODEL_COLORS[entry.model as ModelOrganism] ?? "#7f7f7f"}
                      fillOpacity={0.8}
                      stroke="#333"
                      strokeWidth={0.5}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {selectedPoint && (
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm">
              <span className="font-bold">{selectedPoint.gene}</span>
              <span className="text-muted-foreground"> ({selectedPoint.model})</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedPoint.pmids.map((pmid) => (
                <a
                  key={pmid}
                  href={`https://pubmed.ncbi.nlm.nih.gov/${pmid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  PMID: {pmid}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
