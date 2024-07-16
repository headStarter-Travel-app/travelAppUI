import React from "react";
import { StyleSheet, Alert, View, Button, TextInput } from 'react-native';
import MapView from "react-native-maps";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LogoutUser } from '@/lib/appwrite';
import { useRouter } from "expo-router";

export default function App() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await LogoutUser();
      Alert.alert("Logout successful");
      router.replace("/(auth)/login");
    }
    catch (error: any) {
      console.error("Logout failed:", error);
      Alert.alert("Logout failed. Please try again.");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
        <View style={styles.searchContainer}>
          <TextInput 
            style={styles.searchInput}
            placeholder="Create a new party..."
          />
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <ThemedView style={styles.button}>
          <ThemedText type="subtitle">Login</ThemedText>
        </ThemedView>
        <ThemedView style={styles.button}>
          <ThemedText type="subtitle">Preferences Quiz</ThemedText>
          <ThemedText>Take your quiz to help us understand you!</ThemedText>
        </ThemedView>
      </View>
      <View>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 50,
    backgroundColor: '#F5FCFF',
  },
  mapContainer: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    height: 40,
    paddingLeft: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonsContainer: {
    padding: 10,
  },
  button: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
});