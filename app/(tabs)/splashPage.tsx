import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import AppButton from "@/components/usableOnes/button";
import { CreateUser } from "@/lib/appwrite";
const SplashPage = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-white text-center">Splash Page</Text>
      <AppButton title="Create User" onPress={CreateUser} />
    </View>
  );
};

export default SplashPage;
