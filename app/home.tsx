import {
  Alert,
  Animated,
  Linking,
  RefreshControlComponent,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import CurrentHangout from "@/components/homepage/CurrentHangout";
import PreferenceQuizButton from "@/components/homepage/PreferenceQuizButton";
import Map from "@/components/homepage/Map";
import PastHangouts from "@/components/homepage/PastHangouts";
import { useFocusEffect, useRouter } from "expo-router";
import axios from "axios";
import { getUserId } from "@/lib/appwrite";
import * as Location from "expo-location";
import PlaceModal from "@/components/modal";
import StarRating from "react-native-star-rating-widget";

const API_URL = "https://travelappbackend-c7bj.onrender.com";

// Default location (San Francisco)
const DEFAULT_LOCATION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

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

const Home = () => {
  const router = useRouter();
  const [region, setRegion] = useState(DEFAULT_LOCATION);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [recommendations, setRecommendations] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedPlaceDetails, setSelectedPlaceDetails] = useState<any | null>(
    null
  );
  const [showGetRecommendationsButton, setShowGetRecommendationsButton] =
    useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [hangouts, setHangouts] = useState<any[]>([]);
  const [upcomingHangout, setUpcomingHangout] = useState<any | null>(null);
  const [hangoutLoading, setHangoutLoading] = useState(true);
  const [rating, setRating] = useState(0);

  const fetchHangouts = useCallback(async () => {
    if (userId) {
      try {
        const response = await axios.get(
          `${API_URL}/get-savedHangouts?user_id=${userId}`
        );
        setHangouts(response.data.saved_hangouts);
      } catch (error) {
        console.error("Error fetching hangouts:", error);
      }
    }
  }, [userId]);

  const fetchUpcomingHangout = useCallback(async () => {
    if (userId) {
      try {
        const response = await axios.get(
          `${API_URL}/get-latest-hangout?user_id=${userId}`
        );
        setUpcomingHangout(response.data);
      } catch (error) {
        console.error("Error fetching upcoming hangout:", error);
      } finally {
        setHangoutLoading(false);
      }
    }
  }, [userId]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getUserId();
        setUserId(id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchHangouts();
      fetchUpcomingHangout();
    }, [fetchHangouts, fetchUpcomingHangout])
  );

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        Alert.alert(
          "Location Permission Denied",
          "Permission to access location was denied. Please enable location services in your settings to get the best experience.",
          [
            { text: "Open Settings", onPress: () => Linking.openSettings() },
            { text: "Cancel", style: "cancel" },
          ]
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

        const response = await axios.get(
          `${API_URL}/initial-recommendations?lat=${currentLocation.coords.latitude}&lon=${currentLocation.coords.longitude}`
        );
        setRecommendations(response.data.recommendations);
        setIsLoading(false);
      } catch (error) {
        console.error(
          "Error getting location or fetching recommendations:",
          error
        );
        fetchHangouts();
        fetchUpcomingHangout();

        setIsLoading(false);
      }
    })();
  }, []);

  const fetchRecommendations = async () => {
    setShowGetRecommendationsButton(false);
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/initial-recommendations?lat=${location.latitude}&lon=${location.longitude}`
      );
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkerPress = async (place: Place) => {
    setSelectedPlaceDetails(null);
    setSelectedPlace(null);
    setModalVisible(true);

    try {
      const formattedAddressString = place.formattedAddressLines.join(", ");

      const response = await axios.post(`${API_URL}/get_place_details`, {
        address: formattedAddressString,
        name: place.name,
      });
      setSelectedPlaceDetails(response.data);
      setSelectedPlace(place);
    } catch (error) {
      console.error("Error fetching place details:", error);
      setSelectedPlaceDetails("error");
    }
  };

  const handleHangoutPress = async (place: any) => {
    setSelectedPlaceDetails(null);
    setSelectedPlace(null);
    setModalVisible(true);
    try {
      const response = await axios.post(`${API_URL}/get_place_details`, {
        address: place.address,
        name: place.name,
      });
      setSelectedPlaceDetails(response.data);
      setSelectedPlace(place);
    } catch (error) {
      console.error("Error fetching place details:", error);
      setSelectedPlaceDetails("error");
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPlace(null);
  };

  const handleQuizPress = () => {
    router.push("/quiz");
  };

  const calculateETA = (hangout: any) => {
    const now = new Date();
    const createdAt = new Date(hangout.$createdAt);
    const scheduledDate = new Date(hangout.date);

    const start = createdAt.getTime();
    const curr = now.getTime();
    const end = scheduledDate.getTime();

    const totalDuration = end - start;
    const remainingDuration = end - curr;

    let units = "mins";
    let scaledStart = 0;
    let scaledCurr = Math.round((curr - start) / (60 * 1000));
    let scaledEnd = Math.round(totalDuration / (60 * 1000));

    if (remainingDuration > 24 * 60 * 60 * 1000) {
      // If more than a day remaining, show in days
      units = "days";
      scaledCurr = Math.round((curr - start) / (24 * 60 * 60 * 1000));
      scaledEnd = Math.round(totalDuration / (24 * 60 * 60 * 1000));
    } else if (remainingDuration > 60 * 60 * 1000) {
      // If more than an hour remaining, show in hours
      units = "hours";
      scaledCurr = Math.round((curr - start) / (60 * 60 * 1000));
      scaledEnd = Math.round(totalDuration / (60 * 60 * 1000));
    }

    return { start: scaledStart, curr: scaledCurr, end: scaledEnd, units };
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {!hangoutLoading &&
          upcomingHangout &&
          Object.keys(upcomingHangout).length > 0 && (
            <CurrentHangout
              title={upcomingHangout.name || "Hangout"}
              members={upcomingHangout.groupMemberNames || []}
              eta={calculateETA(upcomingHangout)}
            />
          )}

        <View style={styles.mapContainer}>
          <Map
            region={region}
            setRegion={setRegion}
            mapLoading={isLoading}
            recommendations={recommendations}
            markerPress={handleMarkerPress}
            hangoutPress={handleHangoutPress}
            hangouts={hangouts}
          />
        </View>
        <PreferenceQuizButton handleQuizPress={handleQuizPress} />
        <PastHangouts
          hangouts={[
            {
              title: "Black Wax Museum",
              rating: 4.5,
              date: { month: "January", date: "12th" },
              changeRating: (rating: number) => {
                console.log(
                  "Implement a way to submit a rating change " + rating
                );
              },
            },
          ]}
        />

        <PlaceModal
          isVisible={modalVisible}
          place={selectedPlaceDetails}
          onClose={() => setModalVisible(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 4,
    paddingBottom: 80,
    backgroundColor: "#E6F7FF",
  },
  container: {
    flex: 1,
    backgroundColor: "#E6F7FF", // Very light blue background
    paddingTop: 50, // Move everything down by 50 pixels
    flexDirection: "column",
  },

  mapContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10, // Add some vertical spacing
  },
});
