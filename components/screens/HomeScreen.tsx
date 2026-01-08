import { ThemedText } from "@/components/ui/Themed";
import ThemedCard from "@/components/ui/Themed/ThemedCard";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getGreeting } from "@/lib/utils";
import { HomeData } from "@/types/home.types";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar"; // Import this
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Import this

interface Props {
  data: HomeData;
}

export default function HomeScreen({ data }: Props) {
  const tint = useThemeColor({}, "tint");
  const bg = useThemeColor({}, "background");
  const muted = useThemeColor({}, "placeholder");
  const border = useThemeColor({}, "border");

  const greeting = getGreeting();

  const formatUpcomingDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const handleLocationPress = () => {
    if (!data.user.location) {
      // router.push("/profile/set-address") or similar
      console.log("Redirecting to set address...");
    } else {
      // router.push("/profile/manage-addresses")
      console.log("Managing addresses...");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <StatusBar style="auto" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER SECTION */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <ThemedText type="defaultSemiBold" style={styles.greetingText}>
              {greeting}, {data.user.firstName}
            </ThemedText>

            <TouchableOpacity
              onPress={handleLocationPress}
              style={styles.locationRow}
              activeOpacity={0.7}
            >
              <Ionicons
                name="location"
                size={18}
                color={data.user.location ? "#FF3B30" : tint}
              />
              <ThemedText
                type="defaultSemiBold"
                style={[
                  styles.locationText,
                  !data.user.location && { color: tint },
                ]}
                numberOfLines={1}
              >
                {data.user.location || "Set your home address"}
              </ThemedText>
              <Ionicons
                name="chevron-down"
                size={14}
                color={muted}
                style={{ marginLeft: 2 }}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.avatarCircle, { backgroundColor: tint }]}
          >
            <ThemedText style={{ color: "white", fontWeight: "bold" }}>
              {data.user.firstName[0].toUpperCase()}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {/* SEARCH BAR - Added Shadow for depth */}
          <ThemedCard style={[styles.searchBar, styles.shadowProp]}>
            <Ionicons name="search" size={20} color={muted} />
            <ThemedText style={{ color: muted, marginLeft: 10 }}>
              What service do you need?
            </ThemedText>
          </ThemedCard>

          {/* SERVICES GRID */}
          <Section title="Services available" mutedColor={muted}>
            <View style={styles.servicesGrid}>
              <ServiceItem icon="scissors" label="Hair" color="#E0F2FE" />
              <ServiceItem icon="broom" label="Clean" color="#F0FDF4" />
              <ServiceItem icon="spa" label="Mass" color="#FAF5FF" />
              <ServiceItem icon="faucet-drip" label="Plum" color="#FFF7ED" />
              <ServiceItem icon="bolt" label="Elec" color="#FEFCE8" />
              <ServiceItem icon="plus" label="More" color="#F9FAFB" />
            </View>
          </Section>

          {/* UPCOMING BOOKING - Added a "Confirmed" Badge */}
          {data.upcomingBooking && (
            <Section title="Upcoming booking" mutedColor={muted}>
              <ThemedCard style={styles.bookingCard}>
                <View style={styles.bookingInfo}>
                  <View style={styles.badgeRow}>
                    <ThemedText type="defaultSemiBold" style={{ fontSize: 16 }}>
                      {data.upcomingBooking.serviceName}
                    </ThemedText>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: tint + "20" },
                      ]}
                    >
                      <ThemedText
                        style={{
                          color: tint,
                          fontSize: 10,
                          fontWeight: "bold",
                        }}
                      >
                        CONFIRMED
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText
                    style={{ color: tint, fontWeight: "600", marginTop: 2 }}
                  >
                    {formatUpcomingDate(data.upcomingBooking.scheduledAt)}
                  </ThemedText>
                  <View style={styles.locationDetail}>
                    <Ionicons name="home" size={14} color={muted} />
                    <ThemedText
                      style={{ color: muted, fontSize: 13, marginLeft: 4 }}
                    >
                      {data.upcomingBooking.locationType === "home"
                        ? "Home service"
                        : "Provider Shop"}
                    </ThemedText>
                  </View>
                </View>
                <TouchableOpacity style={styles.viewBtn}>
                  <ThemedText style={{ color: tint, fontWeight: "600" }}>
                    View ›
                  </ThemedText>
                </TouchableOpacity>
              </ThemedCard>
            </Section>
          )}

          {/* BOOK AGAIN */}
          <Section title="Recent Bookings" mutedColor={muted}>
            <ThemedCard style={styles.historyList}>
              {data.history.map((item, index) => (
                <HistoryItem
                  key={item.id}
                  title={item.serviceName}
                  price={`₦${item.price.toLocaleString()}`}
                  subtitle={`${item.dateText} • ${item.locationType}`}
                  border={border}
                  isLast={index === data.history.length - 1}
                />
              ))}
            </ThemedCard>
          </Section>

          {/* TRUST BANNER */}
          <View style={[styles.trustBanner, { backgroundColor: tint + "08" }]}>
            <ThemedText
              type="defaultSemiBold"
              style={{ marginBottom: 12, fontSize: 15 }}
            >
              Why choose our Services?
            </ThemedText>
            <TrustPoint label="Verified providers" tint={tint} />
            <TrustPoint label="Secure payments" tint={tint} />
            <TrustPoint label="Support you can trust" tint={tint} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Helper Components ---

const ServiceItem = ({
  icon,
  label,
  color,
}: {
  icon: string;
  label: string;
  color: string;
}) => (
  <TouchableOpacity style={styles.serviceItem}>
    <View style={[styles.serviceIconBox, { backgroundColor: color }]}>
      <FontAwesome6 name={icon} size={22} color="#374151" />
    </View>
    <ThemedText style={styles.serviceLabel}>{label}</ThemedText>
  </TouchableOpacity>
);

const HistoryItem = ({ title, price, subtitle, border, isLast }: any) => (
  <TouchableOpacity
    style={[
      styles.historyItem,
      !isLast && { borderBottomWidth: 1, borderBottomColor: border },
    ]}
  >
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
        <ThemedText type="defaultSemiBold">{price}</ThemedText>
      </View>
      <ThemedText style={{ opacity: 0.5, fontSize: 13, marginTop: 4 }}>
        {subtitle}
      </ThemedText>
    </View>
    <Ionicons
      name="chevron-forward"
      size={18}
      color="#D1D5DB"
      style={{ marginLeft: 8 }}
    />
  </TouchableOpacity>
);

const TrustPoint = ({ label, tint }: { label: string; tint: string }) => (
  <View style={styles.trustPoint}>
    <View style={[styles.checkCircle, { backgroundColor: tint }]}>
      <Ionicons name="checkmark" size={12} color="white" />
    </View>
    <ThemedText style={{ marginLeft: 10, fontSize: 14, opacity: 0.8 }}>
      {label}
    </ThemedText>
  </View>
);

const Section = ({ title, children, mutedColor }: any) => (
  <View style={{ marginTop: 32 }}>
    <ThemedText style={[styles.sectionTitle, { color: mutedColor }]}>
      {title}
    </ThemedText>
    {children}
  </View>
);

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 10, // Small padding since SafeArea handles the notch
    paddingBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 15,
  },
  greetingText: {
    opacity: 0.6,
    fontSize: 20,
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    marginLeft: 4,
    fontSize: 15,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    // Optional: add a subtle border to make it pop against the background
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginTop: 10,
  },
  shadowProp: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: 16,
    letterSpacing: 1.2,
    marginLeft: 4,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  serviceItem: { width: "30%", alignItems: "center", marginBottom: 20 },
  serviceIconBox: {
    width: 70,
    height: 70,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  serviceLabel: { fontSize: 14, fontWeight: "600" },
  bookingCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderRadius: 24,
  },
  bookingInfo: { flex: 1 },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  locationDetail: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  viewBtn: { paddingLeft: 12 },
  historyList: { borderRadius: 24, paddingHorizontal: 16 },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
  },
  trustBanner: { marginTop: 32, padding: 24, borderRadius: 28 },
  trustPoint: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
