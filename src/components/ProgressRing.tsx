import { Text, View } from 'react-native';
import { colors } from '../constants/colors';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  color?: string;
  number?: number;
}

export default function ProgressRing({
  progress,
  size = 60,
  color = colors.primary,
  number,
}: ProgressRingProps) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Dairə fonu */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: colors.border,
        }}
      />
      {/* Progress dairəsi - SVG olmadan, sadə versiya */}
      <View
        style={{
          position: 'absolute',
          width: size - strokeWidth * 2,
          height: size - strokeWidth * 2,
          borderRadius: size / 2,
          backgroundColor: 'transparent',
          borderWidth: strokeWidth,
          borderColor: color,
          borderRightColor: 'transparent',
          borderBottomColor: 'transparent',
          transform: [{ rotate: `${(progress / 100) * 360}deg` }],
        }}
      />
      {/* Nömrə */}
      {number !== undefined && (
        <Text style={{ color: colors.textPrimary, fontSize: size * 0.35, fontWeight: '800' }}>
          {number}
        </Text>
      )}
    </View>
  );
}