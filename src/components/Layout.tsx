import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"

export function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        K-GeneBook &mdash; Kim et al., <em>Genome Med</em> 2024 (<a href="https://pubmed.ncbi.nlm.nih.gov/39334436/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">PMID: 39334436</a>)
      </footer>
    </div>
  )
}
