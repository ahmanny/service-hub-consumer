// app/(tabs)/bookings/_layout.tsx
import { useThemeColor } from "@/hooks/use-theme-color";
import { Stack } from "expo-router";

export default function BookingLayout() {
  const textColor = useThemeColor({}, "text");
  const headerBackground = useThemeColor({}, "background");

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: headerBackground },
        headerTitleStyle: { fontWeight: "600", fontSize: 20 },
        headerTintColor: textColor,
        headerShadowVisible: false,
      }}
    >
      {/* index represents bookings/index.tsx */}
      <Stack.Screen
        name="index"
        options={{
          title: "Bookings",
        }}
      />
      {/* [id] represents bookings/[id].tsx */}
      <Stack.Screen
        name="[bookingId]"
        options={{
          title: "Booking Details",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
