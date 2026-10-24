import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { PacketVerdict } from '../../utils/packetAnswer';
import { LessonIcon, ink } from './LessonSurface';
import LessonTextMotion, { useLessonTextMotion } from './LessonTextMotion';

export default function LessonFeedback({ verdict, explanation, meaning, assisted = false }: { verdict: PacketVerdict; explanation: string; meaning: string | null; assisted?: boolean }) {
  const correct = verdict.status === 'correct';
  const state = correct ? assisted ? 'assisted' : 'correct' : verdict.status === 'unknown' ? 'idle' : 'incorrect';
  const motion = useLessonTextMotion(state);
  const [meaningOpen, setMeaningOpen] = useState(false);
  useEffect(() => {
    if (!correct || motion.reduced) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, [correct, motion.reduced]);
  return <Animated.View accessibilityLiveRegion="polite" style={[s.box, correct && s.correct]}>
    <View style={s.row}><Animated.View style={motion.transformStyle}><LessonIcon name={correct ? 'check' : 'hint'} color={correct ? ink.mint : ink.orange} size={23} /></Animated.View><LessonTextMotion state={state} style={[s.title, correct && { color: ink.mint }]}>{correct ? 'Düzdür!' : verdict.status === 'unknown' ? 'Yenidən cəhd et' : verdict.status === 'partial' ? 'Cavabın bir hissəsi düzdür' : 'Bu dəfə alınmadı'}</LessonTextMotion></View>
    {!correct ? <Text style={s.note}>{explanation || verdict.message}</Text> : null}
    {correct && meaning ? <Pressable accessibilityRole="button" accessibilityState={{ expanded: meaningOpen }} onPress={() => setMeaningOpen(v => !v)}><Text style={s.link}>{meaningOpen ? meaning : 'Mənasını göstər ›'}</Text></Pressable> : null}
  </Animated.View>;
}
const s = StyleSheet.create({ box: { padding: 14, gap: 6, borderWidth: 1, borderColor: '#9D7450', borderRadius: 18, backgroundColor: '#2A2230', overflow: 'hidden' }, correct: { borderColor: '#50B9A2', backgroundColor: '#133431' }, flash: { borderRadius: 18, backgroundColor: ink.mint }, row: { flexDirection: 'row', gap: 9, alignItems: 'center' }, title: { flex: 1, color: '#FFD2A5', fontSize: 15, lineHeight: 21, fontWeight: '800' }, note: { color: ink.text, fontSize: 13, lineHeight: 19 }, link: { color: '#C1B0F2', fontSize: 12, lineHeight: 18, paddingTop: 3 } });
