import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";

interface SavePlaceModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (date: Date, groupId: string) => void;
  placeDetails: any;
}

const SavePlaceModal: React.FC<SavePlaceModalProps> = ({
  isVisible,
  onClose,
  onSave,
  placeDetails,
}) => {
  console.log(placeDetails.name);
  const name = placeDetails.name;
  console.log(typeof placeDetails);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [openGroup, setOpenGroup] = useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const handleSave = () => {
    if (groupId) {
      onSave(date, groupId);
      onClose();
    }
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
          <Text style={styles.modalTitle}>Save Place</Text>

          <Text style={styles.placeDetails}>{name || "Place"}</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          <View style={styles.dropdownContainer}>
            {/* <DropDownPicker
              open={openGroup}
              value={groupId}
              items={groupItems}
              setOpen={setOpenGroup}
              setValue={setGroupId}
              setItems={() => {}}
              placeholder="Select Group"
              style={styles.dropdown}
              textStyle={styles.dropdownText}
            /> */}
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
  },
  placeDetails: {
    fontSize: 18,
    marginBottom: 15,
  },
  dateButton: {
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  dropdownContainer: {
    width: "100%",
    marginBottom: 15,
    zIndex: 1000,
  },
  dropdown: {
    borderColor: "#B7B7B7",
    height: 50,
  },
  dropdownText: {
    fontSize: 16,
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
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SavePlaceModal;
