import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ui/Themed';
import { Ionicons } from '@expo/vector-icons';
import { spacing } from '@/constants/Layout';
import * as Haptics from 'expo-haptics';

interface Props {
  location: string;
  onPress: () => void;
}

export default function LocationSelector({ location, onPress }: Props) {
  
  const handlePress = () => {
    // Light haptic feedback for a premium physical feel
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      style={styles.container} 
      onPress={handlePress}
    >
      <View style={styles.content}>
        {/* Label above the location for context */}
        <ThemedText style={styles.label}>DELIVERING TO</ThemedText>
        
        <View style={styles.locationRow}>
          <Ionicons name="location" size={18} color="#FFB800" style={styles.icon} />
          
          <ThemedText type="defaultSemiBold" style={styles.locationText} numberOfLines={1}>
            {location}
          </ThemedText>
          
          <Ionicons name="chevron-down" size={14} color="#666" style={styles.chevron} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'transparent', 
  },
  content: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 10,
    color: '#8E8E93',
    letterSpacing: 1.2,
    fontWeight: '700',
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
    marginLeft: -2, 
  },
  locationText: {
    fontSize: 16,
    color: '#1A1A1A',
    marginRight: 4,
  },
  chevron: {
    marginTop: 2,
  },
});