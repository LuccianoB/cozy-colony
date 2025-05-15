import { generateHexGrid, getHexPoints } from './utils/hexUtils';
import { useState, useMemo } from 'react';
import Color from 'color';

const HEX_SIZE = 30; // radius of hex
const HEX_WIDTH = HEX_SIZE * Math.sqrt(3); // width of a hex
const HEX_HEIGHT = HEX_SIZE * 2; // height of a hex

const VIEWBOXWIDTH = 1000; // width of the SVG viewbox
const VIEWBOXHEIGHT = 1000; // height of the SVG viewbox
const HEX_RADIUS = 3; // radius of the hexagon

function App() {
  const [hoveredTileID, setHoveredTileID] = useState(null);
  const [selectedTileId, setSelectedTileId] = useState(null);

  const tiles = useMemo(() => generateHexGrid(HEX_RADIUS), []); 

  //get bounding box of all pixel positions
  const pixelPositions = tiles.map(tile => {
    const x = HEX_WIDTH * (tile.q + tile.r / 2);
    const y = HEX_HEIGHT * (tile.r * 0.75);
    return { x, y };
  });

  // offset to center the hexagons in the SVG
  const minX = Math.min(...pixelPositions.map(p => p.x));
  const maxX = Math.max(...pixelPositions.map(p => p.x));
  const minY = Math.min(...pixelPositions.map(p => p.y));
  const maxY = Math.max(...pixelPositions.map(p => p.y));

  const gridPixelWidth = maxX - minX;
  const gridPixelHeight = maxY - minY;

  const offsetX = (VIEWBOXWIDTH - gridPixelWidth) / 2 - minX;
  const offsetY = (VIEWBOXHEIGHT - gridPixelHeight) / 2 - minY;

  const getPixelPosition = (q, r) => {
    const x = HEX_WIDTH * (q + r / 2);
    const y = HEX_HEIGHT * (r * 0.75);
    return {
      x: x + offsetX,
      y: y + offsetY,
    };
  };

  console.log('TILES', tiles);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#6faaed'
    }}>
      <svg 
        viewBox={`0 0 ${VIEWBOXWIDTH} ${VIEWBOXHEIGHT}`}
        className="block w-full h-full max-w-[90vw] max-h-[90vh]"
        preserveAspectRatio="xMidYMid meet"
      >
        <circle cx="500" cy="500" r="100" fill="red" />
        {tiles.map(tile => {
          // get the pixel position of the tile
          const { x, y } = getPixelPosition(tile.q, tile.r);
          const points = getHexPoints(x, y, HEX_SIZE);

          //get color of the tile
          const baseColor = Color(tile.color);
          const fill = tile.id === selectedTileId
            ? baseColor.darken(0.2).hex() // darken the color when selected
            : hoveredTileID && tile.id === hoveredTileID
            ? baseColor.lighten(0.1).hex() // lighten the color when hovered
            : baseColor.hex();

          return (
            <polygon
              key={tile.id}
              points={points}
              fill={fill}
              stroke="#888"
              strokeWidth={1}
              onMouseEnter={() => setHoveredTileID(tile.id)}
              onMouseLeave={() => setHoveredTileID(null)}
              onClick={() =>
                setSelectedTileId(prev => (prev === tile.id ? null : tile.id))
              }
            />
          );
        })}
      </svg>
    </div>
  );
}

export default App;


