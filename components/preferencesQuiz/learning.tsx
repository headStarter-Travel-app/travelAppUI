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
import {styles} from "./cardStyles"

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
  const [activeOptions, setActiveOptions] = useState<[string, any][]>([]);
  const toggleLearning = (option: string) => {
    setLearning(
      existingLearning.includes(option)
        ? existingLearning.filter((c) => c !== option)
        : [...existingLearning, option]
    );
  };
  useEffect(() => {
    function addStaggered() {
      setActiveOptions([])
      const list = Object.entries(LearningMap)
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
