/*
* Hexagonal grid generation and manipulation functions.
* This module provides functions to generate a hexagonal grid and manipulate hex tiles.
*/
import { TERRAIN_TYPES } from "./terrain";
import { createNoise2D } from 'simplex-noise';


export const generateHexGrid = generateHexGridRadius

// Function to generate a random color from a predefined palette
function getRandomColor() {
  const palette = ['#a7f3d0', '#fde68a', '#bfdbfe', '#fcd34d', '#fca5a5'];
  return palette[Math.floor(Math.random() * palette.length)];
}

// Function to generate a hexagonal grid
export function generateRectangularHexGrid(width, height) {
    const tiles = [];
  
    for (let q = 0; q < width; q++) {
      const qOffset = Math.floor(q / 2); // offset every other column (pointy-top layout)
      for (let r = -qOffset; r < height - qOffset; r++) {
        tiles.push({
          id: `${q}_${r}`,
          q,
          r,
          selected: false,
          type: null, // for future terrain use
        });
      }
    }
  
    return tiles;
}

// Function to generate a hexagonal grid with a specified radius
export function generateHexGridRadius(radius) {
    const tiles = [];
    const terrainKeys = Object.keys(TERRAIN_TYPES);
    const noise2D = createNoise2D();
    const noiseScale = 0.15; // Adjust this value to change the noise scale

    for (let q = -radius; q <= radius; q++) {
      for (let r = -radius; r <= radius; r++) {
        const s = -q - r;
        if (Math.abs(s) <= radius) {
          const noiseValue = noise2D(q * noiseScale, r * noiseScale); //-1 to 1
          const elevation = (noiseValue + 1) / 2; // Normalize to 0 to 1

          let type;
          if (elevation < 0.2) {
            type = 'desert';
          } else if (elevation < 0.4) {
            type = 'grassland';
          } else if (elevation < 0.6) {
            type = 'forest';
          } else if (elevation < 0.8) {
            type = 'mountain';
          } else {
            type = 'peak';
          }

          tiles.push({            
            id: `${q}_${r}`,
            q,
            r,
            type,
            elevation,
            selected: false
          });
        }
      }
    }
    return tiles;
}
  
// Function to get the coordinates of a hexagon's vertices
  export function getHexPoints(cx, cy, size) {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 180) * (60 * i - 30); // pointy-top hex
      const x = cx + size * Math.cos(angle);
      const y = cy + size * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return points.join(" ");
}
  
  