import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useRouter } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { FontAwesome } from "@expo/vector-icons";
import moment from "moment-timezone";
import { globalRecommendations } from "../aiScreen";

const EmptyStateMessage = () => (
  <View style={styles.emptyStateContainer}>
    <Text style={styles.emptyStateText}>
      Take a preference quiz and generate recommendations!
    </Text>
    <TabBarIcon name="sparkles" color="#410DFF" size={50} />
  </View>
);

interface RecommendationsProps {
  data: {
    name?: string;
    hybrid_score?: number;
    photoURL?: string;
    rating?: number;
    website?: string;
    budget?: string;
    hours?: string[];
  }[];
  scores: any[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ data, scores }) => {
  const num = data.length;

  const scoreMap = useMemo(() => {
    return scores.reduce((acc, score) => {
      acc[score.name] = score.hybrid_score;
      return acc;
    }, {});
  }, [scores]);

  const renderCard = useCallback(
    (location: any, key: number) => {
      const hybridScore = scoreMap[location.name] || 0;
      return (
        <View key={key}>
          <Card
            locationName={location.name || "Unknown Location"}
            hybrid_score={hybridScore}
            photoURL={location.photos ? location.photos[0] : ""}
            rating={location.rating || 0}
            website={location.url || "#"}
            budget={location.budget || "N/A"}
            hours={location.hours || []}
          />
        </View>
      );
    },
    [scoreMap]
  );

  if (data.length === 0) {
    return <EmptyStateMessage />;
  }

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
        {data.map((location, index) =>
          renderCard(location, index)
        )}
      </View>
    </ScrollView>
  );
};
const App = () => {
  const [recommendations, setRecommendations] = useState<
    RecommendationsProps["data"]
  >([]);
  const [loading, setLoading] = useState(true);
  const [recDetails, setRecDetails] = useState([]);

  const getRecDetails = useCallback(
    async (addresses: string[], names: string[]) => {
      console.log("Fetching details for:", addresses, names);
      setLoading(true);
      try {
        const response = await fetch(
          "https://travelappbackend-c7bj.onrender.com/get_batch_place_details",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ addresses, names }),
          }
        );

        const result = await response.json();
        if (result.detail) {
          console.error("Error fetching place details:", result.detail);
          setRecDetails([]);
        } else {
          setRecDetails(result);
        }
      } catch (error) {
        console.error("Error in getRecDetails:", error);
        setRecDetails([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    console.log("globalRecommendations updated:", globalRecommendations);
    setRecommendations(globalRecommendations);

    if (globalRecommendations.length > 0) {
      const addresses = globalRecommendations.map((rec) => rec.address || "");
      const names = globalRecommendations.map((rec) => rec.name || "");
      getRecDetails(addresses, names);
    } else {
      setRecDetails([]);
      setLoading(false);
    }
  }, [globalRecommendations, getRecDetails]);

  // useEffect(() => {
  //   console.log("recDetails updated:", recDetails);
  //   console.log(globalRecommendations);
  // }, [recDetails]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading recommendations...</Text>
      </View>
    );
  }

  return <Recommendations data={recDetails} scores={globalRecommendations} />;
};
export default App;

interface CardProps {
  locationName: string;
  hybrid_score: number;
  photoURL?: string;
  rating: number;
  website: string;
  budget: string;
  hours: string[];
}

const Card: React.FC<CardProps> = ({
  locationName,
  hybrid_score,
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
      <View style={{ flexDirection: "row" }}>
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

  const gethybrid_scoreColor = (score: number) => {
    if (score >= 9) return "#4CAF50";
    if (score >= 7) return "#8BC34A";
    if (score >= 5) return "#FFEB3B";
    if (score >= 3) return "#FFC107";
    return "#FF5722";
  };

  const isOpen = () => {
    if (!Array.isArray(hours) || hours.length === 0) {
      return "Unknown";
    }

    const now = moment().tz("America/New_York");
    const day = now.format("dddd");
    const currentTime = now.format("HH:mm");

    const todayHours = hours.find((hour) => hour.startsWith(day));
    if (!todayHours) return "Closed";
    console.log("todayHours:", todayHours);

    // Handle "Closed" case
    if (todayHours.includes("Closed")) {
      return "Closed";
    }

    // Normalize and correct the time string
    const normalizedHours = todayHours
      .replace(/\u202F/g, " ") // Replace non-breaking spaces
      .replace(/–|—/g, "-") // Normalize dashes
      .replace(
        /(\d{1,2}:\d{2})\s?-\s?(\d{1,2}:\d{2})\s?(AM|PM)?/,
        (match, p1, p2, p3) => {
          if (!p3) {
            const firstTime = parseInt(p1.split(":")[0], 10);
            const secondTime = parseInt(p2.split(":")[0], 10);
            // Assume AM for early hours (1-11) and PM for later hours (12 and above)
            const period = firstTime < 12 && secondTime >= 12 ? "PM" : "AM";
            return `${p1} ${period} - ${p2} ${period}`;
          }
          return match;
        }
      );

    console.log("normalizedHours:", normalizedHours);

    const matchResult = normalizedHours.match(
      /(\d{1,2}:\d{2}\s?[AP]M)\s?-\s?(\d{1,2}:\d{2}\s?[AP]M)/
    );
    if (!matchResult) {
      console.log("no result");
      return "Unknown";
    }

    const [, openTime, closeTime] = matchResult;
    const open = moment(openTime, "h:mm A");
    let close = moment(closeTime, "h:mm A");

    // Handle cases where closing time is past midnight
    if (close.isBefore(open)) {
      close.add(1, "day");
    }

    // Check if current time is between open and close times
    return now.isBetween(open, close, null, "[]") ? "Open" : "Closed";
  };

  const openStatus = isOpen();
  const statusColor =
    openStatus === "Open"
      ? "#12F19F"
      : openStatus === "Closed"
      ? "#FF5722"
      : "#FFA500";

  return (
    <View style={styles.cardBGStyle}>
      <View style={styles.cardDesc}>
        <Image source={{ uri: photoURL || defaultImage }} style={styles.image} />
        <View style={[styles.labelCard, { flexGrow: 1, maxHeight: 48 }]}>
          <View
            style={{
              flexGrow: 1,
              flexWrap: "wrap",
              flex: 1,
              flexDirection: "column",
              height: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.locationName}>{locationName}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        
        <View style={styles.infoRow}>
          {/* <View style={styles.labelCard}>
            <Text style={styles.budget}>{budget}</Text>
          </View> */}
          <View style={[styles.labelCard]}>{renderStars(rating)}</View>
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
              styles.hybrid_scoreOval,
              { backgroundColor: gethybrid_scoreColor(hybrid_score) },
            ]}
          >
            <TabBarIcon name="sparkles" color="black" size={16} />
            <Text style={styles.hybrid_scoreText}>
              {hybrid_score.toFixed(1)}
            </Text>
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
    width: 180,
    height: 86,
    resizeMode: "cover",
    borderWidth: 2,
    borderRadius: 8,

  },
  cardContent: {
    alignItems: "center",
    position: "relative",
    paddingBottom: 64,
  },
  locationName: {
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 4,
    width: "100%",
    textAlign: "center",
    textAlignVertical: "center",
  },
  hybrid_scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  hybrid_scoreLabel: {
    fontSize: 16,
    marginRight: 5,
  },
  hybrid_scoreOval: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  hybrid_scoreText: {
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
    flexDirection: "row",
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
    marginBottom: 5,
    borderRadius: 8,
    borderColor: "#000",
    borderWidth: 2,
    overflow: "hidden",
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    paddingHorizontal: 4,
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
    flexDirection: "column",
    justifyContent: "space-between",
    paddingHorizontal: 0,
    marginBottom: 128,
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
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F0F8FF", // Light blue background
  },
  emptyStateText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "DM Sans",
  },
  cardDesc : {
    flexDirection: "column",
    alignItems: "center",
    rowGap: 4
  }
});
