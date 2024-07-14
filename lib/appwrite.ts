import { Account, Client, Databases, ID } from "react-native-appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.nnagelia.headstarterProject",
  projectId: "66930c61001b090ab206",
  databaseId: "66930e1000087eb0d4bd",
  userCollectionId: "66930e5900107bc194dc",
  storageId: "66930ebf003d9d175225",
};
const router = useRouter();

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

export const account = new Account(client);
export const databases = new Databases(client);

// Register User
export const CreateUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  const userID = ID.unique();
  console.log("Creating account for user", userID);
  const name = `${firstName} ${lastName}`;

  try {
    // Check if there is an existing session
    const existingSession = await AsyncStorage.getItem("userSession");

    if (existingSession) {
      console.log("Session already exists:", existingSession);
      return JSON.parse(existingSession);
    }

    // Create a new user account
    const response = await account.create(userID, email, password, name);
    console.log("Successfully created account");

    // Create a new user document in the database
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

    // Log the user in and create a session
    const session = await account.createEmailPasswordSession(email, password);
    await AsyncStorage.setItem("userSession", JSON.stringify(session));
    await AsyncStorage.setItem("userToken", session.$id);
    return session; // Return the session object
  } catch (error: any) {
    console.log(error);
    if (error.code === 401 && error.type === "user_session_already_exists") {
      const existingSession = await AsyncStorage.getItem("userSession");

      return existingSession;
    }
    return error.message;
  }
};

export const LoginUser = async (email: string, password: string) => {
  try {
    // Check if there is an existing session
    const existingSession = await AsyncStorage.getItem("userSession");

    if (existingSession) {
      console.log("Session already exists:", existingSession);
      return JSON.parse(existingSession);
    }

    // Attempt to create a session with email and password
    const session = await account.createEmailPasswordSession(email, password);
    // Store session in AsyncStorage
    await AsyncStorage.setItem("userSession", JSON.stringify(session));
    // Return the session object
    return session;
  } catch (error: any) {
    // Enhanced logging for debugging
    console.error("Login failed with error:", error);
    console.error("Error details:", error.response); // Log additional details if available

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

// Logout User
export const LogoutUser = async () => {
  try {
    await account.deleteSession("current");
    await AsyncStorage.removeItem("userSession");
    console.log("Logout successful");
  } catch (error) {
    console.error("Logout failed", error);
    throw error;
  }
};
