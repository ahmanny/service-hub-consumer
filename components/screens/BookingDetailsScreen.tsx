import { ThemedText } from "@/components/ui/Themed";
import ThemedCard from "@/components/ui/Themed/ThemedCard";
import { SERVICE_META } from "@/constants/services"; // Assuming this exists for icons
import { useThemeColor } from "@/hooks/use-theme-color";
import { BOOKING_STATUS_MAP } from "@/lib/utils/booking.utils";
import { BookingDetails } from "@/types/booking.types"; // Path to your type
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import React from "react";
import {
  Image,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import BookingActionButtons from "../MyBookings/BookingActionButtons";

const fallbackImage = require("../../assets/images/fallback-profile.png");

interface Props {
  booking: BookingDetails;
  isRefetching: boolean;
  onRefresh: () => void;
}

export default function BookingDetailsScreen({
  booking,
  isRefetching,
  onRefresh,
}: Props) {
  const tint = useThemeColor({}, "tint");
  const bg = useThemeColor({}, "background");
  const muted = useThemeColor({}, "placeholder");
  const border = useThemeColor({}, "border");
  const cardBg = useThemeColor({}, "card");

  // Format dates using date-fns or native
  const scheduledDate = new Date(booking.scheduledAt);
  const createdDate = new Date(booking.createdAt);

  const handleGetDirections = () => {
    if (!booking?.location?.geoAddress?.coordinates) return;
    const [lng, lat] = booking.location.geoAddress.coordinates;
    const label = `${booking.provider.firstName}'s Shop`;
    const latLng = `${lat},${lng}`;
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${latLng}`,
      android: `geo:0,0?q=${latLng}(${label})`,
    });
    if (url) Linking.openURL(url);
  };

  const statusInfo = BOOKING_STATUS_MAP[booking.status];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: bg }}
      contentContainerStyle={{ paddingBottom: 60 }}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={onRefresh}
          tintColor={tint}
        />
      }
    >
      {/* PREMIUM HERO SECTION */}
      <View style={[styles.premiumHero, { backgroundColor: tint }]}>
        <View style={styles.heroOverlay}>
          <View style={styles.iconCircleLarge}>
            <FontAwesome6
              name={SERVICE_META[booking.serviceType]?.icon || "gear"}
              size={32}
              color={tint}
            />
          </View>
          <ThemedText style={styles.heroServiceName}>
            {booking.serviceName}
          </ThemedText>
          <View
            style={[
              styles.heroStatusBadge,
              { backgroundColor: "rgba(255,255,255,0.2)" },
            ]}
          >
            <View
              style={[styles.statusDot, { backgroundColor: statusInfo.color }]}
            />
            <ThemedText style={styles.heroStatusText}>
              {statusInfo.label}
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        {/* QUICK INFO SUMMARY */}
        <ThemedCard style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>PRICE</ThemedText>
            <ThemedText type="defaultSemiBold">
              ₦{booking.price.total.toLocaleString()}
            </ThemedText>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>MODE</ThemedText>
            <ThemedText
              type="defaultSemiBold"
              style={{ textTransform: "capitalize" }}
            >
              {booking.location.type}
            </ThemedText>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>REF</ThemedText>
            <ThemedText type="defaultSemiBold">
              #{booking._id.slice(-6).toUpperCase()}
            </ThemedText>
          </View>
        </ThemedCard>

        {/* LOGISTICS & DIRECTIONS */}
        <Section title="Logistics" mutedColor={muted}>
          <ThemedCard style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View
                style={[styles.innerIcon, { backgroundColor: tint + "10" }]}
              >
                <Ionicons name="calendar" size={20} color={tint} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText type="defaultSemiBold">
                  {format(scheduledDate, "PPPP")}
                </ThemedText>
                <ThemedText style={{ color: muted, fontSize: 13 }}>
                  {format(scheduledDate, "p")}
                </ThemedText>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: border }]} />

            <View style={styles.infoRow}>
              <View
                style={[styles.innerIcon, { backgroundColor: tint + "10" }]}
              >
                <Ionicons name="location" size={20} color={tint} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText type="defaultSemiBold">
                  {booking.location.type === "home"
                    ? "Home Service"
                    : "In-Shop Service"}
                </ThemedText>
                <ThemedText
                  numberOfLines={2}
                  style={{ color: muted, fontSize: 13 }}
                >
                  {booking.location.textAddress ||
                    "Address details not provided"}
                </ThemedText>
              </View>
              {booking.location.type === "shop" && (
                <TouchableOpacity
                  style={[styles.directionBtn, { borderColor: tint }]}
                  onPress={handleGetDirections}
                >
                  <Ionicons name="navigate" size={16} color={tint} />
                  <ThemedText
                    style={{ color: tint, fontSize: 12, fontWeight: "700" }}
                  >
                    Directions
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
          </ThemedCard>
        </Section>

        {/* PROVIDER INFO */}
        <Section title="Service Provider" mutedColor={muted}>
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
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#FFB800" />
                <ThemedText style={styles.ratingText}>
                  {booking.provider.rating.toFixed(1)} Rating
                </ThemedText>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.chatButton, { backgroundColor: tint + "15" }]}
            >
              <Ionicons name="chatbubble-ellipses" size={22} color={tint} />
            </TouchableOpacity>
          </ThemedCard>
        </Section>

        {/* TIMELINE / HISTORY */}
        <Section title="Booking Timeline" mutedColor={muted}>
          <ThemedCard style={{ padding: 16 }}>
            <TimelineItem
              label="Request Placed"
              time={format(createdDate, "MMM d, yyyy • p")}
              isLast={false}
              muted={muted}
              tint={tint}
            />
            <TimelineItem
              label="Scheduled For"
              time={format(scheduledDate, "MMM d, yyyy • p")}
              isLast={true}
              muted={muted}
              tint={tint}
              isActive={true}
            />
          </ThemedCard>
        </Section>

        {/*  PAYMENT SUMMARY */}
        <Section title="Payment Details" mutedColor={muted}>
          <ThemedCard style={{ padding: 16, gap: 12 }}>
            <PriceRow label="Base Service" value={booking.price.service} />
            {booking.location.type === "home" && (
              <PriceRow
                label="Home Service Fee"
                value={booking.price.homeServiceFee || 0}
              />
            )}
            <View
              style={[
                styles.divider,
                { backgroundColor: border, marginVertical: 4 },
              ]}
            />
            <View style={styles.totalRow}>
              <ThemedText type="subtitle">Total Amount</ThemedText>
              <ThemedText type="title" style={{ color: tint }}>
                ₦{booking.price.total.toLocaleString()}
              </ThemedText>
            </View>
          </ThemedCard>
        </Section>

        {/*  ACTIONS */}
        <View style={styles.actionArea}>
          <BookingActionButtons status={booking.status} />
        </View>
      </View>
    </ScrollView>
  );
}

// Sub-components
const TimelineItem = ({ label, time, isLast, muted, tint, isActive }: any) => (
  <View style={{ flexDirection: "row", height: isLast ? 40 : 60 }}>
    <View style={{ alignItems: "center", marginRight: 15 }}>
      <View
        style={[
          styles.timelineDot,
          { backgroundColor: isActive ? tint : "#DDD" },
        ]}
      />
      {!isLast && (
        <View style={[styles.timelineLine, { backgroundColor: "#EEE" }]} />
      )}
    </View>
    <View>
      <ThemedText
        style={{ fontSize: 14, fontWeight: isActive ? "700" : "500" }}
      >
        {label}
      </ThemedText>
      <ThemedText style={{ color: muted, fontSize: 12 }}>{time}</ThemedText>
    </View>
  </View>
);
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
  premiumHero: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  heroOverlay: {
    alignItems: "center",
    marginTop: 20,
  },
  iconCircleLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  heroServiceName: {
    color: "white",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 15,
  },
  heroStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  heroStatusText: {
    color: "white",
    fontWeight: "700",
    fontSize: 12,
    marginLeft: 6,
  },
  container: {
    paddingHorizontal: 20,
    marginTop: -15,
  },
  summaryCard: {
    flexDirection: "row",
    padding: 20,
    borderRadius: 24,
    justifyContent: "space-around",
    elevation: 4,
    shadowOpacity: 0.1,
  },
  summaryItem: { alignItems: "center" },
  summaryLabel: {
    fontSize: 10,
    fontWeight: "800",
    opacity: 0.5,
    marginBottom: 4,
  },
  summaryDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  timelineDot: { width: 12, height: 12, borderRadius: 6, zIndex: 2 },
  timelineLine: { width: 2, flex: 1, zIndex: 1, marginVertical: -2 },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  ratingText: { fontSize: 13, opacity: 0.7 },
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
  directionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: "transparent",
  },
});
