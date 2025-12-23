import { getDirections } from "@/services/directions.service";
import { ServiceProfile } from "@/types/service.types";
import * as Location from "expo-location";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type ServiceContextType = {
  selectedService: any;
  direction: any;
  duration: any;
  distance: any;
  directionCoordinates: any;
  setSelectedServce: (s: any) => void;
};
const ServiceContext = createContext({} as ServiceContextType);

export default function ServiceProvider({ children }: PropsWithChildren) {
  const [direction, setDirection] = useState<any>();
  const [selectedService, setSelectedServce] = useState<ServiceProfile>(
    {} as ServiceProfile
  );
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [locationGranted, setLocationGranted] = useState(false);

  // get user location and permission
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setLocationGranted(true);
        const loc = await Location.getCurrentPositionAsync({});
        setUserLocation([loc.coords.longitude, loc.coords.latitude]);
      }
    })();
  }, []);

  // fetch directions whenever selectedService changes
  useEffect(() => {
    const fetchDirections = async () => {
      if (!selectedService?.lat || !selectedService?.long || !userLocation)
        return;
      const serviceLocation = [selectedService.long, selectedService.lat];
      const newDirections = await getDirections(userLocation, serviceLocation);
      // console.log("me:", userLocation);
      // console.log("service:", serviceLocation);
      setDirection(newDirections);
    };
    if (selectedService) {
      fetchDirections();
    }
  }, [selectedService, userLocation]);

  // console.log("Selected:", selectedService);

  return (
    <ServiceContext.Provider
      value={{
        selectedService,
        setSelectedServce,
        direction,
        directionCoordinates: direction?.routes?.[0]?.geometry?.coordinates,
        duration: direction?.routes?.[0]?.duration,
        distance: direction?.routes?.[0]?.distance,
      }}
    >
      {/* Render children only when location is ready */}
      {locationGranted && userLocation ? children : null}
    </ServiceContext.Provider>
  );
}

export const useService = () => useContext(ServiceContext);
