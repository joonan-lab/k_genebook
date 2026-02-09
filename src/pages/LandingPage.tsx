import { Link } from "react-router-dom"
import {
  Dna, Table2, BarChart3, ScatterChart, Grid3X3,
  GitCompareArrows, Layers, Trophy, LayoutDashboard,
  ExternalLink, BookOpen, FlaskConical, Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from "@/context/ThemeContext"

const features = [
  {
    to: "/table",
    icon: Table2,
    title: "Gene Table",
    desc: "Search, sort, filter, and download all 18,692 genes with q-values and FDR data",
    color: "text-blue-500",
  },
  {
    to: "/dashboard",
    icon: LayoutDashboard,
    title: "Dashboard",
    desc: "Overview statistics, significance distributions, and model organism study counts",
    color: "text-purple-500",
  },
  {
    to: "/ranking",
    icon: Trophy,
    title: "Gene Ranking",
    desc: "Composite score ranking combining statistical evidence and model organism validation",
    color: "text-amber-500",
  },
  {
    to: "/sex-plot",
    icon: BarChart3,
    title: "Sex Risk Plot",
    desc: "Top female- and male-associated ASD genes ranked by -log10(q-value)",
    color: "text-pink-500",
  },
  {
    to: "/sex-scatter",
    icon: ScatterChart,
    title: "Female vs Male Scatter",
    desc: "Compare sex-specific enrichment with significance quadrant classification",
    color: "text-rose-500",
  },
  {
    to: "/model-plot",
    icon: FlaskConical,
    title: "Model Bubble Chart",
    desc: "Interactive bubble chart of gene x model organism validation studies with PubMed links",
    color: "text-green-500",
  },
  {
    to: "/heatmap",
    icon: Grid3X3,
    title: "Model Heatmap",
    desc: "Heatmap visualization of PMID counts across genes and model organisms",
    color: "text-cyan-500",
  },
  {
    to: "/fdr-compare",
    icon: GitCompareArrows,
    title: "FDR Comparison",
    desc: "Pairwise scatter plots comparing FDR TADA values across ASD, DD, and NDD",
    color: "text-indigo-500",
  },
  {
    to: "/upset",
    icon: Layers,
    title: "UpSet Plot",
    desc: "Gene set overlap analysis showing shared significance across ASD, DD, and NDD",
    color: "text-orange-500",
  },
]

export function LandingPage() {
  const { theme } = useTheme()

  return (
    <div className="space-y-16 pb-12">
      {/* Hero */}
      <section className="relative overflow-hidden pt-12 pb-16">
        <div className="absolute inset-0 -z-10 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <div className="flex justify-center">
            <div className={`rounded-2xl p-4 ${theme === "dark" ? "bg-primary/10" : "bg-primary/5"}`}>
              <Dna className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            K-GeneBook
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            An interactive resource for exploring ASD risk genes identified through
            whole-genome sequencing of Korean families, SSC, SPARK, and MSSNG cohorts.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link to="/table">
              <Button size="lg">
                <Table2 className="mr-2 h-4 w-4" />
                Explore Gene Table
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About the study */}
      <section className="mx-auto max-w-4xl space-y-4">
        <h2 className="text-2xl font-bold text-center">About the Study</h2>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">Publication</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Kim SW, Lee H, Song DY, et al.
                  &ldquo;Whole genome sequencing analysis identifies sex differences of familial pattern
                  contributing to phenotypic diversity in autism.&rdquo;{" "}
                  <em>Genome Medicine</em> 16, 114 (2024).
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <a href="https://pubmed.ncbi.nlm.nih.gov/39334436/" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-1.5 h-3 w-3" /> PubMed
                    </Button>
                  </a>
                  <a href="https://doi.org/10.1186/s13073-024-01385-6" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-1.5 h-3 w-3" /> Full Text (DOI)
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            <hr className="border-border" />

            <div className="flex items-start gap-3">
              <Dna className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">Key Findings</h3>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1 list-disc list-inside">
                  <li>Robust female enrichment of <em>de novo</em> protein-truncating variants in autism</li>
                  <li>Sex- and phenotype-dependent genetic liability patterns across populations</li>
                  <li>Comorbid intellectual disability and symptom severity explain sex differences in genetic burden</li>
                  <li>Males with autistic sisters show more pronounced communication challenges</li>
                </ul>
              </div>
            </div>

            <hr className="border-border" />

            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">Cohorts</h3>
                <div className="grid grid-cols-2 gap-2 mt-2 sm:grid-cols-4">
                  {[
                    { name: "Korean Families", detail: "2,255 individuals (WGS)" },
                    { name: "SSC", detail: "Simons Simplex Collection" },
                    { name: "SPARK", detail: "Simons SPARK cohort" },
                    { name: "MSSNG", detail: "Autism Speaks MSSNG" },
                  ].map((c) => (
                    <div key={c.name} className="rounded-lg border p-2.5 text-center">
                      <div className="text-xs font-semibold">{c.name}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{c.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Features Grid */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Explore the Data</h2>
        <p className="text-sm text-muted-foreground text-center max-w-xl mx-auto">
          Interactive visualizations and tools for browsing ASD risk gene data
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link key={f.to} to={f.to} className="group">
              <Card className="h-full transition-colors hover:border-primary/40 hover:shadow-md">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${f.color}`}>
                      <f.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                        {f.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Lab info */}
      <section className="mx-auto max-w-2xl text-center space-y-3">
        <h2 className="text-2xl font-bold">An Lab</h2>
        <p className="text-sm text-muted-foreground">
          Genomics &amp; AI for Understanding Human Disease
        </p>
        <p className="text-sm text-muted-foreground">
          Department of Biosystems and Biomedical Sciences, Korea University, Seoul
        </p>
        <a href="https://joonanlab.github.io/" target="_blank" rel="noopener noreferrer">
          <Button variant="outline">
            <ExternalLink className="mr-2 h-4 w-4" />
            Visit Lab Website
          </Button>
        </a>
      </section>
    </div>
  )
}
