import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
  Linking,
  TouchableOpacity,
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

const DEFAULT_LOCATION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function AIScreen() {
  const [theme, setTheme] = useState("");
  const [budget, setBudget] = useState(10);
  const [time, setTime] = useState("");
  const [groupId, setGroupId] = useState("0");
  const [location, setLocation] = useState<any>(DEFAULT_LOCATION);
  const [addInfo, setAddInfo] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<String | null>(null);
  const [formatted, setFormatted] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const router = useRouter();

  const submit = theme !== "" && location !== "";
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
      "Romantic Date": "romatic_date",
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

        // Check for missing preferences
        const missingPreferences = await axios.post(`${API_URL}/check-preferences`, {
        params: { users: ids }
        });

        if (missingPreferences.data.missing) {
          Alert.alert(
            "Preferences Missing",
            "Preferences quiz not submitted. Please take it.",
            [{ text: "OK", onPress: () => router.push("/quiz") }]
          );
          return;
        }

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
        }
        router.replace("/(tabs)/find");
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        Alert.alert("Error", "Failed to fetch recommendations");
      }
    }
  };

  useEffect(() => {
    console.log(recommendations);
  }, [recommendations]);

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
      <TitleContainer />
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
      />
      <AddInfoContainer addInfo={addInfo} setAddInfo={setAddInfo} />
      <SubmitButton active={submit} onSubmit={handleSubmit} />
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
});
