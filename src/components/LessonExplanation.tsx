import { Stack } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { LessonActivities } from '../data/lessonActivities';
import { Lesson } from '../data/types';
import MascotBubble from './MascotBubble';

export default function LessonExplanation({ lesson, content, onContinue, onBack }: {
  lesson: Lesson;
  content: LessonActivities;
  onContinue: () => void;
  onBack: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const part = content.explanation[page];
  const dialoguePage = page === content.explanation.length;

  useEffect(() => () => { void Speech.stop(); }, []);

  const speak = async (text: string) => {
    try {
      await Speech.stop();
      Speech.speak(text, { language: 'en-GB', rate: 0.75 });
    } catch {
      Alert.alert('Səs açıla bilmədi', 'Yenidən cəhd et.');
    }
  };

  const next = () => {
    void Speech.stop();
    if (dialoguePage) onContinue();
    else setPage((value) => value + 1);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity accessibilityLabel="Geri" onPress={() => {
          void Speech.stop();
          if (page > 0) setPage((value) => value - 1);
          else onBack();
        }} style={styles.back}><Text style={styles.backText}>←</Text></TouchableOpacity>
        <Text style={styles.caption}>Müəllim izahı · {page + 1}/{content.explanation.length + 1}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{lesson.titleAz}</Text>
        <Text style={styles.goal}>{lesson.canDo}</Text>
        <MascotBubble message={page === 0 ? content.introduction : 'Tələsmə. Nümunəni dinlə, sonra özün də ucadan de.'} />
        {!dialoguePage && part ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{part.title}</Text>
            <Text style={styles.body}>{part.text}</Text>
            {part.example ? (
              <TouchableOpacity accessibilityLabel="Nümunəni dinlə" style={styles.example} onPress={() => void speak(part.example!)}>
                <Text style={styles.exampleText}>▶  {part.example}</Text>
                <Text style={styles.note}>İngiliscə nümunəni dinlə</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>İlk söhbəti dinlə</Text>
            <Text style={styles.body}>İki tələbə sinifdə qarşılaşır.</Text>
            {content.dialogue.map((line, index) => (
              <TouchableOpacity key={index} style={styles.example} onPress={() => void speak(line.text)}>
                <Text style={styles.note}>{line.speaker}</Text>
                <Text style={styles.exampleText}>▶  {line.text}</Text>
                {showMeaning ? <Text style={styles.body}>{line.translation}</Text> : null}
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowMeaning((value) => !value)}>
              <Text style={styles.link}>{showMeaning ? 'Mənanı gizlət' : 'Mənasını göstər'}</Text>
            </TouchableOpacity>
            <Text style={styles.body}>Hello salamına Hi ilə cavab vermək olar. Eyni sözü təkrarlamaq məcburi deyil.</Text>
          </View>
        )}
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.button} onPress={next}>
          <Text style={styles.buttonText}>{dialoguePage ? 'İfadələri öyrən →' : 'Davam et →'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  back: { padding: 12, backgroundColor: colors.surface, borderRadius: 12 },
  backText: { color: colors.textPrimary, fontSize: 22 },
  caption: { color: colors.textSecondary, fontWeight: '700', flex: 1 },
  content: { padding: 20, paddingBottom: 30 },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: '800' },
  goal: { color: colors.textSecondary, lineHeight: 22, marginTop: 8, marginBottom: 18 },
  card: { padding: 20, borderRadius: 22, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.brd.light, marginTop: 16 },
  cardTitle: { color: colors.textPrimary, fontSize: 21, fontWeight: '800', marginBottom: 12 },
  body: { color: '#c8c8d5', fontSize: 16, lineHeight: 26 },
  example: { backgroundColor: colors.mascot.bgSoft, padding: 16, borderRadius: 14, marginVertical: 12 },
  exampleText: { color: colors.mascot.orange, fontSize: 17, lineHeight: 25, fontWeight: '700' },
  note: { color: colors.textSecondary, fontSize: 12, marginVertical: 5 },
  link: { color: colors.mascot.orange, fontWeight: '700', marginBottom: 16 },
  footer: { paddingHorizontal: 20, paddingTop: 12 },
  button: { backgroundColor: colors.mascot.orange, padding: 17, borderRadius: 17, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
