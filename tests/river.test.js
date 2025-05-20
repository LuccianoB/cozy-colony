import { simulateRiverFlow } from '../src/engine/rules';
import { tiles, tileMap } from './testMaps/fixedRiverMap';

beforeEach(() => {
  // Reset all tile fields before each test
  for (const tile of tiles) {
    tile.flowsTo = [];
    tile.flowsFrom = [];
    tile.flowRate = 0;
    tile.riverPathId = null;
    tile.parentRiverId = null;
    tile.riverOrder = null;
    tile.mergeCount = 0;
  }
});

test('all river tiles trace back to a river_source', () => {
  simulateRiverFlow(tiles, tileMap);

  const visited = new Set();

  function traceBackToSource(tile) {
    let current = tile;
    const seen = new Set();

    while (current) {
      if (seen.has(current.id)) return false; // loop detected
      seen.add(current.id);

      if (current.tags.includes('river_source')) return true;

      if (!current.flowsFrom || current.flowsFrom.length === 0) return false;

      // For this test, we’ll only follow the first flowFrom path
      const { q, r } = current.flowsFrom[0];
      current = tileMap.get(`${q}_${r}`);
    }

    return false;
  }

  for (const tile of tiles) {
    if (tile.flowsFrom && tile.flowsFrom.length > 0) {
      const isValid = traceBackToSource(tile);
      expect(isValid).toBe(true);
    }
  }
});

test('rivers only flow downhill', () => {
  simulateRiverFlow(tiles, tileMap);

  for (const tile of tiles) {
    if (!tile.flowsTo) continue;

    for (const { q, r } of tile.flowsTo) {
      const targetId = `${q}_${r}`;
      const targetTile = tileMap.get(targetId);

      expect(targetTile).toBeDefined();
      expect(targetTile.elevation).toBeLessThan(tile.elevation);
    }
  }
});

test('all flowsTo targets exist in tileMap', () => {
  simulateRiverFlow(tiles, tileMap);

  for (const tile of tiles) {
    if (!tile.flowsTo) continue;

    for (const { q, r } of tile.flowsTo) {
      const targetId = `${q}_${r}`;
      const exists = tileMap.has(targetId);

      expect(exists).toBe(true);
    }
  }
});
