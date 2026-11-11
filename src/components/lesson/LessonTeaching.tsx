import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { PacketCard, PacketLesson } from '../../data/b1PacketTypes';
import { audioMeaning } from '../../utils/lessonPresentation';
import { teachingText } from '../../utils/lessonGuide';
import { LessonIcon, Surface, ink } from './ApprovedLessonSurface';
import LessonMascot from './LessonMascot';
import LessonVocabularyText from './LessonVocabularyText';
import LessonSheet from './LessonSheet';
import ApprovedLessonScene from './ApprovedLessonScene';
import { approvedScenesForCard, type ApprovedSceneId } from '../../utils/approvedLessonScenes';

/** Presentation only: every expression, meaning and explanation comes from the packet. */
export default function LessonTeaching({ card, packet, onSpeak, scenes, artworkHeight = 145 }: { card: PacketCard; packet: PacketLesson; onSpeak: (text: string) => void; scenes?: readonly ApprovedSceneId[]; artworkHeight?: number }) {
  const [details, setDetails] = useState(false);
  const sceneIds = scenes || approvedScenesForCard(card);
  const examples = [...new Set(card.examples || [])];
  const expression = examples[0] || card.board;
  const meaning = expression ? audioMeaning(packet, expression)?.split(' — ').slice(1).join(' — ') : undefined;
  const explanation = teachingText(card);
  const brief = explanation.split(/\n/)[0].split(/(?<=\.)\s/)[0];
  return <View style={s.stack}>
    <View style={s.heading}><Text style={s.badge}>Öyrən</Text><Text style={s.instruction}>Dinlə və nümunəyə bax.</Text></View>
    {sceneIds.length && artworkHeight > 0 ? <ApprovedLessonScene ids={sceneIds} height={artworkHeight} /> : null}
    {expression ? <LinearGradient colors={['#6931C3', '#45209F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.hero, (sceneIds.length > 0 || artworkHeight === 0) && { minHeight: 0, padding: 10 }]}>
      {!sceneIds.length && artworkHeight > 0 ? <LessonMascot height={Math.max(75, artworkHeight)} pose="teaching" style={{ width: '40%' }} /> : null}
      <View style={[s.bubble, sceneIds.length > 0 && { flexDirection: 'row', paddingVertical: 6 }]}><Text style={[s.expression, sceneIds.length > 0 && { flex: 1, fontSize: 22, lineHeight: 28, textAlign: 'left' }]}><LessonVocabularyText packet={packet} text={expression} /></Text><Pressable accessibilityRole="button" accessibilityLabel={`İngiliscə dinlə: ${expression}`} onPress={() => onSpeak(expression)} style={s.audio}><LessonIcon name="play" /></Pressable></View>
    </LinearGradient> : !sceneIds.length && artworkHeight > 0 ? <LessonMascot height={Math.min(110, artworkHeight)} pose="teaching" /> : null}
    <Surface>
      {meaning ? <View style={s.row}><View style={s.icon}><LessonIcon name="book" /></View><View style={s.flex}><Text style={s.label}>Mənası</Text><Text style={s.meaning}>{meaning}</Text></View></View> : null}
      {card.board ? <View style={[s.row, meaning && s.divider]}><View style={s.icon}><LessonIcon name="book" /></View><View style={s.flex}><Text style={s.label}>Quruluşu</Text><Text style={s.structure}><LessonVocabularyText packet={packet} text={card.board} /></Text></View></View> : null}
      {examples.length ? <View style={[s.examples, s.divider]}><Text style={s.label}>Nümunə</Text>{examples.slice(0, 1).map(text => <View key={text} style={s.row}><View style={s.flex}><Text style={s.example}><LessonVocabularyText packet={packet} text={text} /></Text>{audioMeaning(packet, text) ? <Text style={s.translation}>{audioMeaning(packet, text)!.split(' — ').slice(1).join(' — ')}</Text> : null}</View><Pressable accessibilityRole="button" accessibilityLabel={`Nümunəni ingiliscə dinlə: ${text}`} onPress={() => onSpeak(text)} style={s.audio}><LessonIcon name="play" /></Pressable></View>)}</View> : null}
      {examples.length > 1 ? <Pressable accessibilityRole="button" onPress={() => setDetails(true)} style={s.more}><Text style={s.moreText}>Bütün nümunələr ({examples.length})</Text></Pressable> : null}
      {brief ? <Text style={s.translation}><LessonVocabularyText packet={packet} text={brief} /></Text> : null}
      <Pressable accessibilityRole="button" onPress={() => setDetails(true)} style={s.more}><LessonIcon name="hint" size={18} /><Text style={s.moreText}>Qısa izah</Text></Pressable>
    </Surface>
    <LessonSheet visible={details} onClose={() => setDetails(false)} title="Qısa izah">{examples.map(text => <View key={text} style={s.row}><View style={s.flex}><Text style={s.example}><LessonVocabularyText packet={packet} text={text} /></Text>{audioMeaning(packet, text) ? <Text style={s.translation}>{audioMeaning(packet, text)!.split(' — ').slice(1).join(' — ')}</Text> : null}</View><Pressable accessibilityRole="button" accessibilityLabel={`Nümunəni ingiliscə dinlə: ${text}`} onPress={() => onSpeak(text)} style={s.audio}><LessonIcon name="play" /></Pressable></View>)}<Text style={s.body}><LessonVocabularyText packet={packet} text={explanation} /></Text>{card.body !== explanation ? <Text style={s.body}><LessonVocabularyText packet={packet} text={card.body.slice(explanation.length).trim()} /></Text> : null}</LessonSheet>
  </View>;
}
const s = StyleSheet.create({ stack: { gap: 14 }, heading: { gap: 9 }, badge: { alignSelf: 'flex-start', borderRadius: 18, paddingHorizontal: 15, paddingVertical: 5, color: ink.violet, backgroundColor: '#E5D3FA', fontSize: 17, fontWeight: '800' }, instruction: { color: ink.muted, fontSize: 17, lineHeight: 24 }, hero: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 25, padding: 12, minHeight: 170 }, bubble: { flex: 1, gap: 12, alignItems: 'center', backgroundColor: ink.card, borderRadius: 23, padding: 15 }, expression: { color: ink.text, fontSize: 27, lineHeight: 34, fontWeight: '800', textAlign: 'center' }, audio: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E6D5F9', alignItems: 'center', justifyContent: 'center' }, row: { flexDirection: 'row', alignItems: 'center', gap: 12 }, flex: { flex: 1, gap: 4 }, icon: { width: 36, height: 36, borderRadius: 18, backgroundColor: ink.soft, justifyContent: 'center', alignItems: 'center' }, label: { fontSize: 14, fontWeight: '700', color: ink.muted }, meaning: { fontSize: 24, lineHeight: 30, fontWeight: '800', color: ink.text }, divider: { borderTopWidth: 1, borderTopColor: '#E1CFF2', paddingTop: 10 }, structure: { color: ink.text, fontSize: 17, lineHeight: 24, fontWeight: '600' }, examples: { gap: 10, backgroundColor: '#F0E6FC', borderRadius: 16, padding: 12 }, example: { color: ink.text, fontSize: 20, lineHeight: 27, fontWeight: '700' }, translation: { color: ink.muted, fontSize: 15, lineHeight: 21 }, more: { minHeight: 44, alignSelf: 'flex-end', flexDirection: 'row', gap: 7, alignItems: 'center', paddingHorizontal: 12 }, moreText: { color: ink.violet, fontWeight: '700', fontSize: 14 }, body: { color: ink.text, fontSize: 17, lineHeight: 25 } });
