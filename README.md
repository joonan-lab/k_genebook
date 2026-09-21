# K-GeneBook

Interactive gene book for the Korean autism cohort study. It lets readers browse the genes, risk scores, sex-stratified burden, comorbidity patterns and model comparisons reported in the cohort paper without downloading the supplementary tables.

- Live site: https://joonan-lab.github.io/k_genebook/
- Data source: gene-level results from the published cohort study (Kim et al., *Genome Medicine*, 2024). The bundled table is `public/gene_data.csv`.

## Pages

| Route | What it shows |
|---|---|
| Landing | Study summary and key findings |
| Dashboard | Overview of the gene table with filters |
| Ranking | Gene ranking by risk score |
| Heatmap | Gene × domain heatmap |
| Sex scatter / Sex risk | Sex-stratified burden and liability |
| FDR comparison | Gene-set comparison across FDR thresholds |
| UpSet | Overlap across gene sets |
| Comorbidity | Comorbidity bar chart and gene-domain heatmap |
| Gene detail | Per-gene page |

## Development

```bash
npm install
npm run dev        # local dev server
npm run build      # type-check + production build
npm run deploy     # build and publish to GitHub Pages (gh-pages)
```

Stack: React 19, Vite, TypeScript, react-router, TanStack Table, Recharts, PapaParse. Deployment also runs from `.github/workflows/deploy.yml` on push.

## Updating the data

Replace `public/gene_data.csv` and keep the column names used by `src/hooks/useGeneData.ts` and `src/lib/gene-utils.ts`. Only published, de-identified gene-level results belong in this public repository.
