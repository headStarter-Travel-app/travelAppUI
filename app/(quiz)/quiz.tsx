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
import { FinalQuiz } from "@/components/preferencesQuiz/finalQuiz";
import { Learning } from "@/components/preferencesQuiz/learning";
import { getUserId } from "@/lib/appwrite";
import axios from "axios";
enum SocializingOption {
  ENERGETIC = "ENERGETIC",
  RELAXED = "RELAXED",
  BOTH = "BOTH",
}
enum Time {
  MORNING = "MORNING",
  AFTERNOON = "AFTERNOON",
  EVENING = "EVENING",
  NIGHT = "NIGHT",
}
enum Shopping {
  YES = "YES",
  SOMETIME = "SOMETIME",

  NO = "NO",
}

const PreferenceQuiz = () => {
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [entertainment, setEntertainment] = useState<string[]>([]);
  const [sports, setSports] = useState<string[]>([]); //read, write
  const [learning, setLearning] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [canProceed, setCanProceed] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [atmosphere, setAtmosphere] = useState<string[]>([]);
  const [socializing, setSocializing] = useState<SocializingOption>(
    SocializingOption.BOTH
  );
  const [time, setTime] = useState<Time[]>([]);
  const [familyFriendly, setFamilyFriendly] = useState<boolean>(false);
  const [shopping, setShopping] = useState<Shopping>(Shopping.YES);

  const router = useRouter();
  const fetchPreferences = async () => {
    try {
      const userId = await getUserId();
      const response = await axios.get(
        `https://travelappbackend-c7bj.onrender.com/get-preferences?user_id=${userId}`
      );

      if (response.status === 200 && response.data) {
        const preferences = response.data;
        setCuisines(preferences.cuisine || []);
        setEntertainment(preferences.entertainment || []);
        setSports(preferences.sports || []);
        setLearning(preferences.learning || []);
        setAtmosphere(preferences.atmosphere || []);
        setSocializing(preferences.socializing || SocializingOption.BOTH);
        setTime(preferences.Time || []);
        setFamilyFriendly(preferences.family_friendly || false);
        setShopping(preferences.shopping || Shopping.YES);
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
      Alert.alert("Failed to fetch preferences. Using default values.");
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

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
        case 4:
          setCanProceed(learning.length > 0);
          break;
        case 5:
          setCanProceed(atmosphere.length > 0 && time.length > 0);
          break;
        default:
          setCanProceed(false);
      }
    };

    checkProceed();
  }, [
    cuisines,
    entertainment,
    sports,
    learning,
    atmosphere,
    socializing,
    time,
    familyFriendly,
    shopping,
  ]);

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      //await SavePreferences({
      //cuisine: cuisines,
      //entertainment: entertainment,
      //sports: sports,
      //});
      const userId = await getUserId();
      const payload = {
        user_id: userId,
        users: userId,
        cuisine: cuisines,
        atmosphere: atmosphere,
        entertainment: entertainment,
        socializing: socializing,
        Time: time,
        family_friendly: familyFriendly,
        shopping: shopping,
        learning: learning,
        sports: sports,
      };
      const res = await axios.post(
        "https://travelappbackend-c7bj.onrender.com/submit-preferences",
        payload
      );

      if (res.status === 200) {
        // Assuming success is indicated by status 200
        Alert.alert("Preferences saved successfully");
        await fetchPreferences();
        router.replace("/(tabs)");
      } else {
        console.error("Unexpected response status:", res.status);
        Alert.alert("Failed to save preferences. Please try again.");
      }
    } catch (error) {
      console.error("Saving preferences failed:", error);
      Alert.alert("Saving preferences failed. Please try again.");
    } finally {
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
          <Cuisines setCuisines={setCuisines} existingCuisines={cuisines} />
        );
      case 2:
        return (
          <Entertainment
            setEntertainmentOptions={setEntertainment}
            existingEntertainment={entertainment}
          />
        );
      case 3:
        return <Sports setSports={setSports} existingSports={sports} />;
      case 4:
        return (
          <Learning setLearning={setLearning} existingLearning={learning} />
        );
      case 5:
        return (
          <FinalQuiz
            setAtmosphere={setAtmosphere}
            setSocializing={setSocializing}
            setTime={setTime}
            setFamilyFriendly={setFamilyFriendly}
            setShopping={setShopping}
            existingAtmosphere={atmosphere}
            existingSocializing={socializing}
            existingTime={time}
            familyFriendly={familyFriendly}
            existingShopping={shopping}
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
        {page !== 5 ? (
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
          <>
            <AppButton
              title="Submit"
              onPress={handleSavePreferences}
              disabled={!canProceed}
            />
            <AppButton
              title="Back"
              onPress={() => setPage((prev) => prev - 1)}
            />
          </>
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
