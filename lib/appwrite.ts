import { Account, Client, Databases, ID } from "react-native-appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.nnagelia.headstarterProject",
  projectId: "66930c61001b090ab206",
  databaseId: "66930e1000087eb0d4bd",
  userCollectionId: "66930e5900107bc194dc",
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
    const session = await account.createSession(email, password);
    await AsyncStorage.setItem('userSession', JSON.stringify(session));
    return session; // Ensure this returns the session object
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Login User
export const LoginUser = async (email: string, password: string) => {
  try {
    const session = await account.createSession(email, password);
    await AsyncStorage.setItem('userSession', JSON.stringify(session));
    return session; // Ensure this returns the session object
  } catch (error: any) {
    if (error.code === 401) { // Assuming 401 is the error code for invalid credentials
      console.error("Invalid password");
      throw new Error("Invalid password");
    } else if (error.code === 404) { // Assuming 404 is the error code for user not found
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
  const session = await AsyncStorage.getItem('userSession');
  return session !== null;
};

// Logout User
export const LogoutUser = async () => {
  try {
    await account.deleteSession('current');
    await AsyncStorage.removeItem('userSession');
    console.log("Logout successful");
  } catch (error) {
    console.error("Logout failed", error);
    throw error;
  }
};

export const initiatePasswordRecovery = async (email: string) => {
  try {
    const response = await account.createRecovery(email, 'http://localhost:8081/reset-password');
    console.log(response);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const completePasswordRecovery = async (userId: string, secret: string, newPassword: string) => {
  try {
    const response = await account.updateRecovery(userId, secret, newPassword);
    console.log(response);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
