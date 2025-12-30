import { ActivityIndicator, Text, useColorScheme, View } from "react-native";

export default function SplashScreen() {
  const theme = useColorScheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme === "dark" ? "#000" : "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "700",
          marginBottom: 16,
        }}
      >
        YourApp
      </Text>

      <ActivityIndicator size="large" />
    </View>
  );
}
