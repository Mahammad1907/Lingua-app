import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { PacketVerdict } from '../../utils/packetAnswer';
import { LessonIcon, ink } from './LessonSurface';
import LessonSheet from './LessonSheet';
import LessonTextMotion, { useLessonTextMotion } from './LessonTextMotion';

export default function LessonFeedback({ verdict, explanation, meaning, assisted = false, answer, accepted, needsPractice = false, example }: { verdict: PacketVerdict; explanation: string; meaning: string | null; assisted?: boolean; answer?: string; accepted?: string[]; needsPractice?: boolean; example?: string }) {
  const correct = verdict.status === 'correct';
  const state = correct ? assisted ? 'assisted' : 'correct' : verdict.status === 'unknown' ? 'idle' : 'incorrect';
  const motion = useLessonTextMotion(state);
  const [meaningOpen, setMeaningOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  useEffect(() => {
    if (!correct || motion.reduced) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, [correct, motion.reduced]);
  return <Animated.View accessibilityLiveRegion="polite" style={[s.box, correct && s.correct, motion.borderStyle('#9D7450'), verdict.status === 'unknown' && s.unverified]}>
    <View style={s.row}><Animated.View style={motion.iconStyle}><LessonIcon name={correct ? 'check' : 'hint'} color={correct ? ink.mint : verdict.status === 'unknown' ? ink.muted : ink.orange} size={23} /></Animated.View><LessonTextMotion state={state} style={[s.title, correct && { color: ink.mint }, verdict.status === 'unknown' && { color: ink.muted }]}>{correct ? 'Düzdür!' : verdict.status === 'unknown' ? 'Yenidən cəhd et' : verdict.status === 'partial' ? 'Cavabın bir hissəsi düzdür' : 'Bu dəfə alınmadı'}</LessonTextMotion></View>
    {!correct ? <Text style={s.note}>{explanation || verdict.message}</Text> : null}
    {needsPractice ? <Text style={s.note}>Yenidən məşq lazımdır. Davam edə bilərsən; bu bacarığa sonra qayıdacağıq.</Text> : null}
    {!correct && verdict.status !== 'unknown' && answer !== undefined && accepted?.length ? <>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: detailsOpen }} onPress={() => setDetailsOpen(v => !v)}><Text style={s.link}>Mənə başa sal {detailsOpen ? '−' : '+'}</Text></Pressable>
      <LessonSheet visible={detailsOpen} onClose={() => setDetailsOpen(false)} title="Mənə başa sal">
        <Text style={s.note}>Sənin cavabın: {answer}</Text>
        <Text style={s.note}>Belə cavab verə bilərsən: {accepted.join(' / ')}</Text>
        {example ? <Text style={s.note}>{example}</Text> : null}
      </LessonSheet>
    </> : null}
    {correct && meaning ? <Pressable accessibilityRole="button" accessibilityState={{ expanded: meaningOpen }} onPress={() => setMeaningOpen(v => !v)}><Text style={s.link}>{meaningOpen ? meaning : 'Mənasını göstər ›'}</Text></Pressable> : null}
  </Animated.View>;
}
const s = StyleSheet.create({ unverified: { borderColor: '#554681', backgroundColor: '#15162F' }, box: { padding: 11, gap: 5, borderWidth: 1, borderColor: '#9D7450', borderRadius: 18, backgroundColor: '#2A2230', overflow: 'hidden' }, correct: { borderColor: '#50B9A2', backgroundColor: '#133431' }, flash: { borderRadius: 18, backgroundColor: ink.mint }, row: { flexDirection: 'row', gap: 9, alignItems: 'center' }, title: { flex: 1, color: '#FFD2A5', fontSize: 15, lineHeight: 21, fontWeight: '800' }, note: { color: ink.text, fontSize: 13, lineHeight: 19 }, link: { color: '#C1B0F2', fontSize: 12, lineHeight: 18, paddingTop: 3 } });
