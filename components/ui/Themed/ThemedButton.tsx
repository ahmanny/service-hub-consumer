import {
  Pressable,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  PressableProps,
} from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedText } from "./ThemedText";

type ButtonProps = PressableProps & {
  title: string;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline";
  style?: StyleProp<ViewStyle>;
};

export function ThemedButton({
  title,
  loading = false,
  variant = "primary",
  style,
  ...rest
}: ButtonProps) {
  const backgroundPrimary = useThemeColor({}, "buttonPrimary");
  const backgroundSecondary = useThemeColor({}, "buttonSecondary");
  const border = useThemeColor({}, "border");

  const backgroundColor =
    variant === "primary"
      ? backgroundPrimary
      : variant === "secondary"
      ? backgroundSecondary
      : "transparent";

  const borderStyle =
    variant === "outline" ? { borderColor: border, borderWidth: 1 } : {};

  return (
    <Pressable
      disabled={loading || rest.disabled}
      style={[
        {
          backgroundColor,
          height: 56,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
          opacity: rest.disabled || loading ? 0.8 : 1,
        },
        borderStyle,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      )}
    </Pressable>
  );
}
