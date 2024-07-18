import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  Alert,
  View,
  Button,
  TextInput,
  Image,
  ScrollView,
  Platform,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import {
  uploadProfileImage,
  updateProfileImage,
  getUserInfo,
  RemoveImage,
} from "@/lib/appwrite";
import { ProfileSelector } from "@/components/settingsPage/ProfileSelector";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  profileImageUrl: string;
}

export default function TabTwoScreen() {
  const [userData, setUserData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const data = await getUserInfo();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    console.log("feched");
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8A94FF" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Account Information</Text>
      <ProfileSelector userData={userData} refreshUserData={fetchUserData} />
      <View
        style={{ height: 1, backgroundColor: "lightgrey", marginVertical: 20 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
    fontFamily: "DM Sans",
  },
  headerText: {
    fontSize: 28,
    textAlign: "center",
    marginTop: 20,
    paddingTop: 50,
    fontFamily: "DM Sans",
  },
  profileText: {
    fontFamily: "DM Sans",
    fontSize: 24,
    paddingLeft: 50,
    marginTop: 20,
  },
  imageStyleContainer: {
    flex: 1,
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  ChangeImageButton: {
    backgroundColor: "#8A94FF",
    width: 80,
    height: 40,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  changeImageText: {
    color: "black",
    textAlign: "center",
    justifyContent: "center",
    fontFamily: "DM Sans",
  },
  RemoveButton: {
    marginTop: 15,
    backgroundColor: "#E8EAFF",
    width: 80,
    height: 40,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  circularImageContainer: {
    width: 80,
    height: 80,
    marginRight: 10,
    marginLeft: 50,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  circularImage: {
    width: 120,
    height: 120,
    borderRadius: 40,
  },
});
