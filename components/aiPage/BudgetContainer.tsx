import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker';

const BudgetContainer = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ]);
  const renderDropDown = useCallback(() => {
    return (
      <View style={{width: 180, height: 50}}>
        <DropDownPicker 
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder="Select an option"
          style={styles.picker}
          textStyle={styles.pickerText}
        />
      </View>
    )

  }, [items, open, value, styles])
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Info</Text>
      <View style={styles.inputRow}>
        {renderDropDown()}
        {renderDropDown()}
      </View>
      <View style={styles.inputRow}>
        {renderDropDown()}
        {renderDropDown()}
      </View>
    </View>
  )
}

export default BudgetContainer

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    rowGap: 12
  },
  label: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: .3
  },
  picker: {
    padding: 1,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: 8,
    backgroundColor: "#FFF",
    margin: 0,
    flex: 0,
  },
  pickerText : {
    margin: 1,
    padding: 0
  },
  inputRow: {
    flexDirection: "row",
    columnGap: 16
  }
})