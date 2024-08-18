import { Alert, Animated, Linking, RefreshControlComponent, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import CurrentHangout from '@/components/homepage/CurrentHangout'
import PreferenceQuizButton from '@/components/homepage/PreferenceQuizButton'
import Map from "@/components/homepage/Map"
import PastHangouts from '@/components/homepage/PastHangouts'
import { useFocusEffect, useRouter } from 'expo-router'
import axios from 'axios'
import { getUserId } from '@/lib/appwrite'
import * as Location from "expo-location";

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
  const status = 100;

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
    }, [fetchHangouts])
  );

  useEffect(() => {
    console.log("isloading", isLoading);
  }, [isLoading]);

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

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <SafeAreaView style={styles.container}>    
        <CurrentHangout title={"Golden Gate Bridge"} members={["Miguel", "Naman", "B", "The Amazing Doctor Marioa"]} eta={{start: 0, curr: 4, end: 10}} />
        <Map 
          region={region} 
          setRegion={setRegion} 
          mapLoading={isLoading} 
          recommendations={recommendations}
          markerPress={handleMarkerPress}
          hangoutPress={handleHangoutPress}
          hangouts={hangouts}
        />
        <PreferenceQuizButton
          handleQuizPress={handleQuizPress}
        />
        <PastHangouts hangouts={[{title: "Black Wax Mueseum", rating: 4.5, date: {month: "Janurary", date: "12th"}}]} />
        
      </SafeAreaView>
    </ScrollView>
  )
}

export default Home

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 4,
    paddingBottom: 80,
  },
  container: {
    flex: 1,
    backgroundColor: "#E6F7FF", // Very light blue background
    marginVertical: 50, // Move everything down by 50 pixels
    flexDirection: "column",
  },
})