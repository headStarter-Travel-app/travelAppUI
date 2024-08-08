import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Button from "@/components/usableOnes/button"

const SubmitButton = ({active}:{active:boolean}) => {
  return (
    <View>
      <Button title={"Submit"} disabled={!active} />
    </View>
  )
}

export default SubmitButton

const styles = StyleSheet.create({})