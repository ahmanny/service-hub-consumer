import { getServicesForType, SERVICE_META } from "@/constants/services";
import { useThemeColor } from "@/hooks/use-theme-color";
import { BookingSetupInfo, ProviderWithServices } from "@/types/provider.types";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../themed-text";

export function BookingCard({
  provider,
  bookingSetup,
}: {
  provider: ProviderWithServices;
  bookingSetup: BookingSetupInfo | null;
}) {
  const fallbackImage = require("../../assets/images/fallback-profile.png");
  const metaColor = useThemeColor({}, "placeholder");

  const selectedServiceName = bookingSetup?.service
    ? getServicesForType(provider.serviceType).find(
        (s) => s.value === bookingSetup.service
      )?.name
    : null;

  return (
    <View style={styles.container}>
      {/* PROVIDER INFO */}
      <View style={styles.topRow}>
        <View style={styles.profileLeft}>
          <Image
            source={
              provider.profilePicture
                ? { uri: provider.profilePicture }
                : fallbackImage
            }
            style={styles.profileImage}
          />

          <View style={styles.infoColumn}>
            <View style={styles.titleColumn}>
              <View>
                <ThemedText type="defaultSemiBold" style={styles.name}>
                  {provider.firstName}
                </ThemedText>
                <ThemedText style={styles.serviceType}>
                  {SERVICE_META[provider.serviceType].label}
                </ThemedText>
              </View>

              <ThemedText style={styles.price}>
                ₦ {provider.basePriceFrom.toLocaleString()}
              </ThemedText>
            </View>

            <ThemedText style={[styles.meta, { color: metaColor }]}>
              ⭐ {provider.rating.toFixed(1)} • {provider.distance} km •{" "}
              {provider.duration} mins away
            </ThemedText>
          </View>
        </View>
      </View>

      {/* SUMMARY */}
      {bookingSetup && (
        <>
          <View style={styles.divider} />

          <View style={styles.summary}>
            <ThemedText style={styles.summaryPrimary}>
              {selectedServiceName ?? "Select service"} • ₦{" "}
              {provider.basePriceFrom.toLocaleString()}
            </ThemedText>

            {bookingSetup.locationType && (
              <ThemedText style={styles.summarySecondary}>
                Where:{" "}
                {bookingSetup.locationType === "home"
                  ? "Home service"
                  : "Come to shop"}
              </ThemedText>
            )}

            <ThemedText style={styles.summarySecondary}>
              When:{" "}
              {new Date(bookingSetup.bookingDateTime).toLocaleDateString(
                undefined,
                {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                }
              )}{" "}
              •{" "}
              {new Date(bookingSetup.bookingDateTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </ThemedText>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  topRow: {
    marginBottom: 8,
  },

  profileLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  profileImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#eee",
  },

  infoColumn: {
    flex: 1,
  },

  titleColumn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  name: {
    fontSize: 18,
  },

  serviceType: {
    fontSize: 14,
    color: "#0BB45E",
    marginTop: 2,
  },

  price: {
    fontSize: 17,
    fontWeight: "800",
  },

  meta: {
    fontSize: 14,
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.06)",
    marginVertical: 10,
  },

  summary: {
    gap: 6,
  },

  summaryPrimary: {
    fontSize: 15,
    fontWeight: "600",
  },

  summarySecondary: {
    fontSize: 15,
    color: "#666",
  },
});
