document.addEventListener('DOMContentLoaded', function () {
  fetch("gene_data.csv")
    .then(res => res.text())
    .then(text => {
      const rows = text.split("\n").slice(1).filter(r => r.trim() !== "");
      const data = [];

      rows.forEach(line => {
        const cols = line.split(",");
        const gene = cols[0]?.trim();
        const qval = parseFloat(cols[1]);
        if (gene && !isNaN(qval) && qval > 0) {
          data.push({ gene, logq: -Math.log10(qval) });
        }
      });

      const sorted = data.sort((a, b) => b.logq - a.logq).slice(0, 10);

      const trace = {
        x: sorted.map(d => d.gene),
        y: sorted.map(d => d.logq),
        type: 'bar',
        name: '-log10(ASD_female_qval)'
      };

      const layout = {
        title: 'Top ASD Female-associated Genes (by -log10(q))',
        xaxis: { title: 'Gene', tickangle: -45 },
        yaxis: { title: '-log10(q)' }
      };

      Plotly.newPlot('bfPlot', [trace], layout);
    })
    .catch(err => {
      console.error("❌ Failed to load gene_data.csv:", err);
    });
});
