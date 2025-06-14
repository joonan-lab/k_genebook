document.addEventListener('DOMContentLoaded', function () {
  function waitForJQueryAndInit() {
    if (typeof $ === 'undefined' || !$.fn || !$.fn.DataTable) {
      console.warn('⏳ Waiting for jQuery + DataTables...');
      setTimeout(waitForJQueryAndInit, 100);
      return;
    }

    const $table = $('#geneTable');
    if ($table.length === 0) {
      console.warn('⏳ Waiting for #geneTable...');
      setTimeout(waitForJQueryAndInit, 100);
      return;
    }

    if (!$.fn.DataTable.isDataTable('#geneTable')) {
      $table.DataTable({
        pageLength: 10,
        lengthMenu: [10, 25, 50, 100],
        ordering: true,
        searching: true
      });
      console.log('✅ DataTable successfully initialized.');
    }
  }

  waitForJQueryAndInit();
});
