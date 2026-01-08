import AuthScreenLayout from "@/components/layouts/AuthScreenLayout";
import ModernPhoneInput from "@/components/ui/PhoneInput";
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
import {
  ICountry,
  isValidPhoneNumber,
} from "react-native-international-phone-number";

export default function EnterPhone() {
  const router = useRouter();
  const { mutateAsync, isPending } = useSendOtp();

  const [selectedCountry, setSelectedCountry] = useState<ICountry | undefined>(
    undefined
  );
  // Internal state to track just the digits typed by user for the input field
  const [localInputValue, setLocalInputValue] = useState("");

  const handleContinue = async () => {
    if (selectedCountry === undefined) return;

    if (!isValidPhoneNumber(localInputValue, selectedCountry)) {
      Vibration.vibrate(50);
      if (Platform.OS === "android") {
        ToastAndroid.show("Please enter your phone number", ToastAndroid.SHORT);
      } else {
        Alert.alert("Please enter your phone number");
      }
      return;
    }

    const root = selectedCountry.idd?.root ?? "";
    const suffix = selectedCountry.idd?.suffixes?.[0] ?? "";
    const callingCode = `${root}${suffix}`;

    // USE 'phoneNumber' HERE, NOT 'localInputValue'
    const cleanNumber = localInputValue.replace(/[^0-9]/g, "");
    const phoneNumber = `${callingCode}${cleanNumber}`;

    try {
      const res = await mutateAsync({
        phone: phoneNumber,
      });

      Vibration.vibrate(50);

      if (Platform.OS === "android") {
        ToastAndroid.show(res.message, ToastAndroid.SHORT);
      } else {
        Alert.alert("Success", res.message);
      }

      // Navigate with router
      console.log(phoneNumber);
      router.push(`/(auth)/VerifyOTP?phone=${encodeURIComponent(phoneNumber)}`);
    } catch (error) {
      const err = error as ApiError;
      const code = err.response?.data?.code ?? err.code;
      console.log(err);
      const message =
        err.response?.data?.message ?? err.message ?? "Failed to send code";

      if (code === 113) {
        // OTP already sent still continue
        router.push(
          `/(auth)/VerifyOTP?phone=${encodeURIComponent(phoneNumber)}`
        );
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

        <ModernPhoneInput
          localInputValue={localInputValue}
          selectedCountry={selectedCountry}
          setLocalInputValue={setLocalInputValue}
          setSelectedCountry={setSelectedCountry}
          defaultphone={""}
        />
        <ThemedButton
          title="Continue"
          loading={isPending}
          onPress={handleContinue}
          disabled={
            isPending ||
            !selectedCountry ||
            !isValidPhoneNumber(localInputValue, selectedCountry)
          }
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
