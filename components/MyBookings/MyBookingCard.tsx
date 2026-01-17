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
  scheduledLabel: string; // The appointment time
  createdLabel: string; // When the booking was made
  locationLabel: string; // Home service / Come to shop
  status: BookingStatus;
  onPress?: () => void;
}

export function MyBookingCard({
  serviceType,
  serviceName,
  price,
  createdLabel,
  scheduledLabel,
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
    expired: {
      label: "Expired",
      bg: "#F5F5F5",
      text: "#9CA3AF",
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
      {/* Icon */}
      <View style={styles.iconContainer}>
        <FontAwesome6 name={meta.icon} size={18} color="#0BB45E" />
      </View>

      {/* Details */}
      <View style={styles.content}>
        {/* Top Row: Service & Price */}
        <View style={styles.row}>
          <ThemedText style={styles.primaryText} numberOfLines={1}>
            {serviceName} • ₦{formatNumber(price)}
          </ThemedText>

          {CAN_REBOOK.includes(status) && (
            <Pressable
              // onPress={onRebook}
              style={styles.rebookButton}
            >
              <FontAwesome6
                name="clock-rotate-left"
                size={14}
                color="#0BB45E"
              />
            </Pressable>
          )}
        </View>

        {/* Middle Row: Scheduled Date (The most important one) */}
        <View style={styles.dateRow}>
          <Ionicons
            name="calendar-outline"
            size={14}
            color="#0BB45E"
            style={{ marginRight: 4 }}
          />
          <ThemedText style={styles.scheduledText}>{scheduledLabel}</ThemedText>
        </View>

        {/* Bottom Row: Location & Status */}
        <View style={styles.bottomRow}>
          <View>
            <ThemedText style={[styles.locationText, { color: muted }]}>
              {locationLabel}
            </ThemedText>
            {/* Created At - Subtle Metadata */}
            <ThemedText style={[styles.createdText, { color: muted }]}>
              Booked: {createdLabel}
            </ThemedText>
          </View>

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
            <Ionicons name="chevron-forward" size={16} color={muted} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    // Increased height slightly to accommodate the extra line of text nicely
    minHeight: 100,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    // Add a slight shadow or border depending on your design
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16, // Squircle look
    marginRight: 12,
    backgroundColor: "rgba(11, 180, 94, 0.1)", // Light green tint
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 2, // Using gap for consistent spacing
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  primaryText: {
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  scheduledText: {
    fontSize: 13,
    fontWeight: "600",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "flex-end", // Align status pill to bottom of text
    justifyContent: "space-between",
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    fontWeight: "500",
  },
  createdText: {
    fontSize: 10,
    opacity: 0.7,
  },
  rightRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  rebookButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: "rgba(11, 180, 94, 0.05)",
  },
});
