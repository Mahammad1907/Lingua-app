import { highlightedSpeechRange, type SpeechHighlight } from '../../utils/speechHighlight';
import { vocabularyKeys } from '../../utils/vocabularyIdentity';
import { useState } from 'react';
import { useVocabularyStore } from '../../store/vocabularyStore';
import { Text } from 'react-native';
import { b1Packet } from '../../data/b1Course';
import type { PacketLesson } from '../../data/b1PacketTypes';
import { vocabularySegments, type VocabularyEntry } from '../../utils/contextVocabulary';
import { useLessonTheme } from './LessonTheme';
export default function LessonVocabularyText({ text, packet, onSelect, highlight = true, focus }: {
  focus?: SpeechHighlight | null; text: string; packet: PacketLesson; onSelect?: (entry: VocabularyEntry) => void; highlight?: boolean;
}) {
  const { colors: ink } = useLessonTheme();
  const prior = b1Packet.filter(p => p.order < packet.order).flatMap(p => p.vocabulary);
  const vocabulary = [...packet.vocabulary, ...prior];
  const [known] = useState(() => new Set(useVocabularyStore.getState().allWords.filter(v => v.language === 'en').flatMap(v => vocabularyKeys(v.word))));
  const range = highlightedSpeechRange(text, focus);
  const segments = vocabularySegments(text, vocabulary);
  return <>{segments.map((part, i) => { const start = segments.slice(0, i).reduce((count, segment) => count + segment.text.length, 0); const active = range && start < range.end && start + part.text.length > range.start; return part.entry
    ? <Text key={i} onPress={onSelect ? event => { event?.stopPropagation(); onSelect(part.entry!); } : undefined}
      accessibilityRole={onSelect ? 'button' : undefined}
      accessibilityLabel={onSelect ? `${part.text}: mənasını göstər` : undefined}
      style={[highlight && !vocabularyKeys(part.entry.word).some(key => known.has(key)) ? { color: ink.orange, fontWeight: '700' } : undefined]}>{active ? <>{part.text.slice(0, Math.max(0, range.start - start))}<Text style={{ backgroundColor: '#E6C9F8' }}>{part.text.slice(Math.max(0, range.start - start), Math.min(part.text.length, range.end - start))}</Text>{part.text.slice(Math.min(part.text.length, range.end - start))}</> : part.text}</Text>
    : part.text; })}</>;
}
