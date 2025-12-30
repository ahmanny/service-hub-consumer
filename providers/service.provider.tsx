import { ThemedView } from "@/components/ui/Themed";
import { ServiceType } from "@/constants/services";
import { BookingSetupInfo, ProviderSearchResult } from "@/types/provider.types";
import * as Location from "expo-location";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { ActivityIndicator, BackHandler } from "react-native";

type ActiveSheet = "search" | "booking_setup" | "providers" | "booking" | null;

type ServiceContextType = {
  selectedService: ServiceType | undefined;
  setSelectedService: React.Dispatch<
    React.SetStateAction<ServiceType | undefined>
  >;

  selectedProvider: ProviderSearchResult | undefined;
  setSelectedProvider: React.Dispatch<
    React.SetStateAction<ProviderSearchResult | undefined>
  >;

  userLocation: [number, number];
  selectedLocation: [number, number] | null;
  setSelectedLocation: React.Dispatch<
    React.SetStateAction<[number, number] | null>
  >;

  activeSheet: ActiveSheet;
  setActiveSheet: React.Dispatch<React.SetStateAction<ActiveSheet>>;

  directionCoordinates: any;
  setDirectionCoordinates: React.Dispatch<React.SetStateAction<any>>;

  bookingSetup: BookingSetupInfo | null;
  setBookingSetup: React.Dispatch<React.SetStateAction<BookingSetupInfo | null>>;
};

const FALLBACK_LOCATION: [number, number] = [3.3792, 6.5244];

const ServiceContext = createContext({} as ServiceContextType);

export default function ServiceProvider({ children }: PropsWithChildren) {
  // states
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [selectedLocation, setSelectedLocation] = useState<
    [number, number] | null
  >(null);
  const [locationGranted, setLocationGranted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [selectedService, setSelectedService] = useState<ServiceType>();

  const [bookingSetup, setBookingSetup] = useState<BookingSetupInfo | null>(null);

  const [selectedProvider, setSelectedProvider] = useState<
    ProviderSearchResult | undefined
  >(undefined);

  const [activeSheet, setActiveSheet] = useState<ActiveSheet>("search");

  const [directionCoordinates, setDirectionCoordinates] = useState<any>();

  // get user location and permission
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setUserLocation(FALLBACK_LOCATION);
        setSelectedLocation(FALLBACK_LOCATION);
        setIsReady(true);
        return;
      }
      setLocationGranted(true);
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setUserLocation([loc.coords.longitude, loc.coords.latitude]);
      setIsReady(true);
    })();
  }, []);

  useEffect(() => {
    console.log(activeSheet);
    if (activeSheet === "search") {
      setSelectedProvider(undefined);
    }
    const onBackPress = () => {
      if (activeSheet === "booking_setup") {
        setActiveSheet("search");
        return true; // prevent app exit
      }

      if (activeSheet === "providers") {
        setActiveSheet("booking_setup");
        return true;
      }

      if (activeSheet === "booking") {
        setActiveSheet("providers");
        return true;
      }

      return false; // allow default behavior
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => subscription.remove();
  }, [activeSheet]);

  if (!isReady || !userLocation) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size={"large"} />
      </ThemedView>
    );
  }

  return (
    <ServiceContext.Provider
      value={{
        selectedProvider,
        setSelectedProvider,

        selectedService,
        setSelectedService,

        userLocation,
        selectedLocation,
        setSelectedLocation,

        activeSheet,
        setActiveSheet,

        directionCoordinates,
        setDirectionCoordinates,

        bookingSetup,
        setBookingSetup,
      }}
    >
      {/* Render children only when location is ready */}

      {locationGranted && userLocation ? children : null}
    </ServiceContext.Provider>
  );
}

export const useService = () => useContext(ServiceContext);
