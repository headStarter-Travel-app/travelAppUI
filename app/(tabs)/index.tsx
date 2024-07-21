import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Alert,
  View,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Text,
  Modal,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { LogoutUser } from "@/lib/appwrite";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import axios from "axios";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// Default location (San Francisco)
const DEFAULT_LOCATION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

interface Place {
  location: {
    lat: number;
    lon: number;
  };
  name: string;
  description: string;
  imageUrl: string;
  address: string;
  openingHours: string;
}

export default function App() {
  const router = useRouter();
  const [region, setRegion] = useState(DEFAULT_LOCATION);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [recommendations, setRecommendations] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedPlaceDetails, setSelectedPlaceDetails] = useState<any | null>(null);
  const [showGetRecommendationsButton, setShowGetRecommendationsButton] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        setIsLoading(false);
        Alert.alert(
          "Location Permission Denied",
          "Permission to access location was denied. Please enable location services in your settings to get the best experience.",
          [{ text: "Open Settings", onPress: () => Linking.openSettings() }, { text: "Cancel", style: "cancel" }]
        );
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        setRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });

        const response = await axios.get(`http://127.0.0.1:8000/check-recommendations?lat=${currentLocation.coords.latitude}&lon=${currentLocation.coords.longitude}&user_id=${'your-user-id'}`);
        if (response.data.recommendations && response.data.recommendations.length > 0) {
          setRecommendations(response.data.recommendations);
        } else {
          setShowGetRecommendationsButton(true);
        }
      } catch (error) {
        console.error("Error getting location or checking recommendations:", error);
        setIsLoading(false);
      }
    })();
  }, []);

  const fetchRecommendations = async () => {
    setShowGetRecommendationsButton(false);
    setIsLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/initial-recommendations?lat=${location.latitude}&lon=${location.longitude}&user_id=${'your-user-id'}`);
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkerPress = async (place: Place) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/get_place_details', {
        address: place.address,
        name: place.name
      });
      setSelectedPlaceDetails(response.data);
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPlace(null);
  };

  const getMarkerColor = (index: number) => {
    const colors = ["#FF5252", "#4CAF50", "#2196F3", "#FFC107", "#9C27B0"];
    return colors[index % colors.length];
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
                onPress={() => handleMarkerPress(place)}
              >
                <View style={styles.markerContainer}>
                  <View
                    style={[
                      styles.markerOuter,
                      { backgroundColor: getMarkerColor(index) },
                    ]}
                  >
                    <Text style={styles.markerText}>{index + 1}</Text>
                  </View>
                  <View
                    style={[
                      styles.markerArrow,
                      { borderTopColor: getMarkerColor(index) },
                    ]}
                  />
                </View>
              </Marker>
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
                  Get Recommendations
                </ThemedText>
                <ThemedText style={styles.subtitle}>
                  Get recommendations near you
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={24} color="black" />
            </ThemedView>
          </TouchableOpacity>
        </View>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedPlace && (
              <>
                <Image
                  source={{ uri: selectedPlace.imageUrl }}
                  style={styles.placeImage}
                />
                <Text style={styles.placeName}>{selectedPlace.name}</Text>
                <Text style={styles.placeDescription}>
                  {selectedPlace.description}
                </Text>
                <View style={styles.placeDetails}>
                  <Ionicons name="location" size={20} color="#000" />
                  <Text style={styles.placeDetailText}>
                    {selectedPlace.address}
                  </Text>
                </View>
                <View style={styles.placeDetails}>
                  <Ionicons name="time" size={20} color="#000" />
                  <Text style={styles.placeDetailText}>
                    {selectedPlace.openingHours}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  map: {
    flex: 1,
    marginTop: 0,
    height: "50%", // Increase map height
  },
  markerContainer: {
    alignItems: "center",
  },
  markerOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  markerText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "spaceGroteskBold",
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
    transform: [{ translateY: -2 }],
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: '90%',
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  placeImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  placeName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 10,
    fontFamily: "spaceGroteskBold",
  },
  placeDescription: {
    fontSize: 16,
    color: "#555555",
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "spaceGroteskRegular",
  },
  placeDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  placeDetailText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#000000",
    fontFamily: "spaceGroteskRegular",
  },
  closeButton: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "spaceGroteskBold",
  },
});
