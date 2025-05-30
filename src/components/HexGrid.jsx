import { useState, useMemo } from 'react';
import Color from 'color';
import { getHexPoints, generateNoisyIslandGrid } from '../engine/hexUtils';
import { TERRAIN_TYPES } from '../engine/terrain';
import { elevationToGrayscale } from '../utils/color';

const HEX_SIZE = 10;
const HEX_WIDTH = HEX_SIZE * Math.sqrt(3);
const HEX_HEIGHT = HEX_SIZE * 2;
const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 1000;
const HEX_RADIUS = 40;

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
  

  const {
    pixelPositions,
    offsetX,
    offsetY,
  } = useMemo(() => {
    const pixelPositions = tiles.map(tile => {
      const x = HEX_WIDTH * (tile.q + tile.r / 2);
      const y = HEX_HEIGHT * (tile.r * 0.75);
      return { x, y };
    });

    const minX = Math.min(...pixelPositions.map(p => p.x));
    const minY = Math.min(...pixelPositions.map(p => p.y));
    const maxX = Math.max(...pixelPositions.map(p => p.x));
    const maxY = Math.max(...pixelPositions.map(p => p.y));

    const gridPixelWidth = maxX - minX;
    const gridPixelHeight = maxY - minY;

    const offsetX = (VIEWBOX_WIDTH - gridPixelWidth) / 2 - minX;
    const offsetY = (VIEWBOX_HEIGHT - gridPixelHeight) / 2 - minY;

    return {
      pixelPositions,
      offsetX,
      offsetY,
    };
  }, [tiles]);

  const getPixelPosition = (q, r) => {
    const x = HEX_WIDTH * (q + r / 2);
    const y = HEX_HEIGHT * (r * 0.75);
    return { x: x + offsetX, y: y + offsetY };
  };

  const riverPaths = [];
  const seen = new Set();

  for (const tile of tiles) {
    if (tile.tags.includes('river_source') && !seen.has(tile.id)) {
      let path = [];
      let current = tile;

      while (current && current.flowsTo) {
        const { x, y } = getPixelPosition(current.q, current.r);
        path.push([x, y]);
        seen.add(current.id);

        const next = tiles.find(t => t.q === current.flowsTo.q && t.r === current.flowsTo.r);
        current = next;
      }

      // Include final tile if it exists
      if (current) {
        const { x, y } = getPixelPosition(current.q, current.r);
        path.push([x, y]);
      }

      if (path.length >= 2) {
        riverPaths.push(path);
      }
    }
    console.log("Number of river paths:", riverPaths.length);
  }

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      width="100vw"
      height="calc(100vh - 80px)"
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
        <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="10"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>

          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#4ade80" />
        </filter>
      </defs>

      <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
      {riverPaths.map((path, idx) => (
          <polyline
            key={`river-${idx}`}
            points={path.map(([x, y]) => `${x},${y}`).join(' ')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={2}
            markerEnd="url(#arrow)"
          />
        ))}
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
          let stroke =  '#888';
          let strokeWidth = 0.5;
          if (tile.tags.includes('river_source')) {
            stroke = '#00f';
            strokeWidth = 1.5;
          }

          return (
            <polygon
              key={tile.id}
              points={points}
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
              filter={tile.id === selectedTileId ? 'url(#glow)' : 'none'}
              onMouseEnter={() => setHoveredTileID(tile.id)}
              onMouseLeave={() => setHoveredTileID(null)}
              onClick={() =>
                setSelectedTileId(prev => (prev === tile.id ? null : tile.id))
              }
            >
              <title>{typeData.name}
                - Key: {tile.id}
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
