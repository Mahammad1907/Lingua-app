import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  icon?: string;
  disabled?: boolean;
  colors?: [string, string, ...string[]];
}

export default function GradientButton({
  title,
  onPress,
  icon,
  disabled = false,
  colors: gradientColors = ['#06b6d4', '#8b5cf6', '#ec4899'],
}: GradientButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[styles.container, disabled && styles.disabled]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.text}>{title}</Text>
          {icon && <Text style={styles.icon}>{icon}</Text>}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  disabled: {
    opacity: 0.4,
  },
  gradient: {
    paddingVertical: 20,
    paddingHorizontal: 28,
    borderRadius: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  icon: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 10,
  },
});