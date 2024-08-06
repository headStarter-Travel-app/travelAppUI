import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { FontAwesome } from "@expo/vector-icons";

const locationsData = [
  {
    locationName: "Central Park",
    matchScore: 9,
    photoURL: "https://example.com/photos/central_park.jpg",
    rating: 4.5,
    website: "https://centralpark.com",
    budget: "$",
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
    budget: "Free",
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
    budget: "$$$",
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
    budget: "$$",
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
    budget: "$$",
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
    budget: string;
    hours: string[];
  }[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ data }) => {
  const num = data.length;
  return (
    <ScrollView>
      <SafeAreaView>
        <Text style={styles.title}>
          AI <TabBarIcon name="sparkles" color="black" /> Suggestions
        </Text>
      </SafeAreaView>

      <Text style={styles.numHeading}>
        Number of Suggestions: <Text style={{ color: "#410DFF" }}>{num}</Text>
      </Text>
      {data.map((location, index) => (
        <View key={index}>
          <Card
            locationName={location.locationName}
            matchScore={location.matchScore}
            photoURL={location.photoURL}
            rating={location.rating}
            website={location.website}
            budget={location.budget}
            hours={location.hours}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const App = () => {
  return <Recommendations data={locationsData} />;
};

export default App;

interface CardProps {
  locationName: string;
  matchScore: number;
  photoURL: string;
  rating: number;
  website: string;
  budget: string;
  hours: string[];
}

const Card: React.FC<CardProps> = ({
  locationName,
  matchScore,
  photoURL,
  rating,
  website,
  budget,
  hours,
}) => {
  const defaultImage = "https://via.placeholder.com/150";

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <View style={styles.starContainer}>
        {[...Array(fullStars)].map((_, i) => (
          <View key={`full-${i}`}>
            <FontAwesome name="star" size={16} color="#FDCC0D" />
          </View>
        ))}
        {hasHalfStar && (
          <FontAwesome name="star-half-o" size={16} color="#FDCC0D" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <FontAwesome
            key={`empty-${i}`}
            name="star-o"
            size={16}
            color="#FDCC0D"
          />
        ))}
      </View>
    );
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 9) return "#4CAF50";
    if (score >= 7) return "#8BC34A";
    if (score >= 5) return "#FFEB3B";
    if (score >= 3) return "#FFC107";
    return "#FF5722";
  };

  return (
    <View style={styles.cardBGStyle}>
      <Image source={{ uri: photoURL || defaultImage }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.locationName}>{locationName}</Text>
        <View style={styles.matchScoreContainer}>
          <Text style={styles.matchScoreLabel}>Match Score: </Text>
          <View
            style={[
              styles.matchScoreOval,
              { backgroundColor: getMatchScoreColor(matchScore) },
            ]}
          >
            <TabBarIcon name="sparkles" color="black" />
            <Text style={styles.matchScoreText}>{matchScore}</Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>Rating: </Text>
          {renderStars(rating)}
          <Text style={styles.ratingText}>({rating})</Text>
        </View>
        <Text style={styles.budget}>Budget: {budget}</Text>
        <Text style={styles.website} onPress={() => Linking.openURL(website)}>
          Website: {website}
        </Text>
        <Text style={styles.hoursTitle}>Hours:</Text>
        {hours.map((hour, index) => (
          <Text key={index} style={styles.hours}>
            {hour}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parentView: {
    padding: 10,
  },
  title: {
    fontSize: 30,
    marginBottom: 5,
    fontWeight: "500",
    fontFamily: "DM Sans",
    textAlign: "center",
  },
  numHeading: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "500",
    fontFamily: "DM Sans",
    textAlign: "center",
  },
  cardBGStyle: {
    backgroundColor: "#C7ECFD",
    margin: 10,
    borderRadius: 15,
    borderColor: "#000",
    borderWidth: 2,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 15,
  },
  locationName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  matchScoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  matchScoreLabel: {
    fontSize: 16,
    marginRight: 5,
  },
  matchScoreOval: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  matchScoreText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginLeft: 5,
    fontFamily: "DM Sans",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  rating: {
    fontSize: 16,
  },
  starContainer: {
    flexDirection: "row",
    marginLeft: 5,
  },
  ratingText: {
    fontSize: 16,
    marginLeft: 5,
  },
  budget: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "spaceGroteskRegular",
  },
  website: {
    fontSize: 16,
    color: "#0000FF",
    textDecorationLine: "underline",
    marginBottom: 10,
    fontFamily: "spaceGroteskRegular",
  },
  hoursTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "spaceGroteskBold",
  },
  hours: {
    fontSize: 14,
    marginLeft: 10,
    fontFamily: "spaceGroteskRegular",
  },
});
