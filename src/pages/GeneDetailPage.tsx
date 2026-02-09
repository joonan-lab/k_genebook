import { useParams, Link } from "react-router-dom"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { useGeneData } from "@/hooks/useGeneData"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  formatScientific,
  isSignificant,
  parsePmids,
  MODEL_ORGANISMS,
  MODEL_COLORS,
  type ModelOrganism,
} from "@/lib/gene-utils"

export function GeneDetailPage() {
  const { geneSymbol } = useParams<{ geneSymbol: string }>()
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

  const gene = data.find((g) => g.gene === geneSymbol)

  if (!gene) {
    return (
      <div className="space-y-4">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to table
          </Button>
        </Link>
        <div className="py-20 text-center text-muted-foreground">
          Gene "{geneSymbol}" not found
        </div>
      </div>
    )
  }

  const stats = [
    { label: "ASD Female q-val", value: gene.ASD_female_qval },
    { label: "ASD Male q-val", value: gene.ASD_male_qval },
    { label: "FDR TADA ASD", value: gene.FDR_TADA_ASD },
    { label: "FDR TADA DD", value: gene.FDR_TADA_DD },
    { label: "FDR TADA NDD", value: gene.FDR_TADA_NDD },
  ]

  const modelData = MODEL_ORGANISMS.map((model) => ({
    model,
    pmids: parsePmids(gene[model as keyof typeof gene] as string),
    color: MODEL_COLORS[model as ModelOrganism],
  })).filter((m) => m.pmids.length > 0)

  return (
    <div className="space-y-6">
      <Link to="/">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to table
        </Button>
      </Link>

      <div>
        <h1 className="text-3xl font-bold">{gene.gene}</h1>
        <p className="text-sm text-muted-foreground mt-1">Gene detail view</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statistical Significance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                  <div className="font-mono text-sm">{formatScientific(s.value)}</div>
                </div>
                {s.value !== null && (
                  <Badge variant={isSignificant(s.value) ? "success" : "secondary"}>
                    {isSignificant(s.value) ? "Sig." : "N.S."}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {modelData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Model Organism Studies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {modelData.map(({ model, pmids, color }) => (
              <div key={model} className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-medium text-sm">{model}</span>
                  <Badge variant="outline">{pmids.length} studies</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pmids.map((pmid) => (
                    <a
                      key={pmid}
                      href={`https://pubmed.ncbi.nlm.nih.gov/${pmid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs hover:bg-accent transition-colors"
                    >
                      {pmid}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>External Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <a
              href={`https://pubmed.ncbi.nlm.nih.gov/?term=${gene.gene}+autism`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-3 w-3" />
                PubMed Search
              </Button>
            </a>
            <a
              href={`https://www.ncbi.nlm.nih.gov/gene/?term=${gene.gene}[sym]+AND+human[orgn]`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-3 w-3" />
                NCBI Gene
              </Button>
            </a>
            <a
              href={`https://gnomad.broadinstitute.org/gene/${gene.gene}?dataset=gnomad_r4`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-3 w-3" />
                gnomAD
              </Button>
            </a>
            <a
              href={`https://gene.sfari.org/database/human-gene/${gene.gene}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-3 w-3" />
                SFARI Gene
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
