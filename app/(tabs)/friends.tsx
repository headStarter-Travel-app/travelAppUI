import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// @ts-ignore
const FriendsScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const friends = [
    { id: "1", name: "Friend 1", status: "accepted" },
    { id: "2", name: "Friend 2", status: "denied" },
    { id: "3", name: "Friend 3", status: "pending" },
    { id: "4", name: "Friend 4", status: "status" },
    // { id: "5", name: "Friend 5", status: "status" },
    // { id: "6", name: "Friend 6", status: "status" },
    // { id: "7", name: "Friend 7", status: "status" },
    // { id: "8", name: "Friend 8", status: "status" },
  ];

  const requests = [
    { id: "1", name: "Friend 1", status: "accepted" },
    { id: "2", name: "Friend 2", status: "denied" },
    { id: "3", name: "Friend 3", status: "pending" },
    { id: "4", name: "Friend 4", status: "status" },
    // { id: "5", name: "Friend 5", status: "status" },
    // { id: "6", name: "Friend 6", status: "status" },
    // { id: "7", name: "Friend 7", status: "status" },
    // { id: "8", name: "Friend 8", status: "status" },
  ];

  const handleSearch = (text: React.SetStateAction<string>) => {
    setSearchQuery(text);
  };

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search friends..."
          placeholderTextColor="#000"
          value={searchQuery}
          onChangeText={handleSearch}
        />

        <TouchableOpacity style={styles.iconContainer}>
          <Image
            source={require("@/public/utilities/search.png")}
            style={styles.Magnicon}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.friendsText}>Friends</Text>

      {/* List of all the friends */}
      <FlatList
        data={friends.filter((friend) =>
          friend.name.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FriendsContainer item={item} />}
        style={styles.friendsList}
      />
      <Text style={styles.requestsText}>Requests</Text>
      {/* List of all the friend requests */}
      <FlatList
          data={friends.filter((friend) =>
              friend.name.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <FriendsContainer item={item} />}
          style={styles.requestsList}
      />

    </View>
  );
};

interface Friend {
  id: string;
  name: string;
  status: string;
}

interface FriendsContainerProps {
  item: Friend;
}

const FriendsContainer: React.FC<FriendsContainerProps> = ({ item }) => {
  return (
    <View style={styles.friendContainer}>
      <View style={styles.friendInfo}>
        <View style={styles.avatar} />
        <View style={styles.nameNoteContainer}>
          <Text style={styles.friendName}>{item.name}</Text>
          <Text style={styles.friendNote}>{item.status}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>x</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F7FF",
    marginTop: 50,
  },
  searchContainer: {
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    borderColor: "#000",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "spaceGroteskBold",
  },
  iconContainer: {
    marginLeft: 10,
  },
  friendsText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 11,
    marginTop: 10,
    marginBottom: 2,
    color: '#000',
  },
  requestsText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 11,
    marginTop: 10,
    marginBottom: 5,
    color: '#000',
  },
  friendsList: {
    marginTop: 10,
    flexGrow: 1,
  },
  requestsList: {
    marginTop: 10,
    flexGrow: 3,
  },
  friendContainer: {
    margin: 10, // Added margin to match search container
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    borderColor: "#000",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  friendInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    marginRight: 10,
  },
  nameNoteContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  friendName: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 2,
  },

  friendNote: {
    fontSize: 14,
    color: "#888888",
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#000000",
  },
  Magnicon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 25,
  },
});

export default FriendsScreen;
