const THRESHOLD = 0.2;

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
    const MOISTURE_SOURCE_THRESHOLD = 0.6;
    const RIVER_SOURCE_PROBABILITY = 0.7;
  
    for (const tile of tiles) {
      if (
        tile.elevation >= ELEVATION_SOURCE_THRESHOLD &&
        tile.moisture >= MOISTURE_SOURCE_THRESHOLD &&
        Math.random() < RIVER_SOURCE_PROBABILITY
      ) {
        tile.tags.push('river_source');
      }
    }
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
  
      // Orographic adjustment logic
      if (elevationDiff > 0.02) {
        tile.moisture = Math.min(1, tile.moisture + 0.1);
      } else if (elevationDiff < -0.02) {
        tile.moisture = Math.max(0, tile.moisture - 0.1);
      }
    }
  }
  
