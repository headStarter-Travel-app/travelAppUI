import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  Image,
} from "react-native";

const FriendsScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const friends = [
    { id: "1", name: "Friend 1", status: "accepted" },
    { id: "2", name: "Friend 2", status: "pending" },
    { id: "3", name: "Friend 3", status: "pending" },
    { id: "4", name: "Friend 4", status: "accepted" },
    { id: "5", name: "Friend 5", status: "accepted" },
    { id: "6", name: "Friend 6", status: "pending" },
    { id: "7", name: "Friend 7", status: "accepted" },
    { id: "8", name: "Friend 8", status: "pending" },
  ];

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sections = [
    {
      title: "Requests",
      data: filteredFriends.filter((friend) => friend.status === "pending"),
    },
    {
      title: "Friends",
      data: filteredFriends.filter((friend) => friend.status === "accepted"),
    },
  ];

  const renderItem = ({
    item,
    section,
  }: {
    item: Friend;
    section: { title: string };
  }) => {
    if (section.title === "Friends") {
      return <CurrentFriendsContainer item={item} />;
    } else {
      return <PendingFriendContainer item={item} />;
    }
  };

  return (
    <View style={styles.container}>
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

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        style={styles.list}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
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
const CurrentFriendsContainer: React.FC<FriendsContainerProps> = ({ item }) => {
  const handleRemoveFriend = () => {
    console.log(`Removing friend: ${item.name}`);
  };

  return (
    <View style={styles.friendContainer}>
      <View style={styles.friendInfo}>
        <View style={styles.avatar} />
        <View style={styles.nameNoteContainer}>
          <Text style={styles.friendName}>{item.name}</Text>
          <Text style={styles.friendNote}>{item.status}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.circularButton}
        onPress={handleRemoveFriend}
      >
        <Ionicons name="close" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const PendingFriendContainer: React.FC<{ item: Friend }> = ({ item }) => {
  const handleAcceptFriend = () => {
    console.log(`Accepting friend request: ${item.name}`);
  };

  const handleRejectFriend = () => {
    console.log(`Rejecting friend request: ${item.name}`);
  };

  return (
    <View style={styles.friendContainer}>
      <View style={styles.friendInfo}>
        <View style={styles.avatar} />
        <View style={styles.nameNoteContainer}>
          <Text style={styles.friendName}>{item.name}</Text>
          <Text style={styles.friendNote}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.circularButton, styles.acceptButton]}
          onPress={handleAcceptFriend}
        >
          <Ionicons name="checkmark" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.circularButton, styles.rejectButton]}
          onPress={handleRejectFriend}
        >
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F7FF",
    marginTop: 50,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100, // Add padding to the bottom of the list
  },

  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 11,
    marginTop: 20,
    marginBottom: 10,
    color: "#000",
    backgroundColor: "#E6F7FF", // Match the background color
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
    fontWeight: "bold",
    marginLeft: 11,
    marginTop: 10,
    marginBottom: 2,
    color: "#000",
  },
  requestsText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 11,
    marginTop: 10,
    marginBottom: 5,
    color: "#000",
  },
  friendsList: {
    marginTop: 10,
    flexGrow: 1,
  },
  requestsList: {
    marginTop: 10,
    flexGrow: 3,
  },

  removeButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 5,
    backgroundColor: "#000000",
  },
  removeButtonText: {
    color: "#19ff00",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 25,
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
  friendContainer: {
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    borderColor: "#000",
    borderWidth: 2,
    borderBottomWidth: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  friendInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: "#D9D9D9",
    borderRadius: 25,
    marginRight: 15,
  },
  nameNoteContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  friendName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    color: "#333",
  },
  friendNote: {
    fontSize: 14,
    color: "#888",
  },
  actionButtonsContainer: {
    flexDirection: "row",
  },
  circularButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    borderColor: "#000",
    borderWidth: 2,
  },
  acceptButton: {
    backgroundColor: "#4CD964",
  },
  rejectButton: {
    backgroundColor: "#FF3B30",
  },
});

export default FriendsScreen;
