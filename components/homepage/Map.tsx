import { Animated, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import MapView from 'react-native-maps'
import { HangoutMarker, RecommendationMarker } from './markers'

interface MapProps {
  mapLoading : boolean
  region: any
  recommendations: Place[],
  setRegion: () => void,
  markerPress: () => any,
  hangoutPress: () => any,
  hangouts: any[]
}
const DEFAULT_LOCATION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};
interface Place {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  name: string;
  description: string;
  imageUrl: string;
  address: string;
  openingHours: string;
  formattedAddressLines: string[];
}

const Map = ({
  mapLoading,
  region,
  recommendations,
  setRegion,
  hangoutPress,
  markerPress,
  hangouts,
} : MapProps) => {
  const [fadeAnim] = useState(new Animated.Value(0.3));
  
  return (
    !mapLoading ? (
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        mapType="mutedStandard"
        rotateEnabled={true}
        showsUserLocation
        pitchEnabled={true}
      >
        {recommendations?.map((place, index) => (
          <RecommendationMarker
            key={`recommendation-${index}`}
            place={place}
            index={index}
            onPress={markerPress}
          />
        ))}
        {hangouts?.map((place, index) => (
          <HangoutMarker
            key={`hangout-${index}`}
            place={place}
            index={index}
            onPress={hangoutPress}
          />
        ))}
      </MapView>
    ) : (
      <Animated.View
        style={[
          styles.map,
          {
            backgroundColor: "#E0E0E0",
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={{ fontStyle: "italic" }}>
          Loading Location Data...
        </Text>
      </Animated.View>
    )
  )
}

export default Map

const styles = StyleSheet.create({
  map: {
    flex: 1,
    marginTop: 0,
    height: "50%", // Increase map height
    alignItems: "center",
    justifyContent: "center",
  },
})