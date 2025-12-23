// app/(tabs)/_layout.tsx
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme.web";
import { useThemeColor } from "@/hooks/use-theme-color";
import ServiceProvider from "@/providers/service.provider";
import { useAuthStore } from "@/stores/auth.store";
import { Tabs, useRouter } from "expo-router";
import * as React from "react";

export default function TabsLayout() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const isProfileCompleted = user?.profileCompleted === true;

  const colorScheme = useColorScheme();

  // React.useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.replace("/(auth)");
  //   } else if (!isProfileCompleted) {
  //     router.replace("/(onboarding)/ProfileCompletion");
  //   }
  // }, [isAuthenticated, isProfileCompleted]);

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
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="person.crop.circle" color={color} />
            ),
          }}
        />
      </Tabs>
    </ServiceProvider>
  );
}
