import React, { useState, useEffect } from "react";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { View, Text, Image } from "react-native"; // Add this import
import { useColorScheme } from "@/hooks/useColorScheme";
import * as Updates from "expo-updates";
import { usePushNotifications } from "@/usePushNotifications";

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
    // You can also add an alert() to see the error message in case of an error when fetching updates.
    alert(`Error fetching latest Expo update: ${error}`);
  }
}

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    dmSansBold: require("../assets/fonts/DMSans-Bold.ttf"),
    dmSansRegular: require("../assets/fonts/DMSans-Regular.ttf"),
    dmSansMedium: require("../assets/fonts/DMSans-Medium.ttf"),
    spaceGroteskBold: require("../assets/fonts/SpaceGrotesk-Bold.ttf"),
    spaceGroteskRegular: require("../assets/fonts/SpaceGrotesk-Regular.ttf"),
    spaceGroteskMedium: require("../assets/fonts/SpaceGrotesk-Regular.ttf"),
  });
  const { expoPushToken, notification } = usePushNotifications();
  const data = JSON.stringify(notification, undefined, 2);
  useEffect(() => {
    if (expoPushToken) {
      console.log("Expo Push Token:", expoPushToken.data);
    }
  }, [expoPushToken]);

  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (fontsLoaded) {
      // Hide the splash screen after a delay
      setTimeout(() => {
        SplashScreen.hideAsync();
        setIsLoading(false);
      }, 2000); // Adjust the delay as needed
    }
  }, [fontsLoaded]);
  useEffect(() => {
    onFetchUpdateAsync();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  if (isLoading) {
    return <Splash />;
  }

  return (
    <ThemeProvider
      value={colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
    >
      <Stack
        screenOptions={
          {
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: "horizontal",
            cardStyle: { backgroundColor: "#DFF2F9" }, // Apply background color to all screens
          } as any
        }
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="introPage" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
