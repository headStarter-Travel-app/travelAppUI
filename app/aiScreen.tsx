import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
  Linking,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import TitleContainer from "@/components/aiPage/TitleContainer";
import AddInfoContainer from "@/components/aiPage/AddInfoContainer";
import BudgetContainer from "@/components/aiPage/BudgetContainer";
import ThemeContainer from "@/components/aiPage/ThemeContainer";
import SubmitButton from "@/components/aiPage/SubmitButton";
import axios from "axios";
const API_URL = "https://travelappbackend-c7bj.onrender.com";
import { getUserId } from "@/lib/appwrite";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { G } from "react-native-svg";
import { group } from "console";
import { FontAwesome } from "@expo/vector-icons";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

let globalRecommendations: any[] = [];

const DEFAULT_LOCATION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const LoadingOverlay = () => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.loadingOverlay}>
      <Animated.View style={[styles.loadingIcon, animatedStyle]}>
        <Text style={styles.loadingIconText}>🌍</Text>
      </Animated.View>
      <Text style={styles.loadingText}>
        Discovering amazing places for you...
      </Text>
    </View>
  );
};

export default function AIScreen() {
  const [theme, setTheme] = useState("");
  const [budget, setBudget] = useState(10);
  const [time, setTime] = useState("");
  const [groupId, setGroupId] = useState("0");
  const [location, setLocation] = useState<any>(DEFAULT_LOCATION);
  const [locationString, setLocationString] = useState("");
  const [addInfo, setAddInfo] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<String | null>(null);
  const [formatted, setFormatted] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [recsLoading, setRecsLoading] = useState(false);
  const [valid, setValid] = useState(true);

  const router = useRouter();

  const submit = theme !== "" && location !== "" && valid;
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
      } catch (error) {
        console.error("Error getting location :", error);
        Alert.alert("Error", "Failed to get location. Please enable");
      }
    })();
  }, []);

  const fetchGroups = useCallback(async (userId: any) => {
    try {
      const response = await axios.get(
        `${API_URL}/get-groups?user_id=${userId}`
      );
      setGroups(response.data.groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      Alert.alert("Error", "Failed to fetch groups");
    }
  }, []);

  const handleSubmit = async () => {
    console.log("Submitting");
    const themeMap: { [key: string]: string } = {
      "Romantic Date": "romantic_date",
      "Family Outing": "family_outing",
      "Outdoor Adventure": "outdoor_adventure",
      "Educational Trip": "educational_trip",
      "Night Out": "night_out",
      "Relaxation / Wellness": "relaxation_and_wellness",
      "Sports and Fitness": "sports_and_fitness",
      "Shopping Spree": "shopping_spree",
      "Kids Fun Day": "kids_fun_day",
      "Historical / Cultural": "historical_and_cultural_exploration",
      Vacation: "vacation",
      "Food and Drinks": "food_and_drink",
    };
    if (submit) {
      try {
        setRecsLoading(true);
        let locationList = [];
        locationList.push({
          lat: location.latitude,
          lon: location.longitude,
        });
        let ids = [];
        if (groupId == "0") {
          ids.push(currentUserId);
        } else {
          ids = groups.find((group) => group["$id"] === groupId).members;
        }

        // const missingPreferences = await y(
        //   `${API_URL}/check-preferences`,
        //   { users: ids }
        // );

        // if (missingPreferences.data.missing) {
        //   const missingUserIds = missingPreferences.data.users;
        //   const missingUsernames = missingPreferences.data.usernames;
        //   console.log("Missing User IDs:", missingUsernames);

        //   // Check if the current user is one of the missing users
        //   if (missingUserIds.includes(currentUserId)) {
        //     Alert.alert(
        //       "Preferences Missing",
        //       `(${missingUsernames}) haven't taken the preference quiz. Please complete it.`,
        //       [
        //         {
        //           text: "OK",
        //           onPress: () => router.push("/quiz"), // Redirect to quiz
        //         },
        //       ]
        //     );
        //   } else {
        //     Alert.alert(
        //       "Preferences Missing",
        //       `${missingUsernames} haven't taken the preference quiz. Please remind them to complete it.`,
        //       [{ text: "OK" }]
        //     );
        //   }
        // }

        let locationObject = [
          {
            lat: location.latitude,
            lon: location.longitude,
          },
        ];
        let b = Number(budget);
        if (isNaN(budget)) {
          b = 0;
        }
        let otherInfo = addInfo.trim() ? addInfo.split(",") : [];
        console.log("Other Info:", otherInfo);

        const response = await axios.post(`${API_URL}/get-recommendationsAI`, {
          users: ids,
          location: locationObject,
          theme: themeMap[theme],
          other: otherInfo,
          budget: b,
        });
        if (response.data.recommendations.length == 0) {
          Alert.alert("No Recommendations", "No recommendations found");
          return;
        } else if (response.data) {
          setRecommendations(response.data.recommendations);
          globalRecommendations = response.data.recommendations;
          router.push("/recommendations");
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        Alert.alert("Error", "Failed to fetch recommendations");
      } finally {
        setRecsLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      try {
        const userId = await getUserId();
        console.log("Fetched User ID:", userId);
        setCurrentUserId(userId);
        if (userId) {
          await fetchGroups(userId);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUserId();
  }, [fetchGroups]);

  useEffect(() => {
    setFormatted([]);
    groups.forEach((item) => {
      setFormatted((prev) => [
        ...prev,
        { label: item.name, value: item["$id"] },
      ]);
    });
  }, [groups]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.titleContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color="blue" />
        </TouchableOpacity>
        <TitleContainer />
      </View>

      <ThemeContainer setTheme={setTheme} theme={theme} />
      <BudgetContainer
        budget={budget}
        time={time}
        groupId={groupId}
        location={location}
        setBudget={(num) => setBudget(Number(num))}
        setTime={(time) => setTime(time)}
        setGroupId={(id) => setGroupId(id)}
        setLocation={(location) => setLocation(location)}
        group={formatted}
        setIsValid={setValid}
      />
      <AddInfoContainer addInfo={addInfo} setAddInfo={setAddInfo} />
      <SubmitButton active={submit} onSubmit={handleSubmit} />

      <Modal transparent={true} visible={recsLoading} animationType="fade">
        <LoadingOverlay />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    marginTop: 64,
    width: "100%",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    rowGap: 10,
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingIcon: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  loadingIconText: {
    fontSize: 50,
  },
  loadingText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  backButton: {
    padding: 10,
    width: 50,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
  },
});

export { globalRecommendations };
