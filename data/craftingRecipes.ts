import { CraftingRecipe } from '../types/gameTypes';

export const recipes: CraftingRecipe[] = [
  {
    id: 'stone_axe',
    name: 'Stone Axe',
    ingredients: [
      { id: 'wooden_stick', quantity: 1 },
      { id: 'stone', quantity: 2 },
      { id: 'vine', quantity: 1 }
    ],
    result: 'stone_axe',
    category: 'tool',
    initiallyDiscovered: true,
    requiredForDiscovery: [],
    description: 'A crude axe made from stone and wood. Useful for chopping trees.'
  },
  {
    id: 'stone_pickaxe',
    name: 'Stone Pickaxe',
    ingredients: [
      { id: 'wooden_stick', quantity: 1 },
      { id: 'stone', quantity: 3 },
      { id: 'vine', quantity: 1 }
    ],
    result: 'stone_pickaxe',
    category: 'tool',
    initiallyDiscovered: true,
    requiredForDiscovery: [],
    description: 'A crude pickaxe made from stone and wood. Useful for mining rocks.'
  },
  {
    id: 'stone_spear',
    name: 'Stone Spear',
    ingredients: [
      { id: 'wooden_stick', quantity: 2 },
      { id: 'stone', quantity: 1 },
      { id: 'vine', quantity: 1 }
    ],
    result: 'stone_spear',
    category: 'weapon',
    initiallyDiscovered: true,
    requiredForDiscovery: [],
    description: 'A primitive spear with a stone tip. Useful for hunting.'
  },
  {
    id: 'campfire',
    name: 'Campfire',
    ingredients: [
      { id: 'wooden_stick', quantity: 3 },
      { id: 'stone', quantity: 5 }
    ],
    result: 'campfire',
    category: 'shelter',
    initiallyDiscovered: true,
    requiredForDiscovery: [],
    description: 'A basic campfire. Provides warmth and allows cooking food.'
  },
  {
    id: 'leaf_bed',
    name: 'Leaf Bed',
    ingredients: [
      { id: 'leaf', quantity: 10 },
      { id: 'vine', quantity: 2 }
    ],
    result: 'leaf_bed',
    category: 'shelter',
    initiallyDiscovered: true,
    requiredForDiscovery: [],
    description: 'A simple bed made of leaves. Allows you to rest and recover health.'
  },
  {
    id: 'wooden_shelter',
    name: 'Wooden Shelter',
    ingredients: [
      { id: 'wooden_stick', quantity: 10 },
      { id: 'vine', quantity: 5 },
      { id: 'leaf', quantity: 15 }
    ],
    result: 'wooden_shelter',
    category: 'shelter',
    initiallyDiscovered: false,
    requiredForDiscovery: ['leaf_bed', 'campfire'],
    description: 'A basic wooden shelter. Provides protection from the elements.'
  },
  {
    id: 'fishing_rod',
    name: 'Fishing Rod',
    ingredients: [
      { id: 'wooden_stick', quantity: 2 },
      { id: 'vine', quantity: 3 }
    ],
    result: 'fishing_rod',
    category: 'tool',
    initiallyDiscovered: false,
    requiredForDiscovery: ['stone_axe'],
    description: 'A simple fishing rod. Allows you to catch fish from water sources.'
  },
  {
    id: 'cooked_fish',
    name: 'Cooked Fish',
    ingredients: [
      { id: 'fish', quantity: 1 },
      { id: 'campfire', quantity: 0 } // Campfire is required but not consumed
    ],
    result: 'cooked_fish',
    category: 'food',
    initiallyDiscovered: false,
    requiredForDiscovery: ['fish', 'campfire'],
    description: 'A well-cooked fish. Restores a significant amount of hunger.'
  },
  {
    id: 'cooked_meat',
    name: 'Cooked Meat',
    ingredients: [
      { id: 'raw_meat', quantity: 1 },
      { id: 'campfire', quantity: 0 } // Campfire is required but not consumed
    ],
    result: 'cooked_meat',
    category: 'food',
    initiallyDiscovered: false,
    requiredForDiscovery: ['raw_meat', 'campfire'],
    description: 'A piece of cooked meat. Greatly restores hunger.'
  },
  {
    id: 'torch',
    name: 'Torch',
    ingredients: [
      { id: 'wooden_stick', quantity: 1 },
      { id: 'vine', quantity: 1 },
      { id: 'campfire', quantity: 0 } // Campfire is needed to light it but not consumed
    ],
    result: 'torch',
    category: 'tool',
    initiallyDiscovered: false,
    requiredForDiscovery: ['campfire', 'wooden_stick'],
    description: 'A hand-held torch. Provides light during the night.'
  },
  {
    id: 'water_flask',
    name: 'Water Flask',
    ingredients: [
      { id: 'leaf', quantity: 5 },
      { id: 'vine', quantity: 2 }
    ],
    result: 'water_flask',
    resultQuantity: 1,
    category: 'utility',
    initiallyDiscovered: false,
    requiredForDiscovery: ['leaf'],
    description: 'A container of fresh water. Restores thirst.'
  }
];