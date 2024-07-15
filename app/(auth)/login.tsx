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
import { LoginUser, initiatePasswordRecovery } from "@/lib/appwrite"; // Assuming you have a login function in your appwrite library
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Link, useRouter } from "expo-router";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleLogin = async () => {
    setLoading(true);
    if (!email || !password) {
      Alert.alert("Error", "All fields are required.");
      setLoading(false);
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("Error", "Invalid email format.");
      setLoading(false);

      return;
    }
    if (!validatePassword(password)) {
      Alert.alert("Error", "Password must be at least 8 characters long.");
      setLoading(false);

      return;
    }
    try {
      const session = await LoginUser(email, password);
      if (session && session.$id) {
        await AsyncStorage.setItem("userSession", session.$id);
        Alert.alert("Login successful");
        setLoading(false);
        router.replace("/(tabs)");
      } else {
        throw new Error("Invalid session object");
      }
    } catch (error: any) {
      if (error.message.includes("Session already exists")) {
        Alert.alert(
          "Error",
          "Session already exists, You are already logged in."
        );
        setLoading(false);
        router.replace("/(tabs)");
      } else {
        Alert.alert("Login failed", error.message);
        setLoading(false);
      }
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Email is required.");
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("Error", "Invalid email format.");
      return;
    }
    try {
      await initiatePasswordRecovery(email);
      Alert.alert("Reset password email sent successfully");
    } catch (error: any) {
      Alert.alert("Reset password failed. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Email is required.");
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("Error", "Invalid email format.");
      return;
    }
    try {
      await initiatePasswordRecovery(email);
      Alert.alert("Reset password email sent successfully");
    } catch (error: any) {
      Alert.alert("Reset password failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />

      <AppButton title="Login" onPress={handleLogin} />
      <View style={{ height: 10 }} />
      <AppButton title="Forgot Password" onPress={handleResetPassword} />
      <Text style={styles.registerText}>
        Don't have an account?{" "}
        <Link href="/register" asChild>
          <Text style={styles.registerTextBold}>Register</Text>
        </Link>
      </Text>
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
  registerText: {
    marginTop: 20,
  },
  registerTextBold: {
    fontWeight: "bold",
  },
});

export default LoginPage;
