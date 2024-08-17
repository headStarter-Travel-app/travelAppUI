import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";

const AddInfoContainer = ({
  addInfo,
  setAddInfo,
}: {
  addInfo: string;
  setAddInfo: (info: string) => void;
}) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.label}>Additional Info</Text>
        <TextInput
          editable
          multiline
          numberOfLines={4}
          maxLength={40}
          style={styles.textBox}
          value={addInfo}
          onChangeText={(e) => setAddInfo(e)}
          returnKeyType="done"
          blurOnSubmit={true}
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AddInfoContainer;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    rowGap: 8,
  },
  label: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 0.3,
    fontFamily: "DM Sans",
  },
  textBox: {
    width: 320,
    height: 80,
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: 8,
    flexDirection: "column",
    textAlignVertical: "top",
    padding: 8,
  },
});
