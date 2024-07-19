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
import { CreateUser } from "@/lib/appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setLoading(true);
    if (password === confirmPassword) {
      try {
        const session = await CreateUser(email, password, firstName, lastName);
        if (session && session.$id) {
          await AsyncStorage.setItem("userToken", session.$id);
          Alert.alert("Registration successful");
          setLoading(false);
          router.replace("/(tabs)");
        } else {
          setLoading(false);
        }
      } catch (error: any) {
        console.error("Registration failed:", error);
        Alert.alert("Registration failed. Please try again.");
        setLoading(false);
      }
    } else {
      Alert.alert("Passwords do not match");
      setLoading(false);
    }
  };

  const handleLoginPress = () => {
    setLoading(false);

    router.push("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="gray"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="gray"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="gray"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="gray"
        secureTextEntry={true} // Always hide password
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="gray"
        secureTextEntry={true} // Always hide confirm password
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <AppButton title="Register" onPress={handleRegister} />
      )}
      <Text style={styles.loginText}>
        Already have an account?{" "}
        <Text style={styles.loginTextBold} onPress={handleLoginPress}>
          Login
        </Text>
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
    width: "80%", // Adjusted to fill the container
    borderWidth: 2,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    fontWeight: "bold", // Make text bold
    fontSize: 16, // Slightly larger font for input
  },
  loginText: {
    marginTop: 20,
  },
  loginTextBold: {
    fontWeight: "bold",
  },
});

export default RegisterPage;
