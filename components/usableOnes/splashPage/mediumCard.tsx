import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const priceTagImage = require("@/assets/public/splashImages/priceTag.png");

interface CardProps {
  title: string;
  priceRangeLower: number;
  priceRangeUpper: number;
  image: any;
}

const Card: React.FC<CardProps> = ({
  title,
  priceRangeLower,
  priceRangeUpper,
  image,
}) => {
  const priceRange = getPriceRange(priceRangeLower, priceRangeUpper);

  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />
      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.7)"]}
        style={styles.gradient}
      >
        <Text style={styles.title}>{title}</Text>
        <View style={styles.priceContainer}>
          <Image source={priceTagImage} style={styles.priceTag} />
          <Text style={styles.priceText}>{priceRange}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const getPriceRange = (lower: number, upper: number) => {
  const getPriceSymbol = (value: number) => "$".repeat(Math.min(value, 3));
  return `${getPriceSymbol(lower)}-${getPriceSymbol(upper)}`;
};

const styles = StyleSheet.create({
  card: {
    width: 300,
    height: 200,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
    justifyContent: "flex-end",
    padding: 15,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceTag: {
    height: 15,
    width: 15,
    marginRight: 5,
    tintColor: "#fff",
  },
  priceText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default Card;
