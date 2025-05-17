/*
* Hexagonal grid generation and manipulation functions.
* This module provides functions to generate a hexagonal grid and manipulate hex tiles.
*/
import { categorizeTerrain } from "./terrain";
import { createNoise2D } from 'simplex-noise';
import seedrandom from "seedrandom";
import { applyCoastTag, applyRiverSourceTags } from "./rules";


export const generateHexGrid = generateHexGridRadius

function rotateCoordinates(q, r, angleDegrees) {
  const angle = (Math.PI / 180) * angleDegrees;
  const x = q * Math.cos(angle) - r * Math.sin(angle);
  const y = q * Math.sin(angle) + r * Math.cos(angle);
  return [x, y];
}

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
  const rotationAngle = Math.random() * 360;
  const rng = seedrandom(String(Date.now()));
  const noise2D = createNoise2D(rng);
  const moistureNoise2D = createNoise2D(rng);
  const moistureNoiseScale = 0.1; // Adjust this value to change the moisture noise scale
  
  // 1: Generate tiles in a hexagonal grid of given radius
  const coords = [];
  for(let q = -radius; q <= radius; q++) {
    for (let r = -radius; r <= radius; r++) {
      const s = -q - r;
      if (Math.abs(s) <= radius) {
        coords.push({ q, r});
      }
    }
  }

  // 2: compute centroid of the hexagon
  const avgQ = coords.reduce((sum, t) => sum + t.q, 0) / coords.length;
  const avgR = coords.reduce((sum, t) => sum + t.r, 0) / coords.length;

  // 3: Determine max distance from centroid to normalize falloff
  for(const tile of coords) {
    const dq = tile.q - avgQ;
    const dr = tile.r - avgR;
    tile.distanceFromCenter = Math.sqrt(dq * dq + dr * dr);
  }

  const maxDistance = Math.max(...coords.map(tile => tile.distanceFromCenter));

  // 4: Generate each tiles noise value and apply radial falloff
  for(const { q, r, distanceFromCenter } of coords) {
    // Get normalized simplex noise value [-1, 1] -> [0, 1]
    const [rq, rr] = rotateCoordinates(q, r, rotationAngle);
    const baseNoiseValue = (noise2D(rq * noiseScale, rr * noiseScale) + 1) / 2;
    const moistureNoiseValue = (moistureNoise2D(q * moistureNoiseScale, r * moistureNoiseScale) + 1) / 2;

    //Cosine falloff based on distance from centroid
    const normalizedDist = distanceFromCenter / maxDistance;
    const fallOff = Math.pow((1 + Math.cos(Math.PI * normalizedDist)) / 2,1.5);

    //final elevation value
    const boost = 1 - normalizedDist;
    const elevation = baseNoiseValue * fallOff + 0.1 * boost;

    //Skip tiles below the elevation threshold
    if (elevation < elevationThreshold) {
      continue;
    }
    
    //push usable tile
    tiles.push({
      id: `${q}_${r}`,
      q,
      r,
      elevation,
      moisture: moistureNoiseValue,
      selected: false,
      type: null,
      tags: []
    });
  }

  // 5: Apply tags
  applyCoastTag(tiles);
  applyRiverSourceTags(tiles);
  
  for (const tile of tiles) {
    tile.type = categorizeTerrain(tile.elevation, tile.moisture, tile.tags);
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
  
  