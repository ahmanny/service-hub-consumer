// app/(tabs)/_layout.tsx
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme.web";
import { useThemeColor } from "@/hooks/use-theme-color";
import ServiceProvider from "@/providers/service.provider";
import { useAuthStore } from "@/stores/auth.store";
import { Redirect, Tabs } from "expo-router";
import * as React from "react";

export default function TabsLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasProfile = useAuthStore((s) => s.hasProfile);

  const colorScheme = useColorScheme();

  // Not logged in → auth
  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }
  // No profile → onboarding
  if (!hasProfile) {
    return <Redirect href="/(onboarding)" />;
  }

  return (
    <ServiceProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          headerTintColor: useThemeColor({}, "text"),
          tabBarButton: HapticTab,
          tabBarActiveTintColor: useThemeColor({}, "tint"),
          tabBarInactiveTintColor: useThemeColor({}, "inactive"),
          tabBarStyle: {
            backgroundColor: useThemeColor({}, "background"),
            borderTopColor: colorScheme === "dark" ? "#333" : "#ccc",
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={30} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="bookings"
          options={{
            title: "Bookings",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={30} name="calendar" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={30} name="person.crop.circle" color={color} />
            ),
          }}
        />
      </Tabs>
    </ServiceProvider>
  );
}
