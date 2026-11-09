import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useLessonStyles } from './LessonTheme';
import LessonTextMotion, { type LessonMotion } from './LessonTextMotion';

export default function LessonWordChip({ word, used = false, disabled, onPress, label, state = 'idle' }: { word: string; used?: boolean; disabled: boolean; onPress: () => void; label?: string; state?: LessonMotion }) {
  const reduced = useReducedMotion(), s = useLessonStyles(base);
  const [arrival] = useState(() => new Animated.Value(1));
  useEffect(() => {
    arrival.stopAnimation();
    if (reduced || used) { arrival.setValue(1); return; }
    arrival.setValue(0);
    const animation = Animated.timing(arrival, { toValue: 1, duration: 160, useNativeDriver: true, isInteraction: false });
    animation.start(); return () => animation.stop();
  }, [arrival, reduced, used]);
  return <Animated.View style={{ opacity: used ? .25 : 1, transform: [{ translateY: arrival.interpolate({ inputRange: [0, 1], outputRange: [3, 0] }) }] }}><Pressable accessibilityRole="button" accessibilityLabel={label || word} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [s.chip, pressed && !reduced && { transform: [{ scale: .98 }] }]}><LessonTextMotion state={state} style={s.text}>{word}</LessonTextMotion></Pressable></Animated.View>;
}
const base = StyleSheet.create({ chip: { minHeight: 44, backgroundColor: '#282440', borderWidth: 1, borderColor: '#39315E', borderRadius: 13, paddingHorizontal: 14, paddingVertical: 10, justifyContent: 'center' }, text: { color: '#F6F3FF', fontSize: 15, lineHeight: 22 } });
