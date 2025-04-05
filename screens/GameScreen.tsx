import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useGame } from '../context/GameContext';

const GameScreen = () => {
  const navigation = useNavigation();
  const { 
    health, 
    hunger, 
    thirst, 
    world, 
    time, 
    weather, 
    inventory,
    collectResource, 
    advanceTime,
    updateHealth,
    updateHunger,
    updateThirst
  } = useGame();

  const [currentTile, setCurrentTile] = useState({ x: 0, y: 0 });
  const [visibleResources, setVisibleResources] = useState<any[]>([]);
  const [dayPhase, setDayPhase] = useState('day');

  // Update day phase based on time
  useEffect(() => {
    if (time >= 6 && time < 18) {
      setDayPhase('day');
    } else {
      setDayPhase('night');
    }
  }, [time]);

  // Load resources for the current tile
  useEffect(() => {
    if (world && world.sections[world.currentSection]) {
      const section = world.sections[world.currentSection];
      const tile = section.tiles[currentTile.y][currentTile.x];
      setVisibleResources(tile.resources);
    }
  }, [world, currentTile]);

  // Handle resource collection
  const handleCollectResource = (resource: any) => {
    collectResource(resource);
    
    // Remove the resource from visible resources
    setVisibleResources(prev => prev.filter(r => r.id !== resource.id));
    
    // Simulate resource respawn after its respawn time
    setTimeout(() => {
      setVisibleResources(prev => [...prev, resource]);
    }, resource.respawnTime * 1000);
  };

  // Move to a different tile
  const moveTo = (direction: 'north' | 'south' | 'east' | 'west') => {
    const section = world.sections[world.currentSection];
    const maxY = section.tiles.length - 1;
    const maxX = section.tiles[0].length - 1;
    
    let newX = currentTile.x;
    let newY = currentTile.y;
    
    switch (direction) {
      case 'north':
        newY = Math.max(0, currentTile.y - 1);
        break;
      case 'south':
        newY = Math.min(maxY, currentTile.y + 1);
        break;
      case 'west':
        newX = Math.max(0, currentTile.x - 1);
        break;
      case 'east':
        newX = Math.min(maxX, currentTile.x + 1);
        break;
    }
    
    // Moving consumes energy
    updateHunger(-1);
    updateThirst(-1);
    
    // Advance time slightly with movement
    if (Math.random() < 0.2) {
      advanceTime();
    }
    
    setCurrentTile({ x: newX, y: newY });
  };

  // Format time to display
  const formatTime = () => {
    const hour = time % 12 || 12;
    const amPm = time < 12 || time === 24 ? 'AM' : 'PM';
    return `${hour}:00 ${amPm}`;
  };

  if (!world) return <View style={styles.container}><Text style={styles.loadingText}>Loading world...</Text></View>;

  const currentSection = world.sections[world.currentSection];
  const currentTileInfo = currentSection.tiles[currentTile.y][currentTile.x];

  return (
    <View style={[styles.container, dayPhase === 'night' && styles.nightContainer]}>
      <StatusBar style="light" />
      
      {/* Status Bar */}
      <View style={styles.statusBar}>
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Health</Text>
          <View style={styles.statusBarOuter}>
            <View style={[styles.statusBarInner, { width: `${health}%`, backgroundColor: '#e74c3c' }]} />
          </View>
          <Text style={styles.statusText}>{health}%</Text>
        </View>
        
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Hunger</Text>
          <View style={styles.statusBarOuter}>
            <View style={[styles.statusBarInner, { width: `${hunger}%`, backgroundColor: '#e67e22' }]} />
          </View>
          <Text style={styles.statusText}>{hunger}%</Text>
        </View>
        
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Thirst</Text>
          <View style={styles.statusBarOuter}>
            <View style={[styles.statusBarInner, { width: `${thirst}%`, backgroundColor: '#3498db' }]} />
          </View>
          <Text style={styles.statusText}>{thirst}%</Text>
        </View>
      </View>
      
      {/* Environment Info */}
      <View style={styles.environmentInfo}>
        <Text style={styles.environmentText}>
          {currentSection.biome.charAt(0).toUpperCase() + currentSection.biome.slice(1)} | 
          {' ' + currentTileInfo.type.charAt(0).toUpperCase() + currentTileInfo.type.slice(1)} | 
          {' ' + formatTime()} | 
          {' ' + weather.charAt(0).toUpperCase() + weather.slice(1)}
        </Text>
        <TouchableOpacity 
          style={styles.mapButton}
          onPress={() => navigation.navigate('Map' as never)}
        >
          <Text style={styles.mapButtonText}>🗺️ View Map</Text>
        </TouchableOpacity>
      </View>
      
      {/* Main Game Area */}
      <View style={styles.gameArea}>
        <Text style={styles.sectionTitle}>Available Resources</Text>
        {visibleResources.length > 0 ? (
          <FlatList
            data={visibleResources}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.resourceItem}
                onPress={() => handleCollectResource(item)}
              >
                <Text style={styles.resourceIcon}>{item.icon}</Text>
                <View style={styles.resourceInfo}>
                  <Text style={styles.resourceName}>{item.name}</Text>
                  <Text style={styles.resourceDescription}>{item.description}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={styles.noResourcesText}>No resources available in this area.</Text>
        )}
      </View>
      
      {/* Navigation Controls */}
      <View style={styles.navigationControls}>
        <View style={styles.navRow}>
          <View style={styles.spacer} />
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => moveTo('north')}
          >
            <Text style={styles.navButtonText}>↑</Text>
          </TouchableOpacity>
          <View style={styles.spacer} />
        </View>
        
        <View style={styles.navRow}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => moveTo('west')}
          >
            <Text style={styles.navButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.centerNav}>
            <Text style={styles.navCoords}>({currentTile.x}, {currentTile.y})</Text>
          </View>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => moveTo('east')}
          >
            <Text style={styles.navButtonText}>→</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.navRow}>
          <View style={styles.spacer} />
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => moveTo('south')}
          >
            <Text style={styles.navButtonText}>↓</Text>
          </TouchableOpacity>
          <View style={styles.spacer} />
        </View>
      </View>
      
      {/* Bottom Menu */}
      <View style={styles.bottomMenu}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.navigate('Inventory' as never)}
        >
          <Text style={styles.menuButtonText}>🎒 Inventory</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.navigate('Crafting' as never)}
        >
          <Text style={styles.menuButtonText}>⚒️ Crafting</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => advanceTime()}
        >
          <Text style={styles.menuButtonText}>⏱️ Wait</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.navigate('Home' as never)}
        >
          <Text style={styles.menuButtonText}>🏠 Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A4D14',
    padding: 10,
  },
  nightContainer: {
    backgroundColor: '#162709',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
    fontFamily: 'SF-Pro',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
  },
  statusItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  statusLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    marginBottom: 2,
    fontFamily: 'SF-Pro',
  },
  statusBarOuter: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  statusBarInner: {
    height: '100%',
    borderRadius: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    marginTop: 2,
    textAlign: 'right',
    fontFamily: 'SF-Mono-Regular',
  },
  environmentInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  environmentText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'SF-Pro',
    flex: 1,
  },
  mapButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 10,
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'SF-Pro',
  },
  gameArea: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'SF-Pro',
  },
  resourceItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  resourceIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'SF-Pro',
  },
  resourceDescription: {
    color: '#E0E0E0',
    fontSize: 12,
    fontFamily: 'SF-Pro',
  },
  noResourcesText: {
    color: '#CCCCCC',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'SF-Pro',
  },
  navigationControls: {
    marginBottom: 10,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  navButton: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  spacer: {
    width: 50,
    height: 50,
    margin: 5,
  },
  centerNav: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  navCoords: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'SF-Mono-Regular',
  },
  bottomMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuButton: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  menuButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'SF-Pro',
  },
});

export default GameScreen;