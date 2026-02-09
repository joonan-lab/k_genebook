import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { GeneData } from "@/lib/gene-utils"

interface DownloadButtonProps {
  data: GeneData[]
  filename?: string
}

export function DownloadButton({ data, filename = "gene_data_filtered.csv" }: DownloadButtonProps) {
  const handleDownload = () => {
    if (data.length === 0) return

    const headers = [
      "gene",
      "ASD_female_qval",
      "ASD_male_qval",
      "FDR_TADA_ASD",
      "FDR_TADA_DD",
      "FDR_TADA_NDD",
      "Mouse",
      "Drosophila",
      "Zebrafish",
      "Rat",
      "Primate",
      "Organoid",
      "Human cell",
    ]

    const csvRows = [headers.join(",")]
    for (const row of data) {
      const values = headers.map((h) => {
        const val = row[h as keyof GeneData]
        if (val === null) return ""
        const str = String(val)
        return str.includes(",") ? `"${str}"` : str
      })
      csvRows.push(values.join(","))
    }

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDownload} disabled={data.length === 0}>
      <Download className="mr-2 h-4 w-4" />
      Download CSV ({data.length})
    </Button>
  )
}
