import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Alert, ActivityIndicator } from "react-native";

import AppButton from "@/components/usableOnes/button";
import { useRouter } from "expo-router";
import { SavePreferences } from "@/lib/appwrite"; // Assume this function is implemented

const PreferenceQuiz = () => {
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState(0);
  const [cuisine, setCuisine] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      await SavePreferences(location, budget, cuisine);
      Alert.alert("Preferences saved successfully");
      setLoading(false);
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Saving preferences failed:", error);
      Alert.alert("Saving preferences failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preference Quiz</Text>

      <Text style={styles.label}>Preferred Location</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., New York, Tokyo"
        value={location}
        onChangeText={setLocation}
      />

      <Text style={styles.label}>Budget</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 1000"
        value={budget.toString()}
        onChangeText={(text) => setBudget(Number(text))}
        keyboardType="numeric"
      />

      

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <AppButton title="Save Preferences" onPress={handleSavePreferences} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    width: "80%",
    borderWidth: 2,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    fontSize: 16,
  },
});

export default PreferenceQuiz;