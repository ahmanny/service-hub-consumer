import OnboardingScreenLayout from "@/components/layouts/OnboardingScreenLayout";
import { ThemedButton, ThemedText, ThemedView } from "@/components/ui/Themed";
import ThemedInput from "@/components/ui/Themed/ThemedInput";
import { spacing } from "@/constants/Layout";
import { useCompleteProfile } from "@/hooks/consumer/useProfile";
import { ProfileFormData, profileSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Platform,
  StyleSheet,
  ToastAndroid,
  Vibration,
  View,
} from "react-native";

export default function ProfileCompletion() {
  const { mutateAsync, isPending } = useCompleteProfile();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await mutateAsync(data);
      // Navigate to main app (tabs)
      router.replace("/(tabs)"); // or your main tab screen
    } catch (err: any) {
      console.log("====================================");
      console.log(err);
      console.log("====================================");
      Vibration.vibrate(50);
      if (Platform.OS === "android") {
        ToastAndroid.show(
          err.message || "Failed to continue",
          ToastAndroid.SHORT
        );
      } else {
        Alert.alert("Error", err.message || "Failed to continue");
      }
    }
  };
  return (
    <OnboardingScreenLayout contentPaddingBottom={20}>
      <ThemedView style={styles.container}>
        {/* Content */}
        <View style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            Complete your profile
          </ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>
            Just a few details before you continue
          </ThemedText>

          {/* Name row */}
          <View style={styles.row}>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, value } }) => (
                <ThemedInput
                  placeholder="First name"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="words"
                  error={errors.firstName?.message}
                  style={styles.input}
                />
              )}
            />

            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, value } }) => (
                <ThemedInput
                  placeholder="Last name"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="words"
                  error={errors.lastName?.message}
                  style={styles.input}
                />
              )}
            />
          </View>

          {/* Email */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <ThemedInput
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
              />
            )}
          />
        </View>

        {/* Bottom CTA */}
        <View>
          <ThemedButton
            title="Continue"
            loading={isPending}
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || isPending}
          />
        </View>
      </ThemedView>
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },

  content: {
    flex: 1,
  },

  title: {
    marginBottom: spacing.sm,
  },

  subtitle: {
    opacity: 0.6,
    marginBottom: spacing.xl,
  },

  row: {
    gap: 12,
    marginBottom: spacing.md,
  },

  input: {
    flex: 1,
  },

  footer: {
    paddingBottom: 20,
  },
});
