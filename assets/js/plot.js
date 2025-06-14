document.addEventListener('DOMContentLoaded', function() {
  const table = document.getElementById('geneTable');
  const rows = table.querySelectorAll('tbody tr');
  const data = [];

  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    const gene = cells[0].textContent.trim();
    const bf = parseFloat(cells[3].textContent);
    console.log('Gene:', gene, '| BF_total:', bf);  // Debug output
    if (!isNaN(bf) && gene) {
      data.push({ gene, bf });
    }
  });

  // DataTables enhancement: search, sort, pagination
  $('#geneTable').DataTable({
    pageLength: 10,
    lengthMenu: [10, 25, 50, 100],
    ordering: true,
    searching: true
  });

  const sorted = data.sort((a, b) => b.bf - a.bf).slice(0, 10);

  const trace = {
    x: sorted.map(d => d.gene),
    y: sorted.map(d => Math.log10(d.bf)),
    type: 'bar',
    name: 'log10(BF_total)'
  };

  const layout = {
    title: 'Top ASD Genes by Bayes Factor (log10 scale)',
    xaxis: {
      title: 'Gene',
      tickangle: -45
    },
    yaxis: { title: 'log10(BF.total)' }
  };

  Plotly.newPlot('bfPlot', [trace], layout);
});
