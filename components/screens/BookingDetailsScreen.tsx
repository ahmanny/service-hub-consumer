import { ThemedButton, ThemedText } from "@/components/ui/Themed";
import ThemedCard from "@/components/ui/Themed/ThemedCard";
import { SERVICE_META } from "@/constants/services"; // Assuming this exists for icons
import { useThemeColor } from "@/hooks/use-theme-color";
import { BOOKING_STATUS_MAP } from "@/lib/utils/booking.utils";
import { BookingDetails } from "@/types/booking.types"; // Path to your type
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const fallbackImage = require("../../assets/images/fallback-profile.png");

interface Props {
  booking: BookingDetails;
}

export default function BookingDetailsScreen({ booking }: Props) {
  const tint = useThemeColor({}, "tint");
  const bg = useThemeColor({}, "background");
  const muted = useThemeColor({}, "placeholder");
  const border = useThemeColor({}, "border");

  // Date formatting logic remains the same...
  const dateObj = new Date(booking.scheduledAt);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const serviceIcon = SERVICE_META[booking.serviceType]?.icon || "gear";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: bg }}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* HERO SECTION */}
      <View style={[styles.hero, { backgroundColor: tint + "15" }]}>
        <View style={styles.heroContent}>
          <View style={[styles.iconBox, { backgroundColor: tint }]}>
            <FontAwesome6 name={serviceIcon} size={24} color="white" />
          </View>
          <ThemedText type="title" style={{ marginTop: 12 }}>
            {booking.serviceName}
          </ThemedText>
          <ThemedText style={{ color: muted }}>
            Ref: {booking._id.slice(-8).toUpperCase()}
          </ThemedText>
        </View>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        {/* STATUS PILL */}
        <ThemedCard style={styles.statusCard}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: BOOKING_STATUS_MAP[booking.status].color },
            ]}
          />
          <ThemedText type="defaultSemiBold" style={{ flex: 1 }}>
            {BOOKING_STATUS_MAP[booking.status].label}
          </ThemedText>
          <ThemedText style={{ color: muted, fontSize: 12 }}>
            ID: {booking._id.slice(0, 8).toUpperCase()}
          </ThemedText>
        </ThemedCard>

        {/* LOGISTICS SECTION */}
        <Section title="Logistics" mutedColor={muted}>
          <ThemedCard style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.innerIcon}>
                <Ionicons name="calendar" size={20} color={tint} />
              </View>
              <View>
                <ThemedText type="defaultSemiBold">{formattedDate}</ThemedText>
                <ThemedText style={{ color: muted, fontSize: 13 }}>
                  {formattedTime}
                </ThemedText>
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: border }]} />
            <View style={styles.infoRow}>
              <View style={styles.innerIcon}>
                <Ionicons name="location" size={20} color={tint} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText type="defaultSemiBold">
                  {booking.location.type === "home"
                    ? "Home Service"
                    : "Provider Shop"}
                </ThemedText>
                <ThemedText
                  numberOfLines={1}
                  style={{ color: muted, fontSize: 13 }}
                >
                  {booking.location.textAddress || "GPS Location Provided"}
                </ThemedText>
              </View>
            </View>
          </ThemedCard>
        </Section>

        {/* PROVIDER SECTION */}
        <Section title="Provider" mutedColor={muted}>
          <ThemedCard style={styles.providerCard}>
            <Image
              source={
                booking.provider.profilePicture
                  ? { uri: booking.provider.profilePicture }
                  : fallbackImage
              }
              style={styles.avatar}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <ThemedText type="defaultSemiBold">
                {booking.provider.firstName}
              </ThemedText>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Ionicons name="star" size={14} color="#FFB800" />
                <ThemedText style={{ fontSize: 13 }}>
                  {booking.provider.rating.toFixed(1)} Rating
                </ThemedText>
              </View>
            </View>
            <TouchableOpacity style={styles.chatButton}>
              <Ionicons name="chatbubble-ellipses" size={20} color={tint} />
            </TouchableOpacity>
          </ThemedCard>
        </Section>

        {/* UPDATED PRICE BREAKDOWN */}
        <Section title="Payment Summary" mutedColor={muted}>
          <ThemedCard style={{ padding: 16, gap: 12 }}>
            <PriceRow label="Base Service Fee" value={booking.price.service} />

            {/* Only show home service fee if it's a home booking and fee > 0 */}
            {booking.location.type === "home" &&
              (booking.price.homeServiceFee ?? 0) > 0 && (
                <PriceRow
                  label="Home Service Charge"
                  value={booking.price.homeServiceFee!}
                />
              )}

            <View
              style={[
                styles.divider,
                { backgroundColor: border, marginVertical: 4 },
              ]}
            />

            <View style={styles.totalRow}>
              <ThemedText type="defaultSemiBold" style={{ fontSize: 16 }}>
                Total Amount
              </ThemedText>
              <ThemedText
                type="defaultSemiBold"
                style={{ color: tint, fontSize: 20 }}
              >
                ₦{booking.price.total.toLocaleString()}
              </ThemedText>
            </View>
          </ThemedCard>
        </Section>

        {/* ACTIONS */}
        <View style={styles.actionArea}>
          {/* CASE 1: ACTIVE BOOKINGS (Pending or Accepted) */}
          {(booking.status === "pending" || booking.status === "accepted") && (
            <>
              <ThemedButton title="Reschedule Booking" />
              <TouchableOpacity style={styles.cancelBtn}>
                <ThemedText style={{ color: "#FF3B30", fontWeight: "600" }}>
                  Cancel Request
                </ThemedText>
              </TouchableOpacity>
            </>
          )}

          {booking.status === "completed" && (
            <>
              <ThemedButton title="Rate Provider" />
              <ThemedButton title="Rebook" variant="secondary" />
            </>
          )}
          {(booking.status === "cancelled" ||
            booking.status === "declined") && (
            <>
              <ThemedButton title="Find Another Provider" />
              <ThemedButton title="Rebook" variant="secondary" />
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

// Helper components...
const PriceRow = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.priceRow}>
    <ThemedText style={{ opacity: 0.6 }}>{label}</ThemedText>
    <ThemedText type="defaultSemiBold">₦{value.toLocaleString()}</ThemedText>
  </View>
);

const Section = ({ title, children, mutedColor }: any) => (
  <View style={{ marginTop: 24 }}>
    <ThemedText style={[styles.sectionTitle, { color: mutedColor }]}>
      {title}
    </ThemedText>
    {children}
  </View>
);

const styles = StyleSheet.create({
  hero: {
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  heroContent: { alignItems: "center" },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    elevation: 2,
    shadowOpacity: 0.05,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: 8,
    marginLeft: 4,
  },
  infoCard: { padding: 4, borderRadius: 20 },
  infoRow: { flexDirection: "row", alignItems: "center", padding: 12, gap: 12 },
  innerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.04)",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: { height: 1, marginHorizontal: 12 },
  providerCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 20,
  },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#eee" },
  chatButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(11, 180, 94, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  actionArea: { marginTop: 32, gap: 12 },
  mainBtn: {
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: { height: 56, alignItems: "center", justifyContent: "center" },
  btnText: { color: "white", fontWeight: "700", fontSize: 16 },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
