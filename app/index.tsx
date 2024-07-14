import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const [isLogged, setIsLogged] = useState<boolean | null>(null); // null represents the loading state

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const sessionJson = await AsyncStorage.getItem("userSession");
        const session = sessionJson ? JSON.parse(sessionJson) : null;
        console.log("Session", session);
        console.log("Session ID", session?.$id);
        setIsLogged(Boolean(session?.$id));
      } catch (error) {
        console.error("Failed to check login status:", error);
        setIsLogged(false);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    console.log("Is logged in?", isLogged);
  }, [isLogged]);

  if (isLogged === null) {
    // Show a loading spinner while checking the login status
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return isLogged ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Redirect href="/introPage" />
  );
}
