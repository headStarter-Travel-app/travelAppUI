import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
  Linking,
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

  useEffect(() => {
    console.log("Location:", location);
  }, [location]);
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
    if (submit) {
      try {
        const response = await axios.post(`${API_URL}/get-recommendationsAI`, {
          // users : [currentUserId],
          // location: location,
          // theme: theme,
          // other : addInfo.split(","),
          // budget: parseInt(budget),
        });
        setRecommendations(response.data.recommendations);
        //router.push("/recommendations", { recommendations });
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        Alert.alert("Error", "Failed to fetch recommendations");
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
      <SubmitButton active={submit} />
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
