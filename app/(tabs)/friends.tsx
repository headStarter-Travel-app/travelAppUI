import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { getUserId } from "@/lib/appwrite";
import GroupsScreen from "@/components/friendsPage/groupsScreen";
import FriendsScreen from "@/components/friendsPage/friendsScreen";

const API_URL = "https://travelappbackend-c7bj.onrender.com";

const MainScreen = () => {
  const [showFriends, setShowFriends] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      try {
        const userId = await getUserId();
        setCurrentUserId(userId);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurrentUserId();
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.friendsIcon}
        onPress={() => setShowFriends(!showFriends)}
      >
        <Ionicons
          name={showFriends ? "people" : "people-outline"}
          size={30}
          color="#000"
        />
      </TouchableOpacity>
      {showFriends ? (
        <FriendsScreen />
      ) : (
        <></>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F7FF",
    marginTop: 50,
  },
  friendsIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MainScreen;
