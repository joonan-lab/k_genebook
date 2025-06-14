document.addEventListener('DOMContentLoaded', function () {
  const tableEl = document.getElementById('geneTable');

  // ✅ Force DataTable setup
  if (typeof $ !== 'undefined' && $.fn.dataTable) {
    if (!$.fn.DataTable.isDataTable('#geneTable')) {
      $('#geneTable').DataTable({
        pageLength: 10,
        lengthMenu: [10, 25, 50, 100],
        ordering: true,
        searching: true
      });
      console.log('✅ DataTable initialized with search/sort');
    }
  } else {
    console.warn('⚠️ jQuery or DataTables not loaded properly');
  }

  // 📊 Plot based on ASD_female_qval
  const rows = tableEl?.querySelectorAll('tbody tr') || [];
  const data = [];

  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    const gene = cells[0]?.textContent.trim();
    const qval = parseFloat(cells[1]?.textContent);
    if (!isNaN(qval) && qval > 0) {
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
});
