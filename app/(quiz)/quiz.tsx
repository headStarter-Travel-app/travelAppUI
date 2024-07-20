import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SavePreferences } from "@/lib/appwrite";
import AppButton from "@/components/usableOnes/button";
import { useRouter } from "expo-router";
import { Cuisines } from "@/components/preferencesQuiz/cuisines";
import { Ionicons } from "@expo/vector-icons";
import { Entertainment } from "@/components/preferencesQuiz/entertainment";
import { Sports } from "@/components/preferencesQuiz/sports";
const PreferenceQuiz = () => {
  const [cuisines, setCuisines] = useState<Array<string>>([]);
  const [entertainment, setEntertainment] = useState<Array<string>>([]);
  const [sports, setSports] = useState<Array<string>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [page, setPage] = useState(1);
  //Set cuisines to a get request to get the cuisines from the database
  const handleSavePreferences = async () => {
    console.log("Pressed");
    // setLoading(true);
    // try {
    //   await SavePreferences({
    //     cuisine,
    //     entertainment,
    //     atmosphere,
    //     social_interaction: socialInteraction,
    //     activity_level: activityLevel,
    //     time_of_day: timeOfDay,
    //     spontaneity,
    //   });
    //   Alert.alert("Preferences saved successfully");
    //   setLoading(false);
    //   router.replace("/(tabs)");
    // } catch (error) {
    //   console.error("Saving preferences failed:", error);
    //   Alert.alert("Saving preferences failed. Please try again.");
    //   setLoading(false);
  };

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    console.log("Cuisines", cuisines);
  }, [cuisines]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preferences Quiz</Text>
      </View>
      <View style={styles.container}>
        {page == 1 ? (
          <Cuisines setCuisines={setCuisines} existingCuisines={cuisines} />
        ) : page == 2 ? (
          <Entertainment
            setEntertainmentOptions={setEntertainment}
            existingEntertainment={entertainment}
          />
        ) : page == 3 ? (
          <Sports setSports={setSports} existingSports={sports} />
        ) : page == 4 ? (
          <Entertainment
            setEntertainmentOptions={setEntertainment}
            existingEntertainment={entertainment}
          />
        ) : null}
        {page != 9 ? (
          <>
            {/* <View style={{ flex: 1, flexDirection: "row" }}> */}
            <AppButton
              title="Next"
              onPress={() => setPage((prev) => prev + 1)}
            />
            <AppButton
              title="Back"
              onPress={() => setPage((prev) => prev - 1)}
              disabled={page == 1}
            />
            {/* </View> */}
          </>
        ) : (
          <AppButton title="Save Preferences" onPress={handleSavePreferences} />
        )}
        {loading && <ActivityIndicator size="large" color="#007AFF" />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    fontFamily: "DM Sans",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    fontFamily: "DM Sans",
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    fontFamily: "DM Sans",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    borderWidth: 2,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    fontSize: 16,
  },
});

export default PreferenceQuiz;
