export interface GeneData {
  gene: string
  ASD_female_qval: number | null
  ASD_male_qval: number | null
  FDR_TADA_ASD: number | null
  FDR_TADA_DD: number | null
  FDR_TADA_NDD: number | null
  Mouse: string
  Drosophila: string
  Zebrafish: string
  Rat: string
  Primate: string
  Organoid: string
  "Human cell": string
}

export const MODEL_ORGANISMS = [
  "Mouse",
  "Drosophila",
  "Zebrafish",
  "Rat",
  "Primate",
  "Organoid",
  "Human cell",
] as const

export type ModelOrganism = (typeof MODEL_ORGANISMS)[number]

export const MODEL_COLORS: Record<ModelOrganism, string> = {
  Mouse: "#1f77b4",
  Drosophila: "#ff7f0e",
  Zebrafish: "#2ca02c",
  Rat: "#d62728",
  Primate: "#8c564b",
  Organoid: "#9467bd",
  "Human cell": "#e377c2",
}

export function parsePmids(raw: string): string[] {
  if (!raw || raw === "." || raw.trim() === "") return []
  return raw
    .replace(/"/g, "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "" && s !== ".")
}

export function getPmidCount(raw: string): number {
  return parsePmids(raw).length
}

export function parseNumeric(val: unknown): number | null {
  if (val === null || val === undefined || val === "" || val === ".") return null
  const n = Number(val)
  return isNaN(n) ? null : n
}

export function formatScientific(val: number | null): string {
  if (val === null) return "N/A"
  if (val === 0) return "0"
  if (val < 0.001) return val.toExponential(2)
  return val.toPrecision(4)
}

export function isSignificant(val: number | null, threshold = 0.05): boolean {
  return val !== null && val <= threshold
}

export function negLog10(val: number | null): number {
  if (val === null || val <= 0) return 0
  return -Math.log10(val)
}
