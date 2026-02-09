import { useEffect, useState } from "react"
import Papa from "papaparse"
import { parseNumeric, type GeneData } from "@/lib/gene-utils"

export function useGeneData() {
  const [data, setData] = useState<GeneData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const base = import.meta.env.BASE_URL
    fetch(`${base}gene_data.csv`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.text()
      })
      .then((text) => {
        const result = Papa.parse(text, { header: true, skipEmptyLines: true })
        const parsed: GeneData[] = (result.data as Record<string, string>[]).map((row) => ({
          gene: row["gene"]?.trim() ?? "",
          ASD_female_qval: parseNumeric(row["ASD_female_qval"]),
          ASD_male_qval: parseNumeric(row["ASD_male_qval"]),
          FDR_TADA_ASD: parseNumeric(row["FDR_TADA_ASD"]),
          FDR_TADA_DD: parseNumeric(row["FDR_TADA_DD"]),
          FDR_TADA_NDD: parseNumeric(row["FDR_TADA_NDD"]),
          Mouse: row["Mouse"] ?? "",
          Drosophila: row["Drosophila"] ?? "",
          Zebrafish: row["Zebrafish"] ?? "",
          Rat: row["Rat"] ?? "",
          Primate: row["Primate"] ?? "",
          Organoid: row["Organoid"] ?? "",
          "Human cell": row["Human cell"] ?? "",
        }))
        setData(parsed.filter((g) => g.gene !== ""))
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { data, loading, error }
}
