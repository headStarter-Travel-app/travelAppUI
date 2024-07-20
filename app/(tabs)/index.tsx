import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Alert,
  View,
  Button,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { LogoutUser } from "@/lib/appwrite";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
const quizIcon = require("@/assets/images/questionn.svg");
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Change this import at the top

//TODO add map loadin
// Default location (San Francisco)
const DEFAULT_LOCATION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

interface Place {
  location: {
    lat: number;
    lon: number;
  };
  name: string;
  description: string;
}

export default function App() {
  const router = useRouter();
  const [region, setRegion] = useState(DEFAULT_LOCATION);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [recommendations, setRecommendations] = useState<Place[]>([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        setIsLoading(false);
        Alert.alert(
          'Location Permission Denied',
          'Permission to access location was denied. Please enable location services in your settings to get the best experience.',
          [
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
        return;
      }
  
      try {
        let location = await Location.getCurrentPositionAsync({});
        if (location) {
          setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
    
          setLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          // Use dummy recommendations
          setRecommendations([
            { location: { lat: location.coords.latitude + 0.006, lon: location.coords.longitude + 0.008 }, name: "Place 1", description: "Description 1" },
            { location: { lat: location.coords.latitude - 0.004, lon: location.coords.longitude - 0.006 }, name: "Place 2", description: "Description 2" },
            { location: { lat: location.coords.latitude + 0.008, lon: location.coords.longitude - 0.009 }, name: "Place 3", description: "Description 3" }
          ]);
        } else {
          console.log("Location is undefined, using default location");
          // Still use dummy data even if location is undefined
          setRecommendations([
            { location: { lat: DEFAULT_LOCATION.latitude + 0.003, lon: DEFAULT_LOCATION.longitude + 0.006 }, name: "Place 1", description: "Description 1" },
            { location: { lat: DEFAULT_LOCATION.latitude - 0.006, lon: DEFAULT_LOCATION.longitude - 0.004 }, name: "Place 2", description: "Description 2" },
            { location: { lat: DEFAULT_LOCATION.latitude + 0.008, lon: DEFAULT_LOCATION.longitude - 0.006 }, name: "Place 3", description: "Description 3" }
          ]);
        }
      } catch (error) {
        console.error("Error getting location:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);
  
  // Comment out the fetchRecommendations function if you do not need it for now
  // const fetchRecommendations = async (lat: number, lon: number) => {
  //   try {
  //     const response = await axios.post("http://localhost:8000/get-recommendations", {
  //       location: { lat, lon }
  //     });
  //     if (response.data && response.data.recommendations) {
  //       setRecommendations(response.data.recommendations);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching recommendations:", error);
  //   }
  // };

  const handleLogout = async () => {
    try {
      await LogoutUser();
      Alert.alert("Logout successful");
      router.replace("/(auth)/login");
    } catch (error: any) {
      console.error("Logout failed:", error);
      Alert.alert("Logout failed. Please try again.");
    }
  };

  const handleQuizPress = () => {
    router.push("/quiz");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Create a new party..."
            placeholderTextColor="#000"
          />
          <Image
            source={require("@/public/utilities/search.png")}
            style={styles.Magnicon}
          />
        </View>
        {!isLoading && (
          <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={setRegion}
            mapType="mutedStandard"
            rotateEnabled={true}
            showsUserLocation
            showsMyLocationButton
            pitchEnabled={true}
          >
            {recommendations.map((place, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: place.location.lat,
                  longitude: place.location.lon,
                }}
                title={place.name}
                description={place.description}
                pinColor="green" // Green color for recommendations
              />
            ))}
          </MapView>
        )}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={handleQuizPress}>
            <ThemedView style={styles.card}>
              <MaterialCommunityIcons
                name="clipboard-list"
                size={50}
                color="black"
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <ThemedText type="subtitle" style={styles.title}>
                  Preference Quiz
                </ThemedText>
                <ThemedText style={styles.subtitle}>
                  Help us learn more about you
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={24} color="black" />
            </ThemedView>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 4,
    paddingBottom: 100,
  },

  container: {
    flex: 1,
    backgroundColor: "#E6F7FF", // Very light blue background
    marginTop: 50, // Move everything down by 50 pixels
  },
  searchContainer: {
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    borderColor: "#000", // Dark border
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchInput: {
    height: 40,
    fontSize: 18,
    fontWeight: "bold", // Bold text
    color: "#000",
    fontFamily: "spaceGroteskBold",
  },
  map: {
    flex: 1,
    marginTop: 0, // No margin at the top
    height: "40%", // Reduce the height to leave space for the card
  },
  buttonsContainer: {
    padding: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 20, // Increase padding for larger text
    backgroundColor: "#E6F7FF", // Light blue background similar to the page
    borderRadius: 5,
    borderColor: "#000", // Dark border similar to the search container
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 20,
  },
  Magnicon: {
    width: 25,
    height: 25,
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    fontFamily: "spaceGroteskBold",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    fontFamily: "spaceGroteskRegular",
  },
  markerContainer: {
    alignItems: "center",
  },
  markerOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0, 122, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  markerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#007AFF",
  },
  markerArrow: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "rgba(0, 122, 255, 0.3)",
    transform: [{ translateY: -2 }],
  },
});
