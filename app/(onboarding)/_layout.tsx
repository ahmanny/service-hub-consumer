// app/(onboarding)/_layout.tsx
import { useAuthStore } from "@/stores/auth.store";
import { Redirect, Stack } from "expo-router";
import * as React from "react";

export default function OnboardingLayout() {
  const hasProfile = useAuthStore((s) => s.hasProfile);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }

  if (hasProfile && isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
