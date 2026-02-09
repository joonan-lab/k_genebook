import { useState } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MODEL_ORGANISMS, type GeneData } from "@/lib/gene-utils"

export interface FilterState {
  femaleQvalMax: string
  maleQvalMax: string
  fdrAsdMax: string
  fdrDdMax: string
  fdrNddMax: string
  hasModelStudy: string[] // model organisms that must have studies
  noModelStudy: string[] // model organisms that must NOT have studies
}

const defaultFilters: FilterState = {
  femaleQvalMax: "",
  maleQvalMax: "",
  fdrAsdMax: "",
  fdrDdMax: "",
  fdrNddMax: "",
  hasModelStudy: [],
  noModelStudy: [],
}

interface FilterPanelProps {
  onFilter: (fn: ((data: GeneData[]) => GeneData[]) | null) => void
}

export function FilterPanel({ onFilter }: FilterPanelProps) {
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>(defaultFilters)

  const updateFilter = (key: keyof FilterState, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const toggleModelCheckbox = (
    field: "hasModelStudy" | "noModelStudy",
    model: string
  ) => {
    setFilters((prev) => {
      const list = prev[field]
      const next = list.includes(model) ? list.filter((m) => m !== model) : [...list, model]
      return { ...prev, [field]: next }
    })
  }

  const applyFilters = () => {
    onFilter((data: GeneData[]) => {
      return data.filter((row) => {
        if (filters.femaleQvalMax && row.ASD_female_qval !== null) {
          if (row.ASD_female_qval > parseFloat(filters.femaleQvalMax)) return false
        }
        if (filters.maleQvalMax && row.ASD_male_qval !== null) {
          if (row.ASD_male_qval > parseFloat(filters.maleQvalMax)) return false
        }
        if (filters.fdrAsdMax && row.FDR_TADA_ASD !== null) {
          if (row.FDR_TADA_ASD > parseFloat(filters.fdrAsdMax)) return false
        }
        if (filters.fdrDdMax && row.FDR_TADA_DD !== null) {
          if (row.FDR_TADA_DD > parseFloat(filters.fdrDdMax)) return false
        }
        if (filters.fdrNddMax && row.FDR_TADA_NDD !== null) {
          if (row.FDR_TADA_NDD > parseFloat(filters.fdrNddMax)) return false
        }
        for (const model of filters.hasModelStudy) {
          const val = row[model as keyof GeneData] as string
          if (!val || val === "." || val.trim() === "") return false
        }
        for (const model of filters.noModelStudy) {
          const val = row[model as keyof GeneData] as string
          if (val && val !== "." && val.trim() !== "") return false
        }
        return true
      })
    })
  }

  const clearFilters = () => {
    setFilters(defaultFilters)
    onFilter(null)
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Filter className="mr-2 h-4 w-4" />
        Advanced Filters
      </Button>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Advanced Filters</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <div>
            <label className="text-xs text-muted-foreground">Female q-val &le;</label>
            <Input
              type="number"
              step="any"
              placeholder="e.g. 0.05"
              value={filters.femaleQvalMax}
              onChange={(e) => updateFilter("femaleQvalMax", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Male q-val &le;</label>
            <Input
              type="number"
              step="any"
              placeholder="e.g. 0.05"
              value={filters.maleQvalMax}
              onChange={(e) => updateFilter("maleQvalMax", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">FDR ASD &le;</label>
            <Input
              type="number"
              step="any"
              placeholder="e.g. 0.05"
              value={filters.fdrAsdMax}
              onChange={(e) => updateFilter("fdrAsdMax", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">FDR DD &le;</label>
            <Input
              type="number"
              step="any"
              placeholder="e.g. 0.05"
              value={filters.fdrDdMax}
              onChange={(e) => updateFilter("fdrDdMax", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">FDR NDD &le;</label>
            <Input
              type="number"
              step="any"
              placeholder="e.g. 0.05"
              value={filters.fdrNddMax}
              onChange={(e) => updateFilter("fdrNddMax", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Has model study in:
            </label>
            <div className="flex flex-wrap gap-2">
              {MODEL_ORGANISMS.map((model) => (
                <label key={model} className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.hasModelStudy.includes(model)}
                    onChange={() => toggleModelCheckbox("hasModelStudy", model)}
                    className="rounded"
                  />
                  {model}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              No model study in:
            </label>
            <div className="flex flex-wrap gap-2">
              {MODEL_ORGANISMS.map((model) => (
                <label key={model} className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.noModelStudy.includes(model)}
                    onChange={() => toggleModelCheckbox("noModelStudy", model)}
                    className="rounded"
                  />
                  {model}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" onClick={applyFilters}>
            Apply Filters
          </Button>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
