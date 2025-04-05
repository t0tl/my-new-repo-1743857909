import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useGame } from '../context/GameContext';
import { items } from '../data/items';

const CraftingScreen = () => {
  const navigation = useNavigation();
  const { 
    discoveredRecipes, 
    inventory, 
    craftItem,
    checkInventoryForItem
  } = useGame();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Filter recipes by selected category
  const filteredRecipes = selectedCategory === 'all' 
    ? discoveredRecipes 
    : discoveredRecipes.filter(recipe => recipe.category === selectedCategory);
  
  // Check if player has all required ingredients for a recipe
  const canCraftRecipe = (recipe: any) => {
    return recipe.ingredients.every((ingredient: any) => {
      const count = checkInventoryForItem(ingredient.id);
      return count >= ingredient.quantity;
    });
  };
  
  // Handle crafting an item
  const handleCraft = (recipe: any) => {
    if (canCraftRecipe(recipe)) {
      const success = craftItem(recipe);
      if (success) {
        const resultItem = items.find(item => item.id === recipe.result);
        Alert.alert(
          "Crafting Successful",
          `You crafted ${resultItem?.name}!`,
          [{ text: "OK" }]
        );
      }
    } else {
      Alert.alert(
        "Cannot Craft",
        "You don't have all the required ingredients for this recipe.",
        [{ text: "OK" }]
      );
    }
  };
  
  // Get item name from ID
  const getItemName = (itemId: string) => {
    const item = items.find(item => item.id === itemId);
    return item ? item.name : itemId;
  };
  
  // Get item icon from ID
  const getItemIcon = (itemId: string) => {
    const item = items.find(item => item.id === itemId);
    return item ? item.icon : '❓';
  };
  
  // Render recipe ingredient
  const renderIngredient = (ingredient: any) => {
    const hasEnough = checkInventoryForItem(ingredient.id) >= ingredient.quantity;
    
    return (
      <View key={ingredient.id} style={styles.ingredientItem}>
        <Text style={styles.ingredientIcon}>{getItemIcon(ingredient.id)}</Text>
        <Text style={[styles.ingredientText, !hasEnough && styles.missingIngredient]}>
          {getItemName(ingredient.id)} x{ingredient.quantity}
        </Text>
        <Text style={[styles.ingredientCount, !hasEnough && styles.missingIngredient]}>
          ({checkInventoryForItem(ingredient.id)}/{ingredient.quantity})
        </Text>
      </View>
    );
  };
  
  // Render category filter buttons
  const renderCategoryFilters = () => {
    const categories = ['all', 'tool', 'weapon', 'shelter', 'food', 'utility'];
    
    return (
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        style={styles.categoryList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === item && styles.selectedCategoryButton
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === item && styles.selectedCategoryText
            ]}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Text>
          </TouchableOpacity>
        )}
      />
    );
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crafting</Text>
        <View style={styles.spacer} />
      </View>
      
      {discoveredRecipes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No recipes discovered yet.</Text>
          <Text style={styles.emptySubtext}>Collect resources and items to discover crafting recipes.</Text>
        </View>
      ) : (
        <>
          {renderCategoryFilters()}
          
          <FlatList
            data={filteredRecipes}
            keyExtractor={(item) => item.id}
            renderItem={({ item: recipe }) => {
              const resultItem = items.find(item => item.id === recipe.result);
              const canCraft = canCraftRecipe(recipe);
              
              return (
                <View style={styles.recipeContainer}>
                  <View style={styles.recipeHeader}>
                    <Text style={styles.recipeIcon}>{resultItem?.icon || '❓'}</Text>
                    <View style={styles.recipeHeaderText}>
                      <Text style={styles.recipeName}>{recipe.name}</Text>
                      <Text style={styles.recipeDescription}>{recipe.description}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.ingredientsContainer}>
                    <Text style={styles.ingredientsTitle}>Required Ingredients:</Text>
                    {recipe.ingredients.map(renderIngredient)}
                  </View>
                  
                  <TouchableOpacity
                    style={[
                      styles.craftButton,
                      !canCraft && styles.disabledCraftButton
                    ]}
                    onPress={() => handleCraft(recipe)}
                    disabled={!canCraft}
                  >
                    <Text style={styles.craftButtonText}>
                      Craft {resultItem?.name || recipe.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A4D14',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingTop: 10,
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'SF-Pro',
  },
  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'NewYork',
  },
  spacer: {
    width: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'SF-Pro',
  },
  emptySubtext: {
    color: '#CCCCCC',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'SF-Pro',
  },
  categoryList: {
    marginBottom: 15,
  },
  categoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedCategoryButton: {
    backgroundColor: '#4A7D24',
  },
  categoryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'SF-Pro',
  },
  selectedCategoryText: {
    fontWeight: 'bold',
  },
  recipeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  recipeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recipeIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  recipeHeaderText: {
    flex: 1,
  },
  recipeName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'SF-Pro',
  },
  recipeDescription: {
    color: '#E0E0E0',
    fontSize: 12,
    fontFamily: 'SF-Pro',
  },
  ingredientsContainer: {
    marginBottom: 10,
  },
  ingredientsTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'SF-Pro',
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  ingredientIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  ingredientText: {
    color: '#FFFFFF',
    fontSize: 14,
    flex: 1,
    fontFamily: 'SF-Pro',
  },
  ingredientCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'SF-Mono-Regular',
  },
  missingIngredient: {
    color: '#ff8080',
  },
  craftButton: {
    backgroundColor: '#4A7D24',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  disabledCraftButton: {
    backgroundColor: 'rgba(74, 125, 36, 0.4)',
  },
  craftButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'SF-Pro',
  },
});

export default CraftingScreen;