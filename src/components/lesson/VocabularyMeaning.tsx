import { verifiedPronunciation } from '../../data/verifiedPronunciations';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import type { PacketLesson } from '../../data/b1PacketTypes';
import LessonSheet from './LessonSheet';
import { LessonIcon, ink } from './ApprovedLessonSurface';

export default function VocabularyMeaning({ entry, onClose }: { entry: PacketLesson['vocabulary'][number] | null; onClose: () => void }) {
  const pronunciation = entry ? verifiedPronunciation(entry.word) : null;
  const [error, setError] = useState('');
  useEffect(() => { if (entry) return () => { void Speech.stop(); }; }, [entry]);
  const speak = async (text: string) => {
    setError('');
    try { await Speech.stop(); Speech.speak(text, { language: 'en-GB', rate: .75, onError: () => setError('Səs açılmadı. Yenidən dinlə.') }); }
    catch { setError('Səs açılmadı. Yenidən dinlə.'); }
  };
  return <LessonSheet visible={Boolean(entry)} onClose={onClose} title={entry?.word || 'Sözün mənası'}>
    {entry ? <>
      <View style={s.row}><Text style={s.word}>{entry.word}</Text><Pressable accessibilityRole="button" accessibilityLabel="Sözü ingiliscə dinlə" onPress={() => void speak(entry.word)} style={s.audio}><LessonIcon name="sound" color="#FFF" /></Pressable></View>
      {pronunciation ? <><Text style={s.text}>{pronunciation.ipa}</Text><Pressable accessibilityRole="link" onPress={() => void Linking.openURL(pronunciation.source)}><Text style={s.link}>Tələffüz mənbəyi ↗</Text></Pressable></> : null}
      <Text style={s.label}>Mənası</Text><Text style={s.text}>{entry.translation}</Text>
      {entry.usageNote ? <Text style={s.text}>{entry.usageNote}</Text> : null}
      {entry.example ? <><Text style={s.label}>Nümunə</Text><View style={s.row}><Text style={[s.text, { flex: 1 }]}>{entry.example}</Text><Pressable accessibilityRole="button" accessibilityLabel="Nümunəni ingiliscə dinlə" onPress={() => void speak(entry.example)} style={s.audio}><LessonIcon name="play" color="#FFF" /></Pressable></View><Text style={s.text}>{entry.exampleAz}</Text></> : null}
      {error ? <Text accessibilityLiveRegion="polite" style={s.error}>{error}</Text> : null}
    </> : null}
  </LessonSheet>;
}
const s = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: 12 }, word: { color: ink.violet, flex: 1, fontSize: 29, fontWeight: '800' }, audio: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', backgroundColor: ink.violet }, label: { color: ink.muted, fontSize: 13, fontWeight: '700' }, text: { color: ink.text, fontSize: 17, lineHeight: 25 }, link: { color: ink.violet, fontSize: 13, minHeight: 40, paddingVertical: 10 }, error: { color: ink.error } });
