import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { SavePreferences } from "@/lib/appwrite";
import AppButton from "@/components/usableOnes/button";
import { useRouter } from "expo-router";
import { Cuisines } from "@/components/preferencesQuiz/cuisines";
import { Entertainment } from "@/components/preferencesQuiz/entertainment";
import { Sports } from "@/components/preferencesQuiz/sports";
import { Ionicons } from "@expo/vector-icons";

const PreferenceQuiz = () => {
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [entertainment, setEntertainment] = useState<string[]>([]);
  const [sports, setSports] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [canProceed, setCanProceed] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const router = useRouter();

  useEffect(() => {
    const checkProceed = () => {
      switch (page) {
        case 1:
          setCanProceed(cuisines.length > 0);
          break;
        case 2:
          setCanProceed(entertainment.length > 0);
          break;
        case 3:
          setCanProceed(sports.length > 0);
          break;
        default:
          setCanProceed(false);
      }
    };

    checkProceed();
  }, [cuisines, entertainment, sports, page]);

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      //await SavePreferences({
        //cuisine: cuisines,
        //entertainment: entertainment,
        //sports: sports,
      //});
      Alert.alert("Preferences saved successfully");
      setLoading(false);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Saving preferences failed:", error);
      Alert.alert("Saving preferences failed. Please try again.");
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const renderPageContent = () => {
    switch (page) {
      case 1:
        return (
          <Cuisines
            setCuisines={setCuisines}
            existingCuisines={cuisines}
          />
        );
      case 2:
        return (
          <Entertainment
            setEntertainmentOptions={setEntertainment}
            existingEntertainment={entertainment}
          />
        );
      case 3:
        return (
          <Sports
            setSports={setSports}
            existingSports={sports}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preferences Quiz</Text>
      </View>
      <View style={styles.container}>
        {renderPageContent()}
        {page !== 3 ? (
          <>
            <AppButton
              title="Next"
              onPress={() => setPage((prev) => prev + 1)}
              disabled={!canProceed}
            />
            <AppButton
              title="Back"
              onPress={() => setPage((prev) => prev - 1)}
              disabled={page === 1}
            />
          </>
        ) : (
          <AppButton
            title="Submit"
            onPress={handleSavePreferences}
            disabled={!canProceed}
          />
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
  container: {
    flex: 1,
    alignItems: "center",
  },
});

export default PreferenceQuiz;