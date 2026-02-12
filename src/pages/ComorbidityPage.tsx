import { Fragment, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts"
import { useGeneData } from "@/hooks/useGeneData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/context/ThemeContext"
import { isSignificant } from "@/lib/gene-utils"
import {
  COMORBIDITY_DOMAINS, COMORBIDITY_GENES,
  type ComorbidityDomainId,
} from "@/data/comorbidity"

export function ComorbidityPage() {
  const { data, loading, error } = useGeneData()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [hoveredCell, setHoveredCell] = useState<{ gene: string; domain: string } | null>(null)

  const textColor = theme === "dark" ? "#e2e8f0" : "#1e293b"
  const gridColor = theme === "dark" ? "#334155" : "#e2e8f0"

  const { barData, heatmapGenes, geneSet } = useMemo(() => {
    if (data.length === 0) return { barData: [], heatmapGenes: [], geneSet: new Map<string, Set<string>>() }

    // ASD significant genes
    const sigGenes = new Set(
      data.filter((g) => isSignificant(g.FDR_TADA_ASD)).map((g) => g.gene)
    )

    // Filter comorbidity genes to only those in significant gene set
    const filteredDomains: Record<string, string[]> = {}
    for (const domain of COMORBIDITY_DOMAINS) {
      filteredDomains[domain.id] = COMORBIDITY_GENES[domain.id as ComorbidityDomainId]
        .filter((gene) => sigGenes.has(gene))
    }

    // Bar chart data: domain → gene count
    const barData = COMORBIDITY_DOMAINS.map((d) => ({
      domain: d.label,
      count: filteredDomains[d.id].length,
      color: d.color,
    }))

    // All unique genes that appear in at least one domain
    const allGenes = new Set<string>()
    for (const genes of Object.values(filteredDomains)) {
      for (const gene of genes) allGenes.add(gene)
    }

    // Build gene → domains mapping for sorting
    const geneDomainMap = new Map<string, Set<string>>()
    for (const domain of COMORBIDITY_DOMAINS) {
      for (const gene of filteredDomains[domain.id]) {
        if (!geneDomainMap.has(gene)) geneDomainMap.set(gene, new Set())
        geneDomainMap.get(gene)!.add(domain.id)
      }
    }

    // Sort genes by comorbidity count descending, then alphabetically
    const heatmapGenes = [...allGenes].sort((a, b) => {
      const diff = (geneDomainMap.get(b)?.size ?? 0) - (geneDomainMap.get(a)?.size ?? 0)
      return diff !== 0 ? diff : a.localeCompare(b)
    })

    return { barData, heatmapGenes, geneSet: geneDomainMap }
  }, [data])

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>
  }
  if (error) {
    return <div className="flex items-center justify-center py-20 text-destructive">Error: {error}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Comorbidity</h1>
        <p className="text-sm text-muted-foreground">
          Literature-based comorbidity profiles of ASD risk genes (FDR &lt; 0.05) across 10 clinical domains
        </p>
      </div>

      {/* Bar Chart: genes per domain */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Gene Count per Comorbidity Domain</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={barData} margin={{ bottom: 60, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="domain"
                angle={-35}
                textAnchor="end"
                tick={{ fontSize: 11, fill: textColor }}
                interval={0}
              />
              <YAxis
                tick={{ fill: textColor }}
                label={{
                  value: "Number of genes",
                  angle: -90,
                  position: "insideLeft",
                  fill: textColor,
                  style: { fontSize: 12 },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1e293b" : "#fff",
                  border: "1px solid " + gridColor,
                  color: textColor,
                }}
                formatter={(value) => [Number(value), "Genes"]}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Heatmap: Gene × Domain */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Gene × Domain Heatmap ({heatmapGenes.length} genes)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div
              className="inline-grid gap-px"
              style={{
                gridTemplateColumns: `100px repeat(${COMORBIDITY_DOMAINS.length}, 1fr)`,
                minWidth: `${100 + COMORBIDITY_DOMAINS.length * 48}px`,
              }}
            >
              {/* Header row */}
              <div />
              {COMORBIDITY_DOMAINS.map((d) => (
                <div
                  key={d.id}
                  className="text-center text-[10px] font-medium px-0.5 pb-1 leading-tight"
                  style={{ color: d.color }}
                  title={d.label}
                >
                  {d.label.length > 10 ? d.label.split(/[\s/]/)[0] : d.label}
                </div>
              ))}

              {/* Gene rows */}
              {heatmapGenes.map((gene) => (
                <Fragment key={gene}>
                  <div
                    className="text-xs font-mono truncate pr-2 flex items-center cursor-pointer hover:underline"
                    onClick={() => navigate(`/gene/${gene}`)}
                    title={`View ${gene} detail`}
                  >
                    {gene}
                  </div>
                  {COMORBIDITY_DOMAINS.map((d) => {
                    const active = geneSet.get(gene)?.has(d.id) ?? false
                    const isHovered =
                      hoveredCell?.gene === gene && hoveredCell?.domain === d.id
                    return (
                      <div
                        key={`${gene}-${d.id}`}
                        className="h-6 rounded-sm transition-opacity cursor-default"
                        style={{
                          backgroundColor: active
                            ? d.color
                            : theme === "dark"
                              ? "#1e293b"
                              : "#f1f5f9",
                          opacity: active ? (isHovered ? 1 : 0.85) : 1,
                          outline: isHovered ? `2px solid ${d.color}` : "none",
                          outlineOffset: "-1px",
                        }}
                        onMouseEnter={() => setHoveredCell({ gene, domain: d.id })}
                        onMouseLeave={() => setHoveredCell(null)}
                        title={active ? `${gene} — ${d.label}` : ""}
                        onClick={() => {
                          if (active) navigate(`/gene/${gene}`)
                        }}
                      />
                    )
                  })}
                </Fragment>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t">
            {COMORBIDITY_DOMAINS.map((d) => (
              <div key={d.id} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-muted-foreground">{d.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
