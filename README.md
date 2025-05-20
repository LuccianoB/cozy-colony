# HexWorldGen

**HexWorldGen** is a modular, procedurally generated hex-based world system built with React. It generates realistic terrain features using noise functions and directional simulation logic. This project is designed as the foundation for a future simulation or strategy system — such as political simulations, ecological models, or resource-based games.

## Features

- **Hexagonal Tile Grid**  
  Creates a pointy-topped hex map with configurable radius and scale.

- **Elevation & Moisture Generation**  
  Uses seeded Simplex Noise for elevation and moisture layers, with radial island-style falloff.

- **Biome Classification**  
  Tiles are categorized into realistic terrain types (e.g., desert, forest, mountain, glacier) using configurable elevation and moisture thresholds.

- **Tagging System**  
  Each tile supports metadata tags such as:
  - `coast`
  - `river_source`
  - `river`
  - (More planned for expansion, e.g., `urban`, `industrial`)

- **Directional Systems**  
  - Orographic rainfall based on wind direction  
  - River flow simulates downhill paths from high elevation sources  
  - Flow paths use steepest-descent logic with loop safeguards

- **Interactive Visualization**  
  - Hover and select hexes to inspect data  
  - Highlight river sources  
  - Draw rivers with directional arrows between tiles

## Tech Stack

- React (w/ hooks & SVG)
- Simplex Noise via `simplex-noise`
- Seeded randomness via `seedrandom`
- Color handling via `color` package

