import { useGeneData } from "@/hooks/useGeneData"
import { SexRiskChart } from "@/components/SexRiskChart"

export function SexPlotPage() {
  const { data, loading, error } = useGeneData()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-muted-foreground">Loading gene data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-destructive">Error loading data: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Sex-Specific ASD Risk Genes</h1>
        <p className="text-sm text-muted-foreground">
          Top genes ranked by -log10(q-value) for female and male ASD enrichment
        </p>
      </div>
      <SexRiskChart data={data} />
    </div>
  )
}
