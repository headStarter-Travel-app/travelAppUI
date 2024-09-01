import { StyleSheet, Text, View } from "react-native";
import React, { useCallback, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import StarRating from 'react-native-star-rating-widget';

interface HangoutProps {
  title: string;
  rating: number;
  date: {
    month: string;
    date: string;
  };
  changeRating: (rating: number) => void
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
          changeRating={item.changeRating}
        />
      ))}
    </View>
  );
};

const HangoutCard = ({ title, rating, date, changeRating }: HangoutProps) => {
  const [newRating, setRating] = useState(rating)
  return (
    <View style={styles.card}>
      <Text style={styles.hangoutLabel}>{title}</Text>
      <StarRating
        rating={newRating}
        onChange={(newRating) => setRating(newRating)}
        onRatingEnd={() => changeRating(newRating)}
        maxStars={5}
        starSize={30}
        />
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
