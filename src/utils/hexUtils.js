/*
* Hexagonal grid generation and manipulation functions.
* This module provides functions to generate a hexagonal grid and manipulate hex tiles.
*/
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
    for (let q = -radius; q <= radius; q++) {
      for (let r = -radius; r <= radius; r++) {
        const s = -q - r;
        if (Math.abs(s) <= radius) {
          tiles.push({
            id: `${q}_${r}`,
            q,
            r,
            selected: false,
            type: null,
            color: getRandomColor(), // Assign a random color to each tile
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
  
  