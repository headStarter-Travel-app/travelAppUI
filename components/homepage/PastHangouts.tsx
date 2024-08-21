import { StyleSheet, Text, View } from "react-native";
import React, { useCallback } from "react";
import { MaterialIcons } from "@expo/vector-icons";

interface HangoutProps {
  title: string;
  rating: number;
  date: {
    month: string;
    date: string;
  };
}

interface PastHangoutsProps {
  hangouts: HangoutProps[];
}

const PastHangouts = ({ hangouts }: PastHangoutsProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Past Hangouts</Text>
      {hangouts?.map((item, index) => (
        <HangoutCard
          title={item.title}
          rating={item.rating}
          date={item.date}
          key={index}
        />
      ))}
    </View>
  );
};

const HangoutCard = ({ title, rating, date }: HangoutProps) => {
  const renderStars = useCallback((stars: number) => {
    const fullStars = Math.floor(stars);
    const halfStar = stars - fullStars >= 0.5;
    const starList = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        starList.push(
          <MaterialIcons key={`star-${i}`} size={24} color="#ff0" name="star" />
        );
      } else if (i === fullStars && halfStar) {
        starList.push(
          <MaterialIcons
            key={`star-${i}`}
            size={24}
            color="#ff0"
            name="star-half"
          />
        );
      } else {
        starList.push(
          <MaterialIcons
            key={`star-${i}`}
            size={24}
            color="#ff0"
            name="star-border"
          />
        );
      }
    }

    return starList;
  }, []);

  return (
    <View style={styles.card}>
      <Text style={styles.hangoutLabel}>{title}</Text>
      <View style={styles.rating}>{renderStars(rating)}</View>
      <Text style={styles.date}>
        {date.month} {date.date}
      </Text>
    </View>
  );
};

export default PastHangouts;

const styles = StyleSheet.create({
  container: {
    margin: 30,
    flexDirection: "column",
    alignItems: "center",
    rowGap: 12,
  },
  title: {
    fontSize: 36,
    fontStyle: "italic",
    color: "#666",
    fontWeight: 800,
  },
  card: {
    width: "100%",
    borderWidth: 2,
    borderRadius: 8,
    padding: 10,
    flexDirection: "column",
    rowGap: 4,
    position: "relative",
    backgroundColor: "#fff",
  },
  date: {
    position: "absolute",
    top: 10,
    right: 10,
    fontStyle: "italic",
    fontSize: 12,
  },
  hangoutLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  rating: {
    flexDirection: "row",
    padding: 2,
    // backgroundColor: "#000",
    width: 90,
    borderRadius: 8,
  },
});
