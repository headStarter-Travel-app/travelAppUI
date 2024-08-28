import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { relative } from 'path';

interface StatusBarProps {
  num: number,
  max: number,
  min: number
}

const StatusBar = ({num, max, min} : StatusBarProps) => {
  const calcNumber = (num/(max-min))*97 + 3
  return (
    <View style={styles.container}>
      <LinearGradient style={{height: "100%", width: "100%", borderRadius: 8 }} start={{x: 0, y: 0}} end={{x:1, y:0}} colors={['#FF0000', '#FFDD00',  '#FFFF00', '#DDFF00', '#00FF00']} />
      <View style={[styles.bar, {left: `${calcNumber}%`}]} />
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
    overflow: "hidden",
    position: "relative",

  },
  bar: {
    position: "absolute",
    right: 0,
    height: "100%",
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 0, 
    borderBottomLeftRadius: 0, 
  }
  
})