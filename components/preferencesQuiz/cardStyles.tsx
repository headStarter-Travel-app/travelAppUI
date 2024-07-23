import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
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
    // borderWidth: 2,
    // borderColor: "#4040ff",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 2,
  },
  cardText: {
    width: "100%",
    marginTop: 2,
    fontFamily: "spaceGroteskMedium",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 4,
  },
  list: {
    paddingTop: 10
  },
});
