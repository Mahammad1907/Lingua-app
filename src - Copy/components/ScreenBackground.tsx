import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

export default function ScreenBackground({
  children,
}: {
  children?: ReactNode;
}) {
  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            <RadialGradient id="glowPurple" cx="15%" cy="0%" r="75%">
              <Stop offset="0" stopColor="#8b5cf6" stopOpacity="0.16" />
              <Stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="glowBlue" cx="100%" cy="90%" r="70%">
              <Stop offset="0" stopColor="#3b82f6" stopOpacity="0.1" />
              <Stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#glowPurple)" />
          <Rect width="100%" height="100%" fill="url(#glowBlue)" />
        </Svg>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1a' },
});