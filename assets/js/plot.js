document.addEventListener('DOMContentLoaded', function () {
  function waitAndInitTable() {
    const $table = $('#geneTable');
    if ($table.length === 0) {
      console.warn('⏳ Waiting for geneTable...');
      setTimeout(waitAndInitTable, 100);
      return;
    }

    if (!$.fn.DataTable.isDataTable('#geneTable')) {
      $table.DataTable({
        pageLength: 10,
        lengthMenu: [10, 25, 50, 100],
        ordering: true,
        searching: true
      });
      console.log('✅ DataTable forcibly initialized.');
    }
  }

  waitAndInitTable();
});
