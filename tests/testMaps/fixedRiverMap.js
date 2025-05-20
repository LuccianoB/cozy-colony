// /tests/testMaps/fixedRiverMap.js

const makeTile = ({
  q, r, elevation, moisture, tags = []
}) => ({
  id: `${q}_${r}`, q, r,
  elevation,
  moisture,
  tags,
  flowsTo: [],
  flowsFrom: [],
  flowRate: 0,
  riverPathId: null,
  parentRiverId: null,
  riverOrder: null,
  mergeCount: 0
});

// Ocean elevation
const oceanElevation = 0.1;

// 5x5 Grid
export function generateTestTiles() {
  const tiles = [
  // Row -2
  makeTile({ q: -2, r: -2, elevation: oceanElevation, moisture: 0.5 }),
  makeTile({ q: -1, r: -2, elevation: oceanElevation, moisture: 0.5 }),
  makeTile({ q:  0, r: -2, elevation: oceanElevation, moisture: 0.5 }),
  makeTile({ q:  1, r: -2, elevation: oceanElevation, moisture: 0.5 }),
  makeTile({ q:  2, r: -2, elevation: oceanElevation, moisture: 0.5 }),

  // Row -1
  makeTile({ q: -2, r: -1, elevation: oceanElevation, moisture: 0.5 }),
  makeTile({ q: -1, r: -1, elevation: 0.3, moisture: 0.2 }), // A
  makeTile({ q:  0, r: -1, elevation: 0.9, moisture: 0.9, tags: ['river_source'] }), // B
  makeTile({ q:  1, r: -1, elevation: 0.3, moisture: 0.2 }), // C
  makeTile({ q:  2, r: -1, elevation: oceanElevation, moisture: 0.5 }),

  // Row 0
  makeTile({ q: -2, r: 0, elevation: oceanElevation, moisture: 0.5 }),
  makeTile({ q: -1, r: 0, elevation: 0.4, moisture: 0.3 }), // D
  makeTile({ q:  0, r: 0, elevation: 0.8, moisture: 0.5 }), // E
  makeTile({ q:  1, r: 0, elevation: 0.7, moisture: 0.4 }), // F
  makeTile({ q:  2, r: 0, elevation: oceanElevation, moisture: 0.5 }),

  // Row 1
  makeTile({ q: -2, r: 1, elevation: oceanElevation, moisture: 0.5 }),
  makeTile({ q: -1, r: 1, elevation: 0.4, moisture: 0.3 }), // G
  makeTile({ q:  0, r: 1, elevation: 0.7, moisture: 0.6 }), // H
  makeTile({ q:  1, r: 1, elevation: 0.6, moisture: 0.4 }), // I
  makeTile({ q:  2, r: 1, elevation: oceanElevation, moisture: 0.5 }),

  // Row 2
  makeTile({ q: -2, r: 2, elevation: oceanElevation, moisture: 0.5 }),
  makeTile({ q: -1, r: 2, elevation: oceanElevation, moisture: 0.5 }),
  makeTile({ q:  0, r: 2, elevation: oceanElevation, moisture: 0.5 }),
  makeTile({ q:  1, r: 2, elevation: oceanElevation, moisture: 0.5 }),
  makeTile({ q:  2, r: 2, elevation: oceanElevation, moisture: 0.5 }),
];
  const tileMap = new Map(tiles.map(tile => [tile.id, tile]));
  return { tiles, tileMap };
}

