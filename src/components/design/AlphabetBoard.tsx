// Əlifba lövhəsi (15 Nov 2026): 26 letters with their American names in Azerbaijani letters.
// Tap = normal, long press = slow. Plays with the silent switch on, like the lessons.
import * as Speech from 'expo-speech';
import { setAudioModeAsync } from 'expo-audio';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { d, font, shadow } from './theme';

const LETTERS: [string, string][] = [
  ['A', 'ey'], ['B', 'bi'], ['C', 'si'], ['D', 'di'], ['E', 'i'], ['F', 'ef'], ['G', 'ci'], ['H', 'eyç'], ['I', 'ay'],
  ['J', 'cey'], ['K', 'key'], ['L', 'el'], ['M', 'em'], ['N', 'en'], ['O', 'ou'], ['P', 'pi'], ['Q', 'kyu'], ['R', 'ar'],
  ['S', 'es'], ['T', 'ti'], ['U', 'yu'], ['V', 'vi'], ['W', 'dabl-yu'], ['X', 'eks'], ['Y', 'uay'], ['Z', 'zi'],
];

export function AlphabetBoard() {
  const [on, setOn] = useState<string | null>(null);
  const say = (l: string, rate: number) => {
    setOn(l);
    void Speech.stop().then(() => setAudioModeAsync({ playsInSilentMode: true }).catch(() => {}))
      .then(() => Speech.speak(l, { language: 'en-US', rate, onDone: () => setOn(null), onStopped: () => setOn(null), onError: () => setOn(null) }));
  };
  return <View style={[s.card, shadow]}>
    <Text style={s.title}>Əlifba lövhəsi</Text>
    <Text style={s.sub}>Hərfə toxun — eşit. Basıb saxla — yavaş.</Text>
    <View style={s.grid}>
      {LETTERS.map(([l, r]) => <Pressable key={l} accessibilityRole="button" accessibilityLabel={`${l}, ${r}`} onPress={() => say(l, 0.85)} onLongPress={() => say(l, 0.4)}
        style={({ pressed }) => [s.cell, on === l && s.cellOn, pressed && { transform: [{ scale: .95 }] }]}>
        <Text style={[s.letter, on === l && { color: d.greenText }]}>{l}</Text>
        <Text style={s.reading}>{r}</Text>
      </Pressable>)}
    </View>
  </View>;
}

const s = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 22, padding: 16, gap: 6, marginBottom: 16 },
  title: { color: d.ink, fontSize: 20, ...font.extrabold },
  sub: { color: d.inkSoft, fontSize: 14, ...font.bold },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  cell: { width: 58, height: 64, borderRadius: 14, borderWidth: 1.5, borderColor: d.border, backgroundColor: d.surface, alignItems: 'center', justifyContent: 'center' },
  cellOn: { borderColor: d.green, backgroundColor: d.greenSoft },
  letter: { color: d.purple, fontSize: 24, ...font.extrabold },
  reading: { color: d.inkSoft, fontSize: 12, ...font.bold },
});
