import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const session = await AsyncStorage.getItem("userSession");
        setIsLogged(session !== null);
      } catch (error) {
        console.error("Failed to check login status:", error);
        setIsLogged(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLogged) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/introPage" />;
  }
}