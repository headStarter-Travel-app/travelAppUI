import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";

interface EntertainmentProps {
  setEntertainmentOptions: (option: string[]) => void;
  existingEntertainment: string[];
}

const entertainmentMap = {
  Aquarium: require("@/public/entertainment/Aquarium.jpg"),
  Arcade: require("@/public/entertainment/Arcade.jpg"),
  Bars: require("@/public/entertainment/Bars.jpg"),
  Beach: require("@/public/entertainment/Beaches.png"),
  Cinemas: require("@/public/entertainment/Cinemas.jpg"),
  Music: require("@/public/entertainment/Concerts.jpg"),
  Nightlife: require("@/public/entertainment/Nightlife.jpg"),
  Parks: require("@/public/entertainment/Park.jpg"),
  "Theme Parks": require("@/public/entertainment/Theme_Parks.jpg"),
  Zoo: require("@/public/entertainment/Zoos.jpg"),
  Spas: require("@/public/entertainment/Spas.jpg"),
  Club: require("@/public/entertainment/Clubs.jpg"),
};

export const Entertainment: React.FC<EntertainmentProps> = ({
  setEntertainmentOptions,
  existingEntertainment,
}) => {
  const toggleEntertainment = (option: string) => {
    setEntertainmentOptions(
      existingEntertainment.includes(option)
        ? existingEntertainment.filter((c) => c !== option)
        : [...existingEntertainment, option]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Select what you like to do in your free time?
      </Text>
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
            selected={existingEntertainment.includes(name)}
            onPress={() => toggleEntertainment(name)}
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
