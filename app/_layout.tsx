import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { OfflineBanner } from "@/components/OfflineBanner";
import SplashScreen from "@/components/SplashScreen";
import { queryClient } from "@/lib/queryClient";
import { initReactQueryOnlineManager } from "@/lib/reactQueryOnline";
import { useAuthStore } from "@/stores/auth.store";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  React.useEffect(() => initReactQueryOnlineManager(), []);
  const hydrated = useAuthStore((s) => s.hydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasProfile = useAuthStore((s) => s.hasProfile);

  if (!hydrated) {
    return <SplashScreen />; // or splash screen
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <PaperProvider>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <OfflineBanner />
              <StatusBar style="auto" />

              <Stack screenOptions={{ headerShown: false }}>
                {/* must be logged in screens */}
                <Stack.Protected guard={isAuthenticated}>
                  <Stack.Protected guard={hasProfile}>
                    <Stack.Screen name="(tabs)" />
                  </Stack.Protected>
                  <Stack.Protected guard={!hasProfile}>
                    <Stack.Screen name="(onboarding)" />
                  </Stack.Protected>
                </Stack.Protected>
                {/* not must be logged in */}
                <Stack.Protected guard={!isAuthenticated}>
                  <Stack.Screen name="(auth)" />
                </Stack.Protected>
                <Stack.Screen
                  name="modal"
                  options={{ presentation: "modal" }}
                />
              </Stack>
            </ThemeProvider>
          </PaperProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
