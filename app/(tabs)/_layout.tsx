import { Tabs } from "expo-router";
import React from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { FontAwesome } from "@expo/vector-icons"; // Using FontAwesome for the sparkle icon
import { useRouter } from "expo-router";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const { width } = Dimensions.get("window");

export default function TabLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const onAIClick = () => {
    router.push("/aiScreen");
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarBackground: () => (
            <View style={styles.tabBarBackground}>
              <Svg width={width} height="80" style={styles.svg}>
                <Path
                  d={`M0,80 L0,0 Q${width / 2},-40 ${width},0 L${width},80 Z`}
                  fill="lightblue"
                />
              </Svg>
            </View>
          ),
          tabBarShowLabel: false, // This hides the tab names
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color="black"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="find"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "calendar" : "calendar-outline"}
                color="black"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="friends"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "people" : "people-outline"}
                color="black"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "settings" : "settings-outline"}
                color="black"
              />
            ),
          }}
        />
      </Tabs>
      <TouchableOpacity style={styles.floatingButton} onPress={onAIClick}>
        <TabBarIcon name="sparkles" color="purple" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    elevation: 0,
    borderTopWidth: 0,
  },
  tabBarBackground: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  svg: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  floatingButton: {
    position: "absolute",
    bottom: 50,
    left: width / 2 - 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ADD8E6",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});
