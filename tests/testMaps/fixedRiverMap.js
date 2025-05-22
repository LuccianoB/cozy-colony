export function generateTestTiles() {
  const makeTile = ({ q, r, elevation, moisture, tags = [] }) => ({
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

  const ocean = 0.1;
  const peak = 0.9;
  const high = 0.7;
  const mid = 0.6;
  const low = 0.5;
  const lower = 0.4;
  const lowest = 0.3;

  const tiles = [
    // Row -2
    makeTile({ q: -2, r: -2, elevation: high, moisture: 0.3 }),
    makeTile({ q: -1, r: -2, elevation: high, moisture: 0.3 }),
    makeTile({ q:  0, r: -2, elevation: high, moisture: 0.5 }),
    makeTile({ q:  1, r: -2, elevation: peak, moisture: 0.3, tags: ['river_source'] }), // Source A
    makeTile({ q:  2, r: -2, elevation: high, moisture: 0.3 }),

    // Row -1
    makeTile({ q: -2, r: -1, elevation: high, moisture: 0.3 }),
    makeTile({ q: -1, r: -1, elevation: peak, moisture: 0.9, tags: ['river_source'] }), // Source B
    makeTile({ q:  0, r: -1, elevation: high, moisture: 0.6 }),
    makeTile({ q:  1, r: -1, elevation: mid, moisture: 0.9 }),
    makeTile({ q:  2, r: -1, elevation: mid, moisture: 0.3 }),

    // Row 0
    makeTile({ q: -2, r: 0, elevation: low, moisture: 0.3 }),
    makeTile({ q: -1, r: 0, elevation: lower, moisture: 0.5 }),
    makeTile({ q:  0, r: 0, elevation: lower, moisture: 0.5 }), // merge point
    makeTile({ q:  1, r: 0, elevation: low, moisture: 0.5 }),
    makeTile({ q:  2, r: 0, elevation: mid, moisture: 0.3 }),

    // Row 1
    makeTile({ q: -2, r: 1, elevation: mid, moisture: 0.3 }),
    makeTile({ q: -1, r: 1, elevation: lowest, moisture: 0.5 }),
    makeTile({ q:  0, r: 1, elevation: lower, moisture: 0.5 }),
    makeTile({ q:  1, r: 1, elevation: high, moisture: 0.5 }),
    makeTile({ q:  2, r: 1, elevation: lowest, moisture: 0.3 }),

    // Row 2
    makeTile({ q: -2, r: 2, elevation: ocean, moisture: 0.5 }),
    makeTile({ q: -1, r: 2, elevation: ocean, moisture: 0.5 }),
    makeTile({ q:  0, r: 2, elevation: ocean, moisture: 0.5 }),
    makeTile({ q:  1, r: 2, elevation: ocean, moisture: 0.5 }),
    makeTile({ q:  2, r: 2, elevation: ocean, moisture: 0.5 }),
  ];

  const tileMap = new Map(tiles.map(tile => [tile.id, tile]));
  return { tiles, tileMap };
}
