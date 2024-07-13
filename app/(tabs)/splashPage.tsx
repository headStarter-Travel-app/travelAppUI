import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { CreateUser } from "@/lib/appwrite";
const SplashPage = () => {
  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Text className="text-white text-center">Splash Page</Text>
      <Button title="Create User" onPress={CreateUser} />
    </View>
  );
};

export default SplashPage;
