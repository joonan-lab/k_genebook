document.addEventListener('DOMContentLoaded', function() {
  const table = document.getElementById('geneTable');
  const rows = table?.querySelectorAll('tbody tr') || [];
  console.log('✅ DOM loaded. Rows found in #geneTable:', rows.length);

  const data = [];

  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    const gene = cells[0].textContent.trim();
    const bf = parseFloat(cells[3].textContent);
    if (!isNaN(bf) && gene) {
      data.push({ gene, bf });
    }
  });

  // 🧩 DataTables: only initialize if not already active
  if (typeof $ !== 'undefined' && $.fn.dataTable) {
    if (!$.fn.DataTable.isDataTable('#geneTable')) {
      $('#geneTable').DataTable({
        pageLength: 10,
        lengthMenu: [10, 25, 50, 100],
        ordering: true,
        searching: true
      });
      console.log('✅ DataTable initialized.');
    } else {
      console.warn('⚠️ DataTable was already initialized.');
    }
  } else {
    console.warn('⚠️ jQuery or DataTables not loaded properly.');
  }

  // 📊 Plotly visualization: Top 10 genes
  const sorted = data.sort((a, b) => b.bf - a.bf).slice(0, 10);

  const trace = {
    x: sorted.map(d => d.gene),
    y: sorted.map(d => Math.log10(d.bf)),
    type: 'bar',
    name: 'log10(BF_total)'
  };

  const layout = {
    title: 'Top ASD Genes by Bayes Factor (log10 scale)',
    xaxis: { title: 'Gene', tickangle: -45 },
    yaxis: { title: 'log10(BF.total)' }
  };

  Plotly.newPlot('bfPlot', [trace], layout);
});
