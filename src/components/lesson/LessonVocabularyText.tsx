import { Text } from 'react-native';
import { b1Packet } from '../../data/b1Course';
import type { PacketLesson } from '../../data/b1PacketTypes';
import { newLessonWords, vocabularyParts } from '../../utils/lessonVocabulary';
import { ink } from './LessonSurface';
export default function LessonVocabularyText({ text, packet }: { text: string; packet: PacketLesson }) {
  return <>{vocabularyParts(text, newLessonWords(packet, b1Packet)).map((part, i) => part.fresh
    ? <Text key={i} style={{ color: ink.orange, fontWeight: '700' }}>{part.text}</Text> : part.text)}</>;
}
