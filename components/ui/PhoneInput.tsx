import { useThemeColor } from "@/hooks/use-theme-color";
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";

type PhoneInputProps = {
  phone: string;
  setPhone: (text: string) => void;
  callingCode: string;
  setCallingCode: (text: string) => void;
};

export default function PhoneInput({
    callingCode,
    phone,
    setCallingCode,
    setPhone,
}:PhoneInputProps) {
  const [countryCode, setCountryCode] = useState<CountryCode>("NG"); // default to Nigeria

  const onSelect = (country: Country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
  };

  const textColor = useThemeColor({}, "text");
  const border = useThemeColor({}, "border");
  const background = useThemeColor({}, "card");
  const placeholderColor = useThemeColor({}, "placeholder");
  const styles = createStyles({ textColor, background, border });

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <CountryPicker
          countryCode={countryCode}
          withFilter
          withFlag
          withCallingCode
          withEmoji
          onSelect={onSelect}
        />
        <Text style={styles.codeText}>+{callingCode}</Text>
        <TextInput
          style={styles.phoneInput}
          placeholderTextColor={placeholderColor}
          placeholder="Phone number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>
    </View>
  );
}

function createStyles({
  textColor,
  background,
  border,
}: {
  textColor: string;
  border: string;
  background: string;
}) {
  return StyleSheet.create({
    container: {
      marginVertical: 10,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      height: 56,
      borderColor: border,
      backgroundColor: background,
      borderRadius: 16,
      paddingHorizontal: 10,
    },
    codeText: {
      marginRight: 8,
      fontSize: 16,
      color: textColor,
    },
    phoneInput: {
      flex: 1,
      fontSize: 16,
      color: textColor,
      fontFamily: "Inter_500Medium",
    },
  });
}
