import React from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PlaceModalProps {
  isVisible: boolean;
  place: any;
  onClose: () => void;
}

const PlaceModal: React.FC<PlaceModalProps> = ({
  isVisible,
  place,
  onClose,
}) => {
  console.log(place);
  if (!place) {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.loadingText}>Loading place details...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  const renderStars = (rating: number) => {
    if (typeof rating !== "number") return null;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <View style={styles.starContainer}>
        {[...Array(fullStars)].map((_, i) => (
          <Ionicons key={`full-${i}`} name="star" size={20} color="#FFD700" />
        ))}
        {halfStar && <Ionicons name="star-half" size={20} color="#FFD700" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Ionicons
            key={`empty-${i}`}
            name="star-outline"
            size={20}
            color="#FFD700"
          />
        ))}
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <ScrollView style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>

          {place.photos && place.photos.length > 0 ? (
            <ScrollView horizontal pagingEnabled style={styles.imageScroller}>
              {place.photos.map((photo: string, index: number) => (
                <Image
                  key={index}
                  source={{ uri: photo }}
                  style={styles.placeImage}
                />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.placeholderImage}>
              <Text>No images available</Text>
            </View>
          )}

          <View style={styles.infoContainer}>
            <Text style={styles.placeName}>
              {place.name || "Unknown Place"}
            </Text>
            {place.rating ? (
              renderStars(place.rating)
            ) : (
              <Text>No rating available</Text>
            )}

            {place.address && (
              <View style={styles.detailRow}>
                <Ionicons name="location" size={20} color="#666" />
                <Text style={styles.detailText}>{place.address}</Text>
              </View>
            )}

            {place.hours && place.hours.length > 0 ? (
              <View style={styles.detailRow}>
                <Ionicons name="time" size={20} color="#666" />
                <View style={styles.hoursContainer}>
                  {place.hours.map((hour: string, index: number) => (
                    <Text key={index} style={styles.hourText}>
                      {hour}
                    </Text>
                  ))}
                </View>
              </View>
            ) : (
              <Text>No hours information available</Text>
            )}

            {place.url ? (
              <TouchableOpacity
                style={styles.websiteButton}
                onPress={() => Linking.openURL(place.url)}
              >
                <Ionicons name="globe-outline" size={20} color="#fff" />
                <Text style={styles.websiteButtonText}>Visit Website</Text>
              </TouchableOpacity>
            ) : (
              <Text>No website available</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 15,
    padding: 5,
  },
  imageScroller: {
    height: 250,
  },
  placeImage: {
    width: 400,
    height: 250,
    resizeMode: "cover",
  },
  infoContainer: {
    padding: 20,
  },
  placeName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#666",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  detailText: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  hoursContainer: {
    marginLeft: 10,
  },
  hourText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  websiteButton: {
    backgroundColor: "#4A90E2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  websiteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  loadingText: {
    fontSize: 18,
    marginTop: 20,
  },
  placeholderImage: {
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
});

export default PlaceModal;
