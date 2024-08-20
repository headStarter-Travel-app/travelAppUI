import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback } from 'react'
import StatusBar from '@/components/usableOnes/StatusBar'

interface CurrentHangoutProps {
  title: string
  members: string[],
  eta: {
    start: number, 
    end: number, 
    curr: number,
    units: string
  }
}

const CurrentHangout = ({title, members, eta} : CurrentHangoutProps) => {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.members}>
        <Text style={styles.label}>Members:</Text>
        <View style={styles.memberContainer}>
          {members?.map(member => <View style={styles.memberCard}>
            <Text style={styles.memberCardLabel}>{member}</Text>
          </View>)}
        </View>
      </View>
      <View style={styles.eta}>
        <Text style={styles.label}>Time to Meet: {eta?.end - eta?.curr} mins</Text>
        <View style={styles.bar}>
          <StatusBar num={eta?.curr} min={eta?.start} max={eta?.end} color={"#ABFF24"}/>
        </View>
      </View>
    </View>
  )
}

export default CurrentHangout

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    backgroundColor: "#fff",
    flexDirection: "column",
    alignItems: "flex-start",
    margin: 30,
    borderRadius: 8,
    rowGap: 16,
    padding: 10,
    fontFamily: "spaceGroteskRegular",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "spaceGroteskBold",
  },
  members: {
    flexDirection: "column",
    
    rowGap: 4,
  },
  label: {
    fontSize: 12,
    fontFamily: "spaceGroteskRegular",
    width: "100%",
  },
  memberCard: {
    borderWidth: 2,
    backgroundColor: "#EFFAFF",
    padding: 4,
    borderRadius: 8,
    height: 28,
  },
  memberCardLabel: {
    fontSize: 12,
    letterSpacing: .4,
    fontFamily: "spaceGroteskBold",
  },
  memberContainer: {
    
    flexDirection: "row",
    width: "100%",
    columnGap: 4,
    rowGap: 4,
    flexWrap: "wrap"
  },
  eta: {
    flexDirection: "column",
    rowGap: 4,
    width: "100%"
  },
  bar: {
    height: 20,
    width: "100%"
  }
})