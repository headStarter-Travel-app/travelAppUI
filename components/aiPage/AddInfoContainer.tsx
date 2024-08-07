import { StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'

const AddInfoContainer = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Additional Info</Text>
      <TextInput style={styles.textBox}>

      </TextInput>
    </View>
  )
}

export default AddInfoContainer

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    rowGap: 8
  },
  label: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: .3
  },
  textBox: {
    width: 320,
    height: 120,
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: 8,
    flexDirection: "column",
  }
})