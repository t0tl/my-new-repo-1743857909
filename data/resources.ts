import { Resource } from '../types/gameTypes';

export const resources: Resource[] = [
  {
    id: 'wooden_stick',
    name: 'Wooden Stick',
    type: 'resource',
    quantity: 0,
    description: 'A simple wooden stick. Useful for crafting basic tools.',
    icon: '🪵',
    respawnTime: 60, // seconds
    biomes: ['forest', 'plains']
  },
  {
    id: 'stone',
    name: 'Stone',
    type: 'resource',
    quantity: 0,
    description: 'A common stone. Can be used for crafting tools and weapons.',
    icon: '🪨',
    respawnTime: 120,
    biomes: ['mountain', 'river', 'beach']
  },
  {
    id: 'leaf',
    name: 'Leaf',
    type: 'resource',
    quantity: 0,
    description: 'A green leaf. Can be used for crafting and as a basic water collector.',
    icon: '🍃',
    respawnTime: 30,
    biomes: ['forest', 'plains']
  },
  {
    id: 'vine',
    name: 'Vine',
    type: 'resource',
    quantity: 0,
    description: 'A flexible vine. Useful for binding items together.',
    icon: '🌿',
    respawnTime: 90,
    biomes: ['forest']
  },
  {
    id: 'berry',
    name: 'Berry',
    type: 'food',
    quantity: 0,
    description: 'A small, sweet berry. Restores a small amount of hunger.',
    icon: '🍒',
    respawnTime: 60,
    biomes: ['forest', 'plains'],
    effects: [
      { type: 'hunger', value: 10 }
    ]
  },
  {
    id: 'mushroom',
    name: 'Mushroom',
    type: 'food',
    quantity: 0,
    description: 'A forest mushroom. Restores hunger but may not be safe to eat raw.',
    icon: '🍄',
    respawnTime: 45,
    biomes: ['forest'],
    effects: [
      { type: 'hunger', value: 15 },
      { type: 'health', value: -5 }
    ]
  },
  {
    id: 'raw_meat',
    name: 'Raw Meat',
    type: 'food',
    quantity: 0,
    description: 'A piece of raw meat. Not safe to eat without cooking.',
    icon: '🥩',
    respawnTime: 300,
    biomes: ['forest', 'plains'],
    effects: [
      { type: 'hunger', value: 20 },
      { type: 'health', value: -20 }
    ]
  },
  {
    id: 'medicinal_herbs',
    name: 'Medicinal Herbs',
    type: 'medicine',
    quantity: 0,
    description: 'Herbs with healing properties. Restores health when consumed.',
    icon: '🌱',
    respawnTime: 180,
    biomes: ['forest', 'plains'],
    effects: [
      { type: 'health', value: 25 }
    ]
  },
  {
    id: 'fish',
    name: 'Fish',
    type: 'food',
    quantity: 0,
    description: 'A fresh fish. Can be eaten raw but better when cooked.',
    icon: '🐟',
    respawnTime: 150,
    biomes: ['river', 'beach'],
    effects: [
      { type: 'hunger', value: 15 },
      { type: 'health', value: -10 }
    ]
  }
];