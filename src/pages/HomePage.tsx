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
          {data.length.toLocaleString()} genes from Korean families, SSC, SPARK &amp; MSSNG cohorts
          (<a href="https://pubmed.ncbi.nlm.nih.gov/39334436/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Kim et al., Genome Med 2024</a>)
        </p>
      </div>
      <GeneTable data={data} />
    </div>
  )
}
