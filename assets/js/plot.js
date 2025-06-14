document.addEventListener('DOMContentLoaded', function() {
  const table = document.getElementById('geneTable');
  const rows = table.querySelectorAll('tbody tr');
  const data = [];

  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    const gene = cells[0].textContent;
    const bf = parseFloat(cells[3].textContent);
    if (!isNaN(bf)) {
      data.push({ gene, bf });
    }
  });

  const sorted = data.sort((a, b) => b.bf - a.bf).slice(0, 10);

  const trace = {
    x: sorted.map(d => d.gene),
    y: sorted.map(d => Math.log10(d.bf)),
    type: 'bar',
    name: 'log10(BF.total)'
  };

  const layout = {
    title: 'Top ASD Genes by Bayes Factor (log10 scale)',
    xaxis: { title: 'Gene' },
    yaxis: { title: 'log10(BF.total)' }
  };

  Plotly.newPlot('bfPlot', [trace], layout);
});
