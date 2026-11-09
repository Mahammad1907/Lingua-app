import { vocabularyKeys } from '../../utils/vocabularyIdentity';
import { useState } from 'react';
import { useVocabularyStore } from '../../store/vocabularyStore';
import { Text } from 'react-native';
import { b1Packet } from '../../data/b1Course';
import type { PacketLesson } from '../../data/b1PacketTypes';
import { vocabularySegments, type VocabularyEntry } from '../../utils/contextVocabulary';
import { useLessonTheme } from './LessonTheme';
export default function LessonVocabularyText({ text, packet, onSelect, highlight = true }: {
  text: string; packet: PacketLesson; onSelect?: (entry: VocabularyEntry) => void; highlight?: boolean;
}) {
  const { colors: ink } = useLessonTheme();
  const prior = b1Packet.filter(p => p.order < packet.order).flatMap(p => p.vocabulary);
  const vocabulary = [...packet.vocabulary, ...prior];
  const [known] = useState(() => new Set(useVocabularyStore.getState().allWords.filter(v => v.language === 'en').flatMap(v => vocabularyKeys(v.word))));
  return <>{vocabularySegments(text, vocabulary).map((part, i) => part.entry
    ? <Text key={i} onPress={onSelect ? event => { event?.stopPropagation(); onSelect(part.entry!); } : undefined}
      accessibilityRole={onSelect ? 'button' : undefined}
      accessibilityLabel={onSelect ? `${part.text}: mənasını göstər` : undefined}
      style={highlight && !vocabularyKeys(part.entry.word).some(key => known.has(key)) ? { color: ink.orange, fontWeight: '700' } : undefined}>{part.text}</Text>
    : part.text)}</>;
}
