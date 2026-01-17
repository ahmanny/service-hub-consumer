import LineRoute from "@/components/mapViews/LineRoute";
import MapMarkers from "@/components/mapViews/Markers";

import ConfirmSheet from "@/components/BottomSheets/ConfirmSheet";
import ProvidersSheet from "@/components/BottomSheets/ProvidersSheet";
import SearchSheet from "@/components/BottomSheets/SearchSheet";
import WaitingSheet from "@/components/BottomSheets/WaitingSheet";
import { useService } from "@/providers/service.provider";
import Mapbox, { LocationPuck } from "@rnmapbox/maps";
import { StatusBar } from "expo-status-bar";
import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";

const accessToken =
  "pk.eyJ1IjoiYWhtYW5ueSIsImEiOiJjbWplcjZlaDcwZ2VrM2RzbWdleGlhNmNzIn0.82jeiD0j7aR-Y5nj1T0ByA";

Mapbox.setAccessToken(accessToken);

export default function Search() {
  const cameraRef = useRef<Mapbox.Camera>(null);
  const { selectedProvider, userLocation, activeSheet } = useService();

  const directionCoordinates = selectedProvider?.directionCoordinates;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          marginLeft: -16,
          marginTop: -32,
        }}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: "black",
            borderWidth: 3,
            borderColor: "white",
            // transform: [{ scale: isMoving ? 1.1 : 1 }],
          }}
        />
      </View>

      <Mapbox.MapView
        style={styles.map}
        // styleURL={"mapbox://styles/mapbox/dark-v11"}
        logoEnabled={false}
        compassEnabled
        compassPosition={{ top: 40, right: 7 }}
      >
        <Mapbox.Camera
          ref={cameraRef}
          centerCoordinate={userLocation}
          zoomLevel={15}
          animationMode="moveTo"
          animationDuration={1200}
        />
        <LocationPuck
          puckBearingEnabled={true}
          puckBearing="course"
          pulsing={{ isEnabled: true }}
        />
        <MapMarkers />

        {directionCoordinates && (
          <LineRoute coordinates={directionCoordinates} />
        )}
      </Mapbox.MapView>
      {activeSheet === "search" && <SearchSheet />}
      {activeSheet === "providers" && <ProvidersSheet />}
      {activeSheet === "confirm" && <ConfirmSheet />}
      {activeSheet === "waiting" && <WaitingSheet />}
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
