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
        return !neighbor || neighbor.type === null;
      });
  
      if (isCoast) {
        tile.tags.push('coast');
      }
    });
}

// Remove mountains/peaks from coastal tiles
export function enforceCoastalElevationRule(tiles) {
    tiles.forEach(tile => {
      if (tile.tags.includes('coast') && (tile.type === 'mountain' || tile.type === 'peak')) {
        tile.type = 'forest'; // or grassland, depending on your world balance
      }
    });
}
  

