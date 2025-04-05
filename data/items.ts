import { Item } from '../types/gameTypes';

export const items: Item[] = [
  {
    id: 'wooden_stick',
    name: 'Wooden Stick',
    type: 'resource',
    quantity: 0,
    description: 'A simple wooden stick. Useful for crafting basic tools.',
    icon: '🪵'
  },
  {
    id: 'stone',
    name: 'Stone',
    type: 'resource',
    quantity: 0,
    description: 'A common stone. Can be used for crafting tools and weapons.',
    icon: '🪨'
  },
  {
    id: 'leaf',
    name: 'Leaf',
    type: 'resource',
    quantity: 0,
    description: 'A green leaf. Can be used for crafting and as a basic water collector.',
    icon: '🍃'
  },
  {
    id: 'vine',
    name: 'Vine',
    type: 'resource',
    quantity: 0,
    description: 'A flexible vine. Useful for binding items together.',
    icon: '🌿'
  },
  {
    id: 'berry',
    name: 'Berry',
    type: 'food',
    quantity: 0,
    description: 'A small, sweet berry. Restores a small amount of hunger.',
    icon: '🍒',
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
    effects: [
      { type: 'hunger', value: 15 },
      { type: 'health', value: -5 }
    ]
  },
  {
    id: 'water_flask',
    name: 'Water Flask',
    type: 'drink',
    quantity: 0,
    description: 'A container of fresh water. Restores thirst.',
    icon: '💧',
    effects: [
      { type: 'thirst', value: 30 }
    ]
  },
  {
    id: 'cooked_meat',
    name: 'Cooked Meat',
    type: 'food',
    quantity: 0,
    description: 'A piece of cooked meat. Greatly restores hunger.',
    icon: '🍖',
    effects: [
      { type: 'hunger', value: 40 }
    ]
  },
  {
    id: 'raw_meat',
    name: 'Raw Meat',
    type: 'food',
    quantity: 0,
    description: 'A piece of raw meat. Not safe to eat without cooking.',
    icon: '🥩',
    effects: [
      { type: 'hunger', value: 20 },
      { type: 'health', value: -20 }
    ]
  },
  {
    id: 'stone_axe',
    name: 'Stone Axe',
    type: 'tool',
    quantity: 0,
    description: 'A crude axe made from stone and wood. Useful for chopping trees.',
    icon: '🪓'
  },
  {
    id: 'stone_pickaxe',
    name: 'Stone Pickaxe',
    type: 'tool',
    quantity: 0,
    description: 'A crude pickaxe made from stone and wood. Useful for mining rocks.',
    icon: '⛏️'
  },
  {
    id: 'stone_spear',
    name: 'Stone Spear',
    type: 'weapon',
    quantity: 0,
    description: 'A primitive spear with a stone tip. Useful for hunting.',
    icon: '🔱'
  },
  {
    id: 'campfire',
    name: 'Campfire',
    type: 'shelter',
    quantity: 0,
    description: 'A basic campfire. Provides warmth and allows cooking food.',
    icon: '🔥'
  },
  {
    id: 'leaf_bed',
    name: 'Leaf Bed',
    type: 'shelter',
    quantity: 0,
    description: 'A simple bed made of leaves. Allows you to rest and recover health.',
    icon: '🍂'
  },
  {
    id: 'wooden_shelter',
    name: 'Wooden Shelter',
    type: 'shelter',
    quantity: 0,
    description: 'A basic wooden shelter. Provides protection from the elements.',
    icon: '🏠'
  },
  {
    id: 'medicinal_herbs',
    name: 'Medicinal Herbs',
    type: 'medicine',
    quantity: 0,
    description: 'Herbs with healing properties. Restores health when consumed.',
    icon: '🌱',
    effects: [
      { type: 'health', value: 25 }
    ]
  },
  {
    id: 'fishing_rod',
    name: 'Fishing Rod',
    type: 'tool',
    quantity: 0,
    description: 'A simple fishing rod. Allows you to catch fish from water sources.',
    icon: '🎣'
  },
  {
    id: 'fish',
    name: 'Fish',
    type: 'food',
    quantity: 0,
    description: 'A fresh fish. Can be eaten raw but better when cooked.',
    icon: '🐟',
    effects: [
      { type: 'hunger', value: 15 },
      { type: 'health', value: -10 }
    ]
  },
  {
    id: 'cooked_fish',
    name: 'Cooked Fish',
    type: 'food',
    quantity: 0,
    description: 'A well-cooked fish. Restores a significant amount of hunger.',
    icon: '🍳',
    effects: [
      { type: 'hunger', value: 35 }
    ]
  },
  {
    id: 'torch',
    name: 'Torch',
    type: 'tool',
    quantity: 0,
    description: 'A hand-held torch. Provides light during the night.',
    icon: '🔦'
  }
];