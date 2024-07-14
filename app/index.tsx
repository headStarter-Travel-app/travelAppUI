// app/index.js or app/index.tsx
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function Index() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setIsLogged(!!token);
      } catch (error) {
        console.error("Failed to check login status:", error);
        setIsLogged(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLogged === null) {
    // Optionally, you can return a loading indicator here
    return null;
  }

  if (isLogged) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/introPage" />;
  }
}
