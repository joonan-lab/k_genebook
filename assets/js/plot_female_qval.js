document.addEventListener('DOMContentLoaded', function () {
  fetch("/k_genebook/gene_data.csv")
    .then(res => res.text())
    .then(text => {
      const rows = text.split("\n").slice(1).filter(r => r.trim() !== "");
      const femaleData = [];
      const maleData = [];

      rows.forEach(line => {
        const cols = line.split(",");
        const gene = cols[0]?.trim();
        const femaleQ = parseFloat(cols[1]);
        const maleQ = parseFloat(cols[2]);

        if (gene && !isNaN(femaleQ) && femaleQ > 0) {
          femaleData.push({ gene, logq: -Math.log10(femaleQ) });
        }

        if (gene && !isNaN(maleQ) && maleQ > 0) {
          maleData.push({ gene, logq: -Math.log10(maleQ) });
        }
      });

      const topFemale = femaleData.sort((a, b) => b.logq - a.logq).slice(0, 20);
      const topMale = maleData.sort((a, b) => b.logq - a.logq).slice(0, 20);

      Plotly.newPlot('bfPlot', [{
        x: topFemale.map(d => d.gene),
        y: topFemale.map(d => d.logq),
        type: 'bar',
        name: '-log10(Female q)',
        marker: { color: 'salmon' }
      }], {
        title: 'Top 20 Female-Associated ASD Genes (by -log10(q))',
        xaxis: { title: 'Gene', tickangle: -45 },
        yaxis: { title: '-log10(q)' }
      });

      Plotly.newPlot('bmPlot', [{
        x: topMale.map(d => d.gene),
        y: topMale.map(d => d.logq),
        type: 'bar',
        name: '-log10(Male q)',
        marker: { color: 'skyblue' }
      }], {
        title: 'Top 20 Male-Associated ASD Genes (by -log10(q))',
        xaxis: { title: 'Gene', tickangle: -45 },
        yaxis: { title: '-log10(q)' }
      });
    })
    .catch(err => {
      console.error("❌ Failed to load gene_data.csv:", err);
    });
});
