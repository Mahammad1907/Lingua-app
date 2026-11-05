import { vocabularyKey } from '../../utils/vocabularyIdentity';
import { useState } from 'react';
import { useVocabularyStore } from '../../store/vocabularyStore';
import { Text } from 'react-native';
import { b1Packet } from '../../data/b1Course';
import type { PacketLesson } from '../../data/b1PacketTypes';
import { vocabularySegments, type VocabularyEntry } from '../../utils/contextVocabulary';
import { ink } from './LessonSurface';
export default function LessonVocabularyText({ text, packet, onSelect, highlight = true }: {
  text: string; packet: PacketLesson; onSelect?: (entry: VocabularyEntry) => void; highlight?: boolean;
}) {
  const prior = b1Packet.filter(p => p.order < packet.order).flatMap(p => p.vocabulary);
  const vocabulary = [...packet.vocabulary, ...prior];
  const [known] = useState(() => new Set(useVocabularyStore.getState().allWords.filter(v => v.language === 'en').map(v => vocabularyKey(v.word))));
  return <>{vocabularySegments(text, vocabulary).map((part, i) => part.entry
    ? <Text key={i} onPress={onSelect ? () => onSelect(part.entry!) : undefined}
      accessibilityRole={onSelect ? 'button' : undefined}
      accessibilityLabel={onSelect ? `${part.text}: mənasını göstər` : undefined}
      style={highlight && !known.has(vocabularyKey(part.entry.word)) ? { color: ink.orange, fontWeight: '700' } : undefined}>{part.text}</Text>
    : part.text)}</>;
}
