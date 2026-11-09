import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { PacketLesson } from '../../data/b1PacketTypes';
import { vocabularySegments } from '../../utils/contextVocabulary';
import { useVocabularyStore } from '../../store/vocabularyStore';
import { vocabularyKey } from '../../utils/vocabularyIdentity';
import LessonExplanationCard from './LessonExplanationCard';
import { LessonIcon } from './LessonSurface';

export default function LessonLearnedCollection({ packet, onSpeak }: { packet: PacketLesson; onSpeak: (text: string) => void }) {
  const [open, setOpen] = useState(false);
  const saved = useVocabularyStore(s => s.allWords);
  const known = new Set(saved.filter(w => w.language === 'en').map(w => vocabularyKey(w.word)));
  const text = packet.cards.filter(c => c.kind === 'teach').flatMap(c => [c.body, c.board || '', ...(c.examples || [])]).join(' ');
  const entries = [...new Map(vocabularySegments(text, packet.vocabulary).flatMap(p => p.entry && known.has(vocabularyKey(p.entry.word)) ? [[p.entry.word, p.entry] as const] : [])).values()];
  if (!entries.length) return null;
  return <><Pressable accessibilityRole="button" onPress={() => setOpen(true)} style={s.open}><LessonIcon name="book" size={20} /><Text style={s.label}>Öyrəndiklərim · {entries.length} ifadə</Text><LessonIcon name="arrow" size={18} /></Pressable>
    <LessonExplanationCard visible={open} onClose={() => setOpen(false)} title="Öyrəndiklərim">{entries.map(entry => <View key={entry.word} style={s.entry}><View style={s.copy}><Text style={s.word}>{entry.word}</Text><Text style={s.meaning}>{entry.translation}</Text></View><Pressable accessibilityRole="button" accessibilityLabel={`İngiliscə dinlə: ${entry.word}`} onPress={() => onSpeak(entry.word.split(/\s*\/\s*/)[0].replace(/…/g, ''))} style={s.listen}><LessonIcon name="sound" /></Pressable></View>)}</LessonExplanationCard></>;
}
const s = StyleSheet.create({ open: { minHeight: 48, borderWidth: 1, borderColor: '#DFC6F0', backgroundColor: '#FBF6FF', borderRadius: 17, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 10 }, label: { flex: 1, fontSize: 14, fontWeight: '600', color: '#7434A2' }, entry: { flexDirection: 'row', gap: 12, alignItems: 'center', borderBottomWidth: 1, borderColor: '#E9DAF3', paddingBottom: 12 }, copy: { flex: 1, gap: 4 }, word: { fontSize: 17, fontWeight: '700', color: '#301341' }, meaning: { fontSize: 14, lineHeight: 21, color: '#79578C' }, listen: { minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' } });
