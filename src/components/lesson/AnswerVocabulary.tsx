import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { PacketLesson } from '../../data/b1PacketTypes';

type Entry = PacketLesson['vocabulary'][number];
const normalized = (value: string) => value.toLocaleLowerCase('en').replace(/[’‘]/g, "'").match(/[\p{L}]+(?:'[\p{L}]+)*/gu)?.join(' ') || '';

/** Display only authored vocabulary that actually occurs in this response. */
export default function AnswerVocabulary({ text, vocabulary }: { text: string; vocabulary: Entry[] }) {
  const [selected, setSelected] = useState<Entry | null>(null);
  const textWords = ` ${normalized(text)} `;
  const entries = vocabulary.filter((entry, i, all) => {
    const word = normalized(entry.word);
    return word && textWords.includes(` ${word} `) && all.findIndex(other => normalized(other.word) === word) === i;
  });
  if (!entries.length) return null;
  return <View style={s.section}>
    <Text style={s.label}>Sözə və ya ifadəyə toxun:</Text>
    <View style={s.chips}>{entries.map(entry => <Pressable key={entry.word} accessibilityRole="button" accessibilityState={{ selected: selected === entry }} onPress={() => setSelected(entry)} style={[s.chip, selected === entry && s.selected]}><Text style={s.word}>{entry.word}</Text></Pressable>)}</View>
    {selected ? <View style={s.explanation}><Text style={s.heading}>{selected.word} — {selected.translation}</Text>{selected.usageNote ? <Text style={s.text}>{selected.usageNote}</Text> : null}{selected.example ? <Text style={s.text}>{selected.example}{selected.exampleAz ? ` — ${selected.exampleAz}` : ''}</Text> : null}</View> : null}
  </View>;
}
const s = StyleSheet.create({ section: { gap: 10 }, label: { color: '#D5C9F0', fontSize: 14, lineHeight: 20 }, chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, chip: { paddingHorizontal: 12, paddingVertical: 9, borderWidth: 1, borderColor: '#8067BD', borderRadius: 12, backgroundColor: '#302749', minHeight: 40 }, selected: { backgroundColor: '#514071', borderColor: '#D0B2FF' }, word: { color: '#F7F2FF', fontSize: 15, fontWeight: '700' }, explanation: { gap: 6, borderRadius: 14, backgroundColor: '#17172D', padding: 12 }, heading: { color: '#FBC269', fontWeight: '700', fontSize: 15, lineHeight: 22 }, text: { color: '#F8F5FF', fontSize: 14, lineHeight: 21 } });
