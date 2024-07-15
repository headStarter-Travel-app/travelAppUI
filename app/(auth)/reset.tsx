import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import AppButton from "@/components/usableOnes/button";
import { completePasswordRecovery } from "@/lib/appwrite"; // Import the function
import { useLocalSearchParams } from "expo-router";
import { Link, useRouter } from "expo-router";
const ResetPasswordPage = () => {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useLocalSearchParams();
  const userId = searchParams.userId as string;
  const secret = searchParams.secret as string;
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleResetPassword = async () => {
    setLoading(true);
    if (!newPassword) {
      Alert.alert("Error", "Password is required.");
      return;
    }
    if (!validatePassword(newPassword)) {
      Alert.alert("Error", "Password must be at least 8 characters long.");
      return;
    }
    try {
      await completePasswordRecovery(
        userId as string,
        secret as string,
        newPassword
      );
      router.replace("/login");
      setLoading(false);
    } catch (error: any) {
      alert("Password reset failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry={true}
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        secureTextEntry={true}
        value={newPasswordConfirm}
        onChangeText={setNewPasswordConfirm}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <AppButton title="Reset Password" onPress={handleResetPassword} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    width: "50%",
    borderWidth: 2,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ResetPasswordPage;
