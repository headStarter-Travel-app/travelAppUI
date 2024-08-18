import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
  ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useState, useRef } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";

const API_URL = "https://travelappbackend-c7bj.onrender.com";

interface BudgetProps {
  budget: number;
  time: string;
  groupId: string;
  location: string;
  setBudget: (budget: any) => void;
  setTime: (time: any) => void;
  setGroupId: (id: any) => void;
  setLocation: (location: any) => void;
  group: any[];
  setIsValid: (isValid: boolean) => void;
}

const BudgetContainer = ({
  budget,
  time,
  groupId,
  location,
  setBudget,
  setGroupId,
  setLocation,
  setTime,
  group,
  setIsValid,
}: BudgetProps) => {
  const [openBudget, setOpenBudget] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [openGroup, setOpenGroup] = useState(false);
  const [budgetItems, setBudgetItems] = useState([
    { label: "< 10$", value: 10 },
    { label: "< 20$", value: 20 },
    { label: "< 30$", value: 30 },
  ]);
  const [timeItems, setTimeItems] = useState([
    { label: "Morning", value: "Morning" },
    { label: "Afternoon", value: "Afternoon" },
    { label: "Night", value: "Night" },
  ]);
  const [groupItems, setGroupItems] = useState([
    { label: "Individual", value: "0" },
  ]);

  const scrollViewRef = useRef<ScrollView>(null);
  const [locationText, setLocationText] = useState(location);
  const [isLocationValid, setIsLocationValid] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!group) return;
    setGroupItems([{ label: "Individual", value: "0" }, ...group]);
  }, [group]);

  const fetchGeoLocation = async () => {
    if (locationText === "" || locationText === undefined) {
      setLocation(location);
      setIsValid(true);
      setIsLocationValid(true);
      return;
    }

    try {
      const { data } = await axios.post(`${API_URL}/geoCode`, {
        query: locationText,
      });
      if (data && data.length > 0) {
        setLocation(data[0]); // Assuming the first result is the most relevant
        setIsValid(true);
        setIsLocationValid(true);
      } else {
        setIsValid(false);
        setIsLocationValid(false);
      }
    } catch (error) {
      console.error("Error fetching geolocation:", error);
      setIsValid(false);
      setIsLocationValid(false);
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        if (isTyping) {
          fetchGeoLocation();
          setIsTyping(false);
        }
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [isTyping, locationText]);

  const handleLocationChange = (text: string) => {
    setLocationText(text);
    setIsTyping(true);
    if (text === "") {
      setIsLocationValid(true);
      setIsValid(true);
    }
  };

  const handleLocationBlur = () => {
    if (isTyping) {
      fetchGeoLocation();
      setIsTyping(false);
    }
  };

  return (

    <View style={styles.container}>
      <Text style={styles.label}>Info</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.subTitle}>
          Enter Location, leave blank for current
        </Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: isLocationValid ? "green" : "red" },
          ]}
          placeholder="Enter Location"
          onChangeText={handleLocationChange}
          onBlur={handleLocationBlur}
          value={locationText}
        />
        <View style={styles.locationIcon}>
          {(isLocationValid ? <Text>O</Text> : <Text>X</Text>)}
        </View>
      </View>
      <View style={styles.pickerContainer}>
        <View style={styles.pickerWrapper}>
          <DropDownPicker
            open={openGroup}
            value={groupId}
            items={groupItems}
            setOpen={setOpenGroup}
            setValue={setGroupId}
            setItems={setGroupItems}
            placeholder="Select Group"
            style={styles.picker}
            textStyle={styles.pickerText}
            containerStyle={styles.pickerInnerContainer}
          />
        </View>
        <View style={styles.pickerWrapper}>
          <DropDownPicker
            open={openTime}
            value={time}
            items={timeItems}
            setOpen={setOpenTime}
            setValue={setTime}
            setItems={setTimeItems}
            placeholder="Select Time"
            style={styles.picker}
            textStyle={styles.pickerText}
            containerStyle={styles.pickerInnerContainer}
          />
        </View>
      </View>
    </View>
  );
};

export default BudgetContainer;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    width: "100%",
    padding: 16,
  },
  label: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 0.3,
    fontFamily: "DM Sans",
    marginBottom: 16,
  },
  inputContainer: {
    width: 360,
    marginBottom: 16,
    position: "relative"
  },
  input: {
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: 8,
    backgroundColor: "#FFF",
    padding: 10,
    height: 50,
    width: "100%",
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  pickerWrapper: {
    width: "48%", // Adjust this value to control the gap between pickers
  },
  picker: {
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: 8,
    backgroundColor: "#FFF",
    
  },
  pickerInnerContainer: {
    height: 50,
    
  },
  pickerText: {
    fontFamily: "DM Sans",
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 12,
    color: "gray",
    marginBottom: 5,
  },
  locationIcon: {
    position: "absolute",
    right: 10,
    top: 35,
  }
});
