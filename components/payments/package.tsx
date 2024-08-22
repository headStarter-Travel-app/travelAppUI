import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface PackagesProps {
  index: number;
  pkg: any;
  selectedPackage: any;
  handlePackageSelect: any;
}

const Packages: React.FC<PackagesProps> = ({
  index,
  pkg,
  selectedPackage,
  handlePackageSelect,
}) => {
  // Function to render feature items
  const renderFeatureItem = (text: string) => (
    <View style={styles.featureItem}>
      <Ionicons name="checkmark-circle-outline" size={20} color="#6a11cb" />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );

  return (
    <TouchableOpacity
      key={index}
      onPress={() => handlePackageSelect(pkg)}
      style={styles.planBoxWrapper}
    >
      <LinearGradient
        colors={
          selectedPackage === pkg
            ? ["#6a11cb", "#2575fc"]
            : ["#e0e0e0", "#e0e0e0"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBorder}
      >
        <View
          style={[
            styles.planBox,
            selectedPackage === pkg && styles.selectedPlanBox,
          ]}
        >
          <View style={styles.bannerContainer}>
            <LinearGradient
              colors={["#6a11cb", "#2575fc"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.banner}
            >
              <Text style={styles.title}>{pkg.product.title}</Text>
            </LinearGradient>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.checkboxContainer}>
              <View style={styles.checkbox}>
                {selectedPackage === pkg && (
                  <Ionicons name="checkmark" size={20} color="#6a11cb" />
                )}
              </View>
            </View>
            <Text style={styles.price}>
              {pkg.product.priceString} /
              {pkg.product.subscriptionPeriod === "P1M"
                ? "Mo"
                : pkg.product.subscriptionPeriod === "P1Y"
                ? "Yr"
                : ""}
            </Text>
            <View style={styles.featuresContainer}>
              {renderFeatureItem("20 AI Calls per Month (Increase from 5)")}
              {renderFeatureItem("Access to make itineraries")}
              {renderFeatureItem("First Look at brand new Features")}
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  planBoxWrapper: {
    marginBottom: 20,
  },
  gradientBorder: {
    borderRadius: 15,
    padding: 3,
    overflow: "hidden",
  },
  planBox: {
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  selectedPlanBox: {
    backgroundColor: "#F0F8FF",
  },
  bannerContainer: {
    overflow: "hidden",
  },
  banner: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    padding: 20,
    backgroundColor: "#f8f8ff",
  },
  checkboxContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#6a11cb",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  price: {
    fontFamily: "DMSans-Bold",
    fontSize: 18,
    color: "#333",
    marginBottom: 15,
  },
  featuresContainer: {
    marginTop: 10,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureText: {
    fontFamily: "DMSans-Regular",
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
  },
});

export default Packages;
