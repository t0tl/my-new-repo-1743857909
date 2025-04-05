import { GameWorld, WorldSection, WorldTile, Resource } from '../types/gameTypes';
import { resources } from '../data/resources';

// Function to randomly distribute resources based on biome
const distributeResources = (biome: string): Resource[] => {
  const biomeResources = resources.filter(resource => resource.biomes.includes(biome));
  const distributedResources: Resource[] = [];
  
  biomeResources.forEach(resource => {
    // Randomly decide whether to include this resource
    if (Math.random() < 0.3) {  // 30% chance for each resource
      distributedResources.push({...resource, quantity: 1});
    }
  });
  
  return distributedResources;
};

// Generate a single tile
const generateTile = (x: number, y: number, biome: string): WorldTile => {
  const tileTypes = {
    forest: ['tree', 'bush', 'grass', 'rocks'],
    mountain: ['rocks', 'cliff', 'cave', 'snow'],
    beach: ['sand', 'shallow_water', 'palm_tree', 'rocks'],
    plains: ['grass', 'tall_grass', 'flower_field', 'small_pond'],
    river: ['water', 'riverbank', 'shallow_water', 'reeds']
  };
  
  const biomeTypes = tileTypes[biome as keyof typeof tileTypes] || ['grass'];
  const tileType = biomeTypes[Math.floor(Math.random() * biomeTypes.length)];
  
  return {
    type: tileType,
    resources: distributeResources(biome),
    x,
    y
  };
};

// Generate a section of the world with a specific biome
const generateSection = (biome: string): WorldSection => {
  const sectionSize = 10; // 10x10 grid
  const tiles: WorldTile[][] = [];
  
  for (let y = 0; y < sectionSize; y++) {
    const row: WorldTile[] = [];
    for (let x = 0; x < sectionSize; x++) {
      row.push(generateTile(x, y, biome));
    }
    tiles.push(row);
  }
  
  return {
    biome,
    tiles
  };
};

// Generate the complete world
export const generateWorld = (): GameWorld => {
  const biomes = ['forest', 'mountain', 'beach', 'plains', 'river'];
  const sections: WorldSection[] = [];
  
  biomes.forEach(biome => {
    sections.push(generateSection(biome));
  });
  
  return {
    sections,
    currentSection: 0  // Start in the first section (forest)
  };
};