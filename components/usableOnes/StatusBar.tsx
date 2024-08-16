import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback } from 'react'

interface StatusBarProps {
  num: number,
  max: number,
  min: number,
  color: string
}

const StatusBar = ({num, max, min, color} : StatusBarProps) => {

  const currWidth = useCallback(() => {
    return num / (max-min) * 93 + 7;
  }, [num, max, min]);
  return (
    <View style={styles.container}>
      <View style={[styles.bar, {
        width: `${currWidth()}%`,
        backgroundColor: color
      }]} />
    </View>
  )
}

export default StatusBar

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    borderRadius: 12,
    borderWidth: 2,
    borderBottomWidth: 4,
    flexDirection: "column",
    alignItems: "flex-start",
    overflow: "hidden"
  },
  bar: {
    height: "100%",
    borderRadius: 10,
  }
  
})