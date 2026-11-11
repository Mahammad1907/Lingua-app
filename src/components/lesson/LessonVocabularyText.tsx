import { createContext, useContext, useState, type PropsWithChildren } from 'react';
import VocabularyMeaning from './VocabularyMeaning';
import { Text } from 'react-native';
import { b1Packet } from '../../data/b1Course';
import type { PacketLesson } from '../../data/b1PacketTypes';
import { newLessonWords, vocabularyParts, vocabularySegments } from '../../utils/lessonVocabulary';
import { ink } from './ApprovedLessonSurface';
const SelectWord = createContext<(entry: PacketLesson['vocabulary'][number]) => void>(() => {});
export function LessonVocabularyProvider({ children }: PropsWithChildren) {
  const [entry, setEntry] = useState<PacketLesson['vocabulary'][number] | null>(null);
  return <SelectWord.Provider value={setEntry}>{children}<VocabularyMeaning entry={entry} onClose={() => setEntry(null)} /></SelectWord.Provider>;
}
export default function LessonVocabularyText({ text, packet }: { text: string; packet: PacketLesson }) {
  const setSelected = useContext(SelectWord);
  const entries = [...packet.vocabulary, ...b1Packet.filter(l => l.order < packet.order).flatMap(l => l.vocabulary)];
  const fresh = newLessonWords(packet, b1Packet);
  return <>{vocabularySegments(text, entries).map((segment, i) => segment.entry ? <Text key={i} accessibilityRole="button" accessibilityLabel={`${segment.text}: mənası və nümunəsi`} onPress={() => setSelected(segment.entry!)}>{vocabularyParts(segment.text, fresh).map((part, j) => <Text key={j} style={part.fresh ? { color: ink.violet, fontWeight: '700' } : undefined}>{part.text}</Text>)}</Text> : segment.text)}</>;
}
