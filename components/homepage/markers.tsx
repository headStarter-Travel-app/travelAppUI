import React, { useState, useEffect, useRef, useCallback } from "react";
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
  SafeAreaView,
  Modal,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
interface Place {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  name: string;
  description: string;
  imageUrl: string;
  address: string;
  openingHours: string;
  formattedAddressLines: string[];
}

const getRecommendationColor = (index: number) => {
  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"];
  return colors[index % colors.length];
};

const getHangoutColor = (index: number) => {
  const colors = ["#8A2BE2", "#FF1493", "#1E90FF", "#32CD32", "#FFD700"];
  return colors[index % colors.length];
};

const RecommendationMarker = ({
  place,
  index,
  onPress,
}: {
  place: Place;
  index: number;
  onPress: (place: Place) => void;
}) => {
  const color = getRecommendationColor(index);

  return (
    <Marker
      coordinate={{
        latitude: place.coordinate.latitude,
        longitude: place.coordinate.longitude,
      }}
      onPress={() => onPress(place)}
    >
      <View style={styles.markerContainer}>
        <View style={[styles.markerOuter, { backgroundColor: color }]}>
          <MaterialCommunityIcons
            name="map-marker-radius-outline"
            size={20}
            color="white"
          />
        </View>
        <View style={[styles.markerLabel, { backgroundColor: color }]}>
          <Text style={styles.labelText}>{place.name}</Text>
        </View>
      </View>
    </Marker>
  );
};

const HangoutMarker = ({
  place,
  index,
  onPress,
}: {
  place: any;
  index: number;
  onPress: (place: Place) => void;
}) => {
  const color = getHangoutColor(index);

  return (
    <Marker
      coordinate={{
        latitude: place.latitude,
        longitude: place.longitude,
      }}
      onPress={() => onPress(place)}
    >
      <View style={styles.markerContainer}>
        <View style={[styles.hangoutMarkerOuter, { backgroundColor: color }]}>
          <MaterialCommunityIcons name="party-popper" size={20} color="white" />
        </View>
        <View style={[styles.hangoutMarkerLabel, { backgroundColor: color }]}>
          <Text style={styles.hangoutLabelText}>{place.name}</Text>
        </View>
      </View>
    </Marker>
  );
};

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
    alignItems: "center",
    justifyContent: "center",
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
    width: "100%", // Changed from 90% to 100%
    backgroundColor: "darkgrey", // Changed to a light blue color
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
    color: "#1E3A8A", // Changed to a darker blue
    marginBottom: 10,
    fontFamily: "DM Sans",
  },
  placeDescription: {
    fontSize: 16,
    color: "#4B5563", // Changed to a darker gray
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
    color: "#1F2937", // Changed to a dark gray
    fontFamily: "spaceGroteskRegular",
  },
  closeButton: {
    backgroundColor: "#2563EB", // Changed to a vibrant blue
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
  skeleton: {
    flex: 1,
    height: "50%",
    backgroundColor: "#E0E0E0",
  },

  markerLabel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  labelText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  hangoutMarkerOuter: {
    width: 32,
    height: 32,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  hangoutMarkerLabel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  hangoutLabelText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },
});

export { RecommendationMarker };
export { HangoutMarker };
