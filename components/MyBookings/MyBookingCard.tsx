import { ThemedText } from "@/components/ui/Themed";
import { SERVICE_META, ServiceType } from "@/constants/services";
import { useThemeColor } from "@/hooks/use-theme-color";
import { formatNumber } from "@/lib/utils";
import { BookingStatus } from "@/types/booking.types";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

interface BookingCardProps {
  serviceType: ServiceType;
  serviceName: string;
  price: number;
  dateLabel: string; // e.g Tue, 12 Mar • 2:30 PM
  locationLabel: string; // Home service / Come to shop
  status: BookingStatus;
  onPress?: () => void;
}

export function MyBookingCard({
  serviceType,
  serviceName,
  price,
  dateLabel,
  locationLabel,
  status,
  onPress,
}: BookingCardProps) {
  const textColor = useThemeColor({}, "text");
  const muted = useThemeColor({}, "placeholder");
  const cardBg = useThemeColor({}, "card");

  const statusConfig = {
    pending: {
      label: "Pending",
      bg: "#FFF7E6",
      text: "#B76E00",
    },
    accepted: {
      label: "Accepted",
      bg: "#E9F9F0",
      text: "#0BB45E",
    },
    declined: {
      label: "Declined",
      bg: "#FEE2E2",
      text: "#B91C1C",
    },
    upcoming: {
      label: "Upcoming",
      bg: "#E9F9F0",
      text: "#0BB45E",
    },
    completed: {
      label: "Completed",
      bg: "#F2F2F2",
      text: "#6B7280",
    },
    cancelled: {
      label: "Cancelled",
      bg: "#F2F2F2",
      text: "#6B7280",
    },
  }[status];

  const CAN_REBOOK: BookingStatus[] = ["completed", "cancelled", "declined"];

  const meta = SERVICE_META[serviceType];
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: cardBg, opacity: pressed ? 0.9 : 1 },
      ]}
    >
      {/* Avatar */}
      <View style={styles.iconContainer}>
        <FontAwesome6 name={meta.icon} size={18} color="#0BB45E" />
      </View>

      {/* Details */}
      <View style={styles.content}>
        <View style={styles.bottomRow}>
          <ThemedText style={styles.primaryText}>
            {serviceName} • ₦{formatNumber(price)}
          </ThemedText>

          {CAN_REBOOK.includes(status) && (
            <Pressable
              onPress={() => console.log("Rebook pressed")}
              style={styles.rebookButton}
            >
              <FontAwesome6
                name="clock-rotate-left"
                size={16}
                color="#0BB45E"
                style={{ marginLeft: 4 }}
              />
            </Pressable>
          )}
        </View>

        <ThemedText style={[styles.secondaryText, { color: muted }]}>
          On: {dateLabel}
        </ThemedText>

        <View style={styles.bottomRow}>
          <ThemedText style={[styles.locationText, { color: muted }]}>
            {locationLabel}
          </ThemedText>

          <View style={styles.rightRow}>
            <View
              style={[styles.statusPill, { backgroundColor: statusConfig.bg }]}
            >
              <ThemedText
                style={[styles.statusText, { color: statusConfig.text }]}
              >
                {statusConfig.label}
              </ThemedText>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color={muted}
              style={{ marginLeft: 4 }}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 92,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: "#E5E5E5",
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
    justifyContent: "space-between",
  },

  primaryText: {
    fontSize: 15,
    fontWeight: "600",
  },

  secondaryText: {
    fontSize: 14,
    // marginTop: 2,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // marginTop: 2,
  },

  locationText: {
    fontSize: 13,
  },

  rightRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusPill: {
    height: 22,
    paddingHorizontal: 10,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  rebookButton: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "center",
  },
});
