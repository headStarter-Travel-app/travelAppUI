import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import AppButton from "@/components/usableOnes/button";
import { CreateUser } from "@/lib/appwrite";
import MediumCard from "@/components/usableOnes/splashPage/mediumCard";
const image1 = require("@/public/date.png");
const SplashPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Splash Page</Text>
      <CardsGallery />
      <Text style={styles.text} className="text-center">
        Your AI Guide for Group Adventures, Dates, and Vacations
      </Text>
      <AppButton
        title="Sign Up With Email"
        onPress={() => {
          // Navigate to the sign up page
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 75, // Adjust this value as needed to position the text at the top
  },
  text: {
    fontFamily: "spaceGroteskBold", // Use the font you loaded
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});

const CardsGallery = () => {
  return (
    <View>
      <Text>Card Gallery</Text>
      <MediumCard
        title="Card Title"
        priceRangeLower={0}
        PriceRangeUpper={100}
        image={require("@/public/date.png")}
      />
    </View>
  );
};

export default SplashPage;
