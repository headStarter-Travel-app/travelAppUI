import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { group } from "console";

interface BudgetProps {
  budget: number;
  time: string;
  groupId: string;
  location: string;
  setBudget: (budget: any) => void;
  setTime: (time: any) => void;
  setGroupId: (is: any) => void;
  setLocation: (location: any) => void;
  group: any[];
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
  useEffect(() => {
    if (!group) return;
    setGroupItems([{ label: "Individual", value: "0" }, ...group]);
  }, [group]);

  return (
    <View style={[styles.container, { elevation: 1000, zIndex: 10000 }]}>
      <Text style={styles.label}>Info</Text>
      <View style={[styles.inputRow, { zIndex: 100000 }]}>
        <View style={{ width: 180, height: 50 }}>
          {/* <DropDownPicker 
            open={openBudget}
            value={budget}
            items={budgetItems}
            setOpen={setOpenBudget}
            setValue={setBudget}
            setItems={setBudgetItems}
            placeholder="Select Budget"
            style={styles.picker}
            textStyle={styles.pickerText}
            dropDownContainerStyle={styles.pickerItemContainer}
          /> */}
        </View>
        <View style={{ width: 180, height: 50 }}>
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
          />
        </View>
      </View>
      <View style={styles.inputRow}>
        <View style={{ width: 180, height: 50 }}>
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
          />
        </View>
        {/* <View style={{width: 180, height: 50}}>
          <TextInput
            style={[styles.picker]}
            placeholder="Enter Location"
            onChangeText={e => setLocation(e)}
            value={location}
          />
        </View> */}
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
    rowGap: 12,
  },
  label: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 0.3,
    fontFamily: "DM Sans",
  },
  picker: {
    padding: 1,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: 8,
    backgroundColor: "#FFF",
    margin: 0,
    flex: 0,
    height: "100%",
    paddingLeft: 8,
  },
  pickerText: {
    margin: 1,
    padding: 0,
    fontFamily: "DM Sans",
    fontWeight: "bold",
  },
  pickerItemContainer: {
    zIndex: 50,
    elevation: 50000000,
  },
  inputRow: {
    flexDirection: "row",
    columnGap: 16,
  },
});
