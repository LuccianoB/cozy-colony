import { useState, useMemo } from 'react';
import Color from 'color';
import { getHexPoints, generateNoisyIslandGrid } from '../utils/hexUtils';
import { TERRAIN_TYPES } from '../utils/terrain';
import { elevationToGrayscale } from '../utils/color';

const HEX_SIZE = 10;
const HEX_WIDTH = HEX_SIZE * Math.sqrt(3);
const HEX_HEIGHT = HEX_SIZE * 2;
const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 1000;
const HEX_RADIUS = 30;

export default function HexGrid() {
  const [hoveredTileID, setHoveredTileID] = useState(null);
  const [selectedTileId, setSelectedTileId] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState(null);

  const tiles = useMemo(() => {
    return generateNoisyIslandGrid({
        radius: HEX_RADIUS,
        noiseScale: 0.07,
        elevationThreshold: 0.2
    });
  }, [HEX_RADIUS]);

  const pixelPositions = tiles.map(tile => {
    const x = HEX_WIDTH * (tile.q + tile.r / 2);
    const y = HEX_HEIGHT * (tile.r * 0.75);
    return { x, y };
  });

  // Calculate the bounding box of all pixel positions
  const minX = Math.min(...pixelPositions.map(p => p.x));
  const maxX = Math.max(...pixelPositions.map(p => p.x));
  const minY = Math.min(...pixelPositions.map(p => p.y));
  const maxY = Math.max(...pixelPositions.map(p => p.y));

// Calculate the width and height of the grid
  const gridPixelWidth = maxX - minX;
  const gridPixelHeight = maxY - minY;

  // Calculate the offset to center the grid in the SVG 
  const offsetX = (VIEWBOX_WIDTH - gridPixelWidth) / 2 - minX;
  const offsetY = (VIEWBOX_HEIGHT - gridPixelHeight) / 2 - minY;

  const getPixelPosition = (q, r) => {
    const x = HEX_WIDTH * (q + r / 2);
    const y = HEX_HEIGHT * (r * 0.75);
    return { x: x + offsetX, y: y + offsetY };
  };

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      width="100%"
      height="800"
      style={{ display: 'block', cursor: isDragging ? 'grabbing' : 'grab' }}
      preserveAspectRatio="xMidYMid meet"

      // Enable zooming and panning
      onWheel={e => {
        e.preventDefault();
        const zoomFactor = 0.1;
        const newZoom = Math.min(4, Math.max(0.5, zoom - e.deltaY * zoomFactor * 0.01));
        setZoom(newZoom);
      }}
      onMouseDown={e => {
        setIsDragging(true);
        setLastMouse({ x: e.clientX, y: e.clientY });
      }}
      onMouseUp={() => setIsDragging(false)}
      onMouseMove={e => {
        if (!isDragging || !lastMouse) return;
        const dx = e.clientX - lastMouse.x;
        const dy = e.clientY - lastMouse.y;
        setPan(p => ({ x: p.x + dx / zoom, y: p.y + dy / zoom }));
        setLastMouse({ x: e.clientX, y: e.clientY });
      }}
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#4ade80" />
        </filter>
      </defs>

      <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
        {tiles.map(tile => {
          const { x, y } = getPixelPosition(tile.q, tile.r);
          const points = getHexPoints(x, y, HEX_SIZE);
          const typeData = TERRAIN_TYPES[tile.type] || {color: '#ccc', name: 'Unknown'};
          const baseColor = Color(typeData.color);
          const fill = tile.id === selectedTileId
            ? baseColor.darken(0.3).hex()
            : tile.id === hoveredTileID
            ? baseColor.lighten(0.3).hex()
            : baseColor.hex();

          return (
            <polygon
              key={tile.id}
              points={points}
              fill={fill}
              stroke="#888"
              strokeWidth={0.5}
              filter={tile.id === selectedTileId ? 'url(#glow)' : 'none'}
              onMouseEnter={() => setHoveredTileID(tile.id)}
              onMouseLeave={() => setHoveredTileID(null)}
              onClick={() =>
                setSelectedTileId(prev => (prev === tile.id ? null : tile.id))
              }
            >
              <title>{typeData.name} 
                - Elevation: {tile.elevation.toFixed(2)} 
                - Moisture: {tile.moisture.toFixed(2)}
              </title>
            </polygon>
          );
        })}
      </g>
    </svg>
  );
}
