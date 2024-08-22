import React, { useEffect, useState, useCallback } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import Purchases, { CustomerInfo } from "react-native-purchases";
import { setUserPremium } from "@/lib/appwrite";
import { LinearGradient } from "expo-linear-gradient";

const SubscriptionsPage = () => {
  const [subscriptionInfo, setSubscriptionInfo] = useState<CustomerInfo | null>(
    null
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkSubscriptionStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const customerInfo = await Purchases.getCustomerInfo();
      setSubscriptionInfo(customerInfo);
      updateSubscriptionStatus(customerInfo);
    } catch (e) {
      console.error("Error checking subscription status:", e);
      setError("Failed to load subscription information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSubscriptionStatus();
  }, [checkSubscriptionStatus]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await checkSubscriptionStatus();
    setRefreshing(false);
  }, [checkSubscriptionStatus]);

  const updateSubscriptionStatus = (customerInfo: CustomerInfo) => {
    const isPremium =
      customerInfo?.entitlements.active["Premium"] !== undefined;
    const hasExpired = checkIfSubscriptionExpired(customerInfo);
    setIsSubscribed(isPremium && !hasExpired);
    setUserPremium(isPremium && !hasExpired);
  };

  const checkIfSubscriptionExpired = (customerInfo: CustomerInfo): boolean => {
    const expirationDate = customerInfo.latestExpirationDate;
    if (!expirationDate) return false;
    return new Date(expirationDate).getTime() < Date.now();
  };

  const handleCancelSubscription = async () => {
    Linking.openURL("https://apps.apple.com/account/subscriptions");
    Alert.alert(
      "Subscription Management",
      "After making changes to your subscription, please pull down to refresh and see the updated status.",
      [{ text: "OK" }]
    );
  };

  const renderSubscriptionInfo = () => {
    if (isSubscribed) {
      return (
        <View style={styles.subscriptionInfoContainer}>
          <LinearGradient
            colors={["#6a11cb", "#2575fc"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBorder}
          >
            <View style={styles.subscriptionInfo}>
              <Text style={styles.infoTitle}>Premium Subscription</Text>
              <Text style={styles.infoText}>Status: Active</Text>
              <Text style={styles.infoText}>
                Renews on:{" "}
                {subscriptionInfo?.latestExpirationDate
                  ? new Date(
                      subscriptionInfo.latestExpirationDate
                    ).toLocaleString()
                  : "N/A"}{" "}
              </Text>
            </View>
          </LinearGradient>

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
        </View>
      );
    } else {
      return (
        <View style={styles.noSubscriptionContainer}>
          <Text style={styles.noSubscriptionText}>
            You don't have an active subscription.
          </Text>
        </View>
      );
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Your Subscription</Text>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            Loading subscription information...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={checkSubscriptionStatus}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        renderSubscriptionInfo()
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    minHeight: "100%",
    backgroundColor: "#f8f8ff",
  },
  title: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 24,
    color: "#333",
    marginBottom: 20,
  },
  subscriptionInfoContainer: {
    marginBottom: 20,
  },
  gradientBorder: {
    borderRadius: 15,
    padding: 3,
    marginBottom: 20,
  },
  subscriptionInfo: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
  },
  infoTitle: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 20,
    color: "#333",
    marginBottom: 10,
  },
  infoText: {
    fontFamily: "DMSans-Regular",
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  actionButton: {
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  actionButtonText: {
    fontFamily: "DMSans-Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  noSubscriptionContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  noSubscriptionText: {
    fontFamily: "DMSans-Regular",
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: "DMSans-Regular",
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    backgroundColor: "#ffe6e6",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    fontFamily: "DMSans-Regular",
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: "#6a11cb",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    fontFamily: "DMSans-Bold",
    fontSize: 14,
    color: "#FFFFFF",
  },
});

export default SubscriptionsPage;
