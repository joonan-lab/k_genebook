---
layout: default
title: K-GeneBook
---

{% include navbar.html %}


# K-GeneBook: Prioritized ASD Genes from Korean Families

This page presents a curated table of genes prioritized from whole-genome sequencing (WGS) analysis of Korean autism spectrum disorder (ASD) families.  
Statistical enrichment was calculated separately for females and males, based on ASD-specific gene expression, as described in Kim et al. (2024, *Genome Medicine*) [PMID: [39334436](https://pubmed.ncbi.nlm.nih.gov/39334436/)].  
Additional functional validation status was cross-referenced with TADA-based FDR values from Fu et al. (2022, *Nature Genetics*) [PMID: [35982160](https://pubmed.ncbi.nlm.nih.gov/35982160/)].

Each row corresponds to a gene, and each column summarizes statistical or functional evidence, including model organism studies (with PubMed IDs) if available.

### Column Descriptions:

- **gene**: Official gene symbol  
- **ASD_female_qval**: q-value for ASD gene enrichment in female probands (lower is more significant)  
- **ASD_male_qval**: q-value for ASD gene enrichment in male probands  
- **FDR_TADA_ASD**: False discovery rate (FDR) for ASD association from Fu et al. (2022)  
- **FDR_TADA_DD**: FDR for developmental disorders (DD)  
- **FDR_TADA_NDD**: FDR for broader neurodevelopmental disorders (NDD)  
- **Mouse**, **Drosophila**, **Zebrafish**, **Rat**, **Primate**, **Organoid**, **Human cell**:  
  PubMed IDs (PMIDs) for functional studies using the corresponding model system. If no study is available, the field is marked as `.`.



{% include gene_table.html %}

<script src="{{ '/assets/js/plot.js' | relative_url }}"></script>
