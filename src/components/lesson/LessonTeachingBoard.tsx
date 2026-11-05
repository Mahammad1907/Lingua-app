import { Image, StyleSheet, Text, View } from 'react-native';
import type { PacketLesson } from '../../data/b1PacketTypes';
import type { VocabularyEntry } from '../../utils/contextVocabulary';
import LessonVocabularyText from './LessonVocabularyText';

// The board is native text, so it stays sharp and every phrase stays tappable.
// Reuse the approved hooded mascot instead of legacy fox artwork.
export default function LessonTeachingBoard({ text, packet, cardId, onSelect }: { text: string; packet: PacketLesson; cardId: string; onSelect: (entry: VocabularyEntry) => void }) {
  return <View style={s.board}><View style={s.top}><Image source={require('../../../assets/onboarding/welcome.png')} accessible={false} resizeMode="contain" style={s.mascot} /><Text style={s.label}>BirFox ilə öyrən</Text></View><Text style={[s.text, text.length > 150 && s.longText]}><LessonVocabularyText key={cardId} text={text} packet={packet} onSelect={onSelect} /></Text></View>;
}
const s = StyleSheet.create({ board: { borderWidth: 1, borderColor: '#D8B8EF', borderRadius: 19, backgroundColor: '#FCF6FF', padding: 14, gap: 7 }, top: { flexDirection: 'row', alignItems: 'center', gap: 8 }, mascot: { width: 34, height: 42 }, label: { fontSize: 12, lineHeight: 18, color: '#79578C', fontWeight: '600' }, text: { color: '#301341', fontSize: 22, lineHeight: 33, fontWeight: '700' }, longText: { fontSize: 18, lineHeight: 27 } });
