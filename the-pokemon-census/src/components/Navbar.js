import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#121212', color: '#fff' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          The Pokémon Census
        </Typography>
        <Button sx={{ color: '#fff' }} component={Link} to="/">
          Generational Pokémon Counts
        </Button>
        <Button sx={{ color: '#fff' }} component={Link} to="/type-stat-comparisons">
          Type Stat Comparisons
        </Button>
        <Button sx={{ color: '#fff' }} component={Link} to="/move-popularity-by-type">
          Move Popularity by Type
        </Button>
        <Button sx={{ color: '#fff' }} component={Link} to="/legendary-vs-normal-distribution">
          Legendary vs Normal Distribution
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
