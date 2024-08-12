import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const UnderConstruction = () => {
  return (
    <View style={styles.container}>
      <MaterialIcons name="construction" size={80} color="#FFA500" />
      <Text style={styles.title}>Under Construction</Text>
      <Text style={styles.subtitle}>
        We're working hard to create this page.
      </Text>
      <Text style={styles.message}>Please check back soon!</Text>
    </View>
  );
};

export default UnderConstruction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    marginTop: 10,
    color: "#666",
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    marginTop: 20,
    color: "#888",
    textAlign: "center",
  },
});
