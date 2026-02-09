import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Sun, Moon, Dna, Menu, X } from "lucide-react"
import { useTheme } from "@/context/ThemeContext"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/table", label: "Gene Table" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/ranking", label: "Ranking" },
  { to: "/sex-plot", label: "Sex Risk Plot" },
  { to: "/sex-scatter", label: "F vs M Scatter" },
  { to: "/model-plot", label: "Model Bubble" },
  { to: "/heatmap", label: "Heatmap" },
  { to: "/fdr-compare", label: "FDR Compare" },
  { to: "/upset", label: "UpSet Plot" },
]

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg flex-shrink-0">
          <Dna className="h-5 w-5 text-primary" />
          K-GeneBook
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-xs px-2.5",
                  location.pathname === link.to && "bg-accent text-accent-foreground"
                )}
              >
                {link.label}
              </Button>
            </Link>
          ))}
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="ml-1">
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-1 lg:hidden">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t lg:hidden px-4 pb-3 pt-2 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                location.pathname === link.to && "bg-accent text-accent-foreground font-medium"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
