const svg = d3.select("#map");
const path = d3.geoPath();
const tooltip = d3.select("#tooltip");

function renderMunicipalities(geojson, csvData) {
  const nameByCode = {};
  csvData.forEach(d => {
    nameByCode[d.code || d.EKATTE || d.nuts4] = d.name;
  });

  const projection = d3.geoMercator().fitSize([1000, 600], geojson);
  path.projection(projection);

  const municipalities = svg.selectAll("path.municipality")
    .data(geojson.features)
    .enter()
    .append("path")
    .attr("class", "municipality")
    .attr("d", path);

  const highlight = svg.append("path")
    .attr("class", "highlight");

  municipalities
    .on("mouseover", function(event, d) {
      const code = d.properties.nuts4;
      const name = nameByCode[code] || `(${code})`;

      highlight
        .attr("d", path(d))
        .classed("visible", true);

      tooltip
        .classed("visible", true)
        .html(name);
    })
    .on("mousemove", function(event) {
      tooltip
        .style("left", (event.pageX + 8) + "px")
        .style("top", (event.pageY + 8) + "px");
    })
    .on("mouseout", function() {
      highlight.classed("visible", false);
      tooltip.classed("visible", false);
    });
}

async function drawMap() {
  try {
    renderMunicipalities(await Data.geojson(), await Data.municip());
  } catch {
    svg.append("text")
      .attr("x", 20)
      .attr("y", 30)
      .attr("fill", "red")
      .text("Failed to load municipalities or names");
  }
}

drawMap();
