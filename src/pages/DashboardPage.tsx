import { useMemo } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts"
import { useGeneData } from "@/hooks/useGeneData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/context/ThemeContext"
import {
  MODEL_ORGANISMS, getPmidCount,
  isSignificant, type GeneData,
} from "@/lib/gene-utils"

const SIG_THRESHOLD = 0.05

function countSignificant(data: GeneData[], key: keyof GeneData) {
  return data.filter((g) => isSignificant(g[key] as number | null, SIG_THRESHOLD)).length
}

const PIE_COLORS = ["#22c55e", "#e2e8f0"]
const PIE_COLORS_DARK = ["#22c55e", "#334155"]

export function DashboardPage() {
  const { data, loading, error } = useGeneData()
  const { theme } = useTheme()

  const textColor = theme === "dark" ? "#e2e8f0" : "#1e293b"
  const gridColor = theme === "dark" ? "#334155" : "#e2e8f0"
  const pieColors = theme === "dark" ? PIE_COLORS_DARK : PIE_COLORS

  const stats = useMemo(() => {
    if (data.length === 0) return null

    const sigFemale = countSignificant(data, "ASD_female_qval")
    const sigMale = countSignificant(data, "ASD_male_qval")
    const sigAsd = countSignificant(data, "FDR_TADA_ASD")
    const sigDd = countSignificant(data, "FDR_TADA_DD")
    const sigNdd = countSignificant(data, "FDR_TADA_NDD")

    const modelCounts = MODEL_ORGANISMS.map((model) => ({
      model,
      genes: data.filter((g) => getPmidCount(g[model as keyof GeneData] as string) > 0).length,
      studies: data.reduce((sum, g) => sum + getPmidCount(g[model as keyof GeneData] as string), 0),
    }))

    // FDR ASD distribution histogram
    const fdrBins = [
      { range: "0-0.01", count: 0 },
      { range: "0.01-0.05", count: 0 },
      { range: "0.05-0.1", count: 0 },
      { range: "0.1-0.5", count: 0 },
      { range: "0.5-1", count: 0 },
    ]
    for (const g of data) {
      const v = g.FDR_TADA_ASD
      if (v === null) continue
      if (v <= 0.01) fdrBins[0].count++
      else if (v <= 0.05) fdrBins[1].count++
      else if (v <= 0.1) fdrBins[2].count++
      else if (v <= 0.5) fdrBins[3].count++
      else fdrBins[4].count++
    }

    // genes with any model organism study
    const genesWithModel = data.filter((g) =>
      MODEL_ORGANISMS.some((m) => getPmidCount(g[m as keyof GeneData] as string) > 0)
    ).length

    return {
      total: data.length,
      sigFemale, sigMale, sigAsd, sigDd, sigNdd,
      modelCounts, fdrBins, genesWithModel,
    }
  }, [data])

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>
  }
  if (error) {
    return <div className="flex items-center justify-center py-20 text-destructive">Error: {error}</div>
  }
  if (!stats) return null

  const summaryCards = [
    { label: "Total Genes", value: stats.total.toLocaleString() },
    { label: "Sig. Female ASD (q<0.05)", value: stats.sigFemale.toLocaleString() },
    { label: "Sig. Male ASD (q<0.05)", value: stats.sigMale.toLocaleString() },
    { label: "Sig. FDR ASD", value: stats.sigAsd.toLocaleString() },
    { label: "Sig. FDR DD", value: stats.sigDd.toLocaleString() },
    { label: "Sig. FDR NDD", value: stats.sigNdd.toLocaleString() },
  ]

  const sigPieData = [
    { name: "Significant", value: stats.sigAsd },
    { name: "Not Significant", value: stats.total - stats.sigAsd },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of {stats.total.toLocaleString()} genes in the K-GeneBook dataset
        </p>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {summaryCards.map((c) => (
          <Card key={c.label}>
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-2xl font-bold">{c.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{c.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* FDR ASD Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">FDR TADA ASD Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats.fdrBins} margin={{ bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: textColor }} />
                <YAxis tick={{ fill: textColor }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1e293b" : "#fff",
                    border: "1px solid " + gridColor, color: textColor,
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Significance Pie */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">FDR TADA ASD Significance (FDR &lt; 0.05)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={sigPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {sigPieData.map((_, i) => (
                    <Cell key={i} fill={pieColors[i]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Model organism study counts */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Model Organism Studies ({stats.genesWithModel} genes with at least one study)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.modelCounts} margin={{ bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="model" tick={{ fontSize: 11, fill: textColor }} angle={-20} textAnchor="end" />
                <YAxis tick={{ fill: textColor }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1e293b" : "#fff",
                    border: "1px solid " + gridColor, color: textColor,
                  }}
                />
                <Bar dataKey="genes" fill="#3b82f6" name="Genes with studies" radius={[4, 4, 0, 0]} />
                <Bar dataKey="studies" fill="#f59e0b" name="Total PMIDs" radius={[4, 4, 0, 0]} />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
