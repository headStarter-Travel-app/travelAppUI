import React, { useState } from "react";
import {
  StyleSheet,
  Alert,
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import {
  uploadProfileImage,
  updateProfileImage,
  RemoveImage,
} from "@/lib/appwrite";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  profileImageUrl: string;
}

export const ProfileSelector = ({
  userData,
  refreshUserData,
}: {
  userData: ProfileData | null;
  refreshUserData: () => Promise<void>;
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setIsUploading(true);
        const selectedAsset = result.assets[0];

        const file = {
          uri: selectedAsset.uri,
          name: selectedAsset.uri.split("/").pop() || "image.jpg",
          type: `image/${selectedAsset.uri.split(".").pop()}`,
          size: await FileSystem.getInfoAsync(selectedAsset.uri).then(
            (fileInfo: any) => fileInfo.size
          ),
        };

        const fileId = await uploadProfileImage(file);
        await updateProfileImage(fileId);
        Alert.alert("Success", "Profile image updated successfully");

        // Refresh user data after successful upload
        await refreshUserData();
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
      Alert.alert("Error", "Failed to update profile image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setIsUploading(true);
      await RemoveImage();
      Alert.alert("Success", "Profile image removed successfully");
      await refreshUserData();
    } catch (error) {
      console.error("Error removing profile image:", error);
      Alert.alert("Error", "Failed to remove profile image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View>
      <Text style={styles.profileText}>Profile</Text>
      <View style={styles.imageStyleContainer}>
        <View style={styles.circularImageContainer}>
          {isUploading ? (
            <View style={[styles.circularImage, styles.loadingContainer]}>
              <ActivityIndicator size="large" color="#8A94FF" />
            </View>
          ) : (
            <Image
              source={
                userData?.profileImageUrl
                  ? { uri: userData.profileImageUrl }
                  : require("@/public/utilities/profileImage.png")
              }
              style={styles.circularImage}
            />
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={pickImage}
              style={styles.ChangeImageButton}
              disabled={isUploading}
            >
              <Text style={styles.changeImageText}>Change</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleRemoveImage}
              style={styles.RemoveButton}
              disabled={isUploading}
            >
              <Text style={styles.changeImageText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingVertical: 5,
    marginLeft: 30,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
});
