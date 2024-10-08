import { Account, Client, Databases, ID, Storage } from "react-native-appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { get } from "http";
import { Query } from "react-native-appwrite";
import { Alert } from "react-native";
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
const API_URL = "https://travelappbackend-c7bj.onrender.com";

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

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
      userID,
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
    alert(`Error: ${(error as Error).message || error}`);
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
      }
    } else if (error.code === 404) {
      console.error("User does not exist, please register");
    } else {
      console.error("Login failed", error);
      alert("Password reset failed");
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
    await account.deleteSession("current");
    await AsyncStorage.removeItem("userSession");
    await AsyncStorage.clear();
  }
};

export const initiatePasswordRecovery = async (email: string) => {
  try {
    const response = await account.createRecovery(
      email,
      "http://www.proxilink.info/reset-password"
    );
    console.log(response);
  } catch (error) {
    console.error(error);
    alert("Password reset failed");
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
    alert("Password reset failed");
  }
};

export const SavePreferences = async (preferences: {
  cuisine: string[];
  entertainment: string[];
  atmosphere: string;
  social_interaction: string;
  activity_level: string;
  time_of_day: string;
  spontaneity: string;
}) => {
  const userId = getUserId();
  const preferencesWithUserId = {
    user_id: userId,
    ...preferences,
  };

  try {
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.preferencesCollectionId,
      ID.unique(),
      preferencesWithUserId
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

//Accounts

export const uploadProfileImage = async (file: {
  uri: string;
  name: string;
  type: string;
  size: number;
}) => {
  try {
    const response = await storage.createFile(
      appwriteConfig.profileImageBucketID,
      ID.unique(),
      file
    );
    return response.$id;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const updateProfileImage = async (fileId: string) => {
  try {
    const imageUrl = storage.getFileView(
      appwriteConfig.profileImageBucketID,
      fileId
    );
    await account.updatePrefs({
      profileImageId: fileId,
      profileImageUrl: imageUrl.href,
    });
  } catch (error) {
    console.error("Error updating profile image preference:", error);
    throw error;
  }
};
export const getUserInfo = async () => {
  try {
    try {
      const userId = await getUserId();
    } catch (error) {
      console.log("No user found");
      return null;
    }
    const userId = await getUserId();

    // Fetch user account information
    const userAccount = await account.get();

    // Fetch additional user information from your database
    // Assuming you have a 'users' collection in your database
    const userData = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    return {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userAccount.email,
      address: userData.address,
      profileImageUrl: userAccount.prefs.profileImageUrl,
      labels: userAccount.labels,
      premium: userData.premium,
      uses: userData.monthly_uses,
      uid: userAccount.$id,
      // Add any other fields you want to return
    };
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

export const RemoveImage = async () => {
  try {
    const userId = await getUserId();
    const userAccount = await account.get();
    if (userAccount.prefs.profileImageId) {
      await storage.deleteFile(
        appwriteConfig.profileImageBucketID,
        userAccount.prefs.profileImageId
      );
    }
    await account.updatePrefs({
      profileImageId: null,
      profileImageUrl: null,
    });
  } catch (error) {
    console.error("Error removing image:", error);
    throw error;
  }
};

export const updateUserName = async (firstName: string, lastName: string) => {
  try {
    await account.updateName(`${firstName} ${lastName}`);
    const userId = await getUserId();
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      {
        firstName: firstName,
        lastName: lastName,
      }
    );
  } catch (error) {
    console.error("Error updating name:", error);
    throw error;
  }
};

export const updateUserPassword = async (
  newPassword: any,
  oldPassword: any
) => {
  try {
    await account.updatePassword(newPassword, oldPassword);
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};

export const addNotificationToken = async (token: string) => {
  try {
    // Check if the token already exists
    const existingTokens = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.notifications,
      [Query.equal("ID", token)]
    );

    if (existingTokens.total > 0) {
      console.log("Token already exists, not adding.");
      return;
    }

    // Add the token if it doesn't exist
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.notifications,
      ID.unique(),
      {
        ID: token,
        user_id: await getUserId(),
      }
    );
  } catch (error) {
    console.error("Error adding notification token:", error);
    throw error;
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const DeleteUser = () => {
  return new Promise((resolve, reject) => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => resolve(false), // Resolve with false instead of rejecting
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const user = await account.get();

              // Delete document
              try {
                await databases.deleteDocument(
                  appwriteConfig.databaseId,
                  appwriteConfig.userCollectionId,
                  user.$id
                );
              } catch (error) {
                console.warn(
                  "Document not found, proceeding with account deletion."
                );
              }

              resolve({ success: true, userId: user.$id });
            } catch (error) {
              console.error("Error during account deletion process:", error);
              reject(error);
            }
          },
        },
      ]
    );
  });
};

export const setUserPremium = async (status: boolean) => {
  try {
    const user = await getUserId();
    if (status === true) {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        user,
        {
          premium: true,
        }
      );
    } else {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        user,
        {
          premium: false,
        }
      );
      // await fetch(`${API_URL}/api/cancel-premium?user_id=${user}`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
    }
  } catch (error) {
    console.error("Error setting user to premium:", error);
    throw error;
  }
};

export const setUses = async (status: boolean) => {
  try {
    const user = await getUserId();
    if (status === true) {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        user,
        {
          monthly_uses: 20,
        }
      );
    }
  } catch (error) {
    console.error("Error setting user to premium:", error);
    throw error;
  }
};

export const getPremiumStatus = async () => {
  try {
    const user = await getUserId();
    const userAccount = await account.get();

    const userData = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user
    );
    if (userData.premium && userAccount.labels.includes("premium")) {
      return true;
    } else {
      return userData.premium;
    }
  } catch (error) {
    console.error("Error fetching premium status:", error);
    throw error;
  }
};

//Get number of calls remaining

export const getNumberofCalls = async () => {
  //1. Get the user ID
  const userId = await getUserId();
  //2: Get the user document, and then the calls remaining
  const user = await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    userId
  );
  //3: Return calls
  return user.monthly_uses;
};

//Decrement Call count function

export const decrementCallCount = async () => {
  //1. Get the user ID
  const userId = await getUserId();
  //2: Get the user document, and then the calls remaining
  const user = await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    userId
  );
  //3: Decrement the calls remaining. if calls remaining is 0, return false. else return true and proceed
  if (user.monthly_uses === 0) {
    return false;
  } else {
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      {
        monthly_uses: user.monthly_uses - 1,
      }
    );
    return true;
  }
};
