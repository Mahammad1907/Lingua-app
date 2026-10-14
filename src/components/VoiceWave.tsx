import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, AppState, StyleSheet, View } from 'react-native';

export default function VoiceWave({ playing = false, color = '#C4B5E3' }: { playing?: boolean; color?: string }) {
  const [pulse] = useState(() => new Animated.Value(0));
  useEffect(() => {
    let disposed = false;
    let reduced = true;
    let animation: Animated.CompositeAnimation | undefined;
    const sync = () => {
      animation?.stop();
      pulse.setValue(0);
      if (disposed || reduced || !playing || AppState.currentState !== 'active') return;
      animation = Animated.loop(Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 420, useNativeDriver: true, isInteraction: false }),
        Animated.timing(pulse, { toValue: 0, duration: 420, useNativeDriver: true, isInteraction: false }),
      ]));
      animation.start();
    };
    void AccessibilityInfo.isReduceMotionEnabled().then((value) => { reduced = value; sync(); }).catch(() => {});
    const reduce = AccessibilityInfo.addEventListener('reduceMotionChanged', (value) => { reduced = value; sync(); });
    const app = AppState.addEventListener('change', sync);
    return () => { disposed = true; animation?.stop(); reduce.remove(); app.remove(); };
  }, [pulse, playing]);
  return <View style={styles.row} pointerEvents="none">
    {[10, 20, 14, 30, 22, 12, 25, 34, 18, 29, 14, 24, 11, 20, 28, 15].map((height, index) => (
      <Animated.View key={index} style={{ width: 3, borderRadius: 2, height, backgroundColor: color,
        transform: [{ scaleY: pulse.interpolate({ inputRange: [0, 1], outputRange: index % 2 ? [.5, 1] : [1, .55] }) }],
      }} />
    ))}
  </View>;
}
const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: 3, height: 36 } });
