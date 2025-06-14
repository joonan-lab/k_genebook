document.addEventListener('DOMContentLoaded', function () {
  let fullData = [];

  function renderPlot(filteredData) {
    const trace = {
      x: filteredData.map(d => d.gene),
      y: filteredData.map(d => d.model),
      text: filteredData.map(d => d.count + " study" + (d.count > 1 ? "s" : "")),
      customdata: filteredData.map(d => d.pmids),
      mode: 'markers',
      marker: {
        size: filteredData.map(d => d.count * 5),
        sizemode: 'area',
        sizeref: 2.0 * Math.max(...filteredData.map(d => d.count)) / (60 ** 2),
        sizemin: 5,
        color: filteredData.map(d => d.model),
        line: { width: 1, color: '#333' }
      }
    };

    const layout = {
      title: 'Gene × Model Bubble Chart (Bubble Size = #PMIDs)',
      xaxis: { title: 'Gene', tickangle: -45 },
      yaxis: { title: 'Model Type', categoryorder: 'array', categoryarray: ["Mouse", "Drosophila", "Zebrafish", "Rat", "Organoid", "Primate", "Human cell"] },
      height: 700
    };

    Plotly.newPlot('modelPlot', [trace], layout);

    const plot = document.getElementById('modelPlot');
    plot.on('plotly_click', function (data) {
      const gene = data.points[0].x;
      const model = data.points[0].y;
      const pmids = data.points[0].customdata;
      const msg = `<b>${gene}</b> (${model})<br>PMIDs: ${pmids || 'N/A'}`;
      document.getElementById('pmidInfo').innerHTML = msg;
    });
  }

  fetch("/k_genebook/gene_data.csv")
    .then(res => res.text())
    .then(text => {
      const rows = text.split("\n").slice(1).filter(r => r.trim() !== "");
      const models = ["Mouse", "Drosophila", "Zebrafish", "Rat", "Primate", "Organoid", "Human cell"];
      fullData = [];

      rows.forEach(line => {
        const cols = line.split(",");
        const gene = cols[0]?.trim();

        models.forEach((model, i) => {
          const val = cols[6 + i]; // assuming 0~5 are qvals and FDRs
          if (val && val !== ".") {
            const pmidList = val.split(",").map(x => x.trim()).filter(x => x !== "");
            const count = pmidList.length;
            fullData.push({ gene, model, count, pmids: pmidList.join(", ") });
          }
        });
      });

      renderPlot(fullData);

      document.getElementById('filterInput').addEventListener('input', function () {
        const keyword = this.value.toLowerCase();
        const filtered = fullData.filter(d =>
          d.gene.toLowerCase().includes(keyword) || d.model.toLowerCase().includes(keyword)
        );
        renderPlot(filtered);
        document.getElementById('pmidInfo').innerHTML = "";
      });
    })
    .catch(err => {
      console.error("❌ Failed to load gene_data.csv for model bubble plot:", err);
    });
});
