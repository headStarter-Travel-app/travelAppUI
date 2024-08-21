import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Alert,
  View,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  uploadProfileImage,
  updateProfileImage,
  getUserInfo,
  RemoveImage,
  updateUserName,
  updateUserPassword,
  LogoutUser,
} from "@/lib/appwrite";
import { ProfileSelector } from "@/components/settingsPage/ProfileSelector";
import { Ionicons } from "@expo/vector-icons";
import { DeleteUser } from "@/lib/appwrite";
import { useRouter } from "expo-router";
import { Account, Client, Databases, ID, Storage } from "react-native-appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { get } from "http";
import { Query } from "react-native-appwrite";
export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.nnagelia.headstarterProject",
  projectId: "66930c61001b090ab206",
  databaseId: "66930e1000087eb0d4bd",
  userCollectionId: "66930e5900107bc194dc",
  preferencesCollectionId: "6696016b00117bbf6352",
  storageId: "66930ebf003d9d175225",
  profileImageBucketID: "profilePictures",
  notifications: "66abd65b0027a6d279bc",
};
import axios from "axios";
import { log } from "console";
import { LinearGradient } from "expo-linear-gradient";
const API_URL = "https://travelappbackend-c7bj.onrender.com";

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  profileImageUrl: string;
}
export default function TabTwoScreen() {
  const router = useRouter();

  const [userData, setUserData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const data = await getUserInfo();
      setUserData(data);
      setFirstName(data.firstName);
      setLastName(data.lastName);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleUpdateName = async () => {
    try {
      await updateUserName(firstName, lastName);
      Alert.alert("Success", "Name updated successfully");
      await fetchUserData();
    } catch (error) {
      console.error("Error updating name:", error);
      Alert.alert("Error", "Failed to update name");
    }
  };

  const handleUpdatePassword = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    try {
      await updateUserPassword(password, oldPassword);
      Alert.alert("Success", "Password updated successfully");
      setPassword("");
      setConfirmPassword("");
      setOldPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      Alert.alert("Error", "Failed to update password");
    }
  };
  const handleLogout = async () => {
    try {
      await LogoutUser();
      Alert.alert("Logout successful");
      router.replace("/introPage");
    } catch (error: any) {
      console.error("Logout failed:", error);
      Alert.alert("Logout failed. Please try again.");
      router.replace("/introPage");
      await account.deleteSession("current");
      await AsyncStorage.removeItem("userSession");
      await AsyncStorage.clear();
    }
  };
  const handleDeleteAccount = async () => {
    try {
      const result: any = await DeleteUser();

      if (result && result.success) {
        await AsyncStorage.clear();
        router.replace("/introPage");

        try {
          await axios.delete(
            `${API_URL}/deleteAccount?user_id=${result.userId}`
          );
          console.log("Server-side account deletion successful");
        } catch (error) {
          console.error("Error in server-side account deletion:", error);
        }

        // Show success message after everything is done
        Alert.alert("Account deleted successfully");
      }
      // If result is false, it means the user cancelled, so we do nothing
    } catch (error: any) {
      console.error("Account deletion failed:", error);
      Alert.alert("Account deletion failed. Please try again.");
    }
  };

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
      <PremiumBanner />
      <ProfileSelector userData={userData} refreshUserData={fetchUserData} />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter first name"
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Enter last name"
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdateName}>
          <Text style={styles.buttonText}>Update Name</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Old Password</Text>
        <TextInput
          style={styles.input}
          value={oldPassword}
          onChangeText={setOldPassword}
          placeholder="Enter new password"
          secureTextEntry
        />

        <Text style={styles.label}> New Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Confirm new password"
          secureTextEntry
        />
        <Text style={styles.label}>Confirm New Password</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm new password"
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
          <Text style={styles.buttonText}>Update Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
          <Text style={styles.buttonText}>Plans Page</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={{ flexDirection: "row" }}>
            <Ionicons
              name="log-out-outline"
              size={24}
              color="black"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.label}>Logout</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="trash-outline"
              size={24}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const PremiumBanner = () => {
  const router = useRouter();
  const handleBuyPremium = () => {
    router.push("/premium");
  };
  return (
    <View style={styles.banner}>
      <LinearGradient
        style={styles.bannerGradient}
        colors={["#8A94FF", "#0073C5"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <Text style={styles.bannerText}>Get Premium</Text>
      <TouchableOpacity style={styles.planButton} onPress={handleBuyPremium}>
        <Text style={styles.planLabel}>Buy Premium</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 90,
    position: "relative",
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
    marginTop: 10,
    paddingTop: 50,
    marginBottom: 0,
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

  inputContainer: {
    width: "100%",
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "DM Sans",
  },
  input: {
    width: "100%",
    borderWidth: 2,
    borderColor: "gray",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "DM Sans",
  },
  button: {
    backgroundColor: "#8A94FF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    borderColor: "black",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "DM Sans",
  },
  logoutButton: {
    backgroundColor: "#FF6B6B", // A different color to distinguish it
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    borderColor: "black",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deleteButton: {
    backgroundColor: "#DC3545",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    borderColor: "#9A2A2A",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "DM Sans",
  },
  banner: {
    position: "relative",
    width: "100%",
    height: 48,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  bannerGradient: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    height: "100%",
  },
  bannerText: {
    color: "#fff",
  },
  planLabel: {
    color: "#000",
  },
  planButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 128,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
  },
});
