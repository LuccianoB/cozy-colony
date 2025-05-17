export const TERRAIN_TYPES = {
  ocean: {
    name: 'Ocean',
    color: '#3b82f6'
  },
  beach: {
    name: 'Beach',
    color: '#fde68a'
  },
  swamp: {
    name: 'Swamp',
    color: '#4b5563'
  },
  desert: {
    name: 'Desert',
    color: '#fcd34d'
  },
  grassland: {
    name: 'Grassland',
    color: '#86efac'
  },
  wetland: {
    name: 'Wetland',
    color: '#6ee7b7'
  },
  hills: {
    name: 'Hills',
    color: '#78716c'
  },
  forest: {
    name: 'Forest',
    color: '#16a34a'
  },
  highlands: {
    name: 'Highlands',
    color: '#a3a3a3'
  },
  mountain: {
    name: 'Mountain',
    color: '#9ca3af'
  },
  peak: {
    name: 'Mountain Peak',
    color: '#f4f4f5'
  }
};

/**
 * Determines terrain type based on elevation and moisture.
 * @param {number} elevation - Elevation value between 0 and 1.
 * @param {number} moisture - Moisture value between 0 and 1.
 * @returns {string} - Terrain type key
 */
export function categorizeTerrain(elevation, moisture, tags= []) {
  if (tags.includes('coast')){
    return 'beach';
  }
  if (elevation < 0.3) {
    return moisture < 0.4 ? 'beach' : 'swamp';
  } else if (elevation < 0.5) {
    if (moisture < 0.4) return 'desert';
    if (moisture < 0.6) return 'grassland';
    return 'wetland';
  } else if (elevation < 0.7) {
    return moisture < 0.5 ? 'hills' : 'forest';
  } else if (elevation < 0.85) {
    return moisture < 0.4 ? 'highlands' : 'mountain';
  } else {
    return 'peak';
  }
}
