--- 
+++ 
@@ -1,271 +1,66 @@
 import { StatusBar } from 'expo-status-bar';
-import { Text, View, StyleSheet, TouchableOpacity, Platform, Image, ViewStyle, TextStyle } from 'react-native';
-import { useState } from 'react';
-import * as ImagePicker from 'expo-image-picker';
+import { StyleSheet, View } from 'react-native';
+import { NavigationContainer } from '@react-navigation/native';
+import { createNativeStackNavigator } from '@react-navigation/native-stack';
+import { useFonts } from 'expo-font';
+import * as SplashScreen from 'expo-splash-screen';
+import { useCallback } from 'react';
+import GameScreen from './screens/GameScreen';
+import HomeScreen from './screens/HomeScreen';
+import InventoryScreen from './screens/InventoryScreen';
+import CraftingScreen from './screens/CraftingScreen';
+import { GameProvider } from './context/GameContext';
 import './global.css';
 
-type ViewName = 'main' | 'instructions' | 'camera';
-type PlatformType = 'ios' | 'android';
+// Keep the splash screen visible while loading fonts
+SplashScreen.preventAutoHideAsync();
 
-interface ButtonProps {
-  text: string;
-  onPress: () => void;
-  style?: ViewStyle | ViewStyle[];
-}
+const Stack = createNativeStackNavigator();
 
-export default function App(): JSX.Element {
-  const [currentView, setCurrentView] = useState<ViewName>('main');
-  const [platform, setPlatform] = useState<PlatformType>('ios');
-  const [image, setImage] = useState<string | null>(null);
+export default function App() {
+  const [fontsLoaded] = useFonts({
+    'SF-Pro': require('./assets/fonts/SF-Pro.ttf'),
+    'SF-Mono-Regular': require('./assets/fonts/SF-Mono-Regular.otf'),
+    'NewYork': require('./assets/fonts/NewYork.ttf'),
+  });
 
-  const isWeb = Platform.OS === 'web';
-  const photoButtonText = isWeb ? 'Upload Photo' : 'Take Photo';
+  const onLayoutRootView = useCallback(async () => {
+    if (fontsLoaded) {
+      await SplashScreen.hideAsync();
+    }
+  }, [fontsLoaded]);
 
-  const openCamera = async (): Promise<void> => {
-    try {
-      const { granted } = await ImagePicker.requestCameraPermissionsAsync();
-      if (!granted) {
-        alert('Camera permission is required');
-        return;
-      }
-      const result = await ImagePicker.launchCameraAsync({
-        allowsEditing: true,
-        quality: 1,
-      });
-      if (!result.canceled) {
-        setImage(result.assets[0].uri);
-        setCurrentView('camera');
-      }
-    } catch (error) {
-      console.error(error);
-      alert('Error accessing camera');
-    }
-  };
-
-  const renderButton = ({ text, onPress, style }: ButtonProps): JSX.Element => (
-    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
-      <Text style={styles.buttonText}>{text}</Text>
-    </TouchableOpacity>
-  );
-
-  const views: Record<ViewName, JSX.Element> = {
-    main: (
-      <View style={styles.content}>
-        <Image source={require('/public/icosahedron.svg')} style={{maxWidth: "8em", maxHeight: "8em"}} />
-        <Text style={styles.title}>Welcome to Natively!</Text>
-        {/* {showInstallButton && renderButton({text: 'Install App', onPress: handleInstallClick, style: styles.installButton})} */}
-        {renderButton({ text: 'View Instructions', onPress: () => setCurrentView('instructions'), style: styles.instructionsButton})}
-        {renderButton({ text: photoButtonText, onPress: openCamera, style: styles.cameraButton })}
-      </View>
-    ),
-    instructions: (
-      <View style={styles.content}>
-        <Text style={styles.title}>{platform === 'ios' ? 'iOS' : 'Android'} Instructions</Text>
-        <View style={styles.section}>
-          {platform === 'ios' ? (
-            <>
-              <Text style={styles.text}>1. Open your iPhone's camera</Text>
-              <Text style={styles.text}>2. Press the QR code button at the top of the natively.dev website</Text>
-              <Text style={styles.text}>3. Scan the QR code</Text>
-            </>
-          ) : (
-            <>
-              <Text style={styles.text}>1. Download Expo Go from the Play Store</Text>
-              <Text style={styles.text}>2. Open Expo Go on your device</Text>
-              <Text style={styles.text}>3. Press the QR code button at the top of the natively.dev website</Text>
-              <Text style={styles.text}>4. Tap "Scan QR Code" in Expo Go</Text>
-              <Text style={styles.text}>5. Scan the QR code</Text>
-            </>
-          )}
-        </View>
-        <View style={styles.buttonContainer}>
-          {renderButton({
-            text: `Switch to ${platform === 'ios' ? 'Android' : 'iOS'}`,
-            onPress: () => setPlatform(p => p === 'ios' ? 'android' : 'ios'),
-            style: styles.platformButton
-          })}
-          {renderButton({
-            text: 'Back to Main',
-            onPress: () => setCurrentView('main'),
-            style: styles.backButton
-          })}
-        </View>
-      </View>
-    ),
-    camera: (
-      <View style={styles.cameraContainer}>
-        {image ? (
-          <>
-            <Image source={{ uri: image }} style={styles.previewImage} />
-            <View style={styles.cameraControls}>
-              {renderButton({
-                text: 'Back',
-                onPress: () => {
-                  setCurrentView('main');
-                  setImage(null);
-                },
-                style: [styles.backButton, styles.cameraBackButton]
-              })}
-              {renderButton({
-                text: isWeb ? 'Upload New Photo' : 'Take New Photo',
-                onPress: openCamera,
-                style: [styles.cameraButton, styles.cameraBackButton]
-              })}
-            </View>
-          </>
-        ) : (
-          <View style={styles.content}>
-            <Text style={styles.text}>No photo taken yet</Text>
-            {renderButton({ text: photoButtonText, onPress: openCamera })}
-          </View>
-        )}
-      </View>
-    )
-  };
+  if (!fontsLoaded) {
+    return null;
+  }
 
   return (
-    <View style={styles.container}>
-      <StatusBar style="auto" />
-      {views[currentView]}
+    <View style={styles.container} onLayout={onLayoutRootView}>
+      <StatusBar style="light" />
+      <GameProvider>
+        <NavigationContainer>
+          <Stack.Navigator 
+            initialRouteName="Home"
+            screenOptions={{
+              headerShown: false,
+              contentStyle: { backgroundColor: '#2A4D14' },
+              animation: 'fade_from_bottom',
+            }}
+          >
+            <Stack.Screen name="Home" component={HomeScreen} />
+            <Stack.Screen name="Game" component={GameScreen} />
+            <Stack.Screen name="Inventory" component={InventoryScreen} />
+            <Stack.Screen name="Crafting" component={CraftingScreen} />
+          </Stack.Navigator>
+        </NavigationContainer>
+      </GameProvider>
     </View>
   );
 }
 
-interface Styles {
-  container: ViewStyle;
-  content: ViewStyle;
-  title: TextStyle;
-  section: ViewStyle;
-  heading: TextStyle;
-  text: TextStyle;
-  buttonContainer: ViewStyle;
-  button: ViewStyle;
-  buttonText: TextStyle;
-  platformButton: ViewStyle;
-  backButton: ViewStyle;
-  spacing: ViewStyle;
-  shadow: ViewStyle;
-  flexColumn: ViewStyle;
-  cameraButton: ViewStyle;
-  cameraContainer: ViewStyle;
-  previewImage: ViewStyle;
-  cameraControls: ViewStyle;
-  cameraBackButton: ViewStyle;
-  message: TextStyle;
-}
-
-const styles = StyleSheet.create<Styles>({
+const styles = StyleSheet.create({
   container: {
     flex: 1,
-    backgroundColor: '0 0 7%',
-    padding: 20,
+    backgroundColor: '#2A4D14',
   },
-  content: {
-    alignItems: 'center',
-    justifyContent: 'center',
-  },
-  title: {
-    fontSize: 24,
-    fontWeight: '800',
-    textAlign: 'center',
-    marginBottom: 16,
-    color: 'white',
-    marginTop: 16,
-    fontFamily: 'system-ui, sans-serif',
-  },
-  section: {
-    marginBottom: 20,
-    width: '100%',
-    alignItems: 'center',
-  },
-  heading: {
-    fontSize: 28,
-    fontWeight: '700',
-    marginBottom: 20,
-    color: '#333',
-    textAlign: 'center',
-  },
-  text: {
-    fontSize: 16,
-    fontWeight: '700',
-    color: 'white',
-    marginBottom: 8,
-    lineHeight: 24,
-    textAlign: 'center',
-    fontFamily: 'system-ui, sans-serif',
-  },
-  instructionsButton: {
-    backgroundColor: '#52A549',
-  },
-  installButton: {
-    backgroundColor: '#083D77',
-  },
-  cameraButton: {
-    backgroundColor: '#F95738',
-  },
-  platformButton: {
-    backgroundColor: '#52A549',
-  },
-  backButton: {
-    backgroundColor: '#666',
-  },
-  button: {
-    backgroundColor: '#67ab32',
-    padding: 14,
-    borderRadius: 8,
-    marginBottom: 10,
-    width: '80%',
-    shadowColor: '#000',
-    shadowOffset: {
-      width: 0,
-      height: 2,
-    },
-    shadowOpacity: 0.25,
-    shadowRadius: 3.84,
-    elevation: 5,
-  },
-  buttonText: {
-    color: '#fff',
-    fontSize: 16,
-    fontWeight: 'bold',
-    textAlign: 'center',
-  },
-  shadow: {
-    shadowColor: '#000',
-    shadowOffset: { width: 0, height: 2 },
-    shadowOpacity: 0.2,
-    shadowRadius: 4,
-    elevation: 4,
-  },
-  flexColumn: {
-    flex: 1,
-    flexDirection: 'column',
-  },
-  cameraContainer: {
-    flex: 1,
-    width: '100%',
-    height: '100%',
-    justifyContent: 'space-between',
-  },
-  previewImage: {
-    width: '100%',
-    height: '80%',
-    resizeMode: 'contain',
-  },
-  cameraControls: {
-    flexDirection: 'row',
-    justifyContent: 'space-around',
-    padding: 20,
-    backgroundColor: 'transparent',
-  },
-  cameraBackButton: {
-    width: '40%',
-    marginBottom: 0,
-  },
-  message: {
-    fontSize: 16,
-    color: '#666',
-    marginBottom: 20,
-    textAlign: 'center',
-  },
-}); +});