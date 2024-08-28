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
import {
  addNotificationToken,
  setUserPremium,
  getPremiumStatus,
} from "@/lib/appwrite";
import { StatusBar } from "expo-status-bar";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import Purchases from "react-native-purchases";
import { getUserInfo } from "@/lib/appwrite";
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
    background: "#DFF2F9",
  },
};

const CustomDarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    background: "#DFF2F9",
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

  const { expoPushToken } = usePushNotifications();
  const colorScheme = useColorScheme();

  useEffect(() => {
    async function prepare() {
      try {
        await Promise.all([
          new Promise((resolve) => {
            if (fontsLoaded || fontError) {
              console.log("Fonts loaded successfully");
            }
          }),
          requestTrackingPermissionsAsync(),
        ]);

        await onFetchUpdateAsync();

        if (expoPushToken) {
          console.log("Expo Push Token:", expoPushToken.data);
          await addNotificationToken(expoPushToken.data);
        }

        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (e) {
        console.warn("Error during app initialization:", e);
      } finally {
        setIsLoading(false);
      }
    }

    async function initializePurchases() {
      if (Platform.OS === "ios") {
        Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_RC_APPLE! });
      }
      // For Android, you would add a similar check and configuration here

      Purchases.setLogLevel(Purchases.LOG_LEVEL.VERBOSE);

      const customerInfo = await Purchases.getCustomerInfo();
      updatePremiumStatus(customerInfo);

      Purchases.addCustomerInfoUpdateListener((info) => {
        updatePremiumStatus(info);
      });
    }

    prepare();
    initializePurchases();
  }, [fontsLoaded, fontError, expoPushToken]);

  async function updatePremiumStatus(customerInfo: any) {
    const currentUser = await getUserInfo();
    if (!currentUser) {
      console.log("No logged-in user, skipping premium status update");
      return;
    }
    if (!currentUser) {
      console.log("No logged-in user, skipping premium status update");
      return;
    }

    const isPremium =
      customerInfo?.entitlements.active["Premium"] !== undefined;
    await setUserPremium(isPremium);
    const currentStatus = await getPremiumStatus();
    console.log("Current premium status in Appwrite:", currentStatus);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

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
