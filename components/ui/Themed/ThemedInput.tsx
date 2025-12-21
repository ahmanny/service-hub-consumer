import {
  View,
  Text,
  TextInput,
  KeyboardTypeOptions,
  TextInputProps,
} from "react-native";
import React from "react";
import { useThemeColor } from "@/hooks/use-theme-color";
type InputProps = TextInputProps & {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
};

export default function ThemedInput(props: InputProps) {
  const textColor = useThemeColor({}, "text");
  const border = useThemeColor({}, props.error ? "danger" : "border");
  const background = useThemeColor({}, "card");
  const placeholderColor = useThemeColor({}, "placeholder");
  const errorColor = useThemeColor({}, "danger");
  return (
    <View style={{ marginBottom: props.error ? 8 : 16 }}>
      <View
        style={{
          height: 56,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: border,
          backgroundColor: background,
          paddingHorizontal: 16,
          justifyContent: "center",
        }}
      >
        <TextInput
          {...props}
          placeholderTextColor={placeholderColor}
          style={{
            color: textColor,
            fontFamily: "Inter_500Medium",
            fontSize: 16,
          }}
        />
      </View>
      {props.error ? (
        <Text
          style={{
            color: errorColor,
            fontSize: 12,
            marginTop: 4,
            fontFamily: "Inter_400Regular",
          }}
        >
          {props.error}
        </Text>
      ) : null}
    </View>
  );
}
