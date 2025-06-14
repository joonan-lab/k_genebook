$(document).ready(function () {
  $('#geneTable').DataTable({
    pageLength: 10,
    lengthMenu: [10, 25, 50, 100],
    ordering: true,
    searching: true
  });
});
