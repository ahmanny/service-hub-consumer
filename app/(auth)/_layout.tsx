import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/stores/auth.store";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const textColor = useThemeColor({}, "text");
  const headerBackground = useThemeColor({}, "background");
  const hasProfile = useAuthStore((s) => s.hasProfile);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (hasProfile && isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }
  if (!hasProfile && isAuthenticated) {
    return <Redirect href="/(onboarding)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: headerBackground },
        headerTintColor: textColor,
        headerTitle: "",
        headerBackTitle: "",
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="EnterPhone" />
      <Stack.Screen name="VerifyOTP" />
    </Stack>
  );
}
