import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { TabBarIcon } from "../navigation/TabBarIcon";

const TitleContainer = () => {
  return (
    <View style={styles.container}>
      <View style={styles.topLabel}>
        <Text style={styles.topText}>AI</Text>
        <TabBarIcon name="sparkles" color="black" />
        <Text style={styles.topText}>Configurations</Text>
      </View>
      <Text style={styles.bottomText}>Curating Your Perfect Trip...</Text>
    </View>
  );
};

export default TitleContainer;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
  },
  topLabel: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    paddingVertical: 8,
  },
  topText: {
    fontSize: 32,
    fontWeight: "600",
    fontFamily: "DM Sans",
  },
  bottomText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "DM Sans",
  },
});
