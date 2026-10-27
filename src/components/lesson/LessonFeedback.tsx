import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { PacketVerdict } from '../../utils/packetAnswer';
import { LessonIcon, ink } from './LessonSurface';
import SpellingNote from './SpellingNote';
import LessonExplanationCard from './LessonExplanationCard';
import LessonTextMotion, { useLessonTextMotion } from './LessonTextMotion';
import AnswerVocabulary from './AnswerVocabulary';
import type { PacketLesson } from '../../data/b1PacketTypes';

export default function LessonFeedback({ verdict, explanation, meaning, assisted = false, answer, accepted, needsPractice = false, example, vocabulary = [], vocabularyText = '' }: { verdict: PacketVerdict; explanation: string; meaning: string | null; assisted?: boolean; answer?: string; accepted?: string[]; needsPractice?: boolean; example?: string; vocabulary?: PacketLesson['vocabulary']; vocabularyText?: string }) {
  const correct = verdict.status === 'correct';
  const state = correct ? assisted ? 'assisted' : 'correct' : verdict.status === 'unknown' ? 'idle' : 'incorrect';
  const motion = useLessonTextMotion(state);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const plain = (value: string) => value.toLocaleLowerCase('en').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const match = vocabulary.find(entry => plain(entry.word) === plain(vocabularyText));
  useEffect(() => {
    if (!correct || motion.reduced) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, [correct, motion.reduced]);
  return <Animated.View accessibilityLiveRegion="polite" style={[s.box, correct && s.correct, motion.borderStyle('#9D7450'), verdict.status === 'unknown' && s.unverified]}>
    <View style={s.row}><Animated.View style={motion.iconStyle}><LessonIcon name={correct ? 'check' : 'hint'} color={correct ? ink.mint : verdict.status === 'unknown' ? ink.muted : ink.orange} size={23} /></Animated.View><LessonTextMotion state={state} style={[s.title, correct && { color: ink.mint }, verdict.status === 'unknown' && { color: ink.muted }]}>{correct ? verdict.spellingCorrections?.length ? 'Cavab qəbul olundu' : 'Düzdür!' : verdict.status === 'unknown' ? 'Yenidən cəhd et' : verdict.status === 'partial' ? 'Cavabın bir hissəsi düzdür' : 'Bu dəfə alınmadı'}</LessonTextMotion></View>
    {correct && verdict.spellingCorrections?.length ? <SpellingNote corrections={verdict.spellingCorrections} /> : null}
    {!correct ? <Text style={s.note}>{explanation || verdict.message}</Text> : null}
    {verdict.status !== 'unknown' && !correct && accepted?.length ? <Text style={s.note}>Uyğun cavab: {accepted.join(' / ')}</Text> : null}
    {verdict.status !== 'unknown' && (meaning || match?.translation) ? <Text style={s.note}>{meaning || `${match?.word} — ${match?.translation}`}</Text> : null}
    {needsPractice ? <Text style={s.note}>Yenidən məşq lazımdır. Davam edə bilərsən; bu bacarığa sonra qayıdacağıq.</Text> : null}
    {verdict.status !== 'unknown' && answer !== undefined && accepted?.length ? <>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: detailsOpen }} onPress={() => setDetailsOpen(v => !v)}><Text style={s.link}>Cavabın izahı ›</Text></Pressable>
      <LessonExplanationCard visible={detailsOpen} title="Cavabın izahı" onClose={() => setDetailsOpen(false)}>
        <Text style={s.detail}>Sənin cavabın: {answer}</Text>
        <Text style={s.detailAnswer}>Belə cavab verə bilərsən: {accepted.join(' / ')}</Text>
        {meaning ? <Text style={s.detail}>{meaning}</Text> : null}
        {!correct && explanation ? <Text style={s.detail}>{explanation}</Text> : null}
        {!correct && example ? <Text style={s.detail}>{example}</Text> : null}
        <AnswerVocabulary text={vocabularyText} vocabulary={vocabulary} />
      </LessonExplanationCard>
    </> : null}
  </Animated.View>;
}
const s = StyleSheet.create({ detail: { color: '#FAF8FF', fontSize: 15, lineHeight: 23 }, detailAnswer: { color: '#8CF0D3', fontSize: 16, lineHeight: 24, fontWeight: '700' }, unverified: { borderColor: '#554681', backgroundColor: '#15162F' }, box: { padding: 14, gap: 6, borderWidth: 1, borderColor: '#9D7450', borderRadius: 18, backgroundColor: '#2A2230', overflow: 'hidden' }, correct: { borderColor: '#50B9A2', backgroundColor: '#133431' }, flash: { borderRadius: 18, backgroundColor: ink.mint }, row: { flexDirection: 'row', gap: 9, alignItems: 'center' }, title: { flex: 1, color: '#FFD2A5', fontSize: 15, lineHeight: 21, fontWeight: '800' }, note: { color: ink.text, fontSize: 13, lineHeight: 19 }, link: { color: '#C1B0F2', fontSize: 14, lineHeight: 21, fontWeight: '600', minHeight: 40, paddingVertical: 8 } });
