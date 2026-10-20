import { Stack, useFocusEffect, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { b1Exams } from '../../data/b1Exam';
import { useUserStore } from '../../store/userStore';
import { assessPacketAnswer, type PacketVerdict } from '../../utils/packetAnswer';
import { lessonTheme as t } from '../../constants/lessonTheme';
import RecognizedVoiceComposer from '../RecognizedVoiceComposer';
import LessonArtwork3D from './LessonArtwork3D';

interface Response { value: string; verdict: PacketVerdict; spoken: boolean }
export default function PacketExam() {
  const router = useRouter(); const insets = useSafeAreaInsets();
  const [exam] = useState(() => b1Exams[useUserStore.getState().placementResults.some((r) => r.moduleId === 'module_1') ? 1 : 0]);
  const [started, setStarted] = useState(false); const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState(''); const [built, setBuilt] = useState<number[]>([]);
  const [written, setWritten] = useState(false); const [heard, setHeard] = useState(false);
  const [capturing, setCapturing] = useState(false); const [error, setError] = useState('');
  const [responses, setResponses] = useState<Record<string, Response>>({});
  const [outcome, setOutcome] = useState<{ passed: boolean; xp: number; correct: number } | null>(null);
  const busy = useRef(false); const speech = useRef(0); const saved = useRef(new Set<string>());
  const current = exam.cards[index];
  useFocusEffect(useCallback(() => () => { speech.current += 1; void Speech.stop(); }, []));
  const listen = async (rate = .75) => {
    const request = ++speech.current; setError('');
    try {
      await Speech.stop(); if (request !== speech.current) return;
      Speech.speak(current.audio!, { language: 'en-GB', rate,
        onDone: () => { if (request === speech.current) setHeard(true); },
        onError: () => { if (request === speech.current) setError('Audio açılmadı. Yenidən cəhd et və ya Keç seç.'); },
      });
    } catch { setError('Audio açılmadı. Bu, dil səhvi deyil.'); }
  };
  const finish = async (all: Record<string, Response>) => {
    if (busy.current) return;
    busy.current = true; setError('');
    try {
      const checked = Object.fromEntries(exam.cards.map((c) => [c.id, all[c.id]?.verdict.status === 'correct']));
      setOutcome(await useUserStore.getState().finishExam('module_1', checked));
    } catch { setError('Nəticə saxlanmadı. Yenidən cəhd et.'); }
    finally { busy.current = false; }
  };
  const save = (value: string, spoken: boolean, skip = false) => {
    if (saved.current.has(current.id)) return;
    saved.current.add(current.id); speech.current += 1; void Speech.stop();
    const verdict = skip ? { status: 'unknown' as const, criteria: [], message: 'Yoxlanmadı.' } : assessPacketAnswer(value, current.rule!, spoken);
    const all = { ...responses, [current.id]: { value, spoken, verdict } }; setResponses(all);
    if (index === exam.cards.length - 1) { void finish(all); return; }
    setIndex((v) => v + 1); setAnswer(''); setBuilt([]); setWritten(false); setHeard(false); setError('');
  };
  const resultOnlyWritten = exam.cards.some((c) => c.kind === 'voice' && !responses[c.id]?.spoken);
  const unverified = exam.required.some((n) => responses[`b1_exam_q${String(n).padStart(2, '0')}`]?.verdict.status === 'unknown');
  const complete = Object.keys(responses).length === exam.cards.length;
  return <View style={[s.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
    <Stack.Screen options={{ headerShown: false }} />
    <View style={s.header}><TouchableOpacity disabled={capturing} onPress={() => router.back()}><Text style={s.back}>‹</Text></TouchableOpacity><Text style={s.heading}>Bölmə sınağı · {exam.variant}</Text></View>
    <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      {!started ? <>
        <LessonArtwork3D kind="listening" />
        <Text style={s.heading}>Bildiklərini yoxla</Text><Text style={s.body}>17 tapşırıq, o cümlədən 6 səsli cavab. Cavablar sınaq bitəndən sonra görünəcək. Vaxt limiti yoxdur.</Text>
        <Text style={s.body}>Səsli cavab verə bilmirsənsə, “Yazılı davam et” seç. Bu yol danışıq bacarığını təsdiqləmir. Keç = yoxlanmadı.</Text>
        <Text style={s.note}>Keçid əsas ünsiyyət məqsədlərinə görədir; yalnız ümumi faizlə müəyyən edilmir.</Text>
        <TouchableOpacity style={s.primary} onPress={() => setStarted(true)}><Text style={s.dark}>Başla</Text></TouchableOpacity>
      </> : outcome ? <>
        <Text style={s.heading}>{outcome.passed ? resultOnlyWritten ? 'Yazılı cavablar və anlama üzrə keçid' : 'Bölmə üzrə keçid' : unverified ? 'Keçid üçün yoxlama tamamlanmayıb' : 'Bəzi bacarıqları yenidən məşq edək'}</Text>
        <Text style={s.note}>{outcome.correct}/17 uyğun cavab · +{outcome.xp} XP. Danışıq yoxlanmayıbsa ona nəticə verilmir. Tələffüz balı hesablanmır.</Text>
        {exam.cards.map((card) => { const response = responses[card.id]; return <View style={s.result} key={card.id}>
          <Text style={s.body}>{card.number}. {response?.verdict.status === 'correct' ? 'Uyğundur' : response?.verdict.status === 'unknown' ? 'Yoxlanmadı' : 'Yenidən məşq et'}</Text>
          <Text style={s.note}>Sənin cavabın: {response?.value || 'Keçildi'}</Text><Text style={s.note}>Uyğun nümunə: {card.rule!.answers[0]}</Text>
          {response?.verdict.criteria.map((c) => <Text key={c.goal} style={s.note}>{c.passed ? '✓' : '○'} {c.goal}</Text>)}
        </View>; })}
        <TouchableOpacity style={s.primary} onPress={() => router.replace({ pathname: '/module/[id]', params: { id: 'module_1' } })}><Text style={s.dark}>Dərslərə bax</Text></TouchableOpacity>
      </> : complete ? <><Text style={s.body}>{error || 'Nəticə saxlanır…'}</Text>{error ? <TouchableOpacity style={s.primary} onPress={() => void finish(responses)}><Text style={s.dark}>Yenidən saxla</Text></TouchableOpacity> : null}</> : <>
        <Text style={s.note}>{index + 1}/17 · Cavablar sınaq bitəndə açıqlanacaq</Text>
        <Text style={s.heading}>{current.body}</Text>
        {current.audio ? <View style={s.row}><TouchableOpacity disabled={capturing} style={s.option} onPress={() => void listen()}><Text style={s.body}>▶ Dinlə</Text></TouchableOpacity><TouchableOpacity disabled={capturing} style={s.option} onPress={() => void listen(.45)}><Text style={s.body}>Daha yavaş</Text></TouchableOpacity></View> : null}
        {error ? <Text style={s.note}>{error}</Text> : null}
        {!current.audio || heard ? current.kind === 'voice' && !written ? <>
          <RecognizedVoiceComposer key={current.id} deferJudgment onBusyChange={setCapturing} checkAnswer={() => ({ correct: false, countAsAttempt: false, message: '' })} onJudged={() => {}} onValid={(voice) => save(voice.transcript, true)} />
          <TouchableOpacity disabled={capturing} onPress={() => setWritten(true)}><Text style={s.link}>Yazılı davam et</Text></TouchableOpacity>
        </> : <>
          {current.options ? current.options.map((option, i) => <TouchableOpacity key={`${current.id}:${i}`} style={[s.option, answer === option && s.selected]} onPress={() => setAnswer(option)}><Text style={s.body}>{option}</Text></TouchableOpacity>) : current.words ? <>
            <View style={s.row}>{built.map((i, position) => <TouchableOpacity key={`${i}:${position}`} style={s.option} onPress={() => setBuilt((v) => v.filter((_, n) => n !== position))}><Text style={s.body}>{current.words![i]}</Text></TouchableOpacity>)}</View>
            <View style={s.row}>{current.words.map((word, i) => <TouchableOpacity key={`${word}:${i}`} disabled={built.includes(i)} style={[s.option, built.includes(i) && { opacity: .3 }]} onPress={() => setBuilt((v) => [...v, i])}><Text style={s.body}>{word}</Text></TouchableOpacity>)}</View>
          </> : <TextInput accessibilityLabel="Cavabın" style={s.input} value={answer} onChangeText={setAnswer} autoCorrect={false} autoCapitalize="none" multiline />}
          <TouchableOpacity disabled={!answer.trim() && !built.length} style={s.primary} onPress={() => save(current.words ? built.map((i) => current.words![i]).join(' ') : answer, false)}><Text style={s.dark}>Yoxla və davam et</Text></TouchableOpacity>
        </> : <Text style={s.note}>Əvvəl səsi dinlə.</Text>}
        <TouchableOpacity disabled={capturing} onPress={() => save('', false, true)}><Text style={s.link}>Keç · yoxlanmadı</Text></TouchableOpacity>
      </>}
    </ScrollView>
  </View>;
}
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: t.background }, header: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 18 }, back: { color: t.text, fontSize: 34 }, content: { padding: 20, paddingBottom: 35, gap: 16 },
  heading: { color: t.text, fontSize: 20, lineHeight: 29, fontWeight: '800' }, body: { color: t.text, fontSize: 16, lineHeight: 25 }, note: { color: t.muted, fontSize: 12, lineHeight: 20 },
  option: { backgroundColor: t.surface, borderRadius: 14, padding: 14, borderColor: t.border, borderWidth: 1 }, selected: { borderColor: t.orange }, input: { minHeight: 65, padding: 16, borderColor: t.border, borderWidth: 1, color: t.text, fontSize: 17, borderRadius: 14 },
  primary: { backgroundColor: t.orange, borderRadius: 16, padding: 17, alignItems: 'center' }, dark: { color: '#211426', fontWeight: '800', fontSize: 16 }, row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, link: { color: t.orange, fontSize: 14, paddingVertical: 12 }, result: { padding: 16, borderRadius: 16, backgroundColor: t.surface, gap: 6 },
});
