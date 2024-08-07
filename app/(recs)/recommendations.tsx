import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const locationsData = [
  {
    locationName: "Central Park",
    matchScore: 9,
    photoURL: "https://example.com/photos/central_park.jpg",
    rating: 4.5,
    website: "https://centralpark.com",
    hours: [
      "Monday: 6:00 AM – 11:00 PM",
      "Tuesday: 6:00 AM – 11:00 PM",
      "Wednesday: 6:00 AM – 11:00 PM",
      "Thursday: 6:00 AM – 11:00 PM",
      "Friday: 6:00 AM – 11:00 PM",
      "Saturday: 6:00 AM – 11:00 PM",
      "Sunday: 6:00 AM – 11:00 PM",
    ],
  },
  {
    locationName: "Golden Gate Bridge",
    matchScore: 8,
    photoURL: "https://example.com/photos/golden_gate_bridge.jpg",
    rating: 4.7,
    website: "https://goldengatebridge.org",
    hours: [
      "Monday: 5:00 AM – 9:00 PM",
      "Tuesday: 5:00 AM – 9:00 PM",
      "Wednesday: 5:00 AM – 9:00 PM",
      "Thursday: 5:00 AM – 9:00 PM",
      "Friday: 5:00 AM – 9:00 PM",
      "Saturday: 5:00 AM – 9:00 PM",
      "Sunday: 5:00 AM – 9:00 PM",
    ],
  },
  {
    locationName: "Eiffel Tower",
    matchScore: 10,
    photoURL: "https://example.com/photos/eiffel_tower.jpg",
    rating: 4.8,
    website: "https://toureiffel.paris",
    hours: [
      "Monday: 9:00 AM – 12:00 AM",
      "Tuesday: 9:00 AM – 12:00 AM",
      "Wednesday: 9:00 AM – 12:00 AM",
      "Thursday: 9:00 AM – 12:00 AM",
      "Friday: 9:00 AM – 12:00 AM",
      "Saturday: 9:00 AM – 12:00 AM",
      "Sunday: 9:00 AM – 12:00 AM",
    ],
  },
  {
    locationName: "Louvre Museum",
    matchScore: 7,
    photoURL: "https://example.com/photos/louvre_museum.jpg",
    rating: 4.6,
    website: "https://louvre.fr",
    hours: [
      "Monday: Closed",
      "Tuesday: 9:00 AM – 6:00 PM",
      "Wednesday: 9:00 AM – 6:00 PM",
      "Thursday: 9:00 AM – 6:00 PM",
      "Friday: 9:00 AM – 9:45 PM",
      "Saturday: 9:00 AM – 6:00 PM",
      "Sunday: 9:00 AM – 6:00 PM",
    ],
  },
  {
    locationName: "Statue of Liberty",
    matchScore: 8,
    photoURL: "https://example.com/photos/statue_of_liberty.jpg",
    rating: 4.4,
    website: "https://nps.gov/stli",
    hours: [
      "Monday: 8:30 AM – 4:00 PM",
      "Tuesday: 8:30 AM – 4:00 PM",
      "Wednesday: 8:30 AM – 4:00 PM",
      "Thursday: 8:30 AM – 4:00 PM",
      "Friday: 8:30 AM – 4:00 PM",
      "Saturday: 8:30 AM – 4:00 PM",
      "Sunday: 8:30 AM – 4:00 PM",
    ],
  },
];

interface RecommendationsProps {
  data: {
    locationName: string;
    matchScore: number;
    photoURL: string;
    rating: number;
    website: string;
    hours: string[];
  }[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ data }) => {
  const num = data.length;
  return (
    <View>
      <Text style={styles.title}>AI Suggestions</Text>
      <Text>Number of Suggestions: {num}</Text>
      {data.map((location, index) => (
        <View key={index}>
          <Text>{location.locationName}</Text>
          <Text>Match Score: {location.matchScore}</Text>
          <Text>Rating: {location.rating}</Text>
          <Text>Website: {location.website}</Text>
          <Text>Hours:</Text>
          {location.hours.map((hour, hourIndex) => (
            <Text key={hourIndex}>{hour}</Text>
          ))}
        </View>
      ))}
    </View>
  );
};
export default Recommendations;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "DM Sans",
  },
});
