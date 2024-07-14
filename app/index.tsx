// app/index.js or app/index.tsx
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        console.log("token", token);

        if (token) {
          // If a token exists, consider it a valid session
          router.replace("/(tabs)");
        } else {
          router.replace("/introPage");
        }
      } catch (error) {
        console.error("Failed to check login status:", error);
        router.replace("/introPage");
      }
    };

    checkLoginStatus();
  }, [router]);

  // While checking, return null or a loading indicator
  return null;
}
