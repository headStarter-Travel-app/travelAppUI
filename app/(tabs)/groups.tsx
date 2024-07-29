// import { Ionicons } from "@expo/vector-icons";
// import React, { useState, useEffect, useCallback } from "react";
// import {
//     View,
//     TextInput,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     Alert,
//     RefreshControl,
//     FlatList,
//     Modal,
// } from "react-native";
// import LoadingComponent from "@/components/usableOnes/loading";
// import axios from "axios";
// const API_URL = "https://travelappbackend-c7bj.onrender.com";
//
// interface User {
//     $id: string;
//     name: string;
//     email: string;
// }
//
// interface Group {
//     $id: string;
//     name: string;
//     expanded_members?: User[];
// }
//
// const GroupsScreen = ({
//                           currentUserId,
//                           friends,
//                       }: {
//     currentUserId: string;
//     friends: User[];
// }) => {
//     const [groups, setGroups] = useState<Group[]>([]);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [newGroupName, setNewGroupName] = useState("");
//     const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
//     const [addMembersModalVisible, setAddMembersModalVisible] = useState(false);
//     const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
//     const [groupDetailsModalVisible, setGroupDetailsModalVisible] =
//         useState(false);
//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false);
//
//     const fetchGroups = useCallback(async () => {
//         try {
//             const response = await axios.get(
//                 `${API_URL}/get-groups?user_id=${currentUserId}`
//             );
//             setGroups(response.data.groups);
//         } catch (error) {
//             console.error("Error fetching groups:", error);
//             Alert.alert("Error", "Failed to fetch groups");
//         }
//     }, [currentUserId]);
//
//     const refreshGroups = useCallback(async () => {
//         setRefreshing(true);
//         await fetchGroups();
//         setRefreshing(false);
//     }, [fetchGroups]);
//
//     useEffect(() => {
//         const loadInitialData = async () => {
//             setLoading(true);
//             await fetchGroups();
//             setLoading(false);
//         };
//         loadInitialData();
//     }, [fetchGroups]);
//
//     const handleCreateGroup = useCallback(async () => {
//         try {
//             await axios.post(`${API_URL}/create-group`, {
//                 name: newGroupName,
//                 creator_id: currentUserId,
//             });
//             Alert.alert("Success", "Group created successfully");
//             setModalVisible(false);
//             setNewGroupName("");
//             refreshGroups();
//         } catch (error) {
//             console.error("Error creating group:", error);
//             Alert.alert("Error", "Failed to create group");
//         }
//     }, [newGroupName, currentUserId, refreshGroups]);
//
//     const getGroupDetails = useCallback(async (groupId: string) => {
//         try {
//             const response = await axios.get(
//                 `${API_URL}/get-group-details?group_id=${groupId}`
//             );
//             return response.data;
//         } catch (error) {
//             console.error("Error getting group details:", error);
//             Alert.alert("Error", "Failed to get group details");
//         }
//     }, []);
//
//     const handleAddMembers = useCallback(async () => {
//         if (!selectedGroup) return;
//         try {
//             await axios.post(`${API_URL}/add-members`, {
//                 group_id: selectedGroup.$id,
//                 members: selectedMembers,
//             });
//             Alert.alert("Success", "Members added successfully");
//             setAddMembersModalVisible(false);
//             setGroupDetailsModalVisible(false);
//             setSelectedMembers([]);
//             refreshGroups();
//         } catch (error) {
//             console.error("Error adding members:", error);
//             Alert.alert("Error", "Failed to add members");
//         }
//     }, [selectedGroup, selectedMembers, refreshGroups]);
//
//     const renderGroupItem = useCallback(
//         ({ item }: { item: Group }) => (
//             <TouchableOpacity
//                 style={styles.groupContainer}
//                 onPress={async () => {
//                     const details = await getGroupDetails(item.$id);
//                     setSelectedGroup({ ...item, ...details });
//                     setGroupDetailsModalVisible(true);
//                 }}
//             >
//                 <Text style={styles.groupName}>{item.name}</Text>
//             </TouchableOpacity>
//         ),
//         [getGroupDetails]
//     );
//
//     const renderMemberItem = useCallback(
//         ({ item }: { item: User }) => (
//             <Text style={styles.memberItem}>{`${item.name} (${item.email})`}</Text>
//         ),
//         []
//     );
//
//     const renderFriendItem = useCallback(
//         ({ item }: { item: User }) => (
//             <TouchableOpacity
//                 style={[
//                     styles.memberItem,
//                     selectedMembers.includes(item.$id) && styles.selectedMemberItem,
//                 ]}
//                 onPress={() => {
//                     setSelectedMembers((prev) =>
//                         prev.includes(item.$id)
//                             ? prev.filter((id) => id !== item.$id)
//                             : [...prev, item.$id]
//                     );
//                 }}
//             >
//                 <Text>{`${item.name} `}</Text>
//             </TouchableOpacity>
//         ),
//         [selectedMembers]
//     );
//
//     if (loading) {
//         return <LoadingComponent />;
//     }
//
//     return (
//         <View style={styles.container}>
//             <Text style={styles.sectionHeader}>Your Groups</Text>
//             <TouchableOpacity
//                 style={styles.addButton}
//                 onPress={() => setModalVisible(true)}
//             >
//                 <Text style={styles.addButtonText}>Add Group</Text>
//             </TouchableOpacity>
//             <FlatList
//                 data={groups}
//                 renderItem={renderGroupItem}
//                 keyExtractor={(item) => item.$id}
//                 contentContainerStyle={styles.listContent}
//                 refreshControl={
//                     <RefreshControl refreshing={refreshing} onRefresh={refreshGroups} />
//                 }
//             />
//
//             <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={modalVisible}
//                 onRequestClose={() => setModalVisible(false)}
//             >
//                 <View style={styles.modalView}>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Enter group name"
//                         value={newGroupName}
//                         onChangeText={setNewGroupName}
//                     />
//                     <TouchableOpacity style={styles.button} onPress={handleCreateGroup}>
//                         <Text style={styles.buttonText}>Create Group</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                         style={styles.button}
//                         onPress={() => setModalVisible(false)}
//                     >
//                         <Text style={styles.buttonText}>Cancel</Text>
//                     </TouchableOpacity>
//                 </View>
//             </Modal>
//
//             <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={groupDetailsModalVisible}
//                 onRequestClose={() => setGroupDetailsModalVisible(false)}
//             >
//                 <View style={styles.modalView}>
//                     <Text style={styles.modalTitle}>{selectedGroup?.name} Details</Text>
//                     <Text style={styles.subTitle}>Members:</Text>
//                     <FlatList
//                         data={selectedGroup?.expanded_members}
//                         renderItem={renderMemberItem}
//                         keyExtractor={(item) => item.$id}
//                     />
//                     <TouchableOpacity
//                         style={styles.button}
//                         onPress={() => {
//                             setGroupDetailsModalVisible(false);
//                             setAddMembersModalVisible(true);
//                         }}
//                     >
//                         <Text style={styles.buttonText}>Add Members</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                         style={styles.button}
//                         onPress={() => setGroupDetailsModalVisible(false)}
//                     >
//                         <Text style={styles.buttonText}>Close</Text>
//                     </TouchableOpacity>
//                 </View>
//             </Modal>
//
//             <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={addMembersModalVisible}
//                 onRequestClose={() => setAddMembersModalVisible(false)}
//             >
//                 <View style={styles.modalView}>
//                     <Text style={styles.modalTitle}>
//                         Add Members to {selectedGroup?.name}
//                     </Text>
//                     <FlatList
//                         data={friends}
//                         renderItem={renderFriendItem}
//                         keyExtractor={(item) => item.$id}
//                     />
//                     <TouchableOpacity style={styles.button} onPress={handleAddMembers}>
//                         <Text style={styles.buttonText}>Add Selected Members</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                         style={styles.button}
//                         onPress={() => setAddMembersModalVisible(false)}
//                     >
//                         <Text style={styles.buttonText}>Cancel</Text>
//                     </TouchableOpacity>
//                 </View>
//             </Modal>
//         </View>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#E6F7FF",
//         marginTop: 50,
//     },
//     listContent: {
//         paddingBottom: 100,
//     },
//     sectionHeader: {
//         fontSize: 20,
//         fontWeight: "bold",
//         marginLeft: 11,
//         marginTop: 20,
//         marginBottom: 10,
//         color: "#000",
//         backgroundColor: "#E6F7FF",
//     },
//     addButton: {
//         backgroundColor: "#007AFF",
//         padding: 10,
//         borderRadius: 5,
//         margin: 10,
//         alignItems: "center",
//     },
//     addButtonText: {
//         color: "#fff",
//         fontWeight: "bold",
//     },
//     groupContainer: {
//         margin: 10,
//         backgroundColor: "#fff",
//         borderRadius: 10,
//         padding: 15,
//         borderColor: "#000",
//         borderWidth: 2,
//         borderBottomWidth: 4,
//     },
//     groupName: {
//         fontWeight: "bold",
//         fontSize: 18,
//         color: "#333",
//     },
//     modalView: {
//         margin: 20,
//         backgroundColor: "white",
//         borderRadius: 20,
//         padding: 35,
//         alignItems: "center",
//         shadowColor: "#000",
//         shadowOffset: {
//             width: 0,
//             height: 2,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 4,
//         elevation: 5,
//     },
//     input: {
//         height: 40,
//         margin: 12,
//         borderWidth: 1,
//         padding: 10,
//         width: "80%",
//     },
//     button: {
//         backgroundColor: "#2196F3",
//         borderRadius: 20,
//         padding: 10,
//         elevation: 2,
//         marginTop: 10,
//     },
//     buttonText: {
//         color: "white",
//         fontWeight: "bold",
//         textAlign: "center",
//     },
//     modalTitle: {
//         fontSize: 18,
//         fontWeight: "bold",
//         marginBottom: 10,
//     },
//     memberItem: {
//         padding: 10,
//         borderBottomWidth: 1,
//         borderBottomColor: "#ccc",
//     },
//     selectedMemberItem: {
//         backgroundColor: "#e6e6e6",
//     },
//     subTitle: {
//         fontSize: 16,
//         fontWeight: "bold",
//         marginTop: 10,
//         marginBottom: 5,
//     },
// });
//
// export default GroupsScreen;
