import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import AppButton from "@/components/usableOnes/button";
import { CreateUser } from "@/lib/appwrite";
import MediumCard from "@/components/usableOnes/splashPage/mediumCard";
import { SmallCard } from "@/components/usableOnes/splashPage/mediumCard";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Link, useRouter } from "expo-router";

const IntroPage = () => {
  const router = useRouter();

  const handleSignUp = () => {
    // Here you would typically handle the sign-up process
    // For now, we'll just navigate to the tabs
    router.push("/register");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text}>ProxiLink </Text>
      <CardsGallery />
      <Text style={[styles.text, styles.subtitle]}>
        Your AI Guide for Group Adventures, Dates, and Vacations
      </Text>
      <AppButton title="Sign Up With Email" onPress={handleSignUp} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 75, // Adjust this value as needed to position the text at the top
    paddingHorizontal: 20,
  },
  text: {
    fontFamily: "spaceGroteskBold", // Use the font you loaded
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    marginVertical: 20,
  },
  galleryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  leftColumn: {
    flex: 1.7,
  },
  rightColumn: {
    flex: 1,
  },
  cardSpacing: {
    marginBottom: 12, // Add space between elements
  },
});

const CardsGallery = () => {
  return (
    <View style={styles.galleryContainer}>
      <View style={styles.leftColumn}>
        <View style={styles.cardSpacing}>
          <MediumCard
            title="Unwind at Local Bars Near You!"
            priceRangeLower={2}
            priceRangeUpper={3}
            image={require("@/public/date.png")}
          />
        </View>
        <View style={styles.cardSpacing}>
          <MediumCard
            title="Find Theatres Near You!"
            priceRangeLower={0}
            priceRangeUpper={100}
            image={require("@/public/Theatres.png")}
          />
        </View>
      </View>
      <View style={styles.rightColumn}>
        <View style={styles.cardSpacing}>
          <SmallCard
            title="Explore Nearby Parks!"
            priceRangeLower={1}
            priceRangeUpper={2}
            image={require("@/public/parks.png")}
          />
        </View>
        <View style={styles.cardSpacing}>
          <SmallCard
            title="Discover Events!"
            priceRangeLower={2}
            priceRangeUpper={3}
            image={require("@/public/golf.png")}
          />
        </View>
        <View style={styles.cardSpacing}>
          <SmallCard
            title="Explore Restaurants!"
            priceRangeLower={1}
            priceRangeUpper={2}
            image={require("@/public/dining.png")}
          />
        </View>
      </View>
    </View>
  );
};

export default IntroPage;
