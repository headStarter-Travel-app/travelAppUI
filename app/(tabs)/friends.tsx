import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { debounce } from "lodash";

const API_URL = "https://travelappbackend-c7bj.onrender.com";

const MainScreen = () => {
  const [showFriends, setShowFriends] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);

  const fetchFriends = useCallback(async (userId: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/get-friends?user_id=${userId}`
      );
      setFriends(response.data.friends);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  }, []);

  const debouncedFetchFriends = useRef(
    debounce((userId: string) => {
      fetchFriends(userId);
    }, 300)
  ).current;

  const initializeWebSocket = useCallback(
    (userId: string) => {
      if (!socketRef.current) {
        const socket = io(API_URL, {
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        socket.on("connect", () => {
          console.log("Connected to WebSocket");
          socket.emit("join", { userId });
        });

        socket.on("connect_error", (error) => {
          console.log("Connection error:", error);
        });

        socket.on("friendRequest", (data) => {
          console.log("Received friend request:", data);
          debouncedFetchFriends(userId);
        });

        socket.on("disconnect", () => {
          console.log("Disconnected from WebSocket");
        });

        socketRef.current = socket;
      }
    },
    [debouncedFetchFriends]
  );

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      try {
        const userId = await getUserId();
        setCurrentUserId(userId);
        await fetchFriends(userId);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurrentUserId();
  }, [fetchFriends]);

  useEffect(() => {
    if (currentUserId && !socketRef.current) {
      initializeWebSocket(currentUserId);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [currentUserId, initializeWebSocket]);

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
        <GroupsScreen currentUserId={currentUserId || ""} friends={friends} />
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
