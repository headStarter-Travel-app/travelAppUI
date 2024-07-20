import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";

interface LearningProps {
  setLearning: (option: string[]) => void;
  existingLearning: string[];
}

const LearningMap = {
  "Religious Spots": require("@/public/learning/Religious_Spots.png"),
  Museums: require("@/public/learning/Museums.png"),
  "Historical Sites": require("@/public/learning/Historical_Sites.png"),
  Universities: require("@/public/learning/Universities.png"),
  Culture: require("@/public/learning/Cultural_Sites.png"),
  Libraries: require("@/public/learning/library.png"),
};

export const Learning: React.FC<LearningProps> = ({
  setLearning,
  existingLearning,
}) => {
  const toggleLearning = (option: string) => {
    setLearning(
      existingLearning.includes(option)
        ? existingLearning.filter((c) => c !== option)
        : [...existingLearning, option]
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
        data={Object.entries(LearningMap)}
        renderItem={({ item: [name, imageURL] }) => (
          <Card
            key={name}
            name={name}
            imageURL={imageURL}
            selected={existingLearning.includes(name)}
            onPress={() => toggleLearning(name)}
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
