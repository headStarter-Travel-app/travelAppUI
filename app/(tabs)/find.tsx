import React, { useState, useEffect, useCallback, useRef } from "react";
import moment, { Moment } from "moment";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Animated
} from "react-native";
import { Account, Client, Databases, ID, Storage } from "react-native-appwrite";
import { getUserId } from "@/lib/appwrite";
import { getUser } from "@/lib/appwrite";
import axios from "axios";
import { useFocusEffect } from "expo-router";
const API_URL = "https://travelappbackend-c7bj.onrender.com";
import { MaterialIcons } from "@expo/vector-icons";
import { opacity } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

let globalHangouts: any[] = [];
const HangoutCard = ({ hangout }: { hangout: any }) => {
  const [members, setMembers] = useState<string[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current
  useEffect(() => {

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400*hangout.index + 1000,
      useNativeDriver: true,
    }).start()
  }, [hangout])
  //This funciton gets all the member names
  const getDate = useCallback((dateString: any) => {
    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }

      const formatter = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      return formatter.format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  }, []);

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
  return (
    <Animated.View style={[styles.card, {opacity: fadeAnim}]}>
      <Text style={styles.locationName}>{hangout.name}</Text>
      <Text style={styles.date}>{getDate(hangout.date)}</Text>
      <Text style={styles.address}>{hangout.address}</Text>
      <Text style={styles.membersTitle}>Group Members:</Text>
      {members.map((member, index) => (
        <Text key={index} style={styles.memberName}>
          {member}
        </Text>
      ))}
    </Animated.View>
  );
};

//Somehow make a way for this to rerender all elements when you add a new element, or swipe down, or smth smth yk, aslo the time will be in zulu so use moment or smth to make it into the local timezone (moment.guess) or something like that usually works
//See if you can get the meter to work in real time
const HangoutsPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [hangouts, setHangouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHangouts = useCallback(async () => {
    if (userId) {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/get-savedHangouts?user_id=${userId}`
        );
        const hangoutsIndexed = (response.data.saved_hangouts as any[]).map((item, index) => {
          return {...item, index: index}
        })
        setHangouts(hangoutsIndexed);
      } catch (error) {
        console.error("Error fetching hangouts:", error);
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    }
  }, [userId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHangouts();
  }, [fetchHangouts]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getUserId();
        setUserId(id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
        setIsLoading(false);
      }
    };

    fetchUserId();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchHangouts();
    }, [fetchHangouts])
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading hangouts...</Text>
      </View>
    );
  }
  console.log(hangouts[0])
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hangouts</Text>
      {hangouts.length > 0 ? (
        <FlatList
          data={hangouts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <HangoutCard key={item.$id} hangout={item} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#0000ff"]}
              tintColor="#0000ff"
            />
          }
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.noHangoutsText}>No hangouts found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 48,
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 20,
    fontFamily: "spaceGroteskBold"
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    position: "relative",
    shadowOpacity: .3,
    shadowOffset: {width: 0, height:4}
  },
  locationName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "spaceGroteskBold"
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    fontFamily: "spaceGroteskRegular"
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
    fontFamily: "spaceGroteskRegular"
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
    fontFamily: "spaceGroteskRegular"
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
    fontFamily: "spaceGroteskItalic"
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  noHangoutsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  flatListContent: {
    paddingBottom: 100, // Add extra padding at the bottom
  },
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
export { globalHangouts };
