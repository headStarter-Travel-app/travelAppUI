import { Account, Client, ID } from "react-native-appwrite"



export const appwriteConfig = {
  endpoint: process.env.APPWRITE_ENDPOINT!,
  platform: process.env.APPWRITE_PLATFORM!,
  projectId: process.env.APPWRITE_PROJECT_ID!,
  databaseId: process.env.APPWRITE_DATABASE_ID!,
  userCollectionId: process.env.APPWRITE_USER_COLLECTION_ID!,
  storageId: process.env.APPWRITE_STORAGE_ID!,
};
// Init your React Native SDK
const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);

// Register User
export const CreateUser = () => {
  account.create(ID.unique(), "ahmadbasyouni2004@gmail.com", "pasdadsword", "ddfeegwgdd").then(
    function (response) {
      console.log(response);
    },
    function (error) {
      console.log(error);
    }
  );
};

