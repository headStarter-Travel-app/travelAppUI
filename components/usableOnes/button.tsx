import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
}

const AppButton: React.FC<ButtonProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      style={{
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
      }}
      onPress={onPress}
    >
      <Text style={{ color: "black", fontFamily: "DMSans-Bold" }}>{title}</Text>
    </TouchableOpacity>
  );
};

export default AppButton;
