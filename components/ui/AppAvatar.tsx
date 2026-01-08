import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar } from "react-native-paper";

interface AppAvatarProps {
  uri?: string | null;
  initials?: string;
  size?: number;
  onEdit?: () => void;
  tint?: string;
  shape?: "square" | "rounded";
}

export const AppAvatar = ({
  uri,
  initials = "U",
  size = 140,
  onEdit,
  tint = "#0BB45E",
  shape = "rounded",
}: AppAvatarProps) => {
  // Logic for shape
  const borderRadius = shape === "rounded" ? size / 2 : size * 0.2;

  return (
    <View style={{ width: size, height: size }}>
      {uri ? (
        <Avatar.Image
          size={size}
          source={{ uri }}
          style={{ borderRadius, backgroundColor: tint + "10" }}
        />
      ) : (
        <Avatar.Text
          size={size}
          label={initials.toUpperCase()}
          color={tint}
          style={{ borderRadius, backgroundColor: tint + "10" }}
          labelStyle={{
            fontWeight: "bold",
            letterSpacing: -1,
            fontSize: size * 0.3,
          }}
        />
      )}

      {onEdit && (
        <TouchableOpacity
          style={[styles.editBadge, { backgroundColor: tint }]}
          onPress={onEdit}
          activeOpacity={0.8}
        >
          <Ionicons name="camera" size={size * 0.13} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "28%",
    height: "28%",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
