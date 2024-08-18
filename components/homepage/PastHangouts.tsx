import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

interface HangoutProps {
  title: string,
  rating: number,
  date: {
    month: string,
    date: string
  }
}

interface PastHangoutsProps {
  hangouts: HangoutProps[]
}

const PastHangouts = ({ hangouts } : PastHangoutsProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Past Hangouts</Text>
      {hangouts?.map(item => <HangoutCard title={item.title} rating={item.rating} date={item.date} />)}
    </View>
  )
}

const HangoutCard = ({title, rating, date} : HangoutProps) => {
  return(
    <View style={styles.card}>
      <Text style={styles.hangoutLabel}>{title}</Text>
      <Text style={styles.rating}>{rating}</Text>
      <Text style={styles.date}>{date.date}{date.month}</Text>
    </View>
  )
}

export default PastHangouts

const styles = StyleSheet.create({
  container: {
    margin: 30,
    flexDirection: "column",
    alignItems: "center",
    rowGap: 12
  },
  title: {
    fontSize: 36,
    fontStyle: "italic",
    color: "#666",
    fontWeight: 800
  },
  card: {
    width: "100%",
    borderWidth: 2,
    borderRadius: 8,
    padding: 10,
    flexDirection: "column",
    rowGap: 4,
    position: "relative",
  },
  date:{
    position: "absolute",
    top: 10,
    right: 10
  }
})