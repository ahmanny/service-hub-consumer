import { ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Animated, StyleSheet, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const { isAuthenticated, hasProfile } = useAuthStore();
  const bg = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  useEffect(() => {
    // Run Animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    //Logic to redirect after 3 seconds
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.replace("/(auth)");
      } else if (!hasProfile) {
        router.replace("/(onboarding)");
      } else {
        router.replace("/(tabs)/home");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, hasProfile]);

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <ThemedText style={[styles.logoText, { color: textColor }]}>
          AMMANNY
        </ThemedText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 32,
    letterSpacing: 8,
    fontWeight: "800",
  },
});
