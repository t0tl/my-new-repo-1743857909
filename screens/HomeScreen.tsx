import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useGame } from '../context/GameContext';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { resetGame } = useGame();

  const startNewGame = () => {
    resetGame();
    navigation.navigate('Game' as never);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>WILDERNESS SURVIVAL</Text>
        <Text style={styles.subtitle}>Craft. Survive. Thrive.</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={startNewGame}
        >
          <Text style={styles.buttonText}>Start New Game</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Game' as never)}
        >
          <Text style={styles.buttonText}>Continue Game</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>v1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A4D14',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    fontFamily: 'NewYork',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#E0E0E0',
    fontFamily: 'SF-Pro',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    backgroundColor: '#4A7D24',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'SF-Pro',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
  },
  footerText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'SF-Mono-Regular',
  },
});

export default HomeScreen;