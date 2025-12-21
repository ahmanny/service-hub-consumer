import AuthScreenLayout from "@/components/layouts/AuthScreenLayout";
import PhoneInput from "@/components/ui/PhoneInput";
import { ThemedButton, ThemedText, ThemedView } from "@/components/ui/Themed";
import { spacing } from "@/constants/Layout";
import { useSendOtp } from "@/hooks/auth/useAuths";
import { ApiError } from "@/types/api.error.types";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  ToastAndroid,
  Vibration,
} from "react-native";

export default function EnterPhone() {
  const router = useRouter();
  const { mutateAsync, isPending } = useSendOtp();

  const [phone, setPhone] = useState("");
  const [callingCode, setCallingCode] = useState("234");

  const handleContinue = async () => {
    if (!phone.trim()) {
      Vibration.vibrate(50);
      if (Platform.OS === "android") {
        ToastAndroid.show("Please enter your phone number", ToastAndroid.SHORT);
      } else {
        Alert.alert("Please enter your phone number");
      }
      return;
    }

    try {
      const res = await mutateAsync({
        phone: callingCode + phone,
      });

      Vibration.vibrate(50);

      if (Platform.OS === "android") {
        ToastAndroid.show(res.message, ToastAndroid.SHORT);
      } else {
        Alert.alert("Success", res.message);
      }

      // Navigate with router
      router.push(`/(auth)/VerifyOTP?phone=${callingCode + phone}`);
    } catch (error) {
      const err = error as ApiError;
      const code = err.response?.data?.code ?? err.code;
      const message =
        err.response?.data?.message ?? err.message ?? "Failed to send code";

      if (code === 113) {
        // OTP already sent → still continue
        router.push(`/(auth)/VerifyOTP?phone=${callingCode + phone}`);
        return;
      }

      Vibration.vibrate(50);
      if (Platform.OS === "android") {
        ToastAndroid.show(message, ToastAndroid.LONG);
      } else {
        Alert.alert("Error", message);
      }
    }
  };

  const styles = createStyles();

  return (
    <AuthScreenLayout>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Enter Your Phone
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          We’ll send you a verification code via SMS.
        </ThemedText>

        <PhoneInput
          callingCode={callingCode}
          phone={phone}
          setCallingCode={setCallingCode}
          setPhone={setPhone}
        />
        <ThemedButton
          title="Continue"
          loading={isPending}
          onPress={handleContinue}
          disabled={isPending || !phone.trim()}
          style={styles.button}
        />
      </ThemedView>
    </AuthScreenLayout>
  );
}

function createStyles() {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: spacing.md,
      justifyContent: "center",
      gap: spacing.sm,
    },
    title: {
      marginBottom: spacing.xs,
    },
    subtitle: {
      opacity: 0.6,
      marginBottom: spacing.lg,
    },
    button: {
      marginTop: spacing.lg,
    },
  });
}
