import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";

interface ButtonProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean; // Add disabled prop
}

const AppButton: React.FC<ButtonProps> = ({ title, onPress, disabled }) => {
  const buttonStyle: ViewStyle[] = [
    styles.button,
    disabled ? styles.disabledButton : {}, // Apply disabled button styles if disabled
  ];

  return (
    <Pressable
      style={({ pressed }) => [
        ...buttonStyle,
        { opacity: pressed && !disabled ? 0.5 : 1 }, // Dim the button when pressed, unless it's disabled
      ]}
      onPress={disabled ? undefined : onPress} // Disable onPress if the button is disabled
      disabled={disabled} // React Native Pressable accepts a disabled prop
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#BB80DF",
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    width: 256,
    borderWidth: 2,
    borderColor: "black",
    borderBottomWidth: 6,
  },
  text: {
    color: "black",
    fontFamily: "DMSans-Bold",
  },
  disabledButton: {
    // Style for disabled button
    backgroundColor: "#ccc", // Example: change background color
    borderColor: "#aaa", // Example: change border color
  },
});

export default AppButton;
