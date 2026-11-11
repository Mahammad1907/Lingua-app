import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useReducedMotion } from '../../hooks/useReducedMotion';
const bars = [10, 18, 29, 21, 14, 27, 39, 50, 62, 48, 38, 25, 16, 26, 34, 24, 16, 10];
/** Playback decoration only. Microphone amplitude keeps its separate measured view. */
export default function LessonAudioWave({ playing }: { playing: boolean }) {
  const reduced = useReducedMotion();
  const [motion] = useState(() => new Animated.Value(0));
  useEffect(() => {
    motion.stopAnimation(); motion.setValue(0);
    if (!playing || reduced) return;
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(motion, { toValue: 1, duration: 380, useNativeDriver: true, isInteraction: false }),
      Animated.timing(motion, { toValue: 0, duration: 380, useNativeDriver: true, isInteraction: false }),
    ]));
    animation.start(); return () => animation.stop();
  }, [playing, reduced, motion]);
  return <View accessible={false} importantForAccessibility="no-hide-descendants" style={s.wave}>{bars.map((height, i) => <Animated.View key={i} style={[s.bar, { height: height * .75, backgroundColor: i > 4 && i < 12 ? '#F18C20' : '#9854E8', transform: [{ scaleY: playing && !reduced ? motion.interpolate({ inputRange: [0, 1], outputRange: i % 2 ? [.6, 1] : [1, .65] }) : 1 }] }]} />)}</View>;
}
const s = StyleSheet.create({ wave: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3 }, bar: { width: 4, flexShrink: 1, borderRadius: 3 } });
