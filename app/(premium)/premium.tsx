import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Plans from "@/components/payments/plans";
import { getPremiumStatus } from "@/lib/appwrite";
import Purchases from "react-native-purchases";
import SubscriptionsPage from "@/components/payments/subscriptionInfoPage";
const Premium = () => {
  const navigation = useNavigation();
  const [isPremium, setIsPremium] = React.useState(false);
  React.useEffect(() => {
    const init = async () => {
      const customerInfo = await Purchases.getCustomerInfo();

      const premium = await getPremiumStatus();
      const isPremium =
        customerInfo?.entitlements.active["Premium"] !== undefined;

      console.log("Premium status:", isPremium && premium);
      setIsPremium(isPremium && premium);
    };
    init();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Premium Plans</Text>
      </View>
      {isPremium ? (
        <SubscriptionsPage />
      ) : (
        <Plans />
        // <SubscriptionsPage />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: "black",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 16,
    zIndex: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "DM Sans",
    color: "#333",
  },
});

export default Premium;
