import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ThemedView } from '../ThemedView'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { ThemedText } from '../ThemedText'

interface PreferenceQuizProps {
  handleQuizPress: () => void
}

const PreferenceQuizButton = ({handleQuizPress} : PreferenceQuizProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleQuizPress}>
        <ThemedView style={styles.card}>
          <MaterialCommunityIcons
            name="clipboard-list"
            size={50}
            color="black"
            style={styles.icon}
          />
          <View style={styles.textContainer}>
            <ThemedText type="subtitle" style={styles.title}>
              Preference Quiz
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Help us learn more about you
            </ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </ThemedView>
      </TouchableOpacity>
    </View>
  )
}

export default PreferenceQuizButton

const styles = StyleSheet.create({
  container:{
    paddingHorizontal: 30
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20, // Increase padding for larger text
    backgroundColor: "#E6F7FF", // Light blue background similar to the page
    borderRadius: 5,
    borderColor: "#000", // Dark border similar to the search container
    borderWidth: 2,
    borderBottomWidth: 4,
    elevation: 1,
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 20,
  },
  buttonsContainer: {
    padding: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    fontFamily: "spaceGroteskBold",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    fontFamily: "spaceGroteskRegular",
  }

})