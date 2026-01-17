import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, TouchableOpacity, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppInitializer } from "@/components/guards/AppInitializer";
import { GlobalProfileSync } from "@/components/guards/GlobalProfileSync";
import { OfflineBanner } from "@/components/OfflineBanner";
import { ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { queryClient } from "@/lib/queryClient";
import { initReactQueryOnlineManager } from "@/lib/reactQueryOnline";
import { useAuthStore } from "@/stores/auth.store";
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  React.useEffect(() => initReactQueryOnlineManager(), []);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasProfile = useAuthStore((s) => s.hasProfile);
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");

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

              <AppInitializer disabled={!isAuthenticated}>
                <GlobalProfileSync />
                <Stack screenOptions={{ headerShown: false }}>
                  {/* Public Entry Screens */}
                  <Stack.Screen name="index" />

                  {/* Authenticated Screens */}
                  <Stack.Protected guard={isAuthenticated}>
                    <Stack.Protected guard={hasProfile}>
                      <Stack.Screen name="(tabs)" />
                    </Stack.Protected>
                    <Stack.Protected guard={!hasProfile}>
                      <Stack.Screen name="(onboarding)" />
                    </Stack.Protected>
                  </Stack.Protected>

                  {/* Auth Group */}
                  <Stack.Protected guard={!isAuthenticated}>
                    <Stack.Screen name="(auth)" />
                  </Stack.Protected>

                  {/* modals */}
                  <Stack.Screen
                    name="modal"
                    options={{ presentation: "modal" }}
                  />
                  <Stack.Screen
                    name="(modals)/reschedule-booking"
                    options={{
                      headerShown: true,
                      presentation: "modal",
                      headerTitle: "Reschedule",
                      headerTitleAlign: "center",
                      headerShadowVisible: false,
                      headerStyle: {
                        backgroundColor:
                          Platform.OS === "ios" ? undefined : "transparent",
                      },
                      headerTitleStyle: {
                        fontWeight: "700",
                        fontSize: 17,
                        fontFamily:
                          Platform.OS === "ios"
                            ? "System"
                            : "sans-serif-medium",
                      },
                      headerLeft: () => (
                        <TouchableOpacity
                          onPress={() => router.back()}
                          style={{ marginLeft: Platform.OS === "ios" ? 0 : 4 }}
                          activeOpacity={0.7}
                        >
                          {Platform.OS === "ios" ? (
                            <ThemedText
                              style={{
                                color: tintColor,
                                fontSize: 17,
                                fontWeight: "500",
                              }}
                            >
                              Cancel
                            </ThemedText>
                          ) : (
                            <Ionicons
                              name="close"
                              size={24}
                              color={textColor}
                            />
                          )}
                        </TouchableOpacity>
                      ),
                      headerRight: () => (
                        <TouchableOpacity
                          onPress={() => {
                            /* You could trigger form submit here if you move state up */
                          }}
                          style={{ marginRight: Platform.OS === "ios" ? 0 : 4 }}
                        >
                          <Ionicons
                            name="help-circle-outline"
                            size={22}
                            color={textColor}
                            style={{ opacity: 0.6 }}
                          />
                        </TouchableOpacity>
                      ),
                    }}
                  />
                </Stack>
              </AppInitializer>
            </ThemeProvider>
          </PaperProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
