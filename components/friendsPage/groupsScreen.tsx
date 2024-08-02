import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  FlatList,
  Modal,
  Animated,
} from "react-native";
import LoadingComponent from "@/components/usableOnes/loading";
import axios from "axios";
const API_URL = "https://travelappbackend-c7bj.onrender.com";
const defaultImage = require("@/public/utilities/profileImage.png");
import { Image } from "expo-image";

interface User {
  $id: string;
  name: string;
  email: string;
  prefs: {
    profileImageUrl?: string;
  };
  profileImageUrl?: string;
}

interface Group {
  $id: string;
  name: string;
  expanded_members?: User[];
}

const GroupsScreen = ({
  currentUserId,
  friends,
}: {
  currentUserId: string;
  friends: User[];
}) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [addMembersModalVisible, setAddMembersModalVisible] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [groupDetailsModalVisible, setGroupDetailsModalVisible] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [activeGroups, setActiveGroups] = useState<Group[]>([]);
  const [isEditingGroupName, setIsEditingGroupName] = useState(false);

  const fetchGroups = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_URL}/get-groups?user_id=${currentUserId}`
      );
      setGroups(response.data.groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      Alert.alert("Error", "Failed to fetch groups");
    }
  }, [currentUserId]);

  const refreshGroups = useCallback(async () => {
    setRefreshing(true);
    await fetchGroups();
    setRefreshing(false);
  }, [fetchGroups]);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await fetchGroups();
      setLoading(false);
    };
    loadInitialData();
  }, [fetchGroups]);

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      delay: 100,
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [loading]);

  useEffect(() => {
    function addStaggered() {
      setActiveGroups([]);

      groups.map(async (item, index) => {
        await new Promise((resolve) => setTimeout(resolve, 200 * index));
        setActiveGroups((prev) => [...prev, item]);
      });
    }
    addStaggered();
  }, [groups]);

  const closeCreateGroupModal = () => {
    setModalVisible(false);
    setNewGroupName("");
  };

  const handleEditGroupName = useCallback(async () => {
    if (!selectedGroup) return;
    if (newGroupName.trim() === "") {
      setNewGroupName(selectedGroup.name);
      return;
    }
    try {
      await axios.post(`${API_URL}/edit-group-name`, {
        group_id: selectedGroup.$id,
        new_name: newGroupName,
      });
      setSelectedGroup({ ...selectedGroup, name: newGroupName });
      refreshGroups();
    } catch (error) {
      console.error("Error updating group name:", error);
    }
    setIsEditingGroupName(false);
  }, [selectedGroup, newGroupName, refreshGroups]);

  const closeGroupDetailsModal = () => {
    handleEditGroupName();
    setGroupDetailsModalVisible(false);
    setSelectedGroup(null);
    setSelectedMembers([]);
    setIsEditingGroupName(false);
  };

  const closeAddMembersModal = () => {
    setAddMembersModalVisible(false);
    setSelectedMembers([]);
  };

  const handleCreateGroup = useCallback(async () => {
    try {
      await axios.post(`${API_URL}/create-group`, {
        name: newGroupName,
        creator_id: currentUserId,
      });
      Alert.alert("Success", "Group created successfully");
      closeCreateGroupModal();
      refreshGroups();
    } catch (error) {
      console.error("Error creating group:", error);
      Alert.alert("Error", "Failed to create group");
    }
  }, [newGroupName, currentUserId, refreshGroups]);

  const getGroupDetails = useCallback(async (groupId: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/get-group-details?group_id=${groupId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting group details:", error);
      Alert.alert("Error", "Failed to get group details");
    }
  }, []);

  const handleAddMembers = useCallback(async () => {
    if (!selectedGroup) return;
    try {
      await axios.post(`${API_URL}/add-members`, {
        group_id: selectedGroup.$id,
        members: selectedMembers,
      });
      Alert.alert("Success", "Members added successfully");
      closeAddMembersModal();
      closeGroupDetailsModal();
      refreshGroups();
    } catch (error) {
      console.error("Error adding members:", error);
      Alert.alert("Error", "Failed to add members");
    }
  }, [selectedGroup, selectedMembers, refreshGroups]);

  const handleRemoveMember = useCallback(
    async (memberId: string) => {
      if (!selectedGroup) return;
      try {
        await axios.post(`${API_URL}/remove-member`, {
          group_id: selectedGroup.$id,
          member_id: memberId,
        });
        Alert.alert("Success", "Member removed successfully");
        const updatedMembers = selectedGroup.expanded_members?.filter(
          (member) => member.$id !== memberId
        );
        setSelectedGroup({
          ...selectedGroup,
          expanded_members: updatedMembers,
        });
        refreshGroups();
      } catch (error) {
        console.error("Error removing member:", error);
        Alert.alert("Error", "Failed to remove member");
      }
    },
    [selectedGroup, refreshGroups]
  );

  const renderGroupItem = useCallback(
    ({ item }: { item: Group }) => {
      return (
        <TouchableOpacity
          style={[styles.groupContainer]}
          onPress={async () => {
            const details = await getGroupDetails(item.$id);
            setSelectedGroup({ ...item, ...details });
            setGroupDetailsModalVisible(true);
            setSelectedMembers([]);
          }}
        >
          <View style={styles.groupInfo}>
            <Ionicons name="people" size={40} color="#BB80DF" />
            <View style={styles.groupText}>
              <Text style={styles.groupName}>{item.name}</Text>
            </View>
          </View>
          <View style={styles.groupIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="settings" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="person" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    },
    [getGroupDetails]
  );

  const renderMemberItem = useCallback(
    ({ item }: { item: User }) => {
      const profileImageUrl = item.prefs?.profileImageUrl;

      return (
        <View style={styles.memberCard}>
          <Image
            source={profileImageUrl ? { uri: profileImageUrl } : defaultImage}
            style={styles.memberImage}
          />
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{item.name}</Text>
            <Text style={styles.memberEmail}>{item.email}</Text>
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveMember(item.$id)}
          >
            <Ionicons name="close-circle" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      );
    },
    [handleRemoveMember]
  );

  const renderFriendItem = useCallback(
    ({ item }: { item: User }) => {
      const isAlreadyMember = selectedGroup?.expanded_members?.some(
        (member) => member.$id === item.$id
      );
      const isSelected = selectedMembers.includes(item.$id);
      const profileImageUrl = item.prefs?.profileImageUrl;

      return (
        <TouchableOpacity
          style={[
            styles.friendCard,
            isSelected && styles.selectedFriendCard,
            isAlreadyMember && styles.disabledFriendCard,
          ]}
          onPress={() => {
            if (!isAlreadyMember) {
              setSelectedMembers((prev) =>
                prev.includes(item.$id)
                  ? prev.filter((id) => id !== item.$id)
                  : [...prev, item.$id]
              );
            }
          }}
          disabled={isAlreadyMember}
        >
          <Image
            source={profileImageUrl ? { uri: profileImageUrl } : defaultImage}
            style={styles.memberImage}
          />
          <View style={styles.friendInfo}>
            <Text style={styles.friendName}>{item.name}</Text>
            <Text style={styles.friendEmail}>{item.email}</Text>
          </View>
          {isAlreadyMember && (
            <Text style={styles.alreadyMemberText}>Already a member</Text>
          )}
        </TouchableOpacity>
      );
    },
    [selectedMembers, selectedGroup]
  );

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search groups..."
          placeholderTextColor="#000000"
        />
        <Ionicons
          name="search"
          size={24}
          color="#000"
          style={styles.searchIcon}
        />
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add-circle" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Create Group</Text>
      </TouchableOpacity>
      <FlatList
        data={activeGroups}
        renderItem={renderGroupItem}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshGroups} />
        }
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeCreateGroupModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="Enter group name"
              placeholderTextColor="#888"
              value={newGroupName}
              onChangeText={setNewGroupName}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleCreateGroup}
              >
                <Text style={styles.modalButtonText}>Create Group</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.closeButton]}
                onPress={closeCreateGroupModal}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={groupDetailsModalVisible}
        onRequestClose={closeGroupDetailsModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => {
                setIsEditingGroupName(true);
                setNewGroupName(selectedGroup?.name || "");
              }}
            >
              {isEditingGroupName ? (
                <TextInput
                  style={styles.editGroupNameInput}
                  value={newGroupName}
                  onChangeText={setNewGroupName}
                  onBlur={handleEditGroupName}
                  autoFocus
                />
              ) : (
                <Text style={styles.modalTitle}>{selectedGroup?.name}</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.subTitle}>
              Members: {selectedGroup?.expanded_members?.length}
            </Text>
            <FlatList
              data={selectedGroup?.expanded_members}
              renderItem={renderMemberItem}
              keyExtractor={(item) => item.$id}
              style={styles.memberList}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  closeGroupDetailsModal();
                  setAddMembersModalVisible(true);
                }}
              >
                <Text style={styles.modalButtonText}>Add Members</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.closeButton]}
                onPress={closeGroupDetailsModal}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={addMembersModalVisible}
        onRequestClose={closeAddMembersModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Add Members to {selectedGroup?.name}
            </Text>
            <FlatList
              data={friends}
              renderItem={renderFriendItem}
              keyExtractor={(item) => item.$id}
              style={styles.friendList}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleAddMembers}
              >
                <Text style={styles.modalButtonText}>Add Members</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.closeButton]}
                onPress={closeAddMembersModal}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 18,
    paddingHorizontal: 10,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "spaceGroteskBold",
  },
  searchIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
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
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#BB80DF",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    marginVertical: 5,
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  groupContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    borderColor: "#000",
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  groupInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  groupText: {
    marginLeft: 10,
  },
  groupName: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#333",
  },
  groupNote: {
    fontSize: 14,
    color: "#888",
  },
  groupIcons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#E6F7FF",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    marginBottom: 16,
    borderWidth: 1,
    borderBottomWidth: 2,
    borderRadius: 8,
    padding: 2,
    paddingHorizontal: 8,
    width: 256,
    backgroundColor: "#fff",
    color: "#000",
  },
  createButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
    width: "80%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
    minHeight: "50%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 0,
    color: "#333",
  },
  groupDetailName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
    marginBottom: 15,
    color: "#333",
  },
  memberList: {
    width: "100%",
    marginBottom: 4,
    height: 200,
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#333",
    borderBottomWidth: 2,
    marginBottom: 4,
    borderRadius: 8,
  },
  memberImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#333",
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  memberEmail: {
    fontSize: 14,
    color: "#666",
  },
  friendList: {
    width: "100%",
    marginBottom: 15,
  },
  friendCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedFriendCard: {
    backgroundColor: "#e6f7ff",
  },
  disabledFriendCard: {
    opacity: 0.5,
  },
  friendImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  friendEmail: {
    fontSize: 14,
    color: "#666",
  },
  alreadyMemberText: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
  modalButton: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    padding: 12,
    height: 48,
    width: "40%",
    alignItems: "center",
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  modalButtonText: {
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {
    backgroundColor: "#FF3B30",
  },
  buttonRow: {
    flex: 1,
    flexDirection: "row",
    columnGap: 12,
    maxHeight: 48,
    height: 48,
  },
  removeButton: {
    padding: 5,
  },
  editGroupNameInput: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginBottom: 10,
    minWidth: 200,
    textAlign: "center",
  },
});

export default GroupsScreen;
