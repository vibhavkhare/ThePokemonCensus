// Set the dimensions and margins for the chart
const width = 500, height = 500, margin = 40;
const radius = Math.min(width, height) / 2 - margin;

// Create an SVG element
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

// Load the CSV data
d3.csv("data/pokemon.csv").then(data => {
    // Count the occurrences of each 'type1' value
    const typeCounts = d3.rollup(data, v => v.length, d => d.type1);

    // Convert the Map to an array of objects for easier handling
    const typeData = Array.from(typeCounts, ([type, count]) => ({ type, count }));

    // Set up the color scale
    const color = d3.scaleOrdinal()
        .domain(typeData.map(d => d.type))
        .range(d3.schemeCategory10);

    // Create the pie chart data
    const pie = d3.pie()
        .value(d => d.count);

    // Generate the arcs
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    // Draw each slice
    svg.selectAll('path')
        .data(pie(typeData))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.type))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7);

    // Add labels
    svg.selectAll('text')
        .data(pie(typeData))
        .enter()
        .append('text')
        .text(d => d.data.type)
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .style("text-anchor", "middle")
        .style("font-size", 12);
}).catch(error => {
    console.error("Error loading the CSV file:", error);
});
