// app/(onboarding)/_layout.tsx
import { useAuthStore } from "@/stores/auth.store";
import { Stack, useRouter } from "expo-router";
import * as React from "react";

export default function OnboardingLayout() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const isProfileCompleted = user?.profileCompleted === true;

  React.useEffect(() => {
    if (!isAuthenticated) {
      // redirect to auth if not logged in
      router.replace("/Profile");
    } else if (isProfileCompleted) {
      // redirect to main app if profile is done
      router.replace("/ProfileCompletion");
    }
  }, [isAuthenticated, isProfileCompleted]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileCompletion" />
    </Stack>
  );
}
