import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useGame } from '../context/GameContext';

const InventoryScreen = () => {
  const navigation = useNavigation();
  const { 
    inventory, 
    removeFromInventory, 
    updateHealth, 
    updateHunger, 
    updateThirst 
  } = useGame();

  const handleUseItem = (item: any) => {
    if (item.effects) {
      // Apply item effects
      item.effects.forEach((effect: any) => {
        if (effect.type === 'health') {
          updateHealth(effect.value);
        } else if (effect.type === 'hunger') {
          updateHunger(effect.value);
        } else if (effect.type === 'thirst') {
          updateThirst(effect.value);
        }
      });
      
      // Remove one of the item from inventory
      removeFromInventory(item.id);
      
      Alert.alert(
        "Item Used",
        `You used ${item.name}`,
        [{ text: "OK" }]
      );
    } else if (item.type === 'tool' || item.type === 'weapon') {
      Alert.alert(
        "Tool Info",
        `${item.name}: ${item.description}`,
        [{ text: "OK" }]
      );
    } else if (item.type === 'shelter') {
      Alert.alert(
        "Shelter Info",
        `${item.name}: ${item.description}`,
        [{ text: "OK" }]
      );
    } else {
      Alert.alert(
        "Item Info",
        `${item.name}: ${item.description}`,
        [{ text: "OK" }]
      );
    }
  };

  const handleDropItem = (item: any) => {
    Alert.alert(
      "Drop Item",
      `Are you sure you want to drop one ${item.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Drop", 
          onPress: () => {
            removeFromInventory(item.id);
            Alert.alert("Item Dropped", `You dropped one ${item.name}`);
          }
        }
      ]
    );
  };

  // Group items by type for better organization
  const groupedItems = inventory.reduce((acc: any, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {});

  // Convert grouped items to array for FlatList
  const sections = Object.keys(groupedItems).map(type => ({
    title: type.charAt(0).toUpperCase() + type.slice(1),
    data: groupedItems[type]
  }));

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
        <Text style={styles.headerTitle}>Inventory</Text>
        <View style={styles.spacer} />
      </View>
      
      {inventory.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your inventory is empty.</Text>
          <Text style={styles.emptySubtext}>Collect resources in the world to fill your inventory.</Text>
        </View>
      ) : (
        <FlatList
          data={sections}
          keyExtractor={(item) => item.title}
          renderItem={({ item: section }) => (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.data.map((item: any) => (
                <View key={item.id} style={styles.itemContainer}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemIcon}>{item.icon}</Text>
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemDescription}>{item.description}</Text>
                    </View>
                    <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                  </View>
                  <View style={styles.itemActions}>
                    <TouchableOpacity 
                      style={styles.itemButton}
                      onPress={() => handleUseItem(item)}
                    >
                      <Text style={styles.itemButtonText}>Use</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.itemButton, styles.dropButton]}
                      onPress={() => handleDropItem(item)}
                    >
                      <Text style={styles.itemButtonText}>Drop</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        />
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
    marginBottom: 20,
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    fontFamily: 'SF-Pro',
  },
  itemContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'SF-Pro',
  },
  itemDescription: {
    color: '#E0E0E0',
    fontSize: 12,
    fontFamily: 'SF-Pro',
  },
  itemQuantity: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'SF-Mono-Regular',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  itemButton: {
    backgroundColor: '#4A7D24',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 4,
    marginLeft: 10,
  },
  dropButton: {
    backgroundColor: '#a83232',
  },
  itemButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'SF-Pro',
  },
});

export default InventoryScreen;