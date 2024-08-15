import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
const API_URL = "https://travelappbackend-c7bj.onrender.com";
import { getUserId } from "@/lib/appwrite";

interface SavePlaceModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (dateTime: Date, groupMembers: string[]) => void;
  placeDetails: any;
}

const SavePlaceModal: React.FC<SavePlaceModalProps> = ({
  isVisible,
  onClose,
  onSave,
  placeDetails,
}) => {
  const name = placeDetails?.name || "Place";
  const [dateTime, setDateTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [openGroup, setOpenGroup] = useState(false);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [groupItems, setGroupItems] = useState<
    Array<{ label: string; value: string }>
  >([]);

  const fetchGroups = useCallback(async (userId: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/get-groups?user_id=${userId}`
      );
      setGroups(response.data.groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      Alert.alert("Error", "Failed to fetch groups");
    }
  }, []);

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      try {
        const userId = await getUserId();
        setCurrentUserId(userId);
        if (userId) {
          await fetchGroups(userId);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUserId();
  }, [fetchGroups]);

  useEffect(() => {
    const formattedGroups = groups.map((group) => ({
      label: group.name,
      value: group.$id,
    }));
    setGroupItems([
      { label: "Individual", value: "individual" },
      ...formattedGroups,
    ]);
  }, [groups]);

  const onDateTimeChange = (event: any, selectedDateTime?: Date) => {
    const currentDateTime = selectedDateTime || dateTime;
    setShowPicker(Platform.OS === "ios");
    setDateTime(currentDateTime);
  };

  const showDatepicker = () => {
    setPickerMode("date");
    setShowPicker(true);
  };

  const showTimepicker = () => {
    setPickerMode("time");
    setShowPicker(true);
  };

  const handleSave = () => {
    let members: string[] = [];
    if (selectedGroup === "individual") {
      members = currentUserId ? [currentUserId] : [];
    } else {
      const selectedGroupData = groups.find(
        (group) => group.$id === selectedGroup
      );
      members = selectedGroupData ? selectedGroupData.members : [currentUserId];
    }
    console.log(placeDetails);

    onSave(dateTime, members);
    let request = {
      uid: currentUserId,
      groupMembers: members,
      date: dateTime.toISOString(),
      rating: 0.0,
      address: placeDetails.address,
      // latitude: placeDetails.latitude,
      // longitude: placeDetails.longitude,
      name: placeDetails.name,
    };
    console.log(request);
    axios
      .post(`${API_URL}/save-preferences`, request)
      .then((response) => {
        console.log(response);
        alert("Preferences saved successfully!");
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to save preferences.");
      });
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Save and Schedule</Text>

          <Text style={styles.placeDetails}>{name}</Text>

          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={showDatepicker}
            >
              <Text>{dateTime.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={showTimepicker}
            >
              <Text>{dateTime.toLocaleTimeString()}</Text>
            </TouchableOpacity>
          </View>

          {showPicker && (
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={dateTime}
                mode={pickerMode}
                is24Hour={true}
                display="default"
                onChange={onDateTimeChange}
                textColor="#000"
                themeVariant="light"
              />
            </View>
          )}

          <View style={styles.dropdownContainer}>
            <DropDownPicker
              open={openGroup}
              value={selectedGroup}
              items={groupItems}
              setOpen={setOpenGroup}
              setValue={setSelectedGroup}
              setItems={setGroupItems}
              placeholder="Select a Group"
              style={styles.dropdown}
              textStyle={styles.dropdownText}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerContainer: {
    backgroundColor: "white",
  },
  modalView: {
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    fontFamily: "DM Sans",
  },
  placeDetails: {
    fontSize: 18,
    marginBottom: 15,
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  dateTimeButton: {
    backgroundColor: "#BB80DF",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: "#000000",
    fontFamily: "spaceGroteskRegular",
  },
  dropdownContainer: {
    width: "100%",
    marginBottom: 15,
    zIndex: 1000,
  },
  dropdown: {
    borderColor: "#000",
    height: 50,
    borderWidth: 2,
    borderBottomWidth: 4
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: "spaceGroteskRegular",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    backgroundColor: "#2196F3",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: "#000000",
    borderBottomWidth: 4,
    fontFamily: "spaceGroteskRegular",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    borderBottomWidth: 4,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "spaceGroteskRegular",
  },
});

export default SavePlaceModal;
