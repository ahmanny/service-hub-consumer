import { ThemedButton } from "@/components/ui/Themed/ThemedButton";
import { ThemedText } from "@/components/ui/Themed/ThemedText";
import { spacing } from "@/constants/Layout";
import { useThemeColor } from "@/hooks/use-theme-color";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";

export default function Welcome() {
  const router = useRouter();
  const styles = createStyles();
  const bg = useThemeColor({}, "background");

  const handlePhoneContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/(auth)/EnterPhone");
  };

  return (
    <>
      <StatusBar style="light" />
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <ImageBackground
          source={require("@/assets/welcome-bg.png")}
          style={StyleSheet.absoluteFill}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)", "#000"]}
            style={styles.gradient}
          >
            <View style={styles.content}>
              <View style={styles.header}>
                <ThemedText style={styles.brandText}>AMMANNY.</ThemedText>
                <ThemedText type="title" style={styles.title}>
                  Book trusted service providers in{" "}
                  <ThemedText style={styles.highlight}>2 taps</ThemedText>
                </ThemedText>
              </View>

              <View style={styles.buttonGroup}>
                {/* Primary CTA */}
                <ThemedButton
                  title="Continue with Phone"
                  onPress={handlePhoneContinue}
                  variant="primary"
                  style={styles.mainBtn}
                />

                {/* Secondary CTA (Social/Guest) */}
                <ThemedButton
                  title="Continue with Google"
                  onPress={() => Haptics.selectionAsync()}
                  variant="secondary"
                  // icon={<Ionicons name="logo-google" size={20} color="black" />}
                  style={styles.secondaryBtn}
                />

                {/* Terms */}
                <ThemedText style={styles.termsText}>
                  By signing up, you agree to our{" "}
                  <ThemedText style={styles.linkText}>Terms</ThemedText> and{" "}
                  <ThemedText style={styles.linkText}>
                    Privacy Policy
                  </ThemedText>
                  .
                </ThemedText>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    </>
  );
}

function createStyles() {
  return StyleSheet.create({
    gradient: {
      flex: 1,
      justifyContent: "flex-end",
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xl * 2,
    },
    content: {
      gap: spacing.xl,
    },
    header: {
      marginBottom: spacing.md,
    },
    brandText: {
      color: "#FFB800",
      fontSize: 14,
      fontWeight: "900",
      letterSpacing: 4,
      marginBottom: spacing.xs,
    },
    title: {
      fontSize: 40,
      fontWeight: "800",
      color: "#FFF",
      lineHeight: 48,
      letterSpacing: -1,
    },
    highlight: {
      color: "#FFB800",
    },
    buttonGroup: {
      gap: spacing.md,
    },
    mainBtn: {
      height: 60,
      borderRadius: 18,
    },
    secondaryBtn: {
      height: 60,
      borderRadius: 18,
      backgroundColor: "#FFF",
    },
    termsText: {
      fontSize: 12,
      color: "rgba(255,255,255,0.5)",
      textAlign: "center",
      marginTop: spacing.sm,
      paddingHorizontal: spacing.lg,
      lineHeight: 18,
    },
    linkText: {
      color: "#FFF",
      fontSize: 12,
      fontWeight: "600",
      textDecorationLine: "underline",
    },
  });
}

// import AuthScreenLayout from "@/components/layouts/AuthScreenLayout";
// import { ThemedButton } from "@/components/ui/Themed/ThemedButton";
// import { ThemedText } from "@/components/ui/Themed/ThemedText";
// import { fontSize, spacing } from "@/constants/Layout";
// import { useRouter } from "expo-router";
// import React from "react";
// import { Alert, StyleSheet, Text, View } from "react-native";

// export default function Welcome() {
//   const router = useRouter();
//   const styles = createStyles();

//   return (
//     <AuthScreenLayout>
//       <View style={styles.container}>
//         {/* Title */}
//         <ThemedText type="subtitle" style={styles.title}>
//           Welcome to ServiceHub
//         </ThemedText>

//         {/* Primary CTA: OTP signup/login */}
//         <ThemedButton
//           title="Continue with Phone"
//           onPress={() => router.push("/(auth)/EnterPhone")}
//           variant="primary"
//         />

//         {/* Divider */}
//         <View style={styles.dividerContainer}>
//           <View style={styles.line} />
//           <ThemedText type="defaultSemiBold" style={styles.dividerText}>
//             or
//           </ThemedText>
//           <View style={styles.line} />
//         </View>

//         <ThemedButton
//           title="Continue"
//           onPress={() => Alert.alert("Secondary btn for now")}
//           variant="secondary"
//         />

//         {/* Terms and conditions */}
//         <Text style={styles.termsText}>
//           By signing up, you agree to our Terms and Conditions and Privacy
//           Policy.
//         </Text>
//       </View>
//     </AuthScreenLayout>
//   );
// }

// function createStyles() {
//   return StyleSheet.create({
//     container: {
//       flex: 1,
//       padding: spacing.md,
//       justifyContent: "center",
//       gap: spacing.md,
//     },
//     title: {
//       fontSize: fontSize.xxl,
//       fontWeight: "700",
//       marginBottom: spacing.lg,
//     },
//     dividerContainer: {
//       flexDirection: "row",
//       alignItems: "center",
//       marginVertical: spacing.md,
//     },
//     line: {
//       flex: 1,
//       height: 1,
//       backgroundColor: "#ccc",
//     },
//     dividerText: {
//       marginHorizontal: spacing.md,
//       color: "#666",
//       fontWeight: "500",
//     },
//     termsText: {
//       fontSize: 12,
//       color: "#999",
//       textAlign: "center",
//       marginTop: spacing.lg,
//     },
//   });
// }
