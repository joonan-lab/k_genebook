import { useGeneData } from "@/hooks/useGeneData"
import { GeneTable } from "@/components/GeneTable"

export function HomePage() {
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
        <h1 className="text-2xl font-bold">Gene Table</h1>
        <p className="text-sm text-muted-foreground">
          ASD gene data from Korean families &mdash; {data.length.toLocaleString()} genes
        </p>
      </div>
      <GeneTable data={data} />
    </div>
  )
}
