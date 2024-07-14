import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from 'react-native-loading-spinner-overlay';

export default function Index() {
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const session = await AsyncStorage.getItem("userSession");
        setIsLogged(session !== null);
      } catch (error) {
        console.error("Failed to check login status:", error);
        setIsLogged(false);
      } finally {
        setIsLoading(false);
      }
      }

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return <Spinner visible={true} textContent={'Loading...'} textStyle={{color: "FFF"}} />;
  }

  if (isLogged) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/introPage" />;
  }
}