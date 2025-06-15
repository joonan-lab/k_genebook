---
layout: default
title: ASD Plot
permalink: /plot/
---

{% include navbar.html %}

# Sex-Specific ASD Gene Prioritization

This page visualizes top ASD-associated genes separately for females and males, based on statistical prioritization from whole-genome sequencing of Korean ASD families.  
The statistical enrichment was calculated as q-values and transformed to -log10(q) for ranking.  
This analysis was derived from Kim et al. (2024, *Genome Medicine*) [PMID: [39334436](https://pubmed.ncbi.nlm.nih.gov/39334436/)].

Higher -log10(q) indicates stronger statistical evidence for ASD relevance in that sex group.  
Top 20 genes for females and males are shown in separate bar plots.

### Plot Description:

- **X-axis**: Gene symbol  
- **Y-axis**: -log10(q-value)  
- **Bar color**: One plot for females, one for males  
- **Data source**: Korean ASD family cohort (Kim et al. 2024)

<div id="bfPlot" style="width:100%; height:500px;"></div>

<script src="{{ '/assets/js/plot_female_qval.js' | relative_url }}"></script>
