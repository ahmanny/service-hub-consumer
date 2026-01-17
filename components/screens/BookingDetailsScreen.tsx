import { ThemedText } from "@/components/ui/Themed";
import ThemedCard from "@/components/ui/Themed/ThemedCard";
import { SERVICE_META } from "@/constants/services";
import { useThemeColor } from "@/hooks/use-theme-color";
import { BOOKING_STATUS_MAP } from "@/lib/utils/booking.utils";
import { BookingDetails } from "@/types/booking.types";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { format, intervalToDuration } from "date-fns";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
  const router = useRouter();
  const tint = useThemeColor({}, "tint");
  const bg = useThemeColor({}, "background");
  const muted = useThemeColor({}, "placeholder");
  const border = useThemeColor({}, "border");

  const scheduledDate = new Date(booking.scheduledAt);
  const createdDate = new Date(booking.createdAt);
  const statusInfo = BOOKING_STATUS_MAP[booking.status];

  // COUNTDOWN LOGIC
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (booking.status !== "pending" || !booking.deadlineAt) return;

    const interval = setInterval(() => {
      const now = new Date();
      const end = new Date(booking.deadlineAt!);

      if (now >= end) {
        setTimeLeft("Expiring...");
        clearInterval(interval);
        onRefresh();
      } else {
        const duration = intervalToDuration({ start: now, end: end });
        const h = duration.hours || 0;
        const m = duration.minutes || 0;
        const s = duration.seconds || 0;
        setTimeLeft(`${h > 0 ? h + "h " : ""}${m}m ${s}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [booking.deadlineAt, booking.status]);

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
          <SummaryItem
            label="PRICE"
            value={`₦${booking.price.total.toLocaleString()}`}
          />
          <View style={styles.summaryDivider} />
          <SummaryItem label="MODE" value={booking.location.type} capitalize />
          <View style={styles.summaryDivider} />
          <SummaryItem
            label="REF"
            value={`#${booking._id.slice(-6).toUpperCase()}`}
          />
        </ThemedCard>

        {/* PENDING COUNTDOWN ALERT */}
        {booking.status === "pending" && timeLeft && (
          <View
            style={[
              styles.alertBox,
              { backgroundColor: "#FFB80010", borderColor: "#FFB80040" },
            ]}
          >
            <View style={styles.alertHeader}>
              <Ionicons name="time" size={20} color="#FFB800" />
              <ThemedText style={[styles.alertTitle, { color: "#CC9400" }]}>
                Waiting for Provider
              </ThemedText>
            </View>
            <ThemedText style={styles.alertMessage}>
              The provider has{" "}
              <ThemedText type="defaultSemiBold">{timeLeft}</ThemedText> to
              accept this request before it expires.
            </ThemedText>
          </View>
        )}

        {/* EXPIRED / DECLINED ALERT */}
        {(booking.status === "expired" || booking.status === "declined") && (
          <View
            style={[
              styles.alertBox,
              {
                backgroundColor:
                  booking.status === "expired" ? "#5856D610" : "#FF3B3010",
                borderColor:
                  booking.status === "expired" ? "#5856D640" : "#FF3B3040",
              },
            ]}
          >
            <View style={styles.alertHeader}>
              <Ionicons
                name={
                  booking.status === "expired" ? "hourglass" : "close-circle"
                }
                size={20}
                color={booking.status === "expired" ? "#5856D6" : "#FF3B30"}
              />
              <ThemedText
                style={[
                  styles.alertTitle,
                  {
                    color: booking.status === "expired" ? "#5856D6" : "#FF3B30",
                  },
                ]}
              >
                {booking.status === "expired"
                  ? "Request Expired"
                  : "Request Declined"}
              </ThemedText>
            </View>
            <ThemedText style={styles.alertMessage}>
              {booking.status === "expired"
                ? "This provider didn't respond in time. Your request has been automatically cancelled to free up your schedule."
                : booking.declineReason ||
                  "The provider is unavailable for this specific time slot."}
            </ThemedText>
            <TouchableOpacity
              style={[
                styles.rebookBtn,
                {
                  backgroundColor:
                    booking.status === "expired" ? "#5856D6" : "#FF3B30",
                },
              ]}
              // onPress={() => router.push("/(tabs)/explore")}
            >
              <ThemedText style={styles.rebookBtnText}>
                Find Another Provider
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}

        {/* LOGISTICS */}
        <Section title="Logistics" mutedColor={muted}>
          <ThemedCard style={styles.infoCard}>
            <InfoRow
              icon="calendar"
              tint={tint}
              title={format(scheduledDate, "PPPP")}
              subtitle={format(scheduledDate, "p")}
            />
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
                  {booking.location.textAddress || "No address provided"}
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

        {/* USER NOTE */}
        {booking.note && (
          <Section title="Your Request Note" mutedColor={muted}>
            <ThemedCard style={{ padding: 16 }}>
              <ThemedText
                style={{ fontSize: 14, fontStyle: "italic", opacity: 0.8 }}
              >
                "{booking.note}"
              </ThemedText>
            </ThemedCard>
          </Section>
        )}

        {/* TIMELINE */}
        <Section title="Booking Timeline" mutedColor={muted}>
          <ThemedCard style={{ padding: 16 }}>
            <TimelineItem
              label="Request Placed"
              time={format(new Date(booking.createdAt), "MMM d, yyyy • p")}
              isLast={
                !booking.acceptedAt &&
                !booking.declinedAt &&
                !booking.cancelledAt &&
                !booking.rescheduledAt &&
                booking.status === "pending"
              }
              muted={muted}
              tint={tint}
              isActive
            />

            {booking.acceptedAt && (
              <TimelineItem
                label="Provider Accepted"
                time={format(new Date(booking.acceptedAt), "MMM d, yyyy • p")}
                isLast={booking.status === "accepted" && !booking.rescheduledAt}
                muted={muted}
                tint="#0BB45E"
                isActive
              />
            )}

            {booking.rescheduledAt && (
              <TimelineItem
                label="Booking Rescheduled"
                time={format(
                  new Date(booking.rescheduledAt),
                  "MMM d, yyyy • p"
                )}
                isLast={booking.status === "accepted"} 
                muted={muted}
                tint="#5856D6"
                isActive
              />
            )}

            {booking.status === "completed" && (
              <TimelineItem
                label="Service Completed"
                time="Thank you for using our service"
                isLast
                muted={muted}
                tint={tint}
                isActive
              />
            )}

            {booking.declinedAt && (
              <TimelineItem
                label="Request Declined"
                time={format(new Date(booking.declinedAt), "MMM d, yyyy • p")}
                isLast
                muted={muted}
                tint="#FF3B30"
                isActive
              />
            )}

            {booking.cancelledAt && (
              <TimelineItem
                label="Cancelled"
                time={format(new Date(booking.cancelledAt), "MMM d, yyyy • p")}
                isLast
                muted={muted}
                tint="#6B7280"
                isActive
              />
            )}

            {booking.status === "expired" && (
              <TimelineItem
                label="Auto-Expired"
                time={
                  booking.deadlineAt
                    ? format(new Date(booking.deadlineAt), "MMM d, p")
                    : "No response"
                }
                isLast
                muted={muted}
                tint="#9CA3AF"
                isActive
              />
            )}
          </ThemedCard>
        </Section>

        {/* PAYMENT SUMMARY */}
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

        {/* ACTIONS */}
        <View style={styles.actionArea}>
          <BookingActionButtons
            bookingId={booking._id}
            status={booking.status}
          />
        </View>
      </View>
    </ScrollView>
  );
}

// --- HELPER COMPONENTS ---

const SummaryItem = ({ label, value, capitalize }: any) => (
  <View style={styles.summaryItem}>
    <ThemedText style={styles.summaryLabel}>{label}</ThemedText>
    <ThemedText
      type="defaultSemiBold"
      style={{ textTransform: capitalize ? "capitalize" : "none" }}
    >
      {value}
    </ThemedText>
  </View>
);

const InfoRow = ({ icon, tint, title, subtitle }: any) => (
  <View style={styles.infoRow}>
    <View style={[styles.innerIcon, { backgroundColor: tint + "10" }]}>
      <Ionicons name={icon} size={20} color={tint} />
    </View>
    <View>
      <ThemedText type="defaultSemiBold">{title}</ThemedText>
      <ThemedText style={{ color: "#8E8E93", fontSize: 13 }}>
        {subtitle}
      </ThemedText>
    </View>
  </View>
);

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
  premiumHero: { height: 200, justifyContent: "center", alignItems: "center" },
  heroOverlay: { alignItems: "center", marginTop: 20 },
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
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 2 },
  container: { paddingHorizontal: 20, marginTop: -15 },
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
  alertBox: { marginTop: 20, padding: 16, borderRadius: 20, borderWidth: 1 },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  alertTitle: { fontSize: 14, fontWeight: "800", textTransform: "uppercase" },
  alertMessage: { fontSize: 13, lineHeight: 18, opacity: 0.8 },
  rebookBtn: {
    marginTop: 12,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  rebookBtnText: { color: "white", fontWeight: "700", fontSize: 14 },
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
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  ratingText: { fontSize: 13, opacity: 0.7 },
  chatButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineDot: { width: 12, height: 12, borderRadius: 6, zIndex: 2 },
  timelineLine: { width: 2, flex: 1, zIndex: 1, marginVertical: -2 },
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
  actionArea: { marginTop: 32 },
  directionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
});
