const height = 1400;
const width = 1400;
const color = d3.scaleOrdinal(d3.schemeDark2);

const svg = d3.select("#container")
              .append("svg")
              .attr("id", "main-svg")
              .attr("height", height)
              .attr("width", width);
const tooltip = d3.select("#container")
                  .append("div")
                  .attr("id", "tooltip")
                  .attr("class", "hidden");

const run = async () => {
  const dataset = await d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json");

  const treemap = d3.treemap()
                    .size([width, height])
                    .padding(1);
  const root = d3.hierarchy(dataset)
                 .sum(d => d.value);
  treemap(root);

  const leaf = svg.selectAll("g")
                  .data(root.leaves())
                  .enter()
                  .append("g")
                  .attr("transform", d => "translate(" + d.x0 + ", " + d.y0 + ")");
  leaf.append("rect")
      .attr("class", "tile")
      .attr("height", d => d.y1 - d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("fill", d => color(d.data.category))
      .attr("data-name", d => d.data.name)
      .attr("data-category", d => d.data.category)
      .attr("data-value", d => d.data.value)
      .on("mousemove", function(d, i) {
        d3.select("#tooltip").classed("hidden", false);
        d3.select(this).classed("selected", true);
        tooltip.style("top", d.pageY - 195 + "px")
               .style("left", d.pageX - 230 + "px")
               .html("<span style='color: " + color(i.data.category) + "'>Movie:</span> " + i.data.name + "<br><span style='color: " + color(i.data.category) + "'>Category:</span> " + i.data.category + "<br><span style='color: " + color(i.data.category) + "'>Value:</span> " + d3.format(",")(i.data.value))
               .attr("data-value", i.data.value);
      })
      .on("mouseout", function(d, i) {
        d3.select("#tooltip").classed("hidden", true);
        d3.select(this).classed("selected", false);
      });
  leaf.append("text")
      .selectAll("tspan")
      .data(d => d.data.name.split(/\s([A-Z][^A-Z]*)\s/))
      .enter()
      .append("tspan")
      .attr("class", "tile-text")
      .text(d => d)
      .attr("x", 5)
      .attr("y", (d, i) => 18 + i * 15);

  const categories = [...new Set(root.leaves().map((d) => d.data.category))];
  const legendCellHeight = 25;
  const legendCellWidth = 25;
  const legendCellGap = 140;
  const legendSvgWidth = (legendCellWidth + legendCellGap) * categories.length;
  const legend = d3.select("#container")
                   .append("svg")
                   .attr("id", "legend-svg")
                   .attr("height", legendCellHeight)
                   .attr("width", legendSvgWidth);
  legend.append("g")
        .attr("id", "legend")
        .selectAll("rect")
        .data(categories)
        .enter()
        .append("rect")
        .attr("class", "legend-item")
        .attr("height", legendCellHeight)
        .attr("width", legendCellWidth)
        .attr("x", (d, i) => i * (legendCellWidth + legendCellGap))
        .style("fill", (d) => color(d))
        .style("stroke", "black");
  legend.selectAll("text")
        .data(categories)
        .enter()
        .append("text")
        .attr("class", "legend-text")
        .text(d => d)
        .attr("x", (d, i) => i * (legendCellWidth + legendCellGap) + legendCellWidth + 8 + "px")
        .attr("y", 20 + "px");
};
run();