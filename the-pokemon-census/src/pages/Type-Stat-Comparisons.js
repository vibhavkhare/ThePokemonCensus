import React, { useEffect, useRef, useState } from 'react';
import { Typography, Box, MenuItem, Select } from '@mui/material';
import * as d3 from 'd3';

const typeColors = {
  fire: "#ea7a3c",
  water: "#539ae2",
  grass: "#71c558",
  electric: "#e5c531",
  ice: "#70cbd4",
  fighting: "#cb5f48",
  poison: "#b468b7",
  ground: "#cc9f4f",
  flying: "#7da6de",
  psychic: "#e5709b",
  bug: "#94bc4a",
  rock: "#b2a061",
  ghost: "#846ab6",
  dragon: "#6a7baf",
  dark: "#736c75",
  steel: "#89a1b0",
  fairy: "#e397d1",
  normal: "#aab09f",
};

const maxBaseStats = {
  hp: 255,
  attack: 190,
  defense: 230,
  sp_attack: 194,
  sp_defense: 230,
  speed: 180,
};

function TypeStatComparisons() {
  const svgRef1 = useRef();
  const svgRef2 = useRef();
  const [data, setData] = useState([]);
  const [selectedType1, setSelectedType1] = useState('');
  const [selectedType2, setSelectedType2] = useState('');
  const [averageStats1, setAverageStats1] = useState(null);
  const [averageStats2, setAverageStats2] = useState(null);

  useEffect(() => {
    d3.csv("data/pokemon.csv").then((csvData) => {
      const formattedData = csvData.map((d) => ({
        name: d["Name"] ?? d["name"],
        type1: d["Type 1"] ?? d["type1"],
        type2: d["Type 2"] ?? d["type2"],
        hp: +d["hp"],
        attack: +d["attack"],
        defense: +d["defense"],
        sp_attack: +d["sp_attack"],
        sp_defense: +d["sp_defense"],
        speed: +d["speed"],
      }));
      setData(formattedData);
    });
  }, []);

  const calculateAverageStats = (selectedType) => {
    if (!selectedType || data.length === 0) return null;

    const filteredData = data.filter(
      (pokemon) =>
        pokemon.type1.toLowerCase() === selectedType.toLowerCase() ||
        pokemon.type2.toLowerCase() === selectedType.toLowerCase()
    );

    if (filteredData.length === 0) return null;

    return {
      hp: d3.mean(filteredData, (d) => d.hp),
      attack: d3.mean(filteredData, (d) => d.attack),
      defense: d3.mean(filteredData, (d) => d.defense),
      sp_attack: d3.mean(filteredData, (d) => d.sp_attack),
      sp_defense: d3.mean(filteredData, (d) => d.sp_defense),
      speed: d3.mean(filteredData, (d) => d.speed),
    };
  };

  const renderChart = (svgRef, averageStats, selectedType) => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const stats = Object.keys(maxBaseStats).map((key) => ({
      stat: key,
      value: averageStats ? averageStats[key] : 0,
      normalizedValue: averageStats ? averageStats[key] / maxBaseStats[key] : 0,
    }));

    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 20, left: 150 };
    const barHeight = 25;
    const minBarWidth = 5;

    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", stats.length * barHeight + margin.top + margin.bottom);

    const x = d3.scaleLinear().domain([0, 1]).range([0, width]);
    const y = d3
      .scaleBand()
      .domain(stats.map((d) => d.stat))
      .range([0, stats.length * barHeight])
      .padding(0.1);

    const bars = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Add stat labels to the left of the bars
    bars
      .selectAll("text.label")
      .data(stats)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", -10)
      .attr("y", (d) => y(d.stat) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("fill", "#000")
      .style("font-size", "14px")
      .style("text-anchor", "end")
      .text((d) => d.stat.replace("_", " ").toUpperCase());

    // Background rectangles for the max values
    bars
      .selectAll("rect.background")
      .data(stats)
      .enter()
      .append("rect")
      .attr("class", "background")
      .attr("y", (d) => y(d.stat))
      .attr("width", x(1))
      .attr("height", y.bandwidth())
      .attr("fill", "#f0f0f0")
      .attr("stroke", "#000")
      .attr("stroke-width", 1);

    // Actual bars for the average values
    bars
      .selectAll("rect.bar")
      .data(stats)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", (d) => y(d.stat))
      .attr("width", (d) => Math.max(x(d.normalizedValue), minBarWidth))
      .attr("height", y.bandwidth())
      .attr("fill", typeColors[selectedType?.toLowerCase()] || "#ccc")
      .attr("stroke", "#000")
      .attr("stroke-width", 1);

    // Add text labels inside the bars with better alignment
    bars
      .selectAll("text.value")
      .data(stats)
      .enter()
      .append("text")
      .attr("class", "value")
      .attr("x", (d) => (d.value === 0 ? x(1) - 40 : Math.max(x(d.normalizedValue) - 10, minBarWidth + 5)))
      .attr("y", (d) => y(d.stat) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("fill", "#000")
      .style("font-size", "14px")
      .style("text-anchor", "end")
      .text((d) => d.value.toFixed(2));
  };

  useEffect(() => {
    const avgStats1 = calculateAverageStats(selectedType1);
    const avgStats2 = calculateAverageStats(selectedType2);

    setAverageStats1(avgStats1);
    setAverageStats2(avgStats2);

    renderChart(svgRef1, avgStats1, selectedType1);
    renderChart(svgRef2, avgStats2, selectedType2);
  }, [selectedType1, selectedType2, data]);

  return (
    <Box display="flex" justifyContent="space-around">
      <Box>
        <Typography variant="h4">Type 1 Stat Comparisons</Typography>
        <Select value={selectedType1} onChange={(e) => setSelectedType1(e.target.value)} style={{ width: "150px" }}>
          <MenuItem value="">Select Type</MenuItem>
          {Object.keys(typeColors).map((type) => (
            <MenuItem key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </MenuItem>
          ))}
        </Select>
        <svg ref={svgRef1}></svg>
      </Box>

      <Box>
        <Typography variant="h4">Type 2 Stat Comparisons</Typography>
        <Select value={selectedType2} onChange={(e) => setSelectedType2(e.target.value)} style={{ width: "150px" }}>
          <MenuItem value="">Select Type</MenuItem>
          {Object.keys(typeColors).map((type) => (
            <MenuItem key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </MenuItem>
          ))}
        </Select>
        <svg ref={svgRef2}></svg>
      </Box>
    </Box>
  );
}

export default TypeStatComparisons;
