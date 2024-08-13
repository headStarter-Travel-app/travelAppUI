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
  onSave: (dateTime: Date, groupId: string) => void;
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
  const [groupId, setGroupId] = useState<string | null>(null);
  const [openGroup, setOpenGroup] = useState(false);

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
    if (groupId) {
      onSave(dateTime, groupId);
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
            <DateTimePicker
              value={dateTime}
              mode={pickerMode}
              is24Hour={true}
              display="default"
              onChange={onDateTimeChange}
            />
          )}

          <View style={styles.dropdownContainer}>
            <DropDownPicker
              open={openGroup}
              value={groupId}
              items={[]} // You need to provide the group items here
              setOpen={setOpenGroup}
              setValue={setGroupId}
              setItems={() => {}}
              placeholder="Select Group"
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
  },
  dropdownContainer: {
    width: "100%",
    marginBottom: 15,
    zIndex: 1000,
  },
  dropdown: {
    borderColor: "#BB80DF",
    height: 50,
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
