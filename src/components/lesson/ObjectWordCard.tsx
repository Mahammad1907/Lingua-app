import { Image, Linking, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { LessonButton, LessonIcon, ink } from './ApprovedLessonSurface';
/** The author must classify the entry and verify its example/IPA before use. */
export interface ObjectWordContent {
  kind: 'object'; word: string; translation: string; image: ImageSourcePropType;
  example: string; exampleAz: string; structureTaught: boolean;
  pronunciation: { ipa: string; source: string; checkedAt: string; locale: 'en-GB' };
}
export default function ObjectWordCard({ entry, onSpeak, onPractice }: { entry: ObjectWordContent; onSpeak: (text: string) => void; onPractice: () => void }) {
  if (entry.kind !== 'object' || !entry.structureTaught || !entry.pronunciation.source || !entry.pronunciation.ipa) return null;
  return <View style={s.box}>
    <View style={s.card}><Image source={entry.image} resizeMode="contain" accessibilityLabel={entry.word} style={s.image} /><View style={s.row}><Text style={s.word}>{entry.word}</Text><Pressable accessibilityRole="button" accessibilityLabel="Sözü ingiliscə dinlə" onPress={() => onSpeak(entry.word)} style={s.audio}><LessonIcon name="sound" color="#FFF" /></Pressable></View><Text style={s.ipa}>{entry.pronunciation.ipa}</Text><Text style={s.meaning}>{entry.translation}</Text><Pressable accessibilityRole="link" onPress={() => void Linking.openURL(entry.pronunciation.source)}><Text style={s.source}>Tələffüz mənbəyi ↗</Text></Pressable></View>
    <View style={s.card}><Text style={s.label}>Nümunə</Text><View style={s.row}><Text style={s.example}>{entry.example}</Text><Pressable accessibilityRole="button" accessibilityLabel="Nümunəni ingiliscə dinlə" onPress={() => onSpeak(entry.example)} style={s.audio}><LessonIcon name="play" color="#FFF" /></Pressable></View><Text style={s.translation}>{entry.exampleAz}</Text></View>
    <LessonButton label="Məşqə keç" onPress={onPractice} />
  </View>;
}
const s = StyleSheet.create({ box: { gap: 14 }, card: { gap: 9, borderWidth: 1, borderColor: ink.border, borderRadius: 24, padding: 18, backgroundColor: ink.card }, image: { width: '100%', height: 160 }, row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }, word: { color: ink.violet, fontSize: 38, fontWeight: '800' }, audio: { width: 44, height: 44, borderRadius: 22, backgroundColor: ink.violet, alignItems: 'center', justifyContent: 'center' }, ipa: { color: ink.muted, textAlign: 'center', fontSize: 17 }, meaning: { color: ink.text, textAlign: 'center', fontSize: 23, fontWeight: '700' }, source: { color: ink.violet, fontSize: 12, textAlign: 'center', minHeight: 40, paddingVertical: 10 }, label: { color: ink.violet, fontSize: 14, fontWeight: '700' }, example: { flex: 1, color: ink.text, fontSize: 19, lineHeight: 26 }, translation: { color: ink.muted, fontSize: 16, lineHeight: 23 } });
