import { Stack, useFocusEffect, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getLessonById } from '../../data/lessons';
import { packetFlow } from '../../data/b1Course';
import type { PacketCard, PacketLesson as Content, PacketRule } from '../../data/b1PacketTypes';
import { useUserStore } from '../../store/userStore';
import { useVocabularyStore } from '../../store/vocabularyStore';
import { assessPacketAnswer, type PacketVerdict } from '../../utils/packetAnswer';
import { lessonTheme as t } from '../../constants/lessonTheme';
import EnergyMeter from '../EnergyMeter';
import EarnedXP from '../EarnedXP';
import RecognizedVoiceComposer from '../RecognizedVoiceComposer';
import LessonArtwork3D, { TeacherBoard3D } from './LessonArtwork3D';

interface Outcome { answer: string; status: 'independent' | 'assisted' | 'wrong' | 'unverified'; spoken: boolean; reason?: string }
const labels = { independent: 'Müstəqil', assisted: 'Köməklə', wrong: 'Yenidən məşq lazımdır', unverified: 'Yoxlanmadı' };

export default function PacketLesson({ packet }: { packet: Content }) {
  const router = useRouter(); const insets = useSafeAreaInsets();
  const [flow] = useState(() => packetFlow(packet).filter((c) => c.kind !== 'review'));
  const [index, setIndex] = useState(0); const [attempt, setAttempt] = useState('');
  const [answer, setAnswer] = useState(''); const [built, setBuilt] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<PacketVerdict | null>(null);
  const [queue, setQueue] = useState<PacketCard[]>([]); const [reviewing, setReviewing] = useState(false);
  const [outcomes, setOutcomes] = useState<Record<string, Outcome>>({});
  const [history, setHistory] = useState<Record<string, Outcome>>({});
  const [help, setHelp] = useState(false); const [heard, setHeard] = useState(false);
  const [soundError, setSoundError] = useState(''); const [receipt, setReceipt] = useState('');
  const [completionError, setCompletionError] = useState(''); const [done, setDone] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [busy, setBusy] = useState(false);
  const scroll = useRef<ScrollView>(null); const sequence = useRef(0); const starting = useRef('');
  const finishing = useRef(false); const judged = useRef(new Set<string>());
  const original = reviewing ? queue[0] : flow[index];
  const card = reviewing && original?.review ? original.review : original;
  const turn = card?.turns?.[0]; const rule: PacketRule | undefined = turn?.rule || card?.rule;
  const audio = turn?.audio || card?.audio;
  const task = card?.kind === 'task' || card?.kind === 'voice';
  useEffect(() => {
    if (!starting.current) starting.current = useUserStore.getState().beginLesson(packet.id);
    setAttempt(starting.current);
  }, [packet.id]);
  useFocusEffect(useCallback(() => () => { sequence.current += 1; void Speech.stop(); }, []));
  useEffect(() => {
    if (attempt && turn?.sample) useUserStore.getState().useHelp(attempt);
  }, [attempt, turn?.id, turn?.sample]);
  const speak = async (text: string, rate = 0.75, listenTask = false) => {
    const request = ++sequence.current; setSoundError('');
    try {
      await Speech.stop(); if (request !== sequence.current) return;
      Speech.speak(text, { language: 'en-GB', rate,
        onDone: () => { if (request === sequence.current && listenTask) setHeard(true); },
        onError: () => { if (request === sequence.current) setSoundError('Səs açılmadı. Yenidən dinlə; bu, dil səhvi deyil.'); },
      });
    } catch { if (request === sequence.current) setSoundError('Səs açıla bilmədi. Telefonun səs rejimini yoxla.'); }
  };
  const reset = () => {
    sequence.current += 1; void Speech.stop(); Keyboard.dismiss();
    setAnswer(''); setBuilt([]); setFeedback(null); setHelp(false); setHeard(false); setSoundError('');
    scroll.current?.scrollTo({ y: 0, animated: false });
  };
  const advance = (pending = queue) => {
    reset();
    if (reviewing) {
      setQueue((q) => q.slice(1));
      if (queue.length <= 1) { setReviewing(false); setIndex(flow.length - 1); }
    } else if (flow[index + 1]?.kind === 'result' && pending.length) setReviewing(true);
    else setIndex((v) => Math.min(v + 1, flow.length - 1));
  };
  const record = (value: string, verdict: PacketVerdict, token: string, spoken: boolean) => {
    if (!card || judged.current.has(token)) return;
    judged.current.add(token);
    const correct = verdict.status === 'correct';
    const prior = outcomes[card.id];
    useUserStore.getState().recordTask(attempt, card.id, correct, token);
    setHistory((all) => card.id in all ? all : { ...all, [card.id]: { answer: value, spoken, reason: verdict.message, status: correct ? 'independent' : 'wrong' } });
    setOutcomes((all) => ({ ...all, [card.id]: { answer: value, spoken, reason: verdict.message, status: correct ? reviewing || help || turn?.sample || prior?.status === 'wrong' ? 'assisted' : 'independent' : 'wrong' } }));
    if (correct) { setFeedback(verdict); if (turn?.reply) void speak(turn.reply); }
    else if (!reviewing) {
      const pending = queue.some((c) => c.id === card.id) ? queue : [...queue, card];
      setQueue(pending); advance(pending);
    } else setFeedback(verdict);
  };
  const check = () => {
    if (!rule || !card || audio && !heard || !answer.trim() && !built.length || feedback?.status === 'correct') return;
    const value = card.words && built.length ? built.map((i) => card.words![i]).join(' ') : answer;
    const verdict = assessPacketAnswer(value, rule);
    if (verdict.status === 'unknown') { setFeedback(verdict); return; }
    record(value, verdict, `${card.id}:${reviewing}:${value}`, false);
  };
  const skip = () => {
    if (!card) return;
    useUserStore.getState().recordTask(attempt, card.id, null, `${card.id}:skip`);
    setOutcomes((all) => ({ ...all, [card.id]: { answer: '', status: 'unverified', spoken: card.kind === 'voice' } }));
    advance();
  };
  const finish = async () => {
    if (finishing.current) return;
    finishing.current = true; setBusy(true); setCompletionError('');
    try {
      const result = await useUserStore.getState().finishLesson(attempt);
      if (result.completed) useVocabularyStore.getState().addLessonWords(packet.id);
      setReceipt(result.id); setDone(true);
    } catch { setCompletionError('Nəticə saxlanmadı. Yenidən cəhd et.'); finishing.current = false; }
    finally { setBusy(false); }
  };
  const exit = () => { sequence.current += 1; void Speech.stop(); router.replace({ pathname: '/module/[id]', params: { id: 'module_1' } }); };
  if (!card || !attempt) return <View style={s.screen}><Text style={s.body}>Dərs hazırlanır. Bölmənin açıq olduğunu yoxla.</Text><TouchableOpacity onPress={exit}><Text style={s.link}>Geri</Text></TouchableOpacity></View>;
  const isResult = card.kind === 'result';
  const metadata = getLessonById(packet.id);
  return <KeyboardAvoidingView style={[s.screen, { paddingTop: insets.top }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <Stack.Screen options={{ headerShown: false }} />
    <View style={s.header}><TouchableOpacity accessibilityLabel="Geri" onPress={exit}><Text style={s.back}>‹</Text></TouchableOpacity>
      <View style={s.flex}><Text style={s.kicker}>İLK TANIŞLIQ · {packet.order}/7</Text><Text style={s.heading}>{packet.title}</Text></View><EnergyMeter compact /></View>
    <View style={s.progress}><View style={[s.fill, { width: `${(index + 1) / flow.length * 100}%` }]} /></View>
    <ScrollView ref={scroll} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      {reviewing ? <View style={s.reviewBanner}><Text style={s.reviewTitle}>Səhv suallarını təkrarlayırsan</Text><Text style={s.note}>Əsas dərs bitdi · qalan təkrar: {queue.length}</Text></View> : null}
      <Text style={s.kicker}>{card.kind === 'teach' ? 'ÖYRƏN' : card.kind === 'voice' ? 'DANIŞIQ MƏŞQİ' : `KART ${card.number}`}</Text>
      {isResult ? <>
        <TeacherBoard3D text="Bu gün bir addım\nirəlilədin!" />
        <Text style={s.heading}>Məşqin nəticələri</Text>
        <Text style={s.note}>Yazılı və səsli nəticələr ayrıdır. Səs tanıma tələffüz balı deyil.</Text>
        {packetFlow(packet).filter((c) => c.kind === 'task' || c.kind === 'voice').map((c) => <View key={c.id} style={s.resultRow}>
          <Text style={s.body}>{c.kind === 'voice' ? '🎙 ' : ''}{c.turns?.[0].prompt || c.title}</Text>
          <Text style={s.resultLabel}>{labels[outcomes[c.id]?.status || 'unverified']}</Text>
        </View>)}
        {done ? <EarnedXP receiptId={receipt} /> : null}
        {completionError ? <Text style={s.note}>{completionError}</Text> : null}
      </> : <>
        {card.kind === 'teach' || card.board ? <TeacherBoard3D text={(card.board || 'BirFox ilə\nöyrən').slice(0, 90)} correction={card.kind === 'task' && Boolean(card.board)} />
          : <LessonArtwork3D kind={packet.order === 2 ? 'identity' : card.kind === 'voice' ? 'message' : 'conversation'} />}
        <Text style={s.body}>{turn?.prompt || card.body}</Text>
        {card.examples?.map((text, i) => <TouchableOpacity key={`${card.id}:example:${i}`} style={s.example} onPress={() => void speak(text)} accessibilityLabel={`İngiliscə dinlə: ${text}`}><Text style={s.exampleText}>▶ {text}</Text></TouchableOpacity>)}
        {reviewing && history[card.id] ? <View style={s.explanation}>
          <Text style={s.kicker}>SƏNİN ƏVVƏLKİ CAVABIN</Text><Text style={s.body}>{history[card.id].answer || 'Cavab verilməyib'}</Text>
          <TouchableOpacity onPress={() => { setHelp((v) => !v); useUserStore.getState().useHelp(attempt); }}><Text style={s.link}>Mənə başa sal {help ? '−' : '+'}</Text></TouchableOpacity>
          {help ? <><Text style={s.note}>Əvvəlki sualda gözlənən nümunə: {(original.rule || original.turns?.[0].rule)?.answers[0]}</Text><Text style={s.note}>{history[card.id].reason}</Text><Text style={s.note}>{original.explanation || 'Tapşırıqda istənən məna və quruluşu birlikdə tamamla.'}</Text><Text style={s.note}>İndi yeni vəziyyətdə eyni bacarığı məşq et.</Text></> : null}
        </View> : null}
        {audio ? <TouchableOpacity disabled={capturing} style={s.audio} onPress={() => void speak(audio, turn?.rate || 0.75, true)}><Text style={s.exampleText}>▶ {heard ? 'Yenidən dinlə' : 'Əvvəl səsi dinlə'}</Text></TouchableOpacity> : null}
        {soundError ? <Text style={s.note}>{soundError}</Text> : null}
        {task && (!audio || heard) ? card.kind === 'voice' ? <>
          {turn?.sample ? <View style={s.explanation}><Text style={s.note}>Dəstəklə məşq · nümunə görünür</Text><Text style={s.body}>{turn.sample}</Text></View> : null}
          {feedback?.status === 'correct' ? <Text style={s.success}>Səsli cavab uyğundur.</Text> : <RecognizedVoiceComposer key={`${card.id}:${reviewing}`} onBusyChange={setCapturing}
            checkAnswer={(text) => {
              const v = assessPacketAnswer(text, rule!, true);
              if (v.status !== 'correct' && audio) {
                const slower = !rule?.goals?.includes('slow') && assessPacketAnswer(text, { answers: [], goals: ['slow'] }, true).status === 'correct';
                const again = !rule?.goals?.includes('repeat') && assessPacketAnswer(text, { answers: [], goals: ['repeat'] }, true).status === 'correct';
                if (slower || again) { void speak(audio, slower ? .45 : turn?.rate || .75, true); return { correct: false, countAsAttempt: false, message: 'Mesajı yenidən dinlə, sonra yeni səsli cavab yaz. Bu xahiş səhv sayılmır.' }; }
              }
              return { correct: v.status === 'correct', countAsAttempt: v.status !== 'unknown', message: v.message };
            }}
            onJudged={(correct, token, transcript) => { if (!correct) record(transcript || '', assessPacketAnswer(transcript || '', rule!, true), token, true); }}
            onValid={(voice) => record(voice.transcript, assessPacketAnswer(voice.transcript, rule!, true), voice.uri, true)} />}
        </> : <>
          {card.options ? card.options.map((option, i) => <TouchableOpacity key={`${card.id}:${i}`} disabled={feedback?.status === 'correct'} accessibilityState={{ selected: answer === option }} style={[s.option, answer === option && s.selected]} onPress={() => { setAnswer(option); setFeedback(null); }}><Text style={s.body}>{option}</Text></TouchableOpacity>)
            : card.words ? <><View style={s.words}>{built.map((wordIndex, position) => <TouchableOpacity key={`${wordIndex}:${position}`} disabled={feedback?.status === 'correct'} style={s.word} onPress={() => { setBuilt((v) => v.filter((_, i) => i !== position)); setFeedback(null); }}><Text style={s.body}>{card.words![wordIndex]}</Text></TouchableOpacity>)}</View>
              <View style={s.words}>{card.words.map((word, i) => <TouchableOpacity key={`${word}:${i}`} disabled={built.includes(i) || feedback?.status === 'correct'} style={[s.word, built.includes(i) && { opacity: .3 }]} onPress={() => { setBuilt((v) => [...v, i]); setFeedback(null); }}><Text style={s.body}>{word}</Text></TouchableOpacity>)}</View></>
              : <TextInput accessibilityLabel="Cavabın" value={answer} editable={feedback?.status !== 'correct'} onChangeText={(v) => { setAnswer(v); setFeedback(null); }} autoCorrect={false} autoCapitalize="none" multiline style={s.input} placeholder="Cavabını yaz" placeholderTextColor={t.muted} />}
        </> : null}
        {feedback ? <View accessibilityLiveRegion="polite" style={s.explanation}><Text style={feedback.status === 'correct' ? s.success : s.body}>{feedback.message}</Text>{feedback.criteria.map((c) => <Text key={c.goal} style={s.note}>{c.passed ? '✓' : '○'} {c.goal}</Text>)}</View> : null}
      </>}
    </ScrollView>
    <View style={[s.footer, { paddingBottom: Math.max(12, insets.bottom) }]}>
      <TouchableOpacity disabled={busy || capturing || task && feedback?.status !== 'correct' && (card.kind === 'voice' || Boolean(audio && !heard) || !answer.trim() && !built.length)} style={[s.primary, (busy || capturing || task && card.kind === 'voice' && feedback?.status !== 'correct') && { opacity: .45 }]} onPress={() => isResult ? done ? exit() : void finish() : !task || feedback?.status === 'correct' ? advance() : check()}>
        <Text style={s.primaryText}>{isResult ? done ? 'Bölməyə qayıt' : 'Nəticəni saxla' : task && feedback?.status !== 'correct' ? 'Yoxla' : 'Davam et →'}</Text>
      </TouchableOpacity>
      {task && feedback?.status !== 'correct' ? <TouchableOpacity disabled={capturing} onPress={skip}><Text style={s.skip}>{card.kind === 'voice' ? 'İndi danışa bilmirəm · Keç' : 'Yoxlanmadı kimi keç'}</Text></TouchableOpacity> : null}
      {done && metadata ? <Text style={s.note}>{metadata.canDo}</Text> : null}
    </View>
  </KeyboardAvoidingView>;
}
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: t.background }, flex: { flex: 1 }, header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 }, back: { color: t.text, fontSize: 36, paddingRight: 8 },
  kicker: { color: t.muted, fontSize: 10, letterSpacing: 1, marginBottom: 8 }, heading: { color: t.text, fontSize: 19, lineHeight: 26, fontWeight: '800' },
  progress: { marginHorizontal: 20, height: 5, backgroundColor: t.raised, borderRadius: 4, overflow: 'hidden' }, fill: { height: '100%', backgroundColor: t.orange },
  content: { padding: 20, gap: 12, paddingBottom: 30 }, body: { color: t.text, fontSize: 16, lineHeight: 25 }, note: { color: t.muted, fontSize: 12, lineHeight: 19, marginTop: 5 },
  example: { borderRadius: 14, padding: 15, backgroundColor: t.surface }, exampleText: { color: t.orange, fontSize: 16, fontWeight: '700' }, audio: { padding: 17, backgroundColor: t.surface, borderRadius: 16, borderWidth: 1, borderColor: t.border },
  option: { borderWidth: 1, borderColor: t.border, borderRadius: 16, backgroundColor: t.surface, padding: 16 }, selected: { borderColor: t.orange },
  input: { minHeight: 62, padding: 16, color: t.text, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 16, fontSize: 17 },
  words: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, minHeight: 48 }, word: { backgroundColor: t.raised, borderWidth: 1, borderColor: t.border, borderRadius: 12, padding: 12 },
  explanation: { backgroundColor: t.surface, borderRadius: 16, padding: 16 }, link: { color: t.orange, fontSize: 14, fontWeight: '700', paddingVertical: 12 }, success: { color: t.success, fontSize: 15 },
  reviewBanner: { padding: 16, backgroundColor: '#3D2B31', borderRadius: 16, borderColor: t.orange, borderWidth: 1 }, reviewTitle: { color: t.orange, fontWeight: '800', fontSize: 17 },
  resultRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: t.border }, resultLabel: { color: t.orange, fontSize: 12, marginTop: 7 }, footer: { paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: t.border },
  primary: { backgroundColor: t.orange, padding: 16, borderRadius: 16, alignItems: 'center' }, primaryText: { color: '#211426', fontSize: 16, fontWeight: '800' }, skip: { color: t.muted, paddingVertical: 12, textAlign: 'center', fontSize: 12 },
});
