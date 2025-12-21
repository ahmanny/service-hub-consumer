import AuthScreenLayout from "@/components/layouts/AuthScreenLayout";
import { ThemedButton } from "@/components/ui/Themed/ThemedButton";
import { ThemedText } from "@/components/ui/Themed/ThemedText";
import { fontSize, spacing } from "@/constants/Layout";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function Welcome() {
  const router = useRouter();
  const styles = createStyles();

  return (
    <AuthScreenLayout>
      <View style={styles.container}>
        {/* Title */}
        <ThemedText type="subtitle" style={styles.title}>
          Welcome to ServiceHub
        </ThemedText>

        {/* Primary CTA: OTP signup/login */}
        <ThemedButton
          title="Continue with Phone"
          onPress={() => router.push("/ProfileCompletion")}
          variant="primary"
        />

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <ThemedText type="defaultSemiBold" style={styles.dividerText}>
            or
          </ThemedText>
          <View style={styles.line} />
        </View>

        <ThemedButton
          title="Continue"
          onPress={() => Alert.alert("Secondary btn for now")}
          variant="secondary"
        />

        {/* Terms and conditions */}
        <Text style={styles.termsText}>
          By signing up, you agree to our Terms and Conditions and Privacy
          Policy.
        </Text>
      </View>
    </AuthScreenLayout>
  );
}

function createStyles() {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: spacing.md,
      justifyContent: "center",
      gap: spacing.md,
    },
    title: {
      fontSize: fontSize.xxl,
      fontWeight: "700",
      marginBottom: spacing.lg,
    },
    dividerContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: spacing.md,
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: "#ccc",
    },
    dividerText: {
      marginHorizontal: spacing.md,
      color: "#666",
      fontWeight: "500",
    },
    termsText: {
      fontSize: 12,
      color: "#999",
      textAlign: "center",
      marginTop: spacing.lg,
    },
  });
}
