import { BookingListItem } from "@/types/booking.types";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { SectionList, StyleSheet, View } from "react-native";
import { ThemedText } from "../ui/Themed";
import { MyBookingCard } from "./MyBookingCard";

/**
 * TYPES
 */

type BookingSection = {
  title: string;
  data: BookingListItem[];
};

interface Props {
  bookings: BookingListItem[];
  emptyText?: string;
  isRefetching: boolean;
  refetch: () => void;
}

/* HELPERS */

function groupBookingsByMonth(bookings: BookingListItem[]): BookingSection[] {
  if (!bookings.length) return [];

  // sort DESC (latest first)
  const sorted = [...bookings].sort(
    (a, b) =>
      new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
  );

  const map = new Map<string, BookingListItem[]>();

  sorted.forEach((booking) => {
    const date = new Date(booking.scheduledAt);
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(booking);
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => {
      const [aYear, aMonth] = a.split("-").map(Number);
      const [bYear, bMonth] = b.split("-").map(Number);
      return (
        new Date(bYear, bMonth).getTime() - new Date(aYear, aMonth).getTime()
      );
    })
    .map(([_, data]) => {
      const d = new Date(data[0].scheduledAt);
      return {
        title: d.toLocaleString("default", {
          month: "long",
          year: "numeric",
        }),
        data,
      };
    });
}
export function BookingSectionList({
  bookings,
  emptyText = "No bookings yet",
  isRefetching,
  refetch,
}: Props) {
  const sections = useMemo(() => groupBookingsByMonth(bookings), [bookings]);

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item._id}
      stickySectionHeadersEnabled={false}
      contentContainerStyle={[
        styles.container,
        !sections.length && { flexGrow: 1 },
      ]}
      ListEmptyComponent={
        <View style={styles.emptyWrapper}>
          <ThemedText style={styles.emptyText}>{emptyText}</ThemedText>
        </View>
      }
      renderSectionHeader={({ section }) => (
        <ThemedText style={styles.monthHeader}>{section.title}</ThemedText>
      )}
      renderItem={({ item }) => (
        <MyBookingCard
          serviceName={item.serviceName}
          serviceType={item.serviceType}
          price={item.price}
          dateLabel={new Date(item.scheduledAt).toLocaleDateString(undefined, {
            weekday: "short",
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
          locationLabel={item.locationLabel}
          status={item.status}
          onPress={() => router.push(`/(tabs)/bookings/${item._id}`)}
        />
      )}
      refreshing={isRefetching}
      onRefresh={refetch}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    paddingBottom: 32,
  },
  // Added a wrapper for the empty state to center it perfectly
  emptyWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100, // Offset to make it look visually centered
  },
  monthHeader: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 12,
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.6,
  },
});
