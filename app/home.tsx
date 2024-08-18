import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CurrentHangout from '@/components/homepage/CurrentHangout'
import PreferenceQuizButton from '@/components/homepage/PreferenceQuizButton'
import Map from "@/components/homepage/Map"
import PastHangouts from '@/components/homepage/PastHangouts'

const API_URL = "https://travelappbackend-c7bj.onrender.com";

// Default location (San Francisco)
const DEFAULT_LOCATION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

interface Place {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  name: string;
  description: string;
  imageUrl: string;
  address: string;
  openingHours: string;
  formattedAddressLines: string[];
}

const Home = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <SafeAreaView style={styles.container}>
        <PreferenceQuizButton />
        <CurrentHangout />
        <Map />
        <PastHangouts />
      </SafeAreaView>
    </ScrollView>
  )
}

export default Home

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 4,
    paddingBottom: 80,
  },
  container: {
    flex: 1,
    backgroundColor: "#E6F7FF", // Very light blue background
    marginTop: 50, // Move everything down by 50 pixels
  },
})