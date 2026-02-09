import { HashRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/context/ThemeContext"
import { Layout } from "@/components/Layout"
import { LandingPage } from "@/pages/LandingPage"
import { HomePage } from "@/pages/HomePage"
import { DashboardPage } from "@/pages/DashboardPage"
import { RankingPage } from "@/pages/RankingPage"
import { SexPlotPage } from "@/pages/SexPlotPage"
import { SexScatterPage } from "@/pages/SexScatterPage"
import { ModelPlotPage } from "@/pages/ModelPlotPage"
import { HeatmapPage } from "@/pages/HeatmapPage"
import { FdrComparisonPage } from "@/pages/FdrComparisonPage"
import { UpsetPage } from "@/pages/UpsetPage"
import { GeneDetailPage } from "@/pages/GeneDetailPage"

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/table" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/sex-plot" element={<SexPlotPage />} />
            <Route path="/sex-scatter" element={<SexScatterPage />} />
            <Route path="/model-plot" element={<ModelPlotPage />} />
            <Route path="/heatmap" element={<HeatmapPage />} />
            <Route path="/fdr-compare" element={<FdrComparisonPage />} />
            <Route path="/upset" element={<UpsetPage />} />
            <Route path="/gene/:geneSymbol" element={<GeneDetailPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </ThemeProvider>
  )
}
