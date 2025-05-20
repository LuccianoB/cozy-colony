import { useState } from 'react';
import Color from 'color';
import { tiles as fixedTiles, tileMap } from '../../tests/testMaps/fixedRiverMap';
import { getHexPoints } from '../engine/hexUtils';
import { categorizeTerrain, TERRAIN_TYPES } from '../engine/terrain';
import { elevationToGrayscale } from '../utils/color';

const HEX_SIZE = 30;
const HEX_WIDTH = HEX_SIZE * Math.sqrt(3);
const HEX_HEIGHT = HEX_SIZE * 2;
const VIEWBOX_WIDTH = 800;
const VIEWBOX_HEIGHT = 600;

export default function FixedMapDebug() {
  const [useTerrainColor, setUseTerrainColor] = useState(false);

  // Compute pixel positions and centering offsets
  const pixelPositions = fixedTiles.map(tile => {
    const x = HEX_WIDTH * (tile.q + tile.r / 2);
    const y = HEX_HEIGHT * (tile.r * 0.75);
    return { ...tile, x, y };
  });

  const minX = Math.min(...pixelPositions.map(t => t.x));
  const maxX = Math.max(...pixelPositions.map(t => t.x));
  const minY = Math.min(...pixelPositions.map(t => t.y));
  const maxY = Math.max(...pixelPositions.map(t => t.y));

  const offsetX = (VIEWBOX_WIDTH - (maxX - minX)) / 2 - minX;
  const offsetY = (VIEWBOX_HEIGHT - (maxY - minY)) / 2 - minY;

  const getPixelPosition = (q, r) => {
    const x = HEX_WIDTH * (q + r / 2) + offsetX;
    const y = HEX_HEIGHT * (r * 0.75) + offsetY;
    return { x, y };
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Fixed Test Map Debug Viewer</h2>
      <label>
        <input
          type="checkbox"
          checked={useTerrainColor}
          onChange={() => setUseTerrainColor(prev => !prev)}
        />
        Use Terrain Color
      </label>

      <svg
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        width="100vw"
        height="calc(100vh - 80px)" 
        style={{ display: 'block' }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
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
        </defs>

        {/* Arrows for river flows */}
        {fixedTiles
          .filter(tile => tile.flowsTo?.length)
          .map(tile => {
            const { x: x1, y: y1 } = getPixelPosition(tile.q, tile.r);
            return tile.flowsTo.map(({ q, r }, i) => {
              const { x: x2, y: y2 } = getPixelPosition(q, r);
              return (
                <line
                  key={`${tile.id}-arrow-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  markerEnd="url(#arrow)"
                />
              );
            });
          })}

        {/* Hex tiles */}
        {pixelPositions.map(tile => {
          const { x, y } = getPixelPosition(tile.q, tile.r);
          const points = getHexPoints(x, y, HEX_SIZE);

          const type = categorizeTerrain(tile.elevation, tile.moisture, tile.tags);
          const baseColor = useTerrainColor
            ? Color(TERRAIN_TYPES[type]?.color || '#ccc')
            : Color(elevationToGrayscale(tile.elevation));

          const fill = tile.tags.includes('river_source')
            ? baseColor.darken(0.3).hex()
            : baseColor.hex();

          return (
            <polygon
              key={tile.id}
              points={points}
              fill={fill}
              stroke={tile.tags.includes('river') ? '#3b82f6' : '#444'}
              strokeWidth={tile.tags.includes('river') ? 1.5 : 0.5}
            >
              <title>
                ID: {tile.id}
                {'\n'}Type: {type}
                {'\n'}Elevation: {tile.elevation}
                {'\n'}Moisture: {tile.moisture}
                {'\n'}FlowRate: {tile.flowRate ?? 'N/A'}
                {'\n'}RiverPathId: {tile.riverPathId ?? 'N/A'}
              </title>
            </polygon>
          );
        })}
      </svg>
    </div>
  );
}
