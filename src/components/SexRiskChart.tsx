import { useMemo, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/context/ThemeContext"
import { negLog10, type GeneData } from "@/lib/gene-utils"

interface SexRiskChartProps {
  data: GeneData[]
}

export function SexRiskChart({ data }: SexRiskChartProps) {
  const [topN, setTopN] = useState(20)
  const { theme } = useTheme()

  const textColor = theme === "dark" ? "#e2e8f0" : "#1e293b"
  const gridColor = theme === "dark" ? "#334155" : "#e2e8f0"

  const femaleData = useMemo(() => {
    return data
      .filter((g) => g.ASD_female_qval !== null && g.ASD_female_qval > 0)
      .map((g) => ({ gene: g.gene, logq: negLog10(g.ASD_female_qval) }))
      .sort((a, b) => b.logq - a.logq)
      .slice(0, topN)
  }, [data, topN])

  const maleData = useMemo(() => {
    return data
      .filter((g) => g.ASD_male_qval !== null && g.ASD_male_qval > 0)
      .map((g) => ({ gene: g.gene, logq: negLog10(g.ASD_male_qval) }))
      .sort((a, b) => b.logq - a.logq)
      .slice(0, topN)
  }, [data, topN])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <label className="text-sm text-muted-foreground">Show top:</label>
        <Select
          value={String(topN)}
          onChange={(e) => setTopN(Number(e.target.value))}
          className="w-20"
        >
          {[10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Top {topN} Female-Associated ASD Genes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={femaleData} margin={{ bottom: 60, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis
                  dataKey="gene"
                  angle={-45}
                  textAnchor="end"
                  tick={{ fontSize: 11, fill: textColor }}
                  interval={0}
                />
                <YAxis
                  label={{
                    value: "-log10(q)",
                    angle: -90,
                    position: "insideLeft",
                    fill: textColor,
                  }}
                  tick={{ fill: textColor }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1e293b" : "#fff",
                    border: "1px solid " + gridColor,
                    color: textColor,
                  }}
                  formatter={(value?: number) => [value?.toFixed(2) ?? "", "-log10(q)"]}
                />
                <Bar dataKey="logq" fill="#fa8072" name="-log10(Female q)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Top {topN} Male-Associated ASD Genes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={maleData} margin={{ bottom: 60, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis
                  dataKey="gene"
                  angle={-45}
                  textAnchor="end"
                  tick={{ fontSize: 11, fill: textColor }}
                  interval={0}
                />
                <YAxis
                  label={{
                    value: "-log10(q)",
                    angle: -90,
                    position: "insideLeft",
                    fill: textColor,
                  }}
                  tick={{ fill: textColor }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1e293b" : "#fff",
                    border: "1px solid " + gridColor,
                    color: textColor,
                  }}
                  formatter={(value?: number) => [value?.toFixed(2) ?? "", "-log10(q)"]}
                />
                <Bar dataKey="logq" fill="#87ceeb" name="-log10(Male q)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
