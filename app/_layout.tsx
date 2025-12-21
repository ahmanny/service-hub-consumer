// app/_layout.tsx
import "react-native-reanimated";

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  useFonts,
} from "@expo-google-fonts/inter";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useColorScheme } from "react-native";

import { OfflineBanner } from "@/components/OfflineBanner ";
import { queryClient } from "@/lib/queryClient";
import { initReactQueryOnlineManager } from "@/lib/reactQueryOnline";
import { useAuthStore } from "@/stores/auth.store";
import { QueryClientProvider } from "@tanstack/react-query";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Auth state
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const isProfileCompleted = user?.profileCompleted === true;
  // Fonts & splash
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  React.useEffect(() => {
    const unsubscribe = initReactQueryOnlineManager();
    return unsubscribe;
  }, []);

  if (!fontsLoaded) {
    return null; // keep splash screen visible
  }

  return (
    <QueryClientProvider client={queryClient}>
      <OfflineBanner />
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          {/* Stack gating */}
          {/* {!isAuthenticated && (
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          )} */}
          {!isAuthenticated && (
            <Stack.Screen
              name="(onboarding)"
              options={{ headerShown: false }}
            />
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

          {/* Global modals */}
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
