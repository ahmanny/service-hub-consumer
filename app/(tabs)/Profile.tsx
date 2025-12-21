import Mapbox, { Camera, LocationPuck, MapView } from "@rnmapbox/maps";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
const accessToken =
  "pk.eyJ1IjoiYWhtYW5ueSIsImEiOiJjbWplcjZlaDcwZ2VrM2RzbWdleGlhNmNzIn0.82jeiD0j7aR-Y5nj1T0ByA";

Mapbox.setAccessToken(accessToken);

export default function Profile() {
  const [locationGranted, setLocationGranted] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationGranted(status === "granted");
    })();
  }, []);

  if (!locationGranted) return null; // or show a message asking for permission

  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        <Camera followZoomLevel={12} followUserLocation />
        <LocationPuck
          puckBearingEnabled={true}
          puckBearing="course"
          pulsing={{ isEnabled: true }}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Make the parent fill the screen
  },
  map: {
    flex: 1, // Map fills the parent
  },
});
