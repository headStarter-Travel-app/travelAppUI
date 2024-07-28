import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { getUserId } from "@/lib/appwrite";
import { io, Socket } from "socket.io-client";
import GroupsScreen from "@/components/friendsPage/groupsScreen";
import FriendsScreen from "@/components/friendsPage/friendsScreen";

const API_URL = "https://travelappbackend-c7bj.onrender.com";

const MainScreen = () => {
  const [showFriends, setShowFriends] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null); // Use useRef to hold the socket instance

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      try {
        const userId = await getUserId();
        setCurrentUserId(userId);
        await fetchFriends(userId);
        initializeWebSocket(userId);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurrentUserId();
  }, []);

  const fetchFriends = async (userId: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/get-friends?user_id=${userId}`
      );
      setFriends(response.data.friends);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const initializeWebSocket = (userId: string) => {
    if (!socketRef.current) {
      const socket = io(API_URL);

      socket.on("connect", () => {
        console.log("Connected to WebSocket");
        socket.emit("join", { userId });
      });

      socket.on("friendRequest", (data) => {
        console.log("Received friend request:", data);
        fetchFriends(userId);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from WebSocket");
      });

      socketRef.current = socket;
    }
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
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
        <GroupsScreen currentUserId={currentUserId || ''} friends={friends} />
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