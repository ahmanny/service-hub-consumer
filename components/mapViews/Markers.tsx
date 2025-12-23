import pin from "@/assets/images/pin.png";
import services from "@/data/providers.json";
import { useService } from "@/providers/service.provider";
import { CircleLayer, Images, ShapeSource, SymbolLayer } from "@rnmapbox/maps";
import { featureCollection, point } from "@turf/helpers";
import React from "react";

export default function MapMarkers() {
  const { setSelectedServce } = useService();
  const points = services.map((service) =>
    point([service.long, service.lat], { service })
  );
  const onPointPress = async (event: any) => {
    // console.log(JSON.stringify(event, null, 2));
    if (event.features[0].properties.service) {
      setSelectedServce(event.features[0].properties.service);
    }
  };
  return (
    <ShapeSource
      id="providers"
      shape={featureCollection(points)}
      cluster
      onPress={(e) => onPointPress(e)}
    >
      <SymbolLayer
        id="clusters-count"
        style={{
          textField: ["get", "point_count"],
          textSize: 18,
          textColor: "#ffffff",
          textPitchAlignment: "map",
        }}
      />
      <CircleLayer
        belowLayerID="clusters-count"
        id="clusters"
        filter={["has", "point_count"]}
        style={{
          circlePitchAlignment: "map",
          circleColor: "#42E100",
          circleRadius: 20,
          circleOpacity: 1,
          circleStrokeWidth: 2,
          circleStrokeColor: "white",
        }}
      />
      <SymbolLayer
        id="provider-icons"
        filter={["!", ["has", "point_count"]]}
        style={{
          iconImage: "pin",
          iconSize: 0.5,
          iconAllowOverlap: true,
          iconAnchor: "bottom",
        }}
      />
      <Images images={{ pin }} />
    </ShapeSource>
  );
}
