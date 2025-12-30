// app/(auth)/_layout.tsx
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/stores/auth.store";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const textColor = useThemeColor({}, "text");
  const hasProfile = useAuthStore((s) => s.hasProfile);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (hasProfile && isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }
  if (!hasProfile && isAuthenticated) {
    return <Redirect href="/(onboarding)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerTintColor: textColor,
      }}
    >
      <Stack.Screen name="index" options={{ headerTitle: "" }} />
      <Stack.Screen name="EnterPhone" options={{ headerTitle: "" }} />
      <Stack.Screen name="VerifyOTP" options={{ headerTitle: "" }} />
    </Stack>
  );
}
