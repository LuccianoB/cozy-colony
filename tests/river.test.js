import { describe, expect, test, beforeEach } from 'vitest';
import { simulateRiverFlow } from '../src/engine/rules';
import { generateTestTiles } from './testMaps/fixedRiverMap';

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
  }
});

test('simulateRiverFlow is called and processes at least one river source', () => {
  simulateRiverFlow(tiles, tileMap);

  // There should be at least one river tile created from river_source
  const hasRiver = tiles.some(tile => tile.tags.includes('river'));
  expect(hasRiver).toBe(true); // FAILS if function does nothing
});
