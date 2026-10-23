import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { PacketVerdict } from '../../utils/packetAnswer';
import { LessonIcon, ink } from './LessonSurface';

export default function LessonFeedback({ verdict, explanation, meaning }: { verdict: PacketVerdict; explanation: string; meaning: string | null }) {
  const correct = verdict.status === 'correct';
  const reduced = useReducedMotion();
  const [pulse] = useState(() => new Animated.Value(0));
  const [meaningOpen, setMeaningOpen] = useState(false);
  useEffect(() => {
    if (!correct || reduced) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const animation = Animated.timing(pulse, { toValue: 1, duration: 560, useNativeDriver: true });
    animation.start(); return () => animation.stop();
  }, [correct, reduced, pulse]);
  return <Animated.View accessibilityLiveRegion="polite" style={[s.box, correct && s.correct, correct && !reduced && { opacity: pulse.interpolate({ inputRange: [0, .25, 1], outputRange: [.55, 1, 1] }), transform: [{ translateY: pulse.interpolate({ inputRange: [0, 1], outputRange: [7, 0] }) }] }]}>
    {correct && !reduced ? <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, s.flash, { opacity: pulse.interpolate({ inputRange: [0, .3, 1], outputRange: [0, .23, 0] }) }]} /> : null}
    <View style={s.row}><Animated.View style={{ transform: [{ scale: correct && !reduced ? pulse.interpolate({ inputRange: [0, .55, 1], outputRange: [.6, 1.2, 1] }) : 1 }] }}><LessonIcon name={correct ? 'check' : 'hint'} color={correct ? ink.mint : ink.orange} size={23} /></Animated.View><Text style={[s.title, correct && { color: ink.mint }]}>{correct ? 'Düzdür!' : verdict.status === 'unknown' ? 'Yenidən cəhd et' : verdict.status === 'partial' ? 'Cavabın bir hissəsi düzdür' : 'Bu dəfə alınmadı'}</Text></View>
    {!correct ? <Text style={s.note}>{explanation || verdict.message}</Text> : null}
    {correct && meaning ? <Pressable accessibilityRole="button" accessibilityState={{ expanded: meaningOpen }} onPress={() => setMeaningOpen(v => !v)}><Text style={s.link}>{meaningOpen ? meaning : 'Mənasını göstər ›'}</Text></Pressable> : null}
  </Animated.View>;
}
const s = StyleSheet.create({ box: { padding: 14, gap: 6, borderWidth: 1, borderColor: '#9D7450', borderRadius: 18, backgroundColor: '#2A2230', overflow: 'hidden' }, correct: { borderColor: '#50B9A2', backgroundColor: '#133431' }, flash: { borderRadius: 18, backgroundColor: ink.mint }, row: { flexDirection: 'row', gap: 9, alignItems: 'center' }, title: { flex: 1, color: '#FFD2A5', fontSize: 15, lineHeight: 21, fontWeight: '800' }, note: { color: ink.text, fontSize: 13, lineHeight: 19 }, link: { color: '#C1B0F2', fontSize: 12, lineHeight: 18, paddingTop: 3 } });
