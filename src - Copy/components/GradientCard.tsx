import { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';

interface GradientCardProps {
  children: ReactNode;
  onPress?: () => void;
  glow?: boolean;
}

export default function GradientCard({
  children,
  onPress,
  glow = false,
}: GradientCardProps) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.card, glow && styles.cardGlow]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    // Yumşaq kölgə
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  cardGlow: {
    borderColor: colors.borderFocus,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
});