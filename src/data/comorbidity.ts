export const COMORBIDITY_DOMAINS = [
  { id: "epilepsy", label: "Epilepsy", color: "#ef4444" },
  { id: "id", label: "Intellectual Disability", color: "#f97316" },
  { id: "speech", label: "Speech/Language", color: "#eab308" },
  { id: "adhd", label: "ADHD", color: "#22c55e" },
  { id: "schizophrenia", label: "Schizophrenia", color: "#06b6d4" },
  { id: "macrocephaly", label: "Macrocephaly", color: "#3b82f6" },
  { id: "microcephaly", label: "Microcephaly", color: "#6366f1" },
  { id: "cardiac", label: "Cardiac Defects", color: "#8b5cf6" },
  { id: "gi", label: "GI Disorders", color: "#d946ef" },
  { id: "sleep", label: "Sleep Disorders", color: "#ec4899" },
] as const

export type ComorbidityDomain = (typeof COMORBIDITY_DOMAINS)[number]
export type ComorbidityDomainId = ComorbidityDomain["id"]

/** Literature-based gene-comorbidity mappings for ASD risk genes */
export const COMORBIDITY_GENES: Record<ComorbidityDomainId, string[]> = {
  epilepsy: [
    "SCN2A", "SCN1A", "STXBP1", "SYNGAP1", "GRIN2B", "GABRB3", "CNTNAP2",
    "PTEN", "FOXP1", "DYRK1A", "CHD2", "SLC6A1", "SHANK3", "NRXN1",
    "ANKRD11", "KCNQ2", "ASH1L", "GRIN2A", "TCF4", "SETBP1", "KCNB1",
    "CDKL5", "MECP2",
  ],
  id: [
    "ADNP", "ARID1B", "DYRK1A", "KDM6B", "MED13L", "SETD5", "SYNGAP1",
    "ANKRD11", "KMT2A", "FOXP1", "PTEN", "SHANK3", "STXBP1", "GRIN2B",
    "CHD8", "CHD2", "CTNNB1", "DDX3X", "POGZ", "ASH1L", "KDM5B",
    "BCL11A", "TRIP12", "PHF21A", "SLC6A1", "WAC", "TBR1", "GIGYF1",
    "SCN2A", "GRIN2A", "TCF4", "SETBP1", "KAT6A", "ARID2", "RAI1",
    "SATB1", "HNRNPU", "MED13", "CREBBP", "EP300",
  ],
  speech: [
    "FOXP1", "FOXP2", "CNTNAP2", "SHANK3", "ADNP", "SYNGAP1", "GRIN2B",
    "TBR1", "SETD5", "CHD8", "DYRK1A", "MED13L", "ANKRD11", "KMT2A",
    "BCL11A", "DDX3X", "TCF4", "KCNQ2",
  ],
  adhd: [
    "ADNP", "ANKRD11", "CHD8", "FOXP1", "SHANK3", "SYNGAP1", "CNTNAP2",
    "NRXN1", "DYRK1A",
  ],
  schizophrenia: [
    "NRXN1", "SHANK3", "CNTNAP2", "SETD1A", "SYNGAP1", "GRIN2A",
    "GRIN2B", "BCL11A", "TCF4",
  ],
  macrocephaly: [
    "PTEN", "CHD8", "ADNP", "PPP2R5D", "CTNNB1",
  ],
  microcephaly: [
    "DYRK1A", "FOXP1", "KMT2A", "PHF21A", "ASPM", "WDR62",
  ],
  cardiac: [
    "CHD7", "TBX1", "NKX2-5", "NOTCH2", "KMT2D", "DYRK1A", "ANKRD11",
    "KMT2A", "CHD8", "CTNNB1", "PTEN",
  ],
  gi: [
    "PTEN", "SHANK3", "CHD8", "FOXP1", "DYRK1A", "CNTNAP2", "SYNGAP1",
    "SCN2A", "ADNP",
  ],
  sleep: [
    "SHANK3", "ADNP", "SYNGAP1", "CNTNAP2", "MECP2", "FOXP1",
    "CHD8", "SCN2A", "DYRK1A",
  ],
}
