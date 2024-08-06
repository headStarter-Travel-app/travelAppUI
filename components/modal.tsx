import React, { useEffect, useState } from "react";
import { useRef } from "react";
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
  Animated,
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
  const slideArr = [
    useRef(new Animated.Value(0)),
    useRef(new Animated.Value(0)),
    useRef(new Animated.Value(0)),
    useRef(new Animated.Value(0)),
    useRef(new Animated.Value(0)),
  ];
  const opacityArr = [
    useRef(new Animated.Value(0)),
    useRef(new Animated.Value(0)),
    useRef(new Animated.Value(0)),
    useRef(new Animated.Value(0)),
    useRef(new Animated.Value(0)),
  ];
  const [yStart, setYStart] = useState(0);
  if (place === "error") {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, styles.errorModalContent]}>
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={80} color="#FF6B6B" />
              <Text style={styles.errorTitle}>Oops!</Text>
              <Text style={styles.errorText}>
                We couldn't find details for this place. Please try again later.
              </Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  if (place === null) {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, styles.loadingModalContent]}>
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

  slideArr.map((item) => item.current.setValue(-10));
  slideArr.forEach((item, index) =>
    Animated.timing(item.current, {
      delay: 250 * index,
      toValue: 0,
      duration: 900,
      useNativeDriver: true,
    }).start()
  );
  opacityArr.map((item) => item.current.setValue(0));
  opacityArr.forEach((item, index) =>
    Animated.timing(item.current, {
      delay: 250 * index,
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start()
  );

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
            <Animated.View
              style={{
                transform: [
                  {
                    translateX: slideArr[0].current,
                  },
                ],
                opacity: opacityArr[0].current,
              }}
            >
              <Text style={styles.placeName}>
                {place.name || "Unknown Place"}
              </Text>
            </Animated.View>
            <Animated.View
              style={{
                transform: [
                  {
                    translateX: slideArr[1].current,
                  },
                ],
                opacity: opacityArr[1].current,
              }}
            >
              {place.rating ? (
                renderStars(place.rating)
              ) : (
                <Text>No rating available</Text>
              )}
            </Animated.View>

            <Animated.View
              style={{
                transform: [
                  {
                    translateX: slideArr[2].current,
                  },
                ],
                opacity: opacityArr[2].current,
              }}
            >
              {place.address && (
                <View style={styles.detailRow}>
                  <Ionicons name="location" size={20} color="#666" />
                  <Text style={styles.detailText}>{place.address}</Text>
                </View>
              )}
            </Animated.View>

            <Animated.View
              style={{
                transform: [
                  {
                    translateX: slideArr[3].current,
                  },
                ],
                opacity: opacityArr[3].current,
              }}
            >
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
            </Animated.View>

            <Animated.View
              style={{
                transform: [
                  {
                    translateX: slideArr[4].current,
                  },
                ],
                opacity: opacityArr[4].current,
              }}
            >
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
            </Animated.View>
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
  errorModalContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    height: "50%",
  },
  loadingModalContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    height: "30%",
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
    fontFamily: "DM Sans",
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
    fontFamily: "spaceGroteskRegular",
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
    fontFamily: "spaceGroteskMedium",
  },
  hoursContainer: {
    marginLeft: 10,
  },
  hourText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    fontFamily: "spaceGroteskRegular",
  },
  websiteButton: {
    backgroundColor: "#4A90E2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    padding: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 10,
  },
  websiteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    fontFamily: "spaceGroteskBold",
  },
  loadingText: {
    fontSize: 18,
    marginTop: 20,
    color: "#4A90E2",
    fontWeight: "bold",
    fontFamily: "spaceGroteskBold",
  },
  placeholderImage: {
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B6B",
    marginTop: 10,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: "#4B5563",
    textAlign: "center",
    marginTop: 10,
    fontFamily: "spaceGroteskRegular",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "spaceGroteskBold",
  },
});

export default PlaceModal;
