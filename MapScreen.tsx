import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { useGame } from '../context/GameContext';

const MapScreen = () => {
  const navigation = useNavigation();
  const { world, time, weather } = useGame();
  const [mapReady, setMapReady] = useState(false);
  const [webPlatform, setWebPlatform] = useState(false);

  useEffect(() => {
    // Check if running on web platform
    if (Platform.OS === 'web') {
      setWebPlatform(true);
    }
  }, []);

  const renderSectionOnMap = (sectionIndex: number) => {
    if (!world || !world.sections[sectionIndex]) return null;
    
    const section = world.sections[sectionIndex];
    const biomeColors = {
      forest: '#2E7D32',
      mountain: '#757575',
      beach: '#FDD835',
      plains: '#8BC34A',
      river: '#1976D2'
    };
    
    // Generate coordinates for the section polygon
    const sectionSize = 10; // From worldGenerator.ts
    const sectionScale = 0.001; // Scale factor to make the sections visible on the map
    const baseLatitude = 37.78825 + (sectionIndex * sectionScale * sectionSize);
    const baseLongitude = -122.4324;
    
    const coordinates = [
      { latitude: baseLatitude, longitude: baseLongitude },
      { latitude: baseLatitude, longitude: baseLongitude + (sectionScale * sectionSize) },
      { latitude: baseLatitude + (sectionScale * sectionSize), longitude: baseLongitude + (sectionScale * sectionSize) },
      { latitude: baseLatitude + (sectionScale * sectionSize), longitude: baseLongitude },
    ];
    
    const biomeColor = biomeColors[section.biome as keyof typeof biomeColors] || '#CCCCCC';
    
    return (
      <Polygon
        key={`section-${sectionIndex}`}
        coordinates={coordinates}
        fillColor={`${biomeColor}80`} // 80 adds 50% transparency
        strokeColor={biomeColor}
        strokeWidth={2}
      />
    );
  };

  // Format time to display
  const formatTime = () => {
    const hour = time % 12 || 12;
    const amPm = time < 12 || time === 24 ? 'AM' : 'PM';
    return `${hour}:00 ${amPm}`;
  };

  if (!world) return <View style={styles.container}><Text style={styles.loadingText}>Loading world...</Text></View>;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>World Map</Text>
        <Text style={styles.headerTime}>{formatTime()}</Text>
      </View>
      
      {/* Map */}
      <View style={styles.mapContainer}>
        {webPlatform ? (
          <View style={styles.webNotSupported}>
            <Text style={styles.webNotSupportedText}>
              Maps are not supported on web platform in Natively.
            </Text>
            <Text style={styles.webNotSupportedDescription}>
              This would display an interactive map of your game world with different biomes and your current location.
            </Text>
          </View>
        ) : (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
            onMapReady={() => setMapReady(true)}
            mapType="standard"
          >
            {/* Render each section as a polygon */}
            {mapReady && world.sections.map((_, index) => renderSectionOnMap(index))}
            
            {/* Current position marker */}
            {mapReady && (
              <Marker
                coordinate={{
                  latitude: 37.78825 + (world.currentSection * 0.001 * 10) + (0.001 * 5),
                  longitude: -122.4324 + (0.001 * 5),
                }}
                title="Your Position"
                description={`${world.sections[world.currentSection].biome} biome`}
              />
            )}
          </MapView>
        )}
      </View>
      
      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Map Legend</Text>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#2E7D32' }]} />
          <Text style={styles.legendText}>Forest</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#757575' }]} />
          <Text style={styles.legendText}>Mountain</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FDD835' }]} />
          <Text style={styles.legendText}>Beach</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#8BC34A' }]} />
          <Text style={styles.legendText}>Plains</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#1976D2' }]} />
          <Text style={styles.legendText}>River</Text>
        </View>
      </View>
      
      {/* Weather Info */}
      <View style={styles.weatherInfo}>
        <Text style={styles.weatherTitle}>Current Weather: {weather.charAt(0).toUpperCase() + weather.slice(1)}</Text>
        <Text style={styles.weatherDescription}>
          {weather === 'clear' && 'Clear skies and good visibility across all regions.'}
          {weather === 'cloudy' && 'Cloudy conditions may affect visibility in mountainous areas.'}
          {weather === 'rain' && 'Rainy weather makes movement slower in certain biomes.'}
          {weather === 'storm' && 'Stormy conditions increase danger in exposed areas.'}
        </Text>
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
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
    fontFamily: 'SF-Pro',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'SF-Pro',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'SF-Pro',
  },
  headerTime: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'SF-Mono-Regular',
  },
  mapContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  webNotSupported: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webNotSupportedText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'SF-Pro',
  },
  webNotSupportedDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'SF-Pro',
  },
  legend: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  legendTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'SF-Pro',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'SF-Pro',
  },
  weatherInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 10,
    borderRadius: 8,
  },
  weatherTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'SF-Pro',
  },
  weatherDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'SF-Pro',
  },
});

export default MapScreen;