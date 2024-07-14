import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import AppButton from "@/components/usableOnes/button";
import { CreateUser } from "@/lib/appwrite";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (password === confirmPassword) {
      CreateUser(email, password, firstName, lastName);
    } else {
      alert("Passwords do not match");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true} // Always hide password
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry={true} // Always hide confirm password
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <AppButton title="Register" onPress={handleRegister} />
      <Text style={styles.loginText}>
        Already have an account? <Text style={styles.loginTextBold}>Login</Text>
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
    width: "50%", // Adjusted to fill the container
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
