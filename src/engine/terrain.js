export const TERRAIN_TYPES = {
  deep_ocean:{
    name: 'Deep Ocean',
    color: '#2162e3'
  },
  ocean: {
    name: 'Ocean',
    color: '#00b0ff'
  },
  beach: {
    name: 'Beach',
    color: '#fde68a'
  },
  swamp: {
    name: 'Swamp',
    color: '#496a5c'
  },
  desert: {
    name: 'Desert',
    color: '#fcd34d'
  },
  desert_hills: {
    name: 'Desert Hills',
    color: '#fbbf24'
  },
  rocky_highlands: {
    name: 'Rocky Highlands',
    color: '#945711'
  },
  bare_peak: {
    name: 'Bare Peak',
    color: '#706454'
  },
  dry_grassland: {
    name: 'Dry Grassland',
    color: '#CECE6B'
  },
  scrub_hills: {
    name: 'Scrub Hills',
    color: '#9daa58'
  },
  dry_mountains: {
    name: 'Dry Mountains',
    color: '#959871'
  },
  snowy_peak: {
    name: 'Snowy Peak',
    color: '#f4f4f5'
  },
  grassland: {
    name: 'Grassland',
    color: '#8bc34a'
  },
  wetland: {
    name: 'Wetland',
    color: '#149D75'
  },
  hills: {
    name: 'Hills',
    color: '#78716c'
  },
  forest: {
    name: 'Forest',
    color: '#2E6638'
  },
  alpine_forest: {
    name: 'Alpine Forest',
    color: '#084904'
  },
  highlands: {
    name: 'Highlands',
    color: '#a3a3a3'
  },
  mountain: {
    name: 'Mountain',
    color: '#9ca3af'
  },
  misty_mountains: {
    name: 'Misty Mountains',
    color: '#a1a1aa'
  },
  glacier: {
    name: 'Glacier',
    color: '#dafdf8'
  },
  rainforest: {
    name: 'Rainforest',
    color: '#155608'
  }
};

const elevationThresholds = [
  { name: 'deep_ocean', max: 0.1 },
  { name: 'ocean', max: 0.2 },
  { name: 'lowland', max: 0.4 },
  { name: 'upland', max: 0.7 },
  { name: 'highland', max: 0.9 },
  { name: 'peak', max: 1.5 }
];

const moistureThresholds = [
  { name: 'arid', max: 0.1 },
  { name: 'semi_arid', max: 0.4 },
  { name: 'humid', max: 0.8 },
  { name: 'wet', max: 1.5}
];

function getElevationTier(elevation) {
  return elevationThresholds.find(tier => elevation <= tier.max)?.name;
}

function getMoistureTier(moisture) {
  return moistureThresholds.find(tier => moisture <= tier.max)?.name;
}

const terrainMatrix = {
  lowland: {
    arid: 'desert',
    semi_arid: 'dry_grassland',
    humid: 'grassland',
    wet: 'swamp'
  },
  upland: {
    arid: 'desert_hills',
    semi_arid: 'scrub_hills',
    humid: 'forest',
    wet: 'rainforest'
  },
  highland: {
    arid: 'rocky_highlands',
    semi_arid: 'dry_mountains',
    humid: 'alpine_forest',
    wet: 'misty_mountains'
  },
  peak: {
    arid: 'bare_peak',
    semi_arid: 'snowy_peak',
    humid: 'snowy_peak',
    wet: 'glacier'
  }
};

/**
 * Determines terrain type based on elevation and moisture.
 * @param {number} elevation - Elevation value between 0 and 1.
 * @param {number} moisture - Moisture value between 0 and 1.
 * @returns {string} - Terrain type key
 */
export function categorizeTerrain(elevation, moisture, tags= []) {
  if(elevation < 0.1){
    return 'deep_ocean';
  }
  if(elevation < 0.2){
    return 'ocean';
  }

  const elevTier = getElevationTier(elevation);
  const moistTier = getMoistureTier(moisture);
  let terrain = terrainMatrix[elevTier]?.[moistTier] || 'unknown';

  if(tags.includes('coast') && elevation < 0.35){
    terrain = 'beach';
  }

  return terrain
}
