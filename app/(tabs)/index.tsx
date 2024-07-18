import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Alert,
  View,
  Button,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { LogoutUser } from "@/lib/appwrite";
import { useRouter } from "expo-router";
import * as Location from "expo-location";

const quizIcon = require("@/assets/images/questionn.svg");
//TODO add map loadin
// Default location (San Francisco)
const DEFAULT_LOCATION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function App() {
  const router = useRouter();
  const [region, setRegion] = useState(DEFAULT_LOCATION);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState(DEFAULT_LOCATION);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        setIsLoading(false);
        alert(
          "Permission to access location was denied. Please enable location services to get the best experience."
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
        } else {
          console.log("Location is undefined, using default location");
        }
      } catch (error) {
        console.error("Error getting location:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

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
          customMapStyle={mapStyle}
          mapType="mutedStandard"
          rotateEnabled={true}
          pitchEnabled={true}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="You are here"
            description="Your current location"
          />
        </MapView>
      )}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={handleQuizPress}>
          <ThemedView style={styles.card}>
            <Image source={quizIcon} style={styles.icon} />
            <View style={styles.textContainer}>
              <ThemedText type="subtitle" style={styles.title}>
                Preference Quiz
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Help us learn more about you
              </ThemedText>
            </View>
          </ThemedView>
        </TouchableOpacity>
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
  },
  map: {
    flex: 1,
    marginTop: 0, // No margin at the top
    height: "60%", // Reduce the height to leave space for the card
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
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
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
const mapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#242f3e",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#746855",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#242f3e",
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#263c3f",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#6b9a76",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#38414e",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#212a37",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9ca5b3",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#746855",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#1f2835",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#f3d19c",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [
      {
        color: "#2f3948",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#17263c",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#515c6d",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#17263c",
      },
    ],
  },
];
