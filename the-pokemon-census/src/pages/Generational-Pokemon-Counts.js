import React, { useEffect, useRef, useState } from 'react';
import { Typography, Box, MenuItem, Select } from '@mui/material';
import * as d3 from 'd3';

function GenerationalPokemonCounts() {
  const svgRef = useRef();
  const [data, setData] = useState([]);
  const [generation, setGeneration] = useState(1);

  useEffect(() => {
    // Load the data from the CSV file
    d3.csv("/data/pokemon.csv").then((csvData) => {
      // Convert and filter the data to include only necessary fields
      const formattedData = csvData.map((d) => ({
        name: d.Name,
        type1: d["Type 1"],
        generation: parseInt(d.Generation) || 1, // Assume Gen 1 if not provided
      }));
      setData(formattedData);
    });
  }, []);

  useEffect(() => {
    if (!data.length) return;

    // Define the color scale for types
    const typeColors = {
      Water: "blue",
      Fire: "#FF4500",
      Grass: "#7CFC00",
      Electric: "#FFD700",
      Ice: "#00CED1",
      // ... add more types here
      Normal: "#D3D3D3"
    };

    // Filter the data by selected generation
    const filteredData = data.filter(d => d.generation === generation);
    
    // Count Pokémon by type
    const typeCounts = d3.rollups(
      filteredData,
      v => v.length,
      d => d.type1
    ).map(([type, count]) => ({ type, count }));

    // Clear the previous SVG contents
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Set dimensions and margins for the pie chart
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const pie = d3.pie().value(d => d.count);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const chartGroup = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Create tooltip
    const tooltip = d3.select("body").append("div")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("padding", "5px")
      .style("border", "1px solid #ccc")
      .style("border-radius", "4px")
      .style("display", "none");

    // Draw pie chart slices
    chartGroup.selectAll("path")
      .data(pie(typeCounts))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", d => typeColors[d.data.type] || "#cccccc")
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .on("mouseover", (event, d) => {
        tooltip.style("display", "block")
               .html(`Type: ${d.data.type}<br>Count: ${d.data.count}`);
        d3.select(event.currentTarget).style("opacity", 0.7);
      })
      .on("mousemove", (event) => {
        tooltip.style("left", (event.pageX + 10) + "px")
               .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
        tooltip.style("display", "none");
        d3.selectAll("path").style("opacity", 1);
      });

  }, [data, generation]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Generational Pokémon Counts
      </Typography>
      <Select
        value={generation}
        onChange={(e) => setGeneration(e.target.value)}
        displayEmpty
        style={{ marginBottom: "20px" }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8].map(gen => (
          <MenuItem key={gen} value={gen}>Generation {gen}</MenuItem>
        ))}
      </Select>
      <svg ref={svgRef}></svg>
    </Box>
  );
}

export default GenerationalPokemonCounts;
