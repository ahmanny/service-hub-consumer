import LineRoute from "@/components/mapViews/LineRoute";
import MapMarkers from "@/components/mapViews/Markers";

import { useService } from "@/providers/service.provider";
import Mapbox, { Camera, LocationPuck, MapView } from "@rnmapbox/maps";
import React from "react";
import { StyleSheet, View } from "react-native";

const accessToken =
  "pk.eyJ1IjoiYWhtYW5ueSIsImEiOiJjbWplcjZlaDcwZ2VrM2RzbWdleGlhNmNzIn0.82jeiD0j7aR-Y5nj1T0ByA";

Mapbox.setAccessToken(accessToken);

export default function Home() {
  const {
    setSelectedServce,
    direction,
    directionCoordinates,
    distance,
    duration,
  } = useService();

  // console.log("Time:", duration);

  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        <Camera followZoomLevel={14} followUserLocation />
        <LocationPuck
          puckBearingEnabled={true}
          puckBearing="course"
          pulsing={{ isEnabled: true }}
        />
        <MapMarkers />

        {directionCoordinates && (
          <LineRoute coordinates={directionCoordinates} />
        )}
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
