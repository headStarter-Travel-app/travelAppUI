import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Linking,
  TouchableOpacity,
} from "react-native";
import React, { useCallback } from "react";
import { useRouter } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { FontAwesome } from "@expo/vector-icons";
import moment from "moment-timezone";

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
      "Tuesday: 5:00 AM – 7:00 AM",
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
  const renderCard = useCallback((location: any, key: number) => {
    return(
      <View key={key}>
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
    )
  }, [])
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
      <View style={styles.locationContainer}>
        <View style={styles.locationColumn}>
          {data.map((location, index) => (
            (index % 2 == 0 ? renderCard(location, index) : <></>)
          ))}
        </View>
        <View style={styles.locationColumn}>
          {data.map((location, index) => (
            (index % 2 == 1 ? renderCard(location, index) : <></>)
          ))}
        </View>
      </View>
      
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
      <View style={{flexDirection: "row"}}>
        {[...Array(fullStars)].map((_, i) => (
          <View key={`full-${i}`}>
            <FontAwesome name="star" size={16} color="#1E90FF" />
          </View>
        ))}
        {hasHalfStar && (
          <FontAwesome name="star-half-o" size={16} color="#1E90FF" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <FontAwesome
            key={`empty-${i}`}
            name="star-o"
            size={16}
            color="#1E90FF"
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

  const isOpen = () => {
    const now = moment().tz("America/New_York");
    const day = now.format("dddd");
    const currentTime = now.format("HH:mm");

    const todayHours = hours.find((hour) => hour.startsWith(day));
    if (!todayHours) return "Closed";

    const matchResult = todayHours.match(
      /(\d{1,2}:\d{2} [AP]M) – (\d{1,2}:\d{2} [AP]M)/
    );
    const [, openTime, closeTime] = matchResult ? matchResult : ["", "", ""];
    const open = moment(openTime, "h:mm A");
    let close = moment(closeTime, "h:mm A");
    if (closeTime === "12:00 AM") {
      close.add(1, "day");
    }

    return now.isBetween(open, close) || now.isSame(open) || now.isSame(close)
      ? "Open"
      : "Closed";
  };

  const openStatus = isOpen();
  const statusColor = openStatus === "Open" ? "#12F19F" : "#FF5722";

  return (
    <View style={styles.cardBGStyle}>
      <Image source={{ uri: photoURL || defaultImage }} style={styles.image} />
      <View style={styles.cardContent}>
        <View style={[styles.labelCard, {flexGrow: 1, maxHeight: 48}]}>
          <View style={{flexGrow:1, flexWrap: "wrap", flex:1, flexDirection: "column", height: 12, justifyContent: "center", alignItems: "center"}}>
            <Text style={styles.locationName}>{locationName}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.labelCard}>
            <Text style={styles.budget}>{budget}</Text>
          </View>
          <View style={[styles.labelCard]}>
            {renderStars(rating)}
            {/* <Text style={styles.ratingText}>({rating})</Text> */}
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.labelCard}>
            <Text style={[styles.hoursStatus, { color: statusColor }]}>
              {openStatus}
            </Text>
          </View>
          
            <View
            style={[
              styles.labelCard,
              styles.matchScoreOval,
              { backgroundColor: getMatchScoreColor(matchScore) },
            ]}
          >
            <TabBarIcon name="sparkles" color="black" size={16} />
            <Text style={styles.matchScoreText}>{matchScore}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.websiteButton}
          onPress={() => Linking.openURL(website)}
        >
          <Text style={styles.websiteButtonText}>Visit Website</Text>
        </TouchableOpacity>
        

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
  image: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 8,
    alignItems: "center",
    position: "relative",
    paddingBottom: 64
  },
  locationName: {
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 4,
    width: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    
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
    fontSize: 16,
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
    flexDirection: "row"
  },
  ratingText: {
    fontSize: 16,
    marginLeft: 5,
  },
  budget: {
    fontSize: 16,
    fontFamily: "spaceGroteskRegular",
    textAlign: "center",
  },
  website: {
    fontSize: 16,
    color: "#0000FF",
    textDecorationLine: "underline",
    marginBottom: 10,
    fontFamily: "spaceGroteskRegular",
    textAlign: "center",
  },
  hours: {
    fontSize: 14,
    marginLeft: 10,
    fontFamily: "spaceGroteskRegular",
    textAlign: "center",
  },
  cardBGStyle: {
    backgroundColor: "#C7ECFD",
    margin: 10,
    borderRadius: 8,
    borderColor: "#000",
    borderWidth: 2,
    overflow: "hidden",
    alignItems: "center",
    alignSelf: "center",
    width: "90%",
  },
  websiteButton: {
    position: "absolute",
    backgroundColor: "#1E90FF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
    borderBottomWidth: 4,
    bottom: 4,
    right: 4,
  },
  websiteButtonText: {
    color: "white",
    fontFamily: "spaceGroteskRegular",
    fontSize: 16,
  },
  hoursTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "spaceGroteskBold",
    textAlign: "center",
  },
  hoursStatus: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "DM Sans",
  },
  locationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 128
  },
  locationColumn: {
    width: "50%"
  },
  labelCard: {
    backgroundColor: "#FFF",
    paddingHorizontal: 6,
    borderWidth: 2,
    borderRadius: 8,
    height: 36,
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: 120,
    minWidth: 36,
    shadowOpacity: .3,
    shadowOffset: {width: 0, height: 4}
  },
  infoRow: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    width: "100%",
    paddingTop: 4
  }
});
