// app/(auth)/_layout.tsx
import { useThemeColor } from "@/hooks/use-theme-color";
import { Stack } from "expo-router";

export default function AuthLayout() {
  const textColor = useThemeColor({}, "text");

  return (
    <Stack
      screenOptions={{
        headerShown: true, // show header by default
        headerTransparent: true, // match your previous style
        headerTintColor: textColor,
      }}
    >
      <Stack.Screen
        name="Welcome"
        options={{ headerShown: true, headerTitle: "Welcome" }}
      />
      <Stack.Screen name="EnterPhone" options={{ headerTitle: "" }} />
      <Stack.Screen name="VerifyOTP" options={{ headerTitle: "" }} />
    </Stack>
  );
}
