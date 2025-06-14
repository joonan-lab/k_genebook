
document.addEventListener('DOMContentLoaded', function () {
  const tableEl = document.getElementById('geneTable');
  const plotEl = document.getElementById('bfPlot');
  if (!tableEl) {
    console.error('❌ #geneTable not found in DOM');
    return;
  }
  if (!plotEl) {
    console.error('❌ #bfPlot not found in DOM');
    return;
  }

  // ⛳ DataTable 초기화
  if (typeof $ !== 'undefined' && $.fn.dataTable) {
    if (!$.fn.DataTable.isDataTable('#geneTable')) {
      $('#geneTable').DataTable({
        pageLength: 10,
        lengthMenu: [10, 25, 50, 100],
        ordering: true,
        searching: true
      });
      console.log('✅ DataTable initialized.');
    }
  } else {
    console.warn('⚠️ jQuery or DataTables not loaded properly.');
  }

  // 🎯 Plotly 시각화 (상위 10개 gene)
  const rows = tableEl.querySelectorAll('tbody tr');
  const data = [];
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    if (cells.length >= 4) {
      const gene = cells[0].textContent.trim();
      const bf = parseFloat(cells[3].textContent);
      if (!isNaN(bf)) {
        data.push({ gene, bf });
      }
    }
  });

  if (data.length === 0) {
    console.warn('⚠️ No valid data found for plotting.');
    return;
  }

  const sorted = data.sort((a, b) => b.bf - a.bf).slice(0, 10);
  Plotly.newPlot('bfPlot', [{
    x: sorted.map(d => d.gene),
    y: sorted.map(d => Math.log10(d.bf)),
    type: 'bar',
    name: 'log10(BF.total)'
  }], {
    title: 'Top ASD Genes by Bayes Factor (log10 scale)',
    xaxis: { title: 'Gene', tickangle: -45 },
    yaxis: { title: 'log10(BF.total)' }
  });

  console.log('✅ Plotly rendered with', sorted.length, 'genes');
});
