import { ServiceType } from "@/constants/services";
import { useAuthStore } from "@/stores/auth.store";
import { BookingSetupInfo, ProviderSearchResult } from "@/types/provider.types";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { BackHandler } from "react-native";

type ActiveSheet = "search" | "providers" | "confirm" | "waiting";

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
  setBookingSetup: React.Dispatch<
    React.SetStateAction<BookingSetupInfo | null>
  >;
};

export const FALLBACK_LOCATION: [number, number] = [3.3792, 6.5244];

const ServiceContext = createContext({} as ServiceContextType);

export default function ServiceProvider({ children }: PropsWithChildren) {
  const userLocation = useAuthStore((state) => state.userLocation);
  const [selectedLocation, setSelectedLocation] = useState<
    [number, number] | null
  >(null);

  const [selectedService, setSelectedService] = useState<ServiceType>();

  const [bookingSetup, setBookingSetup] = useState<BookingSetupInfo | null>(
    null
  );

  const [selectedProvider, setSelectedProvider] = useState<
    ProviderSearchResult | undefined
  >(undefined);

  const [activeSheet, setActiveSheet] = useState<ActiveSheet>("search");

  const [directionCoordinates, setDirectionCoordinates] = useState<any>();

  useEffect(() => {
    console.log(activeSheet);
    if (activeSheet === "search") {
      setSelectedProvider(undefined);
    }
    const onBackPress = () => {
      if (activeSheet === "providers") {
        setActiveSheet("search");
        return true;
      }

      if (activeSheet === "confirm") {
        setActiveSheet("providers");
        return true;
      }
      if (activeSheet === "waiting") {
        setActiveSheet("search");
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

  return (
    <ServiceContext.Provider
      value={{
        selectedProvider,
        setSelectedProvider,

        selectedService,
        setSelectedService,

        userLocation: userLocation || FALLBACK_LOCATION,
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

      {userLocation ? children : null}
    </ServiceContext.Provider>
  );
}

export const useService = () => useContext(ServiceContext);
