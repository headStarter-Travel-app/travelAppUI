import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { relative } from "path";

const DEFAULT_ITEMS = [
  "Educational Trip",
  "Outdoor Adventure",
  "Romantic Date",
  "Nights Out",
  "Educational Trip",
  "Outdoor Adventure",
  "Romantic Date",
  "Nights Out",
  "Educational Trip",
  "Outdoor Adventure",
  "Romantic Date",
  "Nights Out",
];

const ThemeContainer = () => {
  const renderCard = useCallback(
    ({ item, index }: { item: string; index: number }) => {
      return (
        <View
          key={index}
          style={[
            styles.themeCard,
            {
              marginBottom: index % 4 == 0 || index % 4 == 2 ? 10 : 0,
              marginTop: index % 4 == 1 || index % 4 == 3 ? 10 : 0,
              marginLeft: index % 4 == 2 || index % 4 == 3 ? 10 : 0,
              marginRight: index % 4 == 0 || index % 4 == 1 ? 10 : 0,
            },
          ]}
        >
          <Text style={styles.themeCardText}>{item}</Text>
        </View>
      );
    },
    []
  );

  // const renderGrid = useCallback((args : string[]) => {
  //   return (
  //     <View style={styles.themeContainer}>
  //       <View style={styles.gridCols}>
  //         {args.map(((item, index) => {
  //           return (index % 2 == 0 ? renderCard(item, index) : <></>)
  //         }))}
  //       </View>
  //       <View style={styles.gridCols}>
  //         {args.map(((item, index) => {
  //           return (index % 2 == 1 ? renderCard(item, index) : <></>)
  //         }))}
  //       </View>
  //     </View>
  //   )
  // }, [])
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Theme</Text>

      <FlatList
        style={styles.themeScroll}
        data={DEFAULT_ITEMS}
        renderItem={renderCard}
        numColumns={2}
      ></FlatList>
      <LinearGradient
        style={styles.topFade}
        colors={["#D9F0F8FF", "#D9F0F811"]}
      ></LinearGradient>
      <LinearGradient
        style={styles.bottomFade}
        colors={["#D9F0F811", "#D9F0F8FF"]}
      ></LinearGradient>
    </View>
  );
};

export default ThemeContainer;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    height: 250,
    position: "relative",
    rowGap: 12,
  },
  label: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 0.3,
    fontFamily: "DM Sans",
  },
  themeContainer: {
    backgroundColor: "#AAA",

    padding: 10,
    marginHorizontal: "auto",
    flexDirection: "row",
    overflow: "hidden",
  },
  themeCard: {
    borderWidth: 2,
    borderBottomWidth: 4,
    width: 140,
    height: 40,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 6,
  },
  themeCardText: {
    width: "100%",
    textAlign: "center",
    fontSize: 12.5,
    color: "#000",
    fontWeight: "bold",
    fontFamily: "spaceGroteskBold",
  },
  gridCols: {
    flexDirection: "column",
    width: "50%",
    backgroundColor: "#CCC",
  },
  themeScroll: {
    width: 330,
    height: 225,
    padding: 15,
  },
  topFade: {
    position: "absolute",
    top: 36,
    height: 20,
    width: "80%",
  },
  bottomFade: {
    position: "absolute",
    bottom: 0,
    height: 20,
    width: "80%",
  },
});
