const THRESHOLD = 0.2;
import { getNeighbors } from './hexUtils';

// Directions for axial hex neighbors (pointy-topped)
const directions = [
    [+1, 0], [0, +1], [-1, +1],
    [-1, 0], [0, -1], [+1, -1]
];

// Check if a tile is coastal: any adjacent tile is missing or has no type
export function applyCoastTag(tiles) {
    const tileMap = {};
    tiles.forEach(tile => {
      tileMap[`${tile.q}_${tile.r}`] = tile;
    });
  
    tiles.forEach(tile => {
      const isCoast = directions.some(([dq, dr]) => {
        const neighbor = tileMap[`${tile.q + dq}_${tile.r + dr}`];
        return !neighbor || neighbor.elevation < THRESHOLD;
      });
  
      if (isCoast) {
        tile.tags.push('coast');
      }
    });
}

/**
 * Tags tiles as river sources based on elevation and moisture.
 * A river source is a high elevation, high moisture tile that may initiate flow.
 *
 * @param {Array} tiles - Array of tile objects.
 */
export function applyRiverSourceTags(tiles) {
    const ELEVATION_SOURCE_THRESHOLD = 0.7;
    const MOISTURE_SOURCE_THRESHOLD = 0.8;
  
    for (const tile of tiles) {
      if (
        (tile.elevation >= ELEVATION_SOURCE_THRESHOLD &&
        tile.moisture >= MOISTURE_SOURCE_THRESHOLD)||
        tile.elevation >=0.9 &&
        !['ocean', 'deep_ocean'].includes(tile.type) && // Exclude ocean tiles
        !tile.tags.includes('coast') // Exclude coastal tiles
      ){
        tile.tags.push('river_source');
      }
    }
  }

/**
 * Simulates downhill river flow from each river source.
 * Adds `river` tag and sets `flowsTo` for each tile in the flow path.
 * 
 * @param {Array} tiles - Array of tile objects.
 * @param {Map} tileMap - Map of tile.id => tile.
 */
export function simulateRiverFlow(tiles, tileMap) {
  
  }
  
  

// Remove mountains/peaks from coastal tiles
export function enforceCoastalElevationRule(tiles) {
    tiles.forEach(tile => {
      if (tile.tags.includes('coast') && (tile.type === 'mountain' || tile.type === 'peak')) {
        tile.type = 'forest'; // or grassland, depending on your world balance
      }
    });
}
  
/**
 * Adjusts tile moisture using a directional wind-based orographic simulation.
 * Moisture increases when elevation rises in windward direction and decreases on leeward sides.
 * 
 * @param {Array} tiles - Array of tile objects.
 * @param {[number, number]} windDir - Direction the wind is blowing (e.g., [-1, 0] = west → east).
 */
export function applyOrographicRainfall(tiles, windDir = [-1, 0]) {
    const tileMap = new Map(tiles.map(t => [t.id, t]));
  
    for (const tile of tiles) {
        const neighborQ = tile.q + windDir[0];
        const neighborR = tile.r + windDir[1];
        const neighbor = tileMap.get(`${neighborQ}_${neighborR}`);
  
        if (!neighbor) continue;
  
        const elevationDiff = tile.elevation - neighbor.elevation;
  
        // === PARAM 2: Elevation sensitivity threshold ===
        // Controls how subtle terrain needs to be to count as a slope
        // If the difference is too small, skip the tile.
        if (Math.abs(elevationDiff) < 0.02) continue;

        // === PARAM 3 + 4: Moisture adjustment (proportional to elevation difference) ===
        // Greater elevation change = more intense rain shadow or orographic rainfall.
        // Max impact is clamped for realism.
        // Adjust the maxDelta value to control the strength of the rainfall effect.
        // lower values = more moisture, higher values = less moisture
        const maxDelta = 0.5; 
        const delta = Math.min(maxDelta, Math.abs(elevationDiff) * 1.5);

        if (elevationDiff > 0) {
            // Wind hits slope → air rises → rain increases
            tile.moisture = Math.min(1, tile.moisture + delta);
        } else {
            // Wind goes downhill → dry descending air
            tile.moisture = Math.max(0, tile.moisture - delta);
        }
    }
  }
  
