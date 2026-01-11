import { ServiceType } from "@/constants/services";
import { ProvidersDashboardData } from "@/types/provider.types";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { TabType } from "../CategoryTabs";
import ProviderCard from "../ProviderCard";
import SectionHeader from "../SectionHeader";
import { router } from "expo-router";

interface Props {
  data: ProvidersDashboardData;
  onCategoryChange: (tab: TabType) => void;
}
export default function DiscoveryView({ data, onCategoryChange }: Props) {
  const sectionConfig: { type: ServiceType; title: string }[] = [
    { type: "barber", title: "Barbers Near You" },
    { type: "electrician", title: "Top Electricians" },
    { type: "plumber", title: "Emergency Plumbing" },
    { type: "house_cleaning", title: "Cleaning Services" },
    { type: "hair_stylist", title: "Hair Stylists" },
  ];

  const handlePress = (id: string) => {
    router.push(`/(tabs)/home/${id}`)
    console.log(id);
  };

  return (
    <>
      {sectionConfig.map((section) => {
        const providers = data[section.type];

        if (!providers || providers.length === 0) return null;

        return (
          <View key={section.type} style={styles.sectionContainer}>
            <SectionHeader
              title={section.title}
              onViewAll={() => onCategoryChange(section.type)}
            />
            <FlatList
              horizontal
              data={providers}
              keyExtractor={(item) => item._id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalListContent}
              snapToInterval={196}
              decelerationRate="fast"
              renderItem={({ item }) => (
                <ProviderCard
                  name={item.firstName}
                  category={item.serviceType}
                  rating={item.rating}
                  price={`₦${item.basePrice.toLocaleString()}`}
                  image={item.profilePicture || ""}
                  distance={item.distance}
                  isInstant={item.availabilityMode === "instant"}
                  onPress={() => handlePress(item._id)}
                />
              )}
            />
          </View>
        );
      })}

      {/* POPULAR / CLOSEST SECTION
      <SectionHeader title="Closest to You" onViewAll={() => {}} />
      <View style={styles.verticalListContent}>
        {MOCK_PROVIDERS.filter((p) => p.isClosest).map((item) => (
          <PopularProviderCard
            key={item._id}
            name={item.firstName}
            rating={item.rating}
            image={item.profilePicture || ""}
            onPress={() => handlePress(item._id)}
          />
        ))}
      </View> */}
      <View style={{ height: 40 }} />
    </>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 8,
  },
  horizontalListContent: {
    paddingLeft: 20,
    paddingRight: 4,
  },
  verticalListContent: {
    paddingHorizontal: 20,
    gap: 12, // Gap between vertical cards
  },
});
