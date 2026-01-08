import OnboardingScreenLayout from "@/components/layouts/OnboardingScreenLayout";
import { ThemedButton, ThemedText, ThemedView } from "@/components/ui/Themed";
import { fontSize, radius, spacing } from "@/constants/Layout";
import {
  useGetOtpCooldown,
  useResendOtp,
  useVerifyOtp,
} from "@/hooks/auth/useAuths";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  Platform,
  Text,
  ToastAndroid,
  Vibration,
  View,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";

export default function VerifyOTP() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const displayPhone = phone || "No number provided";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef<number | null>(null);

  const { mutateAsync: verifyMutateAsync } = useVerifyOtp();
  const { mutateAsync: resendMutateAsync, isPending: resending } =
    useResendOtp();
  const { mutateAsync: getCooldownMutateAsync } = useGetOtpCooldown();

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

  const startTimer = useCallback((duration: number) => {
    setSecondsLeft(duration);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  React.useEffect(() => {
    const fetchCooldown = async () => {
      if (!phone) return;
      try {
        const res = await getCooldownMutateAsync({ phone });
        if (res.cooldown > 0) startTimer(res.cooldown);
      } catch {}
    };
    fetchCooldown();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phone]);

  const handleVerify = async () => {
    if (otp.length < 4) {
      Alert.alert("Invalid OTP", "Please enter full code");
      return;
    }
    setLoading(true);
    try {
      await verifyMutateAsync({ phone, otp });
      Vibration.vibrate(50);
      router.push("/(onboarding)");
    } catch (err: any) {
      Platform.OS === "android"
        ? ToastAndroid.show(err.message || "Failed", ToastAndroid.LONG)
        : Alert.alert("Error", err.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || resending) return;
    try {
      const res = await resendMutateAsync({ phone });
      Vibration.vibrate(50);
      Platform.OS === "android"
        ? ToastAndroid.show(res.message, ToastAndroid.SHORT)
        : Alert.alert("Success", res.message);
      startTimer(res.cooldown);
    } catch (err: any) {
      Platform.OS === "android"
        ? ToastAndroid.show(err.message || "Failed", ToastAndroid.LONG)
        : Alert.alert("Error", err.message || "Failed");
    } finally {
      setOtp("");
    }
  };

  const border = useThemeColor({}, "border");
  const background = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");

  return (
    <OnboardingScreenLayout contentPaddingBottom={0}>
      <ThemedView
        style={{ flex: 1, paddingHorizontal: spacing.sm, paddingTop: 45 }}
      >
        <View
          style={{ flex: 1, justifyContent: "flex-start", gap: spacing.md }}
        >
          <ThemedText
            type="title"
            style={{ fontSize: fontSize.xxl, fontWeight: "700" }}
          >
            Verify OTP
          </ThemedText>
          <ThemedText>Enter the 4-digit code sent to {displayPhone}</ThemedText>
          <OtpInput
            numberOfDigits={4}
            autoFocus
            onTextChange={setOtp}
            theme={{
              containerStyle: {
                justifyContent: "space-between",
                width: "100%",
                marginBottom: 10,
              },
              pinCodeContainerStyle: {
                width: 60,
                height: 60,
                borderRadius: radius.md,
                borderWidth: 1,
                borderColor: border,
                backgroundColor: background,
                justifyContent: "center",
                alignItems: "center",
              },
              pinCodeTextStyle: {
                fontSize: fontSize.xl,
                fontWeight: "600",
                color: textColor,
              },
              focusedPinCodeContainerStyle: { borderColor: "#1E8A4B" },
            }}
          />
          <ThemedText
            style={{
              textAlign: "center",
              marginTop: spacing.md,
              color: "#666",
            }}
          >
            {secondsLeft > 0 ? (
              `Resend in ${formatTime(secondsLeft)}`
            ) : (
              <Text
                style={{
                  color: "#1E8A4B",
                  fontWeight: "600",
                  opacity: resending || secondsLeft > 0 ? 0.5 : 1,
                }}
                onPress={handleResend}
              >
                {resending ? "Resending..." : "Resend code"}
              </Text>
            )}
          </ThemedText>
        </View>

        <View>
          <ThemedButton
            title="Verify"
            loading={loading}
            onPress={handleVerify}
            disabled={otp.length < 4}
          />
        </View>
      </ThemedView>
    </OnboardingScreenLayout>
  );
}
