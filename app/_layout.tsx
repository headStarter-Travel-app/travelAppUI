import React, { useState, useEffect } from "react";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { View, Image, Platform } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as Updates from "expo-updates";
import { usePushNotifications } from "@/usePushNotifications";
import { addNotificationToken } from "@/lib/appwrite";
import { StatusBar } from "expo-status-bar";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import Purchases from "react-native-purchases";
import { getUserId } from "@/lib/appwrite";
import { setUserPremium } from "@/lib/appwrite";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const splashImage = require("../public/splash.png");

// Create a simple Splash component
const Splash = () => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "black",
    }}
  >
    <Image source={splashImage} style={{ width: 200, height: 200 }} />
  </View>
);

// Define your custom themes
const CustomDefaultTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    background: "#DFF2F9", // Custom background color for light theme
  },
};

const CustomDarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    background: "#DFF2F9", // Custom background color for dark theme
  },
};

async function onFetchUpdateAsync() {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  } catch (error) {
    console.error(`Error fetching latest Expo update: ${error}`);
  }
}

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    dmSansBold: require("../assets/fonts/DMSans-Bold.ttf"),
    dmSansRegular: require("../assets/fonts/DMSans-Regular.ttf"),
    dmSansMedium: require("../assets/fonts/DMSans-Medium.ttf"),
    spaceGroteskBold: require("../assets/fonts/SpaceGrotesk-Bold.ttf"),
    spaceGroteskRegular: require("../assets/fonts/SpaceGrotesk-Regular.ttf"),
    spaceGroteskMedium: require("../assets/fonts/SpaceGrotesk-Regular.ttf"),
  });

  const { expoPushToken, notification } = usePushNotifications();
  const colorScheme = useColorScheme();

  useEffect(() => {
    async function prepare() {
      try {
        // Wait for fonts to load and request tracking permission
        await Promise.all([
          new Promise((resolve) => {
            if (fontsLoaded || fontError) {
              console.log("Fonts loaded successfully");
            }
          }),
          requestTrackingPermissionsAsync(),
        ]);

        // Fetch updates
        await onFetchUpdateAsync();

        // Handle push notification token
        if (expoPushToken) {
          console.log("Expo Push Token:", expoPushToken.data);
          await addNotificationToken(expoPushToken.data);
        }

        // Add a small delay to ensure smooth transition
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (e) {
        console.warn("Error during app initialization:", e);
      } finally {
        setIsLoading(false);
      }
    }
    async function checkPremium() {
      const ci = await Purchases.getCustomerInfo();
      console.log(ci);
      if (ci?.entitlements.active["Premium"] !== undefined) {
        console.log("User is premium");
        setUserPremium(true);
      } else {
        setUserPremium(false);

        console.log("User is not premium");
      }
    }

    prepare();
    checkPremium();
  }, [fontsLoaded, fontError, expoPushToken]);

  //Set up reveneu cat
  Purchases.setLogLevel(Purchases.LOG_LEVEL.VERBOSE);
  useEffect(() => {
    if (Platform.OS === "ios") {
      Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_RC_APPLE! });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // Force exit loading state after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return <Splash />;
  }

  return (
    <ThemeProvider
      value={colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
    >
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: "horizontal",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="introPage" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
