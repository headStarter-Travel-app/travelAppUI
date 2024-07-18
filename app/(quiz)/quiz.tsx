import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SavePreferences } from "@/lib/appwrite";

import AppButton from "@/components/usableOnes/button";
import { useRouter } from "expo-router";

const PreferenceQuiz = () => {
  const [cuisine, setCuisine] = useState<string[]>([]);
  const [entertainment, setEntertainment] = useState<string[]>([]);
  const [atmosphere, setAtmosphere] = useState<string>("");
  const [socialInteraction, setSocialInteraction] = useState<string>("");
  const [activityLevel, setActivityLevel] = useState<string>("");
  const [timeOfDay, setTimeOfDay] = useState<string>("");
  const [spontaneity, setSpontaneity] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      await SavePreferences({
        cuisine,
        entertainment,
        atmosphere,
        social_interaction: socialInteraction,
        activity_level: activityLevel,
        time_of_day: timeOfDay,
        spontaneity,
      });
      Alert.alert("Preferences saved successfully");
      setLoading(false);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Saving preferences failed:", error);
      Alert.alert("Saving preferences failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preference Quiz</Text>

      <Text style={styles.label}>Cuisine Preferences</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Italian, Japanese"
        value={cuisine.join(", ")}
        onChangeText={(text) => setCuisine(text.split(", "))}
      />

      <Text style={styles.label}>Entertainment Preferences</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Movies, Live music"
        value={entertainment.join(", ")}
        onChangeText={(text) => setEntertainment(text.split(", "))}
      />

      <Text style={styles.label}>Atmosphere Preferences</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., I prefer quieter, more relaxed spots."
        value={atmosphere}
        onChangeText={setAtmosphere}
      />

      <Text style={styles.label}>Social Interaction</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., I prefer intimate gatherings with close friends."
        value={socialInteraction}
        onChangeText={setSocialInteraction}
      />

      <Text style={styles.label}>Activity Level</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., I enjoy both energetic and relaxed activities equally."
        value={activityLevel}
        onChangeText={setActivityLevel}
      />

      <Text style={styles.label}>Time of Day</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Evening"
        value={timeOfDay}
        onChangeText={setTimeOfDay}
      />

      <Text style={styles.label}>Spontaneity</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., I enjoy a mix of both spontaneity and planned activities."
        value={spontaneity}
        onChangeText={setSpontaneity}
      />

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <AppButton title="Save Preferences" />
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
