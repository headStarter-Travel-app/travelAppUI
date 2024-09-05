import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Button from "@/components/usableOnes/button";

const SubmitButton = ({
  active,
  onSubmit,
}: {
  active: boolean;
  onSubmit: () => void;
}) => {
  return (
    <View style={styles.container}>
      <Button title={"Submit"} disabled={!active} onPress={onSubmit} />
    </View>
  );
};

export default SubmitButton;
const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    marginVertical: 12
  }
});
