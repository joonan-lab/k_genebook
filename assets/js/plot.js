document.addEventListener('DOMContentLoaded', function () {
  const tableEl = document.getElementById('geneTable');

  if (!tableEl) {
    console.warn('⚠️ geneTable element not found.');
    return;
  }

  if (typeof $ !== 'undefined' && $.fn.dataTable) {
    if (!$.fn.DataTable.isDataTable('#geneTable')) {
      $('#geneTable').DataTable({
        pageLength: 10,
        lengthMenu: [10, 25, 50, 100],
        ordering: true,
        searching: true
      });
      console.log('✅ DataTable initialized with paging, search, and sort.');
    }
  } else {
    console.warn('⚠️ jQuery or DataTables not loaded.');
  }
});
