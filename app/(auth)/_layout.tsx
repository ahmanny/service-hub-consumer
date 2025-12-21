// app/(auth)/_layout.tsx
import { useThemeColor } from "@/hooks/use-theme-color";
import { Stack } from "expo-router";

export default function AuthLayout() {
  const textColor = useThemeColor({}, "text");

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
