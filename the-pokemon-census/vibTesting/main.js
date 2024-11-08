// Define dimensions and radius for the pie chart
const width = 600;
const height = 600;
const radius = Math.min(width, height) / 2;

// Select SVG and set up a group for the pie chart
const svg = d3.select("#pie-chart")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

// Define a custom color dictionary for Pokémon types
const typeColors = {
    "fire": "#ea7a3c",
    "water": "#539ae2",
    "grass": "#71c558",
    "electric": "#e5c531",
    "ice": "#70cbd4",
    "fighting": "#cb5f48",
    "poison": "#b468b7",
    "ground": "#cc9f4f",
    "flying": "#7da6de",
    "psychic": "#e5709b",
    "bug": "#94bc4a",
    "rock": "#b2a061",
    "ghost": "#846ab6",
    "dragon": "#6a7baf",
    "dark": "#736c75",
    "steel": "#89a1b0",
    "fairy": "#e397d1",
    "normal": "#aab09f"
};

// Pie and arc generators
const pie = d3.pie().value(d => d.count);
const arc = d3.arc().innerRadius(0).outerRadius(radius);

//Tooltip setup
const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "1px solid #ccc")
    .style("padding", "8px")
    .style("border-radius", "4px")
    .style("display", "none");

// Load the data
d3.csv("data/pokemon.csv").then(data => {
    // Convert generation and count fields to numbers
    data.forEach(d => {
        d.generation = +d.generation;
        d.count = +d.count;
    });

    // Get unique generations for the dropdown
    const generations = Array.from(new Set(data.map(d => d.generation))).sort();

    // Populate dropdown with generations
    const dropdown = d3.select("#generation-select");
    dropdown.selectAll("option")
        .data(generations)
        .enter()
        .append("option")
        .text(d => `Generation ${d}`)
        .attr("value", d => d);

    // Initial display with the first generation
    updateChart(data, generations[0]);

    // Update the chart when a different generation is selected
    dropdown.on("change", function() {
        const selectedGen = +this.value;
        updateChart(data, selectedGen);
    });
});

// Function to update the pie chart based on selected generation
function updateChart(data, generation) {
    // Filter data by selected generation
    const filteredData = data
        .filter(d => d.generation === generation)
        .reduce((acc, cur) => {
            const type = cur.type1;
            if (!acc[type]) acc[type] = { type: type, count: 0 };
            acc[type].count += 1;
            return acc;
        }, {});

    // Transform data into array format for the pie chart
    const pieData = Object.values(filteredData);

    // Join data and update pie chart
    const arcs = svg.selectAll("path").data(pie(pieData));

    // Enter new data for pie slices
    arcs.enter()
        .append("path")
        .merge(arcs)
        .attr("d", arc)
        .attr("fill", d => typeColors[d.data.type] || "#cccccc") // Use custom color or fallback
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .on("mouseover", function(event, d) {
            tooltip.style("display", "block")
                .html(`Type: ${d.data.type}<br>Count: ${d.data.count}`);
            d3.select(this).style("opacity", 0.7); // Highlight slice on hover
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                   .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("display", "none");
            d3.select(this).style("opacity", 1); // Reset slice opacity
        });

    // Remove old data
    arcs.exit().remove();
}
