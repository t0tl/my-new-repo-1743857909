import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { generateWorld } from '../utils/worldGenerator';
import { Item, Resource, CraftingRecipe } from '../types/gameTypes';
import { recipes } from '../data/craftingRecipes';
import { items } from '../data/items';
import { resources } from '../data/resources';

interface GameContextProps {
  health: number;
  hunger: number;
  thirst: number;
  inventory: Item[];
  world: any;
  time: number;
  weather: string;
  discoveredRecipes: CraftingRecipe[];
  updateHealth: (value: number) => void;
  updateHunger: (value: number) => void;
  updateThirst: (value: number) => void;
  addToInventory: (item: Item) => void;
  removeFromInventory: (itemId: string, quantity?: number) => void;
  collectResource: (resource: Resource) => void;
  craftItem: (recipe: CraftingRecipe) => boolean;
  advanceTime: () => void;
  resetGame: () => void;
  checkInventoryForItem: (itemId: string) => number;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [health, setHealth] = useState(100);
  const [hunger, setHunger] = useState(100);
  const [thirst, setThirst] = useState(100);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [world, setWorld] = useState<any>(null);
  const [time, setTime] = useState(8); // 8 AM start time
  const [weather, setWeather] = useState('clear');
  const [discoveredRecipes, setDiscoveredRecipes] = useState<CraftingRecipe[]>([]);

  // Initialize the world on first load
  useEffect(() => {
    resetGame();
  }, []);

  // Decrease hunger and thirst over time
  useEffect(() => {
    const interval = setInterval(() => {
      setHunger(prev => Math.max(0, prev - 1));
      setThirst(prev => Math.max(0, prev - 1.5));
      
      // If hunger or thirst are at 0, start decreasing health
      if (hunger <= 0 || thirst <= 0) {
        setHealth(prev => Math.max(0, prev - 1));
      }
      
      // Game over condition
      if (health <= 0) {
        Alert.alert(
          "Game Over",
          "You didn't survive. Try again?",
          [
            { text: "Restart", onPress: () => resetGame() }
          ]
        );
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [hunger, thirst, health]);

  const updateHealth = (value: number) => {
    setHealth(prev => Math.min(100, Math.max(0, prev + value)));
  };

  const updateHunger = (value: number) => {
    setHunger(prev => Math.min(100, Math.max(0, prev + value)));
  };

  const updateThirst = (value: number) => {
    setThirst(prev => Math.min(100, Math.max(0, prev + value)));
  };

  const addToInventory = (item: Item) => {
    setInventory(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + item.quantity } 
            : i
        );
      }
      return [...prev, { ...item }];
    });

    // Check if any new recipes can be discovered
    checkForNewRecipes();
  };

  const removeFromInventory = (itemId: string, quantity = 1) => {
    setInventory(prev => {
      const existingItem = prev.find(i => i.id === itemId);
      if (!existingItem) return prev;
      
      if (existingItem.quantity <= quantity) {
        return prev.filter(i => i.id !== itemId);
      }
      
      return prev.map(i => 
        i.id === itemId 
          ? { ...i, quantity: i.quantity - quantity } 
          : i
      );
    });
  };

  const collectResource = (resource: Resource) => {
    // Add the resource to inventory
    addToInventory({
      id: resource.id,
      name: resource.name,
      type: 'resource',
      quantity: 1,
      description: resource.description,
      icon: resource.icon
    });
  };

  const craftItem = (recipe: CraftingRecipe): boolean => {
    // Check if player has required materials
    const canCraft = recipe.ingredients.every(ingredient => {
      const inventoryItem = inventory.find(item => item.id === ingredient.id);
      return inventoryItem && inventoryItem.quantity >= ingredient.quantity;
    });

    if (!canCraft) {
      Alert.alert("Crafting Failed", "You don't have all the required materials.");
      return false;
    }

    // Remove ingredients from inventory
    recipe.ingredients.forEach(ingredient => {
      removeFromInventory(ingredient.id, ingredient.quantity);
    });

    // Add crafted item to inventory
    const craftedItem = items.find(item => item.id === recipe.result);
    if (craftedItem) {
      addToInventory({
        ...craftedItem,
        quantity: recipe.resultQuantity || 1
      });
      return true;
    }
    
    return false;
  };

  const advanceTime = () => {
    setTime(prev => (prev + 1) % 24);
    
    // Random weather changes
    const weatherChance = Math.random();
    if (weatherChance < 0.1) {
      const weatherTypes = ['clear', 'cloudy', 'rain', 'storm'];
      const newWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
      setWeather(newWeather);
    }
  };

  const resetGame = () => {
    setHealth(100);
    setHunger(100);
    setThirst(100);
    setInventory([]);
    setWorld(generateWorld());
    setTime(8);
    setWeather('clear');
    
    // Start with basic recipes discovered
    setDiscoveredRecipes(recipes.filter(r => r.initiallyDiscovered));
  };

  const checkInventoryForItem = (itemId: string): number => {
    const item = inventory.find(i => i.id === itemId);
    return item ? item.quantity : 0;
  };

  const checkForNewRecipes = () => {
    const newDiscoveries = recipes.filter(recipe => {
      // Skip already discovered recipes
      if (discoveredRecipes.some(r => r.id === recipe.id)) {
        return false;
      }
      
      // Check if all required items for discovery are in inventory
      return recipe.requiredForDiscovery.every(item => {
        const inventoryItem = inventory.find(i => i.id === item);
        return inventoryItem && inventoryItem.quantity > 0;
      });
    });

    if (newDiscoveries.length > 0) {
      setDiscoveredRecipes(prev => [...prev, ...newDiscoveries]);
      if (newDiscoveries.length === 1) {
        Alert.alert(
          "New Recipe Discovered!",
          `You've discovered how to craft: ${newDiscoveries[0].name}`
        );
      } else {
        Alert.alert(
          "New Recipes Discovered!",
          `You've discovered ${newDiscoveries.length} new crafting recipes!`
        );
      }
    }
  };

  return (
    <GameContext.Provider
      value={{
        health,
        hunger,
        thirst,
        inventory,
        world,
        time,
        weather,
        discoveredRecipes,
        updateHealth,
        updateHunger,
        updateThirst,
        addToInventory,
        removeFromInventory,
        collectResource,
        craftItem,
        advanceTime,
        resetGame,
        checkInventoryForItem
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};