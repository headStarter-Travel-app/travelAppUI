import React, { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  TouchableOpacity,
  Animated,
  Image,
} from "react-native";
import AppButton from "@/components/usableOnes/button";
import MediumCard from "@/components/usableOnes/splashPage/mediumCard";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const isDesktop = Platform.OS === "web" && width > 768;

const IntroPage = () => {
  const router = useRouter();
  const [cards, setCards] = useState([
    {
      id: 1,
      title: "Find Date Locations!",
      priceRangeLower: 2,
      priceRangeUpper: 3,
      image: require("@/public/date.png"),
    },
    {
      id: 2,
      title: "Find new Hangout Spots!",
      priceRangeLower: 1,
      priceRangeUpper: 2,
      image: require("@/public/Theatres.jpg"),
    },
    {
      id: 3,
      title: "Plan Group Adventures!",
      priceRangeLower: 1,
      priceRangeUpper: 3,
      image: require("@/public/golf.png"),
    },
    {
      id: 4,
      title: "Use AI to plan your next Vacation!",
      priceRangeLower: 2,
      priceRangeUpper: 3,
      image: require("@/public/vacation.jpg"),
    },
  ]);

  const animatedValues = useRef(cards.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    animatedValues.forEach((value, index) => {
      Animated.timing(value, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, [cards]);

  const handleCardTap = () => {
    Animated.parallel(
      animatedValues.map((value) =>
        Animated.timing(value, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      )
    ).start(() => {
      setCards((prevCards) => {
        const newCards = [...prevCards];
        const firstCard = newCards.shift();
        if (firstCard) {
          newCards.push(firstCard);
        }
        return newCards;
      });
    });
  };

  const handleSignUp = () => {
    router.push("/register");
  };

  const getCardStyle = (index: number) => {
    const rotate = animatedValues[index].interpolate({
      inputRange: [0, 1],
      outputRange: [
        index === 0 ? "-4deg" : index === 1 ? "2deg" : "-3deg",
        index === 0 ? "-5deg" : index === 1 ? "3deg" : "-1deg",
      ],
    });

    const translateY = animatedValues[index].interpolate({
      inputRange: [0, 1],
      outputRange: [index * 30, index * 20],
    });

    const translateX = animatedValues[index].interpolate({
      inputRange: [0, 1],
      outputRange: [index * 5 - 5, index * 3 - 3],
    });

    const scale = animatedValues[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0.95, 1],
    });

    return {
      transform: [{ rotate }, { translateY }, { translateX }, { scale }],
      opacity: animatedValues[index],
    };
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Image
          source={require("@/public/splash.png")}
          alt="ProxiLink Logo"
          style={{
            width: 50,
            height: 50,
          }}
        />
        <Text style={[styles.title, { marginLeft: 10 }]}>ProxiLink</Text>
      </View>
      <View style={styles.cardsContainer}>
        {cards.map((card, index) => (
          <TouchableOpacity
            key={card.id}
            style={[styles.card, { zIndex: cards.length - index }]}
            onPress={handleCardTap}
            activeOpacity={0.9}
          >
            <Animated.View style={getCardStyle(index)}>
              <MediumCard
                title={card.title}
                priceRangeLower={card.priceRangeLower}
                priceRangeUpper={card.priceRangeUpper}
                image={card.image}
              />
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.subtitle}>
        Unite, Explore, Enjoy: ProxiLink's AI Platform Will Help You Curate Your
        Next Adventure, Date, or Vacation!
      </Text>
      <AppButton title="Sign Up With Email" onPress={handleSignUp} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 90,
    paddingHorizontal: 20,
    backgroundColor: "#DFF2F9",
  },
  title: {
    fontFamily: "spaceGroteskBold",
    fontSize: 32,
    textAlign: "center",
    lineHeight: 50, // This should match the height of the image
  },
  cardsContainer: {
    width: "100%",
    height: 400,
    position: "relative",
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    position: "absolute",
    width: "100%",
    maxWidth: 300,
    alignSelf: "center",
    elevation: 5,
  },
  subtitle: {
    fontFamily: "spaceGroteskBold",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
    maxWidth: 300,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
});

export default IntroPage;
