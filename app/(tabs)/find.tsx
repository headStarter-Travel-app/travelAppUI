import React, { useState, useEffect, useCallback } from "react";
import moment, { Moment } from "moment";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { Account, Client, Databases, ID, Storage } from "react-native-appwrite";
import { getUserId } from "@/lib/appwrite";
import { getUser } from "@/lib/appwrite";
import axios from "axios";
const API_URL = "https://travelappbackend-c7bj.onrender.com";
import { MaterialIcons } from "@expo/vector-icons";

const HangoutCard = ({ hangout }: { hangout: any }) => {
  const [members, setMembers] = useState<string[]>([]);

  //This funciton gets all the member names
  const getDate = useCallback((date: string) => {
    var localTime = moment(date).tz(moment.tz.guess())
    date = localTime.format()
    var sample = "2024-08-14T03:50:07.151+00:00"
    const month = date.substring(5, 7);
    const day = date.substring(8, 10);
    const hour = date.substring(11, 13);
    const min = date.substring(14, 16);
    var plainMonth;
    switch(month){
      case "01": plainMonth = "Janurary"; break;
      case "02": plainMonth = "Feburary"; break;
      case "03": plainMonth = "March"; break;
      case "04": plainMonth = "April"; break;
      case "05": plainMonth = "May"; break;
      case "06": plainMonth = "June"; break;
      case "07": plainMonth = "July"; break;
      case "08": plainMonth = "August"; break;
      case "09": plainMonth = "September"; break;
      case "10": plainMonth = "October"; break;
      case "11": plainMonth = "November"; break;
      case "12": plainMonth = "December"; break;
    }
    return plainMonth + " " + day + " @ " + hour + ":" + min;
  }, [])

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const memberPromises = hangout.groupMembers.map((memberId: string) =>
          getUser(memberId)
        );
        const memberDocuments = await Promise.all(memberPromises);
        const memberNames = memberDocuments.map(
          (doc) => doc.firstName + " " + doc.lastName
        );
        setMembers(memberNames);
      } catch (error) {
        console.error("Error fetching member details:", error);
      }
    };

    fetchMembers();
  }, [hangout.groupMembers]);

  //Each UI carda is put here
  console.log(hangout.date.moment)
  return (
    <View style={styles.card}>
      <Text style={styles.locationName}>{hangout.name}</Text>
      <Text style={styles.date}>{getDate(hangout.date)}</Text>
      <Text style={styles.address}>{hangout.address}</Text>
      <Text style={styles.membersTitle}>Group Members:</Text>
      {members.map((member, index) => (
        <Text key={index} style={styles.memberName}>
          {member}
        </Text>
      ))}
      
    </View>
  );
};

//Somehow make a way for this to rerender all elements when you add a new element, or swipe down, or smth smth yk, aslo the time will be in zulu so use moment or smth to make it into the local timezone (moment.guess) or something like that usually works
//See if you can get the meter to work in real time
const HangoutsPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [hangouts, setHangouts] = useState<any[]>([]);

  

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getUserId();
        setUserId(id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);
  //This gets all saved hangouts, console log it to see what you have

  useEffect(() => {
    if (userId) {
      axios
        .get(`${API_URL}/get-savedHangouts?user_id=${userId}`)
        .then((response) => {
          setHangouts(response.data.saved_hangouts);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [userId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hangouts Page</Text>
      <FlatList
        data={hangouts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <HangoutCard hangout={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 48,
    flexDirection: "column",
    alignItems: "center"
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    position: "relative"
  },
  locationName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  membersTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  memberName: {
    fontSize: 14,
    marginLeft: 10,
  },
  container2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  title2: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    marginTop: 10,
    color: "#666",
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    marginTop: 20,
    color: "#888",
    textAlign: "center",
  },
  date: {
    color: "#aaa",
    fontStyle: "italic",
  }
});

const UnderConstruction = () => {
  return (
    <View style={styles.container2}>
      <MaterialIcons name="construction" size={80} color="#FFA500" />
      <Text style={styles.title2}>Under Construction</Text>
      <Text style={styles.subtitle}>
        We're working hard to create this page.
      </Text>
      <Text style={styles.message}>Please check back soon!</Text>
    </View>
  );
};
export default HangoutsPage;
