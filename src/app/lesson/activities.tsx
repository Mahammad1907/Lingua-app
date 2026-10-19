import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MascotBubble from '../../components/MascotBubble';
import EnergyMeter from '../../components/EnergyMeter';
import { useUserStore } from '../../store/userStore';
import VoicePractice from '../../components/VoicePractice';
import { colors } from '../../constants/colors';
import { getLessonActivities, LessonActivities } from '../../data/lessonActivities';
import { getLessonById } from '../../data/lessons';
import { Lesson } from '../../data/types';
import { completeLessonSession } from '../../utils/lessonCompletion';

export default function ActivitiesScreen() {
  const params = useLocalSearchParams<{ id: string; correct: string; time: string; attemptId?: string }>();
  const router = useRouter();
  const lesson = getLessonById(params.id || '');
  const content = getLessonActivities(params.id || '');
  if (!lesson || !content) return (
    <View style={styles.error}>
      <Text style={styles.title}>Bu dərs üçün fəaliyyət tapılmadı</Text>
      <TouchableOpacity onPress={() => router.back()}><Text style={styles.link}>Geri qayıt</Text></TouchableOpacity>
    </View>
  );
  return <Activities key={lesson.id} lesson={lesson} content={content} attemptId={params.attemptId ?? ''} elapsed={Number(params.time)} />;
}

function Activities({ lesson, content, attemptId, elapsed }: {
  lesson: Lesson; content: LessonActivities; attemptId: string; elapsed: number;
}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [stop, setStop] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [stage, setStage] = useState<'game' | 'speaking'>('game');
  const [speakingIndex, setSpeakingIndex] = useState(0);
  const finishing = useRef(false);
  const lastAdvance = useRef(-1);
  const [startedAt] = useState(() => Date.now());
  const [completionError, setCompletionError] = useState('');
  const currentStop = content.game.stops[stop];
  const task = content.speaking[speakingIndex];

  useEffect(() => () => { void Speech.stop(); }, []);

  const answer = (value: string) => {
    if (feedback === 'correct') return;
    useUserStore.getState().recordTask(attemptId, `game:${stop}`, value === currentStop.answer, value);
    setFeedback(value === currentStop.answer ? 'correct' : 'wrong');
    void Speech.stop().then(() => {
      Speech.speak(value, { language: 'en-GB', rate: 0.75 });
    }).catch(() => {});
  };

  const nextStop = () => {
    if (lastAdvance.current === stop) return;
    lastAdvance.current = stop;
    void Speech.stop();
    if (stop + 1 === content.game.stops.length) setStage('speaking');
    else setStop((value) => value + 1);
    setFeedback(null);
  };

  const finishTask = async (outcome: { skipped: boolean; assisted: boolean }) => {
    if (outcome.assisted) useUserStore.getState().useHelp(attemptId);
    useUserStore.getState().recordTask(attemptId, `voice:${speakingIndex}`, outcome.skipped ? null : true, 'recording');
    if (speakingIndex + 1 < content.speaking.length) {
      setSpeakingIndex((value) => value + 1);
      return;
    }
    if (finishing.current) return;
    finishing.current = true;
    try {
    const summary = await completeLessonSession(attemptId);
    const priorTime = Number.isFinite(elapsed) ? Math.max(1, elapsed) : 1;
    const time = priorTime + Math.floor((Date.now() - startedAt) / 60000);
    router.replace({ pathname: '/lesson/complete', params: {
      id: lesson.id, correct: String(summary.correct), total: String(summary.total),
      wrong: String(summary.wrong), time: String(time), receiptId: summary.receiptId,
    } });
    } catch { finishing.current = false; setCompletionError('Nəticə saxlanmadı. Yenidən cəhd et.'); }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}><Text style={styles.backText}>←</Text></TouchableOpacity>
        <Text style={styles.caption}>{stage === 'game' ? 'Oyun · 3 dayanacaq' : `Danışıq · ${speakingIndex + 1}/${content.speaking.length}`}</Text>
        <EnergyMeter compact />
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <Text style={styles.title}>{stage === 'game' ? content.game.title : 'Sənin danışıq növbən'}</Text>
        <MascotBubble message={stage === 'game' ? content.game.instructions : 'Özün danış, sonra yazını dinlə. Burada səhv etməyə görə can itirmirsən.'} />
        {stage === 'game' ? (
          <>
            <View style={styles.route}>
              {content.game.stops.map((place, index) => (
                <View key={place.place} style={styles.station}>
                  <View style={[styles.stationCircle, index < stop && styles.visited, index === stop && styles.current]}>
                    <Text style={styles.stationEmoji}>{index < stop ? '✓' : place.emoji}</Text>
                  </View>
                  <Text style={styles.stationLabel}>{place.place}</Text>
                </View>
              ))}
            </View>
            <View style={styles.scene}>
              <Text style={styles.sceneEmoji}>{currentStop.emoji}</Text>
              <Text style={styles.sceneTitle}>{currentStop.place} · {currentStop.time}</Text>
              <Text style={styles.body}>Günün bu vaxtına xüsusi salamı seç.</Text>
            </View>
            {content.game.options.map((value) => (
              <TouchableOpacity key={value} disabled={feedback === 'correct'} style={styles.option} onPress={() => answer(value)}>
                <Text style={styles.optionText}>{value}</Text>
              </TouchableOpacity>
            ))}
            {feedback ? (
              <MascotBubble variant={feedback === 'correct' ? 'success' : 'hint'} message={feedback === 'correct'
                ? 'Doğrudur! Yolun növbəti hissəsi açıldı.'
                : `${currentStop.time === '08:30' ? 'Səhər' : currentStop.time === '15:00' ? 'Günortadan sonra' : 'Axşam'} salamını xatırla. Yenidən cəhd et.`} />
            ) : null}
            {feedback === 'correct' ? (
              <TouchableOpacity style={styles.next} onPress={nextStop}><Text style={styles.nextText}>{stop + 1 === content.game.stops.length ? 'İndi danışaq →' : 'Növbəti dayanacaq →'}</Text></TouchableOpacity>
            ) : null}
          </>
        ) : (
          <VoicePractice key={speakingIndex} prompt={task.prompt} examples={task.examples} onDone={finishTask} last={speakingIndex + 1 === content.speaking.length} />
        )}
        {completionError ? <Text style={styles.body}>{completionError}</Text> : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  back: { padding: 12, borderRadius: 12, backgroundColor: colors.surface },
  backText: { color: '#fff', fontSize: 22 },
  caption: { color: colors.textSecondary, fontWeight: '700', flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 10 },
  title: { color: '#fff', fontSize: 27, fontWeight: '800', marginBottom: 18 },
  body: { color: '#c2cadb', lineHeight: 22, textAlign: 'center', marginTop: 8 },
  route: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#161e35', padding: 14, borderRadius: 22, marginVertical: 18 },
  station: { flex: 1, alignItems: 'center' },
  stationCircle: { height: 48, width: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: '#28314d', borderWidth: 2, borderColor: '#44506c' },
  visited: { backgroundColor: '#184d40', borderColor: '#53ca9c' },
  current: { borderColor: colors.mascot.orange, backgroundColor: '#503026' },
  stationEmoji: { color: '#7ae0b2', fontSize: 21 },
  stationLabel: { color: '#bac7dc', fontSize: 11, marginTop: 8, textAlign: 'center' },
  scene: { backgroundColor: colors.surface, padding: 22, borderRadius: 24, alignItems: 'center', marginBottom: 16 },
  sceneEmoji: { fontSize: 55, marginBottom: 12 },
  sceneTitle: { color: '#fff', fontSize: 20, fontWeight: '800', textAlign: 'center' },
  option: { backgroundColor: '#24243f', padding: 17, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: '#3b3b60' },
  optionText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  next: { backgroundColor: colors.mascot.orange, padding: 18, borderRadius: 16, alignItems: 'center', marginVertical: 16 },
  nextText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  error: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colors.background },
  link: { color: colors.mascot.orange, fontSize: 17, marginTop: 16 },
});
