import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function HomeSectionProgress({ percent }: { percent: number }) {
  const fraction = Math.min(100, Math.max(0, percent)) / 100;
  const reduced = useReducedMotion();
  const [value] = useState(() => new Animated.Value(fraction));
  useEffect(() => {
    value.stopAnimation();
    if (reduced) { value.setValue(fraction); return; }
    const animation = Animated.timing(value, { toValue: fraction, duration: 320, useNativeDriver: false, isInteraction: false });
    animation.start(); return () => animation.stop();
  }, [value, fraction, reduced]);
  return <View accessible={false} style={s.track}><Animated.View style={[s.fill, { width: value.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} /></View>;
}
const s = StyleSheet.create({ track: { width: '70%', maxWidth: 260, height: 5, borderRadius: 5, backgroundColor: '#DCC3ED', overflow: 'hidden', marginTop: 3 }, fill: { height: '100%', borderRadius: 5, backgroundColor: '#9137D5' } });
