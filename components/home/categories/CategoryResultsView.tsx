import { ThemedText } from "@/components/ui/Themed";
import { SERVICE_META, ServiceType } from "@/constants/services";
import { ProviderListItem } from "@/types/provider.types";
import React from "react";
import { View } from "react-native";
import ProviderCard from "../ProviderCard";

interface Props {
  category: ServiceType;
  providers: ProviderListItem[];
}

export default function CategoryResultsView({ category, providers }: Props) {
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
      <ThemedText type="subtitle">
        {SERVICE_META[category]?.label || category}
      </ThemedText>
      {providers.map((i) => (
        <ProviderCard
          key={i._id}
          name={i.firstName}
          category={i.serviceType}
          rating={i.rating}
          price={`₦${i.basePrice.toLocaleString()}`}
          image={i.profilePicture || ""}
          distance={i.distance}
          isInstant={i.availabilityMode === "instant"}
          onPress={() => {}}
          //@ts-ignore
          style={{ width: "100%", marginBottom: 16 }}
        />
      ))}

      {providers.length === 0 && (
        <ThemedText>No providers found in this area.</ThemedText>
      )}
    </View>
  );
}
