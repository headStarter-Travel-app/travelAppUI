import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";

interface CuisineProps {
  setCuisines: (cuisines: string[]) => void;
  existingCuisines: string[];
}

const CuisinesMap = {
  Japanese: require("@/public/cuisines/Japanese_Cuisine.png"),
  Italian: require("@/public/cuisines/Italian_Cuisine.png"),
  Mexican: require("@/public/cuisines/Mexican_Cuisine.png"),
  // Add more cuisines here
};

export const Cuisines: React.FC<CuisineProps> = ({
  setCuisines,
  existingCuisines,
}) => {
  const toggleCuisine = (cuisine: string) => {
    setCuisines(
      existingCuisines.includes(cuisine)
        ? existingCuisines.filter((c) => c !== cuisine)
        : [...existingCuisines, cuisine]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What cuisines do you enjoy?</Text>
      <Text style={styles.subTitle}>
        Select all that apply. You can always change this later.
      </Text>
      <FlatList
        data={Object.entries(CuisinesMap)}
        renderItem={({ item: [name, imageURL] }) => (
          <CuisineCard
            key={name}
            name={name}
            imageURL={imageURL}
            selected={existingCuisines.includes(name)}
            onPress={() => toggleCuisine(name)}
          />
        )}
        numColumns={2}
        keyExtractor={(item) => item[0]}
        contentContainerStyle={styles.gridContainer}
      />
    </View>
  );
};

interface CuisineCardProps {
  name: string;
  imageURL: any;
  selected: boolean;
  onPress: () => void;
}

export const CuisineCard: React.FC<CuisineCardProps> = ({
  name,
  imageURL,
  selected,
  onPress,
}) => {
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
  },
  selectedCard: {
    backgroundColor: "#d0d0ff",
    borderWidth: 2,
    borderColor: "#4040ff",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 2,
  },
  cardText: {
    marginTop: 5,
    fontFamily: "spaceGroteskMedium",
    textAlign: "center",
    fontSize: 16,
  },
});
