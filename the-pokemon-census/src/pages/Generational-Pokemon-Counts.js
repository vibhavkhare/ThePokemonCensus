import React, { useEffect, useRef, useState } from 'react';
import { Typography, Box, MenuItem, Select } from '@mui/material';
import * as d3 from 'd3';

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

function GenerationalPokemonCounts() {
  const svgRef = useRef();
  const [data, setData] = useState([]);
  const [generation, setGeneration] = useState(1);

  useEffect(() => {
    d3.csv("data/pokemon.csv").then((csvData) => {
      const formattedData = csvData.map((d) => ({
        name: d["Name"] ?? d["name"],
        type1: d["Type 1"] ?? d["type1"],
        generation: parseInt(d["generation"]),
      }));
      setData(formattedData);
    });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const filteredData = data.filter(d => d.generation === generation);

      const typeCounts = d3.rollup(
        filteredData,
        v => v.length,
        d => d.type1
      );

      const typeData = Array.from(typeCounts, ([type, count]) => ({ type, count }));

      const width = 600; // 1.5 times bigger
      const height = 600; // 1.5 times bigger
      const radius = Math.min(width, height) / 2;

      d3.select(svgRef.current).selectAll("*").remove();

      const pie = d3.pie().value(d => d.count);
      const arc = d3.arc().innerRadius(0).outerRadius(radius);

      const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      const arcs = svg.selectAll("path")
        .data(pie(typeData));

      arcs.enter()
        .append("path")
        .merge(arcs)
        .attr("d", arc)
        .attr("fill", d => typeColors[d.data.type.toLowerCase()] || "#ccc")
        .attr("stroke", "white")
        .style("stroke-width", "3px") //  times bigger stroke width
        .on("mouseover", function(event, d) {
          const type = d.data.type.toLowerCase();
          const imageUrl = `/img/${type}.png`;

          tooltip.style("display", "block")
            .html(`
              <div style="display: flex; align-items: center;">
                <img src="${imageUrl}" alt="${type}" style="width: 60px; height: 60px; margin-right: 15px;" />
                <div style="font-size: 1.5em;">
                  <strong>Type:</strong> ${d.data.type}<br>
                  <strong>Count:</strong> ${d.data.count}
                </div>
              </div>
            `);
          d3.select(this).style("opacity", 0.7);
        })
        .on("mousemove", function(event) {
          tooltip.style("left", (event.pageX + 15) + "px")
                 .style("top", (event.pageY - 42) + "px");
        })
        .on("mouseout", function() {
          tooltip.style("display", "none");
          d3.select(this).style("opacity", 1);
        });

      const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("display", "none")
        .style("background", "white")
        .style("padding", "10px") // 1.5 times bigger padding
        .style("border", "1.5px solid #ccc") // 1.5 times bigger border
        .style("border-radius", "7.5px"); // 1.5 times bigger radius

    }
  }, [data, generation]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom style={{ fontSize: "1.5em" }}>
        Generational Pokémon Counts
      </Typography>
      <Select
        value={generation}
        onChange={(e) => setGeneration(e.target.value)}
        displayEmpty
        style={{ marginBottom: "30px", fontSize: "1.5em" }} // 1.5 times bigger font size
      >
        {[1, 2, 3, 4, 5, 6, 7, 8].map(gen => (
          <MenuItem key={gen} value={gen} style={{ fontSize: "1.5em" }}>
            Generation {gen}
          </MenuItem>
        ))}
      </Select>
      <svg ref={svgRef}></svg>
    </Box>
  );
}

export default GenerationalPokemonCounts;
