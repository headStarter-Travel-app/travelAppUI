import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import TitleContainer from "@/components/aiPage/TitleContainer"
import AddInfoContainer from "@/components/aiPage/AddInfoContainer";
import BudgetContainer from "@/components/aiPage/BudgetContainer";
import ThemeContainer from "@/components/aiPage/ThemeContainer";
import SubmitButton from "@/components/aiPage/SubmitButton";

export default function aiScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <TitleContainer />
      <ThemeContainer />
      <BudgetContainer />
      <AddInfoContainer />
      <SubmitButton />
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  screen: {
    marginTop: 64,
    width: "100%",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    rowGap: 20,
  }
});
