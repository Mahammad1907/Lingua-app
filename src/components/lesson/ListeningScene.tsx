import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { LessonIcon, ink } from './LessonSurface';

// This is a playback animation, not an audio-amplitude measurement.
export default function ListeningScene({ playing, compact = false }: { playing: boolean; compact?: boolean }) {
  const reduced = useReducedMotion();
  const [pulse] = useState(() => new Animated.Value(0));
  useEffect(() => {
    pulse.stopAnimation(); pulse.setValue(0);
    if (!playing || reduced) return;
    const animation = Animated.loop(Animated.sequence([Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }), Animated.timing(pulse, { toValue: 0, duration: 600, useNativeDriver: true })]));
    animation.start(); return () => animation.stop();
  }, [playing, reduced, pulse]);
  return <LinearGradient colors={['#241D4F', '#101A35']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.scene, compact && { paddingVertical: 10 }]} accessibilityLabel={playing ? 'Səs oxunur' : 'Dinləmə tapşırığı'}>
    <View style={s.icon}><LessonIcon name="sound" color={ink.orange} size={28} /></View>
    <View style={s.wave} accessibilityElementsHidden>{[9, 15, 26, 39, 24, 47, 35, 22, 41, 30, 18, 37, 24, 14, 8].map((height, index) => <Animated.View key={index} style={{ width: 5, height, borderRadius: 4, backgroundColor: playing ? index < 8 ? ink.orange : ink.violet : '#8672C0', transform: [{ scaleY: pulse.interpolate({ inputRange: [0, 1], outputRange: index % 2 ? [.55, 1] : [1, .55] }) }] }} />)}</View>
    <Text style={s.label}>{playing ? 'Diqqətlə dinlə…' : 'Dinlə və cavab ver'}</Text>
  </LinearGradient>;
}
const s = StyleSheet.create({ scene: { borderRadius: 22, borderWidth: 1, borderColor: '#514075', padding: 16, alignItems: 'center', gap: 8 }, icon: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#3C2948', alignItems: 'center', justifyContent: 'center' }, wave: { height: 48, flexDirection: 'row', alignItems: 'center', gap: 6 }, label: { color: ink.violet, fontSize: 12, lineHeight: 18, fontWeight: '600' } });
