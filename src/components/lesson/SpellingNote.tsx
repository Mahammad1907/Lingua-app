import { StyleSheet, Text, View } from 'react-native';
import type { PacketVerdict } from '../../utils/packetAnswer';
import { ink } from './ApprovedLessonSurface';

function marked(word: string, other: string, color: string) {
  let start = 0, end = word.length, otherEnd = other.length;
  while (start < end && start < otherEnd && word[start] === other[start]) start++;
  while (end > start && otherEnd > start && word[end - 1] === other[otherEnd - 1]) { end--; otherEnd--; }
  return <Text style={s.word}>{word.slice(0, start)}<Text style={{ color, textDecorationLine: 'underline' }}>{word.slice(start, end)}</Text>{word.slice(end)}</Text>;
}
export default function SpellingNote({ corrections }: { corrections: NonNullable<PacketVerdict['spellingCorrections']> }) {
  return <View style={s.box}><Text style={s.title}>Kiçik yazı düzəlişi</Text>{corrections.map((c, i) => <View key={i} style={s.row}>{marked(c.before, c.after, '#984000')}<Text style={s.arrow}>→</Text>{marked(c.after, c.before, ink.mint)}</View>)}</View>;
}
const s = StyleSheet.create({ box: { padding: 11, gap: 6, borderRadius: 12, borderWidth: 1, borderColor: '#569B87', backgroundColor: '#ECFAEF' }, title: { color: '#166534', fontSize: 14, lineHeight: 20, fontWeight: '700' }, row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12 }, word: { color: '#24402B', fontSize: 18, lineHeight: 25, fontWeight: '700' }, arrow: { color: '#166534', fontSize: 18 } });
