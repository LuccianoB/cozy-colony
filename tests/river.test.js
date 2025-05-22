import { describe, expect, test, beforeEach } from 'vitest';
import { simulateRiverFlow } from '../src/engine/rules';
import { generateTestTiles } from './testMaps/fixedRiverMap';
import { getNeighbors } from '../src/engine/hexUtils';

console.log("Running river.test.js");

let tiles;
let tileMap;

beforeEach(() => {
  // Generate a fixed set of tiles for testing
  ({ tiles, tileMap } = generateTestTiles());

  // Reset all tile fields before each test
  for (const tile of tiles) {
    tile.flowsTo = [];
    tile.flowsFrom = [];
    tile.flowRate = 0;
    tile.riverPathId = null;
    tile.parentRiverId = null;
    tile.riverOrder = null;
    tile.mergeCount = 0;

    // Reset tags while preserving 'river_source'
    tile.tags = tile.tags.includes('river_source') ? ['river_source'] : [];

    simulateRiverFlow(tiles, tileMap);
  }
});

//** HELPER FUNCTIONS */

/**
 * Traces the river path from a given source tile.
 * @param {*} source - The source tile to start tracing from.
 * @param {*} tileMap - A map of tile IDs to tile objects.
 * @returns {Array} - Array of tiles in the river path.
 * @returns {Object} - The last tile in the path.
 */
function traceRiverPath(source, tileMap) {
  const path = [];
  let current = source;
  const seen = new Set();

  while (current && current.flowsTo.length > 0) {
    path.push(current);
    seen.add(current.id);

    const { q, r } = current.flowsTo[0];
    const next = tileMap.get(`${q}_${r}`);

    if (!next || seen.has(next.id)) break;
    current = next;
  }

  if (current && !seen.has(current.id)) {
    path.push(current);
  }

  return {
    path,
    endTile: current
  };
}


//** TESTS */
test('simulateRiverFlow is called and processes at least one river source', () => {
  simulateRiverFlow(tiles, tileMap);

  // There should be at least one river tile created from river_source
  const hasRiver = tiles.some(tile => tile.tags.includes('river'));
  expect(hasRiver).toBe(true); // FAILS if function does nothing
});

test('All river sources generate rivers that flow from the river source tile',()=>{

    const sources = tiles.filter(tile => tile.tags.includes('river_source'));

    for(const source of sources){
        expect(source.flowsTo.length).toBeGreaterThan(0);

        for(const {q,r} of source.flowsTo){
            const targetId = `${q}_${r}`;
            const targetTile = tileMap.get(targetId);

            expect (targetTile).toBeDefined();
            expect(targetTile.elevation).toBeLessThan(source.elevation);
        }
    }
});

test('Rivers flow is continous and downhill until valid end point', () => {
  const sources = tiles.filter(tile => tile.tags.includes('river_source'));

    for (const source of sources) {
      const { path, endTile } = traceRiverPath(source, tileMap);

      expect(path.length).toBeGreaterThan(1);

      for(let i = 0; i < path.length - 1; i++) {
        expect(path[i + 1].elevation).toBeLessThan(path[i].elevation);
      }

      const isOcean = endTile.elevation <= 0.1;
      const neighbors = getNeighbors(endTile, tileMap);
      const hasDownHill = neighbors.some(neighbor => neighbor.elevation < endTile.elevation);

      expect(isOcean || !hasDownHill).toBe(true);
    }
});
