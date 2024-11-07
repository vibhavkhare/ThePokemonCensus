import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './theme';
import Navbar from './components/Navbar';
import GenerationalPokemonCounts from './pages/Generational-Pokemon-Counts';
import TypeStatComparisons from './pages/Type-Stat-Comparisons';
import MovePopularityByType from './pages/Move-Popularity-by-Type';
import LegendaryVsNormalDistribution from './pages/Legendary-vs-Normal-Distribution';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<GenerationalPokemonCounts />} />
          <Route path="/type-stat-comparisons" element={<TypeStatComparisons />} />
          <Route path="/move-popularity-by-type" element={<MovePopularityByType />} />
          <Route path="/legendary-vs-normal-distribution" element={<LegendaryVsNormalDistribution />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;