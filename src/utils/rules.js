const THRESHOLD = 0.3;

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
  

