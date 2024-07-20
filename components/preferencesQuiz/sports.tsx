import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";

interface SportsProps {
  setSports: (option: string[]) => void;
  existingSports: string[];
}

//Mini golf, go kart, basketball courts, fields, hiking, aquatic,
const entertainmentMap = {
  Golf: require("@/public/sports/golf.png"),
  Fields: require("@/public/sports/fields.png"),
  "Live Sports": require("@/public/sports/liveSport.jpg"),
  // Basketball: require("@/public/sports/basketball.png"),
  Soccer: require("@/public/sports/soccer.jpg"),
  Hiking: require("@/public/sports/hiking.jpg"),
  "Aquatic Sports": require("@/public/sports/aquatic.jpg"),
  "Go Kart": require("@/public/sports/goKart.jpg"),
};

export const Sports: React.FC<SportsProps> = ({
  setSports,
  existingSports,
}) => {
  const toggleSport = (option: string) => {
    setSports(
      existingSports.includes(option)
        ? existingSports.filter((c) => c !== option)
        : [...existingSports, option]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select outdoor/athletic activities!</Text>
      <Text style={styles.subTitle}>
        Select all that apply. You can always change this later.
      </Text>
      <FlatList
        data={Object.entries(entertainmentMap)}
        renderItem={({ item: [name, imageURL] }) => (
          <Card
            key={name}
            name={name}
            imageURL={imageURL}
            selected={existingSports.includes(name)}
            onPress={() => toggleSport(name)}
          />
        )}
        numColumns={3}
        keyExtractor={(item) => item[0]}
        contentContainerStyle={[styles.gridContainer, styles.flatListContainer]}
      />
    </View>
  );
};

interface Card {
  name: string;
  imageURL: any;
  selected: boolean;
  onPress: () => void;
}

export const Card: React.FC<Card> = ({ name, imageURL, selected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selectedCard]}
      onPress={onPress}
    >
      <Text style={styles.cardText}>{name}</Text>

      <Image source={imageURL} style={styles.image} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  flatListContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },

  title: {
    fontSize: 24,
    fontFamily: "dmSansBold",
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    fontFamily: "dmSansRegular",
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
  },
  gridContainer: {
    paddingHorizontal: 5,
  },
  card: {
    margin: 5,
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    width: "30%", // Changed from fixed width to percentage
  },
  selectedCard: {
    backgroundColor: "#d0d0ff",
    borderWidth: 2,
    borderColor: "#4040ff",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 2,
  },
  cardText: {
    marginTop: 5,
    fontFamily: "spaceGroteskMedium",
    textAlign: "center",
    fontSize: 14,
  },
});
