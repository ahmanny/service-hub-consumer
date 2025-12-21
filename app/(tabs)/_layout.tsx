// app/(tabs)/_layout.tsx
import { useAuthStore } from "@/stores/auth.store";
import { Stack, useRouter } from "expo-router";
import * as React from "react";

export default function TabsLayout() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const isProfileCompleted = user?.profileCompleted === true;

  // React.useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.replace("/Welcome");
  //   } else if (!isProfileCompleted) {
  //     router.replace("/Explore");
  //   }
  // }, [isAuthenticated, isProfileCompleted]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="Profile" />
    </Stack>
  );
}
