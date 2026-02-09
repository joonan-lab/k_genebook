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
        K-GeneBook &mdash; ASD Gene Data from Korean Families
      </footer>
    </div>
  )
}
