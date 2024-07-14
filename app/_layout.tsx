import React, { useState, useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";

import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { View, Text } from "react-native"; // Add this import

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create a simple Splash component
const Splash = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Your Splash Screen</Text>
  </View>
);

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

  if (!fontsLoaded) {
    return null;
  }

  if (isLoading) {
    return <Splash />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
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
