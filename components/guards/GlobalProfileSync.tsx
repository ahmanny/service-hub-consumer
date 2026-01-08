import { useConsumerProfile } from "@/hooks/consumer/useProfile";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect } from "react";

export function GlobalProfileSync() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasProfile = useAuthStore((s) => s.hasProfile);
  const login = useAuthStore((s) => s.login);

  // Background fetch only if logged in
  const { data } = useConsumerProfile(isAuthenticated && hasProfile);

  useEffect(() => {
    if (data?.profile) {
      // Sync the background server data into the persisted Zustand store
      login(data.profile, data.hasProfile);
    }
  }, [data, login]);

  return null; // This component doesn't render anything
}
