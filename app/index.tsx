import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";

export default function Index() {
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const session = await AsyncStorage.getItem("userSession");
        if (session !== null) {
          setIsLogged(true);
          setSuccessMessage("You have successfully logged in!");
        } else {
          setIsLogged(false);
        }
      } catch (error) {
        console.error("Failed to check login status:", error);
        setIsLogged(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return (
      <Spinner
        visible={true}
        textContent={"Loading..."}
        textStyle={{ color: "#000000" }}
      />
    );
  }

  if (isLogged) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/introPage" />;
  }
}
