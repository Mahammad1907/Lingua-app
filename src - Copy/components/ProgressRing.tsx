import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../constants/colors';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  color?: string;
  number?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
}

export default function ProgressRing({
  progress,
  size = 60,
  color = colors.primary,
  number,
  strokeWidth = 5,
  showPercentage = false,
}: ProgressRingProps) {
  // Progress-i 0-100 arası saxla
  const clampedProgress = Math.max(0, Math.min(100, progress));

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (clampedProgress / 100) * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Arxa fon dairəsi */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(139, 92, 246, 0.15)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress qövsü */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      {/* Mərkəzdəki mətn */}
      {number !== undefined && (
        <View style={styles.centerContent}>
          <Text
            style={[
              styles.numberText,
              { fontSize: size * 0.32 },
            ]}
          >
            {number}
          </Text>
        </View>
      )}

      {showPercentage && number === undefined && (
        <View style={styles.centerContent}>
          <Text
            style={[
              styles.numberText,
              { fontSize: size * 0.28 },
            ]}
          >
            {Math.round(clampedProgress)}%
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: colors.textPrimary,
    fontWeight: '800',
  },
});