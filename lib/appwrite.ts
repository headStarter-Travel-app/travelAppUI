import { Account, Client, Databases, ID } from "react-native-appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { get } from "http";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.nnagelia.headstarterProject",
  projectId: "66930c61001b090ab206",
  databaseId: "66930e1000087eb0d4bd",
  userCollectionId: "66930e5900107bc194dc",
  preferencesCollectionId: "6696016b00117bbf6352",
  storageId: "66930ebf003d9d175225",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);
const databases = new Databases(client);

// Register User
export const CreateUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  const userID = ID.unique();
  const name = `${firstName} ${lastName}`;
  try {
    const response = await account.create(userID, email, password, name);
    console.log("Successfully created account");
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        uid: userID,
        email: email,
        firstName: firstName,
        lastName: lastName,
      }
    );
    console.log("Successfully created user document");
    const session = await account.createEmailPasswordSession(email, password);
    await AsyncStorage.setItem("userSession", JSON.stringify(session));
    return session; // Ensure this returns the session object
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Login User
export const LoginUser = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    await AsyncStorage.setItem("userSession", JSON.stringify(session));
    return session; // Ensure this returns the session object
  } catch (error: any) {
    // Enhanced logging for debugging
    console.error("Login failed with error:", error);
    console.error("Error details:", error.response); // Log additional details if available
    alert(error.message);

    // Handling different error codes
    if (error.code === 401) {
      if (error.type === "user_session_already_exists") {
        console.error("Session already exists");
        const existingSession = await AsyncStorage.getItem("userSession");
        return existingSession;
      } else {
        console.error("Invalid password");
        throw new Error("Invalid password");
      }
    } else if (error.code === 404) {
      console.error("User does not exist, please register");
      throw new Error("User does not exist, please register");
    } else {
      console.error("Login failed", error);
      throw error;
    }
  }
};

// Check if user is logged in
export const isLoggedIn = async () => {
  const session = await AsyncStorage.getItem("userSession");
  return session !== null;
};

// Logout User
export const LogoutUser = async () => {
  try {
    await account.deleteSession("current");
    await AsyncStorage.removeItem("userSession");
    await AsyncStorage.clear();
    console.log("Logout successful");
  } catch (error) {
    console.error("Logout failed", error);
    throw error;
  }
};

export const initiatePasswordRecovery = async (email: string) => {
  try {
    const response = await account.createRecovery(
      email,
      "http://localhost:8081/reset"
    );
    console.log(response);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const completePasswordRecovery = async (
  userId: string,
  secret: string,
  newPassword: string
) => {
  try {
    const response = await account.updateRecovery(userId, secret, newPassword);
    alert("Password reset successfully");
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const SavePreferences = async (location: string, budget: number, cuisine: string) => {
  const userId = getUserId();
  const preferences = {
    user_id: userId,
    cuisine: cuisine,
    budget: budget,
    location: location,
  };

  try {
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.preferencesCollectionId,
      ID.unique(),
      preferences
    );
    console.log("Preferences saved successfully");
  } catch (error) {
    console.error("Error saving preferences:", error);
    throw error;
  }
};

export const getUserId = async () => {
  const result = await account.get();
  return result.$id;
};


