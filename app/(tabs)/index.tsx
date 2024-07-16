import React from "react";
import {
  StyleSheet,
  Alert,
  View,
  Button,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import MapView from "react-native-maps";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { LogoutUser } from "@/lib/appwrite";
import { useRouter } from "expo-router";

const quizIcon = require("@/assets/images/questionn.svg");

export default function App() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await LogoutUser();
      Alert.alert("Logout successful");
      router.replace("/(auth)/login");
    } catch (error: any) {
      console.error("Logout failed:", error);
      Alert.alert("Logout failed. Please try again.");
    }
  };

  const handleQuizPress = () => {
    router.push("/quiz");
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Create a new party..."
          placeholderTextColor="#000"
        />
      </View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={handleQuizPress}>
          <ThemedView style={styles.card}>
            <Image source={quizIcon} style={styles.icon} />
            <View style={styles.textContainer}>
              <ThemedText type="subtitle" style={styles.title}>
                Preference Quiz
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Help us learn more about you
              </ThemedText>
            </View>
          </ThemedView>
        </TouchableOpacity>
      </View>
      <View>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F7FF", // Very light blue background
    marginTop: 50, // Move everything down by 50 pixels
  },
  searchContainer: {
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    borderColor: "#000", // Dark border
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    height: 40,
    fontSize: 18,
    fontWeight: "bold", // Bold text
    color: "#000",
  },
  map: {
    flex: 1,
    marginTop: 0, // No margin at the top
    height: "60%", // Reduce the height to leave space for the card
  },
  buttonsContainer: {
    padding: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 20, // Increase padding for larger text
    backgroundColor: "#E6F7FF", // Light blue background similar to the page
    borderRadius: 5,
    borderColor: "#000", // Dark border similar to the search container
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
  },
});
