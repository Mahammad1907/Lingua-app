import { createContext, useContext, useState, type PropsWithChildren } from 'react';
import VocabularyMeaning from './VocabularyMeaning';
import { vocabularyKey } from '../../utils/vocabularyIdentity';
import { Text } from 'react-native';
import { b1Packet } from '../../data/b1Course';
import type { PacketLesson } from '../../data/b1PacketTypes';
import { newLessonWords, vocabularyParts } from '../../utils/lessonVocabulary';
import { ink } from './ApprovedLessonSurface';
const SelectWord = createContext<(entry: PacketLesson['vocabulary'][number]) => void>(() => {});
export function LessonVocabularyProvider({ children }: PropsWithChildren) {
  const [entry, setEntry] = useState<PacketLesson['vocabulary'][number] | null>(null);
  return <SelectWord.Provider value={setEntry}>{children}<VocabularyMeaning entry={entry} onClose={() => setEntry(null)} /></SelectWord.Provider>;
}
export default function LessonVocabularyText({ text, packet }: { text: string; packet: PacketLesson }) {
  const setSelected = useContext(SelectWord);
  const entries = b1Packet.filter(l => l.order <= packet.order).flatMap(l => l.vocabulary);
  return <>{vocabularyParts(text, newLessonWords(packet, b1Packet)).map((part, i) => {
    const entry = entries.find(v => vocabularyKey(v.word) === vocabularyKey(part.text));
    return entry ? <Text key={i} accessibilityRole="button" accessibilityLabel={`${part.text}: mənası və nümunəsi`} onPress={() => setSelected(entry)} style={part.fresh ? { color: ink.violet, fontWeight: '700' } : undefined}>{part.text}</Text> : part.text;
  })}</>;
}
