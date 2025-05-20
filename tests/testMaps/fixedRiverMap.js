export const tiles = [
    // Row -1
    {
      id: '-1_-1', q: -1, r: -1,
      elevation: 0.3, moisture: 0.2,
      tags: [], flowsTo: [], flowsFrom: [],
      flowRate: 0, riverPathId: null, parentRiverId: null,
      riverOrder: null, mergeCount: 0
    },
    {
      id: '0_-1', q: 0, r: -1,
      elevation: 0.9, moisture: 0.9,
      tags: ['river_source'], flowsTo: [], flowsFrom: [],
      flowRate: 0, riverPathId: null, parentRiverId: null,
      riverOrder: null, mergeCount: 0
    },
    {
      id: '1_-1', q: 1, r: -1,
      elevation: 0.3, moisture: 0.2,
      tags: [], flowsTo: [], flowsFrom: [],
      flowRate: 0, riverPathId: null, parentRiverId: null,
      riverOrder: null, mergeCount: 0
    },
  
    // Row 0
    {
      id: '-1_0', q: -1, r: 0,
      elevation: 0.4, moisture: 0.3,
      tags: [], flowsTo: [], flowsFrom: [],
      flowRate: 0, riverPathId: null, parentRiverId: null,
      riverOrder: null, mergeCount: 0
    },
    {
      id: '0_0', q: 0, r: 0,
      elevation: 0.8, moisture: 0.5,
      tags: [], flowsTo: [], flowsFrom: [],
      flowRate: 0, riverPathId: null, parentRiverId: null,
      riverOrder: null, mergeCount: 0
    },
    {
      id: '1_0', q: 1, r: 0,
      elevation: 0.7, moisture: 0.4,
      tags: [], flowsTo: [], flowsFrom: [],
      flowRate: 0, riverPathId: null, parentRiverId: null,
      riverOrder: null, mergeCount: 0
    },
  
    // Row 1
    {
      id: '-1_1', q: -1, r: 1,
      elevation: 0.4, moisture: 0.3,
      tags: [], flowsTo: [], flowsFrom: [],
      flowRate: 0, riverPathId: null, parentRiverId: null,
      riverOrder: null, mergeCount: 0
    },
    {
      id: '0_1', q: 0, r: 1,
      elevation: 0.7, moisture: 0.6,
      tags: [], flowsTo: [], flowsFrom: [],
      flowRate: 0, riverPathId: null, parentRiverId: null,
      riverOrder: null, mergeCount: 0
    },
    {
      id: '1_1', q: 1, r: 1,
      elevation: 0.6, moisture: 0.4,
      tags: [], flowsTo: [], flowsFrom: [],
      flowRate: 0, riverPathId: null, parentRiverId: null,
      riverOrder: null, mergeCount: 0
    }
  ];
  
  // Build a tileMap for neighbor lookups
  export const tileMap = new Map(tiles.map(tile => [tile.id, tile]));
  