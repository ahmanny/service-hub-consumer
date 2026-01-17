import { TabType } from "@/components/home/CategoryTabs";
import { ThemedText } from "@/components/ui/Themed";
import { SERVICE_META, ServiceType } from "@/constants/services";
import { FontAwesome6 } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

interface Props {
  selectedCategory?: string;
  onSelectCategory: (categoryId: TabType) => void;
}

export default function ({
  selectedCategory,
  onSelectCategory,
}: Props) {
  const handlePress = (id: TabType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectCategory(id);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {(Object.keys(SERVICE_META) as ServiceType[]).map((key) => {
          const item = SERVICE_META[key];
          const isSelected = selectedCategory === key;

          return (
            <TouchableOpacity
              key={key}
              activeOpacity={0.8}
              onPress={() => handlePress(key)}
              style={[styles.categoryCard, isSelected && styles.selectedCard]}
            >
              <View
                style={[
                  styles.iconContainer,
                  isSelected && styles.selectedIconContainer,
                ]}
              >
                <FontAwesome6
                  name={item.icon}
                  size={22}
                  color={isSelected ? "#FFF" : "#1A1A1A"}
                />
              </View>
              <ThemedText
                style={[styles.label, isSelected && styles.selectedLabel]}
              >
                {item.label}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16, // Better breathing room
  },
  categoryCard: {
    alignItems: "center",
    gap: 8,
  },
  selectedCard: {
    // Optional: add a slight lift or scale effect here
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20, // Squircle look
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E9ECEF",
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedIconContainer: {
    backgroundColor: "#000",
    borderColor: "#000",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6C757D",
    letterSpacing: -0.2,
  },
  selectedLabel: {
    color: "#000",
    fontWeight: "700",
  },
});
