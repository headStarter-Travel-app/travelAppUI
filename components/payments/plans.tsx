import React, { useEffect, useState } from "react";
import { Linking } from "react-native";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { getUserInfo, setUserPremium, setUses } from "@/lib/appwrite";
import Purchases, { CustomerInfo } from "react-native-purchases";
import Packages from "./package";
import { getPremiumStatus } from "@/lib/appwrite";

const Plans = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [packages, setPackages] = useState<any>([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const init = async () => {
      await loadOfferings();
      await checkSubscriptionStatus();
    };

    init();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      updateSubscriptionStatus(customerInfo);
    } catch (e) {
      console.error("Error checking subscription status:", e);
    }
  };

  const updateSubscriptionStatus = (customerInfo: CustomerInfo) => {
    const isPremium =
      customerInfo?.entitlements.active["Premium"] !== undefined;
    setIsSubscribed(isPremium);
    setUserPremium(isPremium);
    setUses(true);
  };

  const loadOfferings = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      const currentOffering = offerings.current;
      if (currentOffering) {
        console.log(currentOffering.availablePackages[1]);
        setPackages(currentOffering.availablePackages);
      }
    } catch (e) {
      console.error("Error loading offerings:", e);
      setError("Failed to load offerings");
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSelect = (pkg: any) => {
    setSelectedPackage(pkg);
  };

  const handleSubscribe = async () => {
    if (!selectedPackage) {
      return;
    }
    try {
      const { customerInfo } = await Purchases.purchasePackage(selectedPackage);
      updateSubscriptionStatus(customerInfo);
      if (isSubscribed) {
        Alert.alert("Success", "Subscription successful!");
      }
    } catch (e) {
      console.error("Error subscribing:", e);
      Alert.alert("Error", "Failed to subscribe. Please try again.");
    }
  };

  const handleCancelSubscription = async () => {
    // Note: This is just for testing. In a real app, you'd typically redirect to the app store or a web portal for cancellation.
    Linking.openURL("https://apps.apple.com/account/subscriptions");
    // After redirecting, you might want to refresh the subscription status
    await checkSubscriptionStatus();
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading plans...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {packages.map((pkg: any, index: number) => (
        <Packages
          key={index}
          index={index}
          pkg={pkg}
          selectedPackage={selectedPackage}
          handlePackageSelect={handlePackageSelect}
        />
      ))}
      <TouchableOpacity
        style={[
          styles.actionButton,
          (selectedPackage === null || isSubscribed) && styles.disabledButton,
        ]}
        disabled={selectedPackage === null || isSubscribed}
        onPress={handleSubscribe}
      >
        <LinearGradient
          colors={["#6a11cb", "#2575fc"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.actionButton}
        >
          <Text style={styles.actionButtonText}>
            {isSubscribed ? "Already Subscribed" : "Subscribe"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* {isSubscribed && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleCancelSubscription}
        >
          <LinearGradient
            colors={["#cb1111", "#fc2525"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.actionButton}
          >
            <Text style={styles.actionButtonText}>Manage Subscription</Text>
          </LinearGradient>
        </TouchableOpacity>
      )} */}
    </ScrollView>
  );
};

export default Plans;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
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
    marginBottom: 10,
  },
  description: {
    fontFamily: "DMSans-Regular",
    fontSize: 14,
    color: "#666",
  },
  loadingText: {
    fontFamily: "DMSans-Regular",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    fontFamily: "DMSans-Regular",
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  actionButton: {
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 10,
  },
  actionButtonText: {
    fontFamily: "DMSans-Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
