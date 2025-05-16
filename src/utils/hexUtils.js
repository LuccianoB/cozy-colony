/*
* Hexagonal grid generation and manipulation functions.
* This module provides functions to generate a hexagonal grid and manipulate hex tiles.
*/
import { TERRAIN_TYPES } from "./terrain";
import { createNoise2D } from 'simplex-noise';
import { applyCoastTag, enforceCoastalElevationRule } from "./rules";


export const generateHexGrid = generateHexGridRadius

/**
 * Generates a hex grid shaped like a noisy island.
 * 
 * @param {Object} options - Configuration options.
 * @param {number} options.radius - Base radius of the island.
 * @param {number} options.noiseScale - Scale of the simplex noise.
 * @param {number} options.elevationThreshold - Minimum elevation to include a tile (simulates coasts).
 * @returns {Array} Array of hex tiles.
 */
export function generateNoisyIslandGrid({
  radius = 10,
  noiseScale = 0.1,
  elevationThreshold = 0.3
} = {}) {
  const tiles = [];
  const noise2D = createNoise2D();
  
  for (let q = -radius; q <= radius; q++) {
    for (let r = -radius; r <= radius; r++) {
      const s = -q - r;
      if (Math.abs(s) > radius) continue;

      // 1. Normalize position to a unit distance from center (0,0)
      const distance = Math.sqrt(q * q + r * r + s * s) / radius;

      // 2. Base noise (controls landforms)
      const noiseValue = noise2D(q * noiseScale, r * noiseScale);
      const normalizedNoise = (noiseValue + 1) / 2;

      // 3. Apply falloff near edges (distance 1 → strong dampening)
      const falloff = Math.pow(1 - distance, 2);  // Square falloff
      const elevation = normalizedNoise * falloff;

      // 4. Skip low-elevation tiles (simulate ocean)
      if (elevation < elevationThreshold) continue;

      tiles.push({
        id: `${q}_${r}`,
        q,
        r,
        elevation,
        selected: false,
        tags: [],
        type: null, // terrain type will be applied later
      });
    }
  }

  return tiles;
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

          const distanceFromCenter = Math.sqrt(q * q + r * r);
          const maxDistance = radius;

          const fallOff = 1 - (distanceFromCenter / maxDistance);
          const smoothFalloff = Math.pow(fallOff, 2); // Smooth falloff

          const finalElevation = elevation * smoothFalloff;

          // Determine the terrain type based on elevation
          let type;
          if (finalElevation < 0.2) {
            type = 'desert';
          } else if (finalElevation < 0.4) {
            type = 'grassland';
          } else if (finalElevation < 0.6) {
            type = 'forest';
          }
          else if (finalElevation < 0.8) {
            type = 'hills';
          } else if (finalElevation < 0.9) {
            type = 'mountain';
          } else {
            type = 'peak';
          }

          tiles.push({            
            id: `${q}_${r}`,
            q,
            r,
            type,
            elevation: finalElevation,
            selected: false,
            tags: []
          });
        }
      }
    }
    applyCoastTag(tiles);
    enforceCoastalElevationRule(tiles);
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
  
  