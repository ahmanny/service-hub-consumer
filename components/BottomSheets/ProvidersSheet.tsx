import { SERVICE_META } from "@/constants/services";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useSearchProviders } from "@/hooks/useSearchProviders";
import { useService } from "@/providers/service.provider";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useEffect, useRef } from "react";
import { FlatList, Keyboard, Text } from "react-native";
import ProviderResultCard from "../mapViews/ProviderResultCard";
import ProviderResultCardSkeleton from "../skeletons/ProviderResultCardSkeleton";
import { ThemedButton } from "../ui/Themed";

export default function ProvidersSheet() {
  const {
    selectedProvider,
    setSelectedProvider,
    userLocation,
    selectedService,
    activeSheet,
    setActiveSheet,
    bookingSetup,
  } = useService();

  const handleSelectProvider = async () => {
    // Close UI immediately
    Keyboard.dismiss();
    setActiveSheet("confirm");
  };

  const { data: nearbyProviders, isFetching } = useSearchProviders(
    {
      serviceType: selectedService || "barber",
      lat: userLocation[1],
      lng: userLocation[0],
      bookingDateTime: bookingSetup?.bookingDateTime || "",
      locationType: bookingSetup?.locationType || null,
      service: bookingSetup?.service || "",
    },
    activeSheet === "providers" &&
      selectedService !== undefined &&
      bookingSetup !== null
  );

  const providersBottomSheetRef = useRef<BottomSheet>(null);
  const textColor = useThemeColor({}, "text");

  useEffect(() => {
    if (activeSheet !== "providers") {
      providersBottomSheetRef.current?.close();
    }
  }, [activeSheet]);

  useEffect(() => {
    // console.log(nearbyProviders);
    if (nearbyProviders && nearbyProviders.length > 0) {
      const closestProvider = nearbyProviders.find((p) => p.isClosest);
      if (closestProvider) {
        setSelectedProvider(closestProvider);
      }
    }
  }, [nearbyProviders]);

  return (
    <BottomSheet
      ref={providersBottomSheetRef}
      index={activeSheet === "providers" ? 1 : -1}
      snapPoints={["30%"]}
      enablePanDownToClose={false}
      backgroundStyle={{
        backgroundColor: useThemeColor({}, "background"),
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 10,
      }}
    >
      <BottomSheetView style={{ flex: 1, padding: 16, gap: 12 }}>
        <>
        
        </>
        {selectedService && (
          <Text
            style={{
              textAlign: "center",
              fontWeight: "700",
              fontSize: 16,
              color: textColor,
            }}
          >
            Nearby {SERVICE_META[selectedService].label}s
          </Text>
        )}

        {isFetching ? (
          <FlatList
            data={[1, 2, 3]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={() => <ProviderResultCardSkeleton />}
          />
        ) : (
          <>
            <FlatList
              data={nearbyProviders}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <ProviderResultCard
                  item={item}
                  selected={selectedProvider?._id === item._id}
                  onPress={() => setSelectedProvider(item)}
                />
              )}
            />
            <ThemedButton
              title="Select"
              variant="primary"
              onPress={() => handleSelectProvider()}
              disabled={!selectedProvider}
            />
          </>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
}
