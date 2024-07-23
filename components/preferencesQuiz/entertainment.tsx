import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Animated,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { styles } from "./cardStyles"

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
  const [activeOptions, setActiveOptions] = useState<[string, any][]>([]);

  const toggleEntertainment = (option: string) => {
    setEntertainmentOptions(
      existingEntertainment.includes(option)
        ? existingEntertainment.filter((c) => c !== option)
        : [...existingEntertainment, option]
    );
  };

  /* Used for animation*/
  useEffect(() => {
    function addStaggered() {
      setActiveOptions([])
      const list = Object.entries(entertainmentMap)
      list.map((async (item, index) => {
        await new Promise(resolve => setTimeout(resolve, 60 * index));
        setActiveOptions(prev => [...prev, item])
      }))
    }
    addStaggered();
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Select what you like to do in your free time?
      </Text>
      <Text style={styles.subTitle}>
        Select all that apply. You can always change this later.
      </Text>
      <FlatList
        data={activeOptions}
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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const yBounce = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      delay: 20,
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);
  useEffect(() => {
    (
      selected ? 
      Animated.timing(yBounce, {
        toValue: -5,
        duration: 100,
        useNativeDriver: true,
      }).start() :
      Animated.timing(yBounce, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start()
    )
  }, [selected])

  return (
    <Animated.View style={[
      styles.card, 
      selected && styles.selectedCard,
      {transform: [
        {translateY : yBounce}
      ]},
      {opacity : fadeAnim},

    ]}> 
      <TouchableOpacity
        style={{width:"100%"}}
        onPress={onPress}
      >
        <Text style={styles.cardText}>{name}</Text>

        <Image source={imageURL} style={styles.image} />
      </TouchableOpacity>
    </Animated.View>
  );
};

