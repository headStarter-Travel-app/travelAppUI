import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Animated
} from "react-native";
import { styles } from "./cardStyles"

interface CuisineProps {
  setCuisines: (cuisines: string[]) => void;
  existingCuisines: string[];
}

const CuisinesMap = {
  Japanese: require("@/public/cuisines/Japanese_Cuisine.png"),
  Italian: require("@/public/cuisines/Italian_Cuisine.png"),
  Mexican: require("@/public/cuisines/Mexican_Cuisine.png"),
  Indian: require("@/public/cuisines/Indian_Cuisine.png"),
  Chinese: require("@/public/cuisines/Chinese_Cuisine.png"),
  French: require("@/public/cuisines/French_Cuisine.png"),
  Brazilian: require("@/public/cuisines/Brazilian_Cuisine.png"),
  Thai: require("@/public/cuisines/Thai_Cuisine.png"),
  FastFood: require("@/public/cuisines/Fast_Food.png"),
  Turkish: require("@/public/cuisines/Turkish_Cuisine.png"),
  Korean: require("@/public/cuisines/Korean_Cuisine.png"),
  Mediterranean: require("@/public/cuisines/Mediterranean_Cuisine.png"),
  Hungarian: require("@/public/cuisines/Hungarian.png"),
  //   Czech: require("@/public/cuisines/Czech.png"),
  Irish: require("@/public/cuisines/Irish.png"),
  //   Eritrean: require("@/public/cuisines/Eritrean.png"),
  //   Mongolian: require("@/public/cuisines/Mongolian.png"),
  //   Nepalese: require("@/public/cuisines/Nepalese.png"),
  Tibetan: require("@/public/cuisines/Tibetan.png"),
  //   Somali: require("@/public/cuisines/Somali.png"),
  //   Uzbek: require("@/public/cuisines/Uzbek.png"),
  Moroccan: require("@/public/cuisines/Moroccan.png"),
  Cuban: require("@/public/cuisines/Cuban.png"),
  Belgian: require("@/public/cuisines/Belgian.png"),
  Swedish: require("@/public/cuisines/Swedish.png"),
  //   Dutch: require("@/public/cuisines/Dutch.png"),
  Swiss: require("@/public/cuisines/Swiss.png"),
  Vietnamese: require("@/public/cuisines/Vietnamese.png"),
  Canadian: require("@/public/cuisines/Canadian.png"),
  Polish: require("@/public/cuisines/Polish.png"),
  //   Filipino: require("@/public/cuisines/Filipino.png"),
  Argentinian: require("@/public/cuisines/Argentinian.png"),
  Ethiopian: require("@/public/cuisines/Ethiopian.png"),
  Peruvian: require("@/public/cuisines/Peruvian.png"),
  Russian: require("@/public/cuisines/Russian.png"),
  Portuguese: require("@/public/cuisines/Portuguese.png"),
  German: require("@/public/cuisines/German.png"),
  Caribbean: require("@/public/cuisines/Caribbean.png"),
  African: require("@/public/cuisines/African.png"),
  Pizza: require("@/public/cuisines/Pizza.jpg"),
};

export const Cuisines: React.FC<CuisineProps> = ({
  setCuisines,
  existingCuisines,
}) => {

  const [activeCuisnes, setActiveCuisines] = useState<[string, any][]>([]);

  const toggleCuisine = (cuisine: string) => {
    setCuisines(
      existingCuisines.includes(cuisine)
        ? existingCuisines.filter((c) => c !== cuisine)
        : [...existingCuisines, cuisine]
    );
  };

  /* Used for animation*/
  useEffect(() => {
    function addStaggered() {
      setActiveCuisines([])
      const list = Object.entries(CuisinesMap)
      list.map((async (item, index) => {
        await new Promise(resolve => setTimeout(resolve, 60 * index));
        setActiveCuisines(prev => [...prev, item])
      }))
    }
    addStaggered();
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What cuisines do you enjoy?</Text>
      <Text style={styles.subTitle}>
        Select all that apply. You can always change this later.
      </Text>
      <FlatList
        style={styles.list}
        data={activeCuisnes}
        renderItem={({ item: [name, imageURL] }) => (
          <CuisineCard
            key={name}
            name={name}
            imageURL={imageURL}
            selected={existingCuisines.includes(name)}
            onPress={() => toggleCuisine(name)}
          />
        )}
        numColumns={3}
        keyExtractor={(item) => item[0]}
        contentContainerStyle={[styles.gridContainer, styles.flatListContainer]}
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


