document.addEventListener('DOMContentLoaded', function () {
  let fullData = [];

  const modelColors = {
    "Mouse": "#1f77b4",
    "Drosophila": "#ff7f0e",
    "Zebrafish": "#2ca02c",
    "Rat": "#d62728",
    "Organoid": "#9467bd",
    "Primate": "#8c564b",
    "Human cell": "#e377c2"
  };

  function renderPlot(filteredData) {
    const sizes = filteredData.map(d => d.count);
    const maxSize = Math.max(...sizes);

    const trace = {
      x: filteredData.map(d => d.gene),
      y: filteredData.map(d => d.model),
      text: filteredData.map(d => d.count + " study" + (d.count > 1 ? "s" : "")),
      customdata: filteredData.map(d => d.pmids),
      mode: 'markers',
      marker: {
        size: sizes.map(n => n * 6),
        sizemode: 'area',
        sizeref: maxSize > 0 ? (2.0 * maxSize) / (60 ** 2) : 1,
        sizemin: 6,
        color: filteredData.map(d => modelColors[d.model] || "#7f7f7f"),
        line: { width: 1, color: '#333' }
      }
    };

    const layout = {
      title: 'Gene × Model Bubble Chart (Bubble Size = #PMIDs)',
      xaxis: { title: 'Gene', tickangle: -45 },
      yaxis: {
        title: 'Model Type',
        categoryorder: 'array',
        categoryarray: ["Mouse", "Drosophila", "Zebrafish", "Rat", "Organoid", "Primate", "Human cell"]
      },
      height: 700,
      showlegend: false
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
        const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);  // safely split CSV
        const gene = cols[0]?.replace(/"/g, '').trim();

        models.forEach((model, i) => {
          let val = cols[6 + i];
          if (val && val !== "." && typeof val === "string") {
            const clean = val.replace(/"/g, '');
            const pmidList = clean.split(",").map(x => x.trim()).filter(x => x !== "");
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
