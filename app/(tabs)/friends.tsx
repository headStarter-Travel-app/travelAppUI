import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import axios from "axios";
import { getUserId } from "@/lib/appwrite";

const API_URL = "https://travelappbackend-c7bj.onrender.com";

interface User {
  $id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface SectionData {
  title: string;
  data: User[];
}

const FriendsScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState<User[]>([]);
  const [pendingRequests, setPendingRequests] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [eligibleFriends, setEligibleFriends] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      const userId = await getUserId();
      setCurrentUserId(userId);
    };
    fetchCurrentUserId();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchFriendsAndRequests();
      fetchEligibleFriends();
    }
  }, [currentUserId]);

  const fetchFriendsAndRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/user-friends/${currentUserId}`);
      setFriends(response.data.friends);
      setPendingRequests(response.data.pending_requests);
    } catch (error) {
      console.error("Error fetching friends and requests:", error);
    }
  };

  const fetchEligibleFriends = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-eligible-friends?user_id=${currentUserId}`);
      setEligibleFriends(response.data.eligible_users);
    } catch (error) {
      console.error("Error fetching eligible friends:", error);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length > 0) {
      const filteredResults = eligibleFriends.filter(
        (user) =>
          user.firstName.toLowerCase().includes(text.toLowerCase()) ||
          user.lastName.toLowerCase().includes(text.toLowerCase()) ||
          user.email.toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  };

  const handleSendFriendRequest = async (receiverId: string) => {
    try {
      await axios.post(`${API_URL}/send-friend-request`, {
        sender_id: currentUserId,
        receiver_id: receiverId,
      });
      Alert.alert("Friend request sent successfully");
      setSearchQuery("");
      setSearchResults([]);
      fetchEligibleFriends();
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const handleAcceptFriendRequest = async (senderId: string) => {
    try {
      await axios.post(`${API_URL}/accept-friend-request`, {
        sender_id: senderId,
        receiver_id: currentUserId,
      });
      fetchFriendsAndRequests();
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleRejectFriendRequest = async (senderId: string) => {
    try {
      await axios.post(`${API_URL}/reject-friend-request`, {
        sender_id: senderId,
        receiver_id: currentUserId,
      });
      fetchFriendsAndRequests();
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    try {
      await axios.post(`${API_URL}/remove-friend`, {
        sender_id: currentUserId,
        receiver_id: friendId,
      });
      fetchFriendsAndRequests();
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  const getSections = (): SectionData[] => {
    const sections: SectionData[] = [];

    if (searchQuery.length > 0) {
      sections.push({
        title: "Search Results",
        data: searchResults,
      });
    } else {
      sections.push({
        title: "Friend Requests",
        data: pendingRequests,
      });
      sections.push({
        title: "Friends",
        data: friends,
      });
    }

    return sections;
  };

  const renderItem = ({ item, section }: { item: User; section: SectionData }) => {
    if (section.title === "Search Results") {
      return (
        <SearchResultContainer
          item={item}
          onSendRequest={() => handleSendFriendRequest(item["$id"])}
        />
      );
    } else if (section.title === "Friend Requests") {
      return (
        <PendingFriendContainer
          item={item}
          onAccept={() => handleAcceptFriendRequest(item["$id"])}
          onReject={() => handleRejectFriendRequest(item["$id"])}
        />
      );
    } else {
      return (
        <CurrentFriendsContainer
          item={item}
          onRemove={() => handleRemoveFriend(item["$id"])}
        />
      );
    }
  };

  const renderSectionHeader = ({
    section: { title, data },
  }: {
    section: SectionData;
  }) => (
    <>
      <Text style={styles.sectionHeader}>{title}</Text>
      {data.length === 0 && (
        <Text style={styles.emptyStateText}>
          {title === "Friend Requests"
            ? "No pending friend requests"
            : title === "Friends"
            ? "No friends yet. Start adding friends!"
            : "No results found"}
        </Text>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
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
        sections={getSections()}
        keyExtractor={(item, index) => `${item["$id"]}-${index}`}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        style={styles.list}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

interface ContainerProps {
  item: User;
  onSendRequest?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  onRemove?: () => void;
}

const SearchResultContainer: React.FC<ContainerProps> = ({
  item,
  onSendRequest,
}) => (
  <View style={styles.friendContainer}>
    <View style={styles.friendInfo}>
      <View style={styles.avatar} />
      <Text
        style={styles.friendName}
      >{`${item.firstName} ${item.lastName}`}</Text>
    </View>
    <TouchableOpacity
      style={[styles.circularButton, styles.addButton]}
      onPress={onSendRequest}
    >
      <Ionicons name="add" size={24} color="#fff" />
    </TouchableOpacity>
  </View>
);

const PendingFriendContainer: React.FC<ContainerProps> = ({
  item,
  onAccept,
  onReject,
}) => (
  <View style={styles.friendContainer}>
    <View style={styles.friendInfo}>
      <View style={styles.avatar} />
      <Text
        style={styles.friendName}
      >{`${item.firstName} ${item.lastName}`}</Text>
    </View>
    <View style={styles.actionButtonsContainer}>
      <TouchableOpacity
        style={[styles.circularButton, styles.acceptButton]}
        onPress={onAccept}
      >
        <Ionicons name="checkmark" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.circularButton, styles.rejectButton]}
        onPress={onReject}
      >
        <Ionicons name="close" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  </View>
);

const CurrentFriendsContainer: React.FC<ContainerProps> = ({
  item,
  onRemove,
}) => (
  <View style={styles.friendContainer}>
    <View style={styles.friendInfo}>
      <View style={styles.avatar} />
      <Text
        style={styles.friendName}
      >{`${item.firstName} ${item.lastName}`}</Text>
    </View>
    <TouchableOpacity
      style={[styles.circularButton, styles.removeButton]}
      onPress={onRemove}
    >
      <Ionicons name="close" size={24} color="#fff" />
    </TouchableOpacity>
  </View>
);

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
    paddingBottom: 100,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 11,
    marginTop: 20,
    marginBottom: 10,
    color: "#000",
    backgroundColor: "#E6F7FF",
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
  emptyStateText: {
    fontSize: 16,
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 10,
  },
});

export default FriendsScreen;
