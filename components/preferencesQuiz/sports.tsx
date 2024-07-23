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
import { styles } from "./cardStyles";

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
  const [activeOptions, setActiveOptions] = useState<[string, any][]>([]);
  const toggleSport = (option: string) => {
    setSports(
      existingSports.includes(option)
        ? existingSports.filter((c) => c !== option)
        : [...existingSports, option]
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
      <Text style={styles.title}>Select outdoor/athletic activities!</Text>
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
        style={{width : "100%"}}
        onPress={onPress}
      >
        <Text style={styles.cardText}>{name}</Text>

        <Image source={imageURL} style={styles.image} />
      </TouchableOpacity>
    </Animated.View>
  );
};

