import { useGeneData } from "@/hooks/useGeneData"
import { ModelBubbleChart } from "@/components/ModelBubbleChart"

export function ModelPlotPage() {
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
        <h1 className="text-2xl font-bold">Model Organism Studies</h1>
        <p className="text-sm text-muted-foreground">
          Gene x Model organism bubble chart showing validation studies (bubble size = # PMIDs)
        </p>
      </div>
      <ModelBubbleChart data={data} />
    </div>
  )
}
