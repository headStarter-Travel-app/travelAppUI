import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FriendsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const friends = [
    { id: '1', name: 'Friend 1', note: 'Note' },
    { id: '2', name: 'Friend 2', note: 'Note' },
    { id: '3', name: 'Friend 3', note: 'Note' },
    // Add more friends as needed
  ];

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search friends..."
          placeholderTextColor="#C7C7CD"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="ios-search" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={friends.filter(friend => friend.name.toLowerCase().includes(searchQuery.toLowerCase()))}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.friendContainer}>
            <View style={styles.friendInfo}>
              <View style={styles.avatar} />
              <Text style={styles.friendName}>{item.name}</Text>
              <Text style={styles.friendNote}>{item.note}</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#E6F7FF",
      marginTop: 50,
    },
    searchContainer: {
      margin: 10,
      backgroundColor: "#fff",
      borderRadius: 5,
      padding: 10,
      borderColor: "#000",
      borderWidth: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    searchInput: {
      flex: 1,
      height: 40,
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000',
      fontFamily: 'spaceGroteskBold',
    },
    iconContainer: {
      marginLeft: 10,
    },
    list: {
      marginTop: 20,
    },
    friendContainer: {
      margin: 10, // Added margin to match search container
      backgroundColor: "#fff",
      borderRadius: 5,
      padding: 10,
      borderColor: "#000",
      borderWidth: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    friendInfo: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    avatar: {
      width: 40,
      height: 40,
      backgroundColor: '#D9D9D9',
      borderRadius: 20,
      marginRight: 10
    },
    friendName: {
      fontWeight: 'bold',
      fontSize: 18
    },
    friendNote: {
      fontSize: 16,
      color: '#888888'
    },
    addButton: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: '#007AFF',
      color: '#fff'
    },
    addButtonText: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 'bold'
    }
  });

export default FriendsScreen;
