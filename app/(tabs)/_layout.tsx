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
import "react-native-reanimated";

import { OfflineBanner } from "@/components/OfflineBanner ";
import { queryClient } from "@/lib/queryClient";
import { initReactQueryOnlineManager } from "@/lib/reactQueryOnline";
import { useAuthStore } from "@/stores/auth.store";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const isProfileCompleted = user?.profileCompleted === true;

  React.useEffect(() => {
    return initReactQueryOnlineManager();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <StatusBar style="auto" />
          {/* Stack should only contain Screens */}
          <Stack>
            {!isAuthenticated && (
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            )}
            {isAuthenticated && !isProfileCompleted && (
              <Stack.Screen
                name="(onboarding)"
                options={{ headerShown: false }}
              />
            )}
            {isAuthenticated && isProfileCompleted && (
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            )}
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          </Stack>
        </ThemeProvider>
      </SafeAreaProvider>
      <OfflineBanner />
    </QueryClientProvider>
  );
}
