// Game types

export interface Item {
  id: string;
  name: string;
  type: string;
  quantity: number;
  description: string;
  icon: string;
  effects?: ItemEffect[];
}

export interface ItemEffect {
  type: 'health' | 'hunger' | 'thirst';
  value: number;
}

export interface Resource extends Item {
  respawnTime: number;
  biomes: string[];
}

export interface CraftingIngredient {
  id: string;
  quantity: number;
}

export interface CraftingRecipe {
  id: string;
  name: string;
  ingredients: CraftingIngredient[];
  result: string;
  resultQuantity?: number;
  category: 'tool' | 'weapon' | 'shelter' | 'food' | 'utility';
  initiallyDiscovered: boolean;
  requiredForDiscovery: string[];
  description: string;
}

export interface WorldTile {
  type: string;
  resources: Resource[];
  x: number;
  y: number;
}

export interface WorldSection {
  biome: string;
  tiles: WorldTile[][];
}

export interface GameWorld {
  sections: WorldSection[];
  currentSection: number;
}