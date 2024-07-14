import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

interface ButtonProps {
  title: string;
  onPress?: () => void;
}

const AppButton: React.FC<ButtonProps> = ({ title, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { opacity: pressed ? 0.5 : 1 }, // Dim the button to 50% opacity when pressed
      ]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#BB80DF",
    paddingTop: 12, // py-3 equivalent in pixels
    paddingBottom: 12, // py-3 equivalent in pixels
    paddingLeft: 16, // px-4 equivalent in pixels
    paddingRight: 16, // px-4 equivalent in pixels
    borderRadius: 6, // rounded-md equivalent in pixels
    alignItems: "center",
    justifyContent: "center",
    width: 256, // w-64 equivalent in pixels
    borderWidth: 2,
    borderColor: "black",
    borderBottomWidth: 6,
  },
  text: {
    color: "black",
    fontFamily: "DMSans-Bold",
  },
});

export default AppButton;
