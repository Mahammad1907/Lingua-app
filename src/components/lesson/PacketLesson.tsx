import { Stack, useFocusEffect, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, Pressable, useWindowDimensions, BackHandler } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getLessonById } from '../../data/lessons';
import { packetFlow } from '../../data/b1Course';
import type { PacketCard, PacketLesson as Content, PacketRule } from '../../data/b1PacketTypes';
import { useUserStore } from '../../store/userStore';
import { useVocabularyStore } from '../../store/vocabularyStore';
import { assessPacketAnswer, type PacketVerdict } from '../../utils/packetAnswer';
import EarnedXP from '../EarnedXP';
import RecognizedVoiceComposer from '../RecognizedVoiceComposer';
import { ClassroomScene, LessonButton, LessonIcon, SelectionMark, SoundMark, Surface, LessonEnergy, ink } from './LessonSurface';
import { audioMeaning, heroHeight, lessonMode } from '../../utils/lessonPresentation';
import ReusableLessonScene from './ReusableLessonScene';
import { packetScene } from '../../utils/packetScene';
import { lessonHint, teachingText } from '../../utils/lessonGuide';
import LessonWelcome from './LessonWelcome';
import LessonExitDialog from './LessonExitDialog';
import WrittenAnswerInput from './WrittenAnswerInput';

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
  const [keyboard, setKeyboard] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [meaningOpen, setMeaningOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [explanationOpen, setExplanationOpen] = useState(false);
  const { height, fontScale } = useWindowDimensions();
  useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setKeyboard(true));
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKeyboard(false));
    return () => { show.remove(); hide.remove(); };
  }, []);
  const scroll = useRef<ScrollView>(null); const sequence = useRef(0); const starting = useRef('');
  const finishing = useRef(false); const judged = useRef(new Set<string>());
  useEffect(() => { if (keyboard) requestAnimationFrame(() => scroll.current?.scrollToEnd({ animated: true })); }, [keyboard]);
  const original = reviewing ? queue[0] : flow[index];
  const card = reviewing && original?.review ? original.review : original;
  const turn = card?.turns?.[0]; const rule: PacketRule | undefined = turn?.rule || card?.rule;
  const audio = turn?.audio || card?.audio;
  const task = card?.kind === 'task' || card?.kind === 'voice';
  useEffect(() => {
    if (!starting.current) starting.current = useUserStore.getState().beginLesson(packet.id);
    setAttempt(starting.current);
  }, [packet.id]);
  useFocusEffect(useCallback(() => () => { sequence.current += 1; setPlaying(false); void Speech.stop(); }, []));
  useEffect(() => {
    if (attempt && turn?.sample) useUserStore.getState().useHelp(attempt);
  }, [attempt, turn?.id, turn?.sample]);
  useFocusEffect(useCallback(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (busy) return true;
      if (done) router.replace({ pathname: '/module/[id]', params: { id: 'module_1' } });
      else { Keyboard.dismiss(); setExitOpen(true); }
      return true;
    });
    return () => subscription.remove();
  }, [busy, done, router]));
  const speak = async (text: string, rate = 0.75, listenTask = false) => {
    const request = ++sequence.current; setSoundError('');
    try {
      await Speech.stop(); if (request !== sequence.current) return;
      setPlaying(true);
      Speech.speak(text, { language: 'en-GB', rate,
        onDone: () => { if (request === sequence.current) { setPlaying(false); if (listenTask) setHeard(true); } },
        onStopped: () => { if (request === sequence.current) setPlaying(false); },
        onError: () => { if (request === sequence.current) { setPlaying(false); setSoundError('Səs açılmadı. Yenidən dinlə; bu, dil səhvi deyil.'); } },
      });
    } catch { if (request === sequence.current) { setPlaying(false); setSoundError('Səs açıla bilmədi. Telefonun səs rejimini yoxla.'); } }
  };
  const reset = () => {
    sequence.current += 1; void Speech.stop(); Keyboard.dismiss();
    setPlaying(false); setMeaningOpen(false); setSpeed(1); setDetailsOpen(false); setExplanationOpen(false);
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
      setQueue(pending); setFeedback(verdict); Keyboard.dismiss();
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
  const leave = () => {
    if (busy) return;
    sequence.current += 1; void Speech.stop(); Keyboard.dismiss();
    if (attempt && !done) useUserStore.getState().abandonLesson(attempt);
    setExitOpen(false); router.replace({ pathname: '/module/[id]', params: { id: 'module_1' } });
  };
  const exit = () => {
    if (busy) return;
    if (done || !attempt) leave();
    else { Keyboard.dismiss(); sequence.current += 1; void Speech.stop(); setPlaying(false); setExitOpen(true); }
  };
  if (!card || !attempt) return <View style={s.screen}><Text style={s.body}>Dərs hazırlanır. Bölmənin açıq olduğunu yoxla.</Text><TouchableOpacity onPress={exit}><Text style={s.link}>Geri</Text></TouchableOpacity></View>;
  const isResult = card.kind === 'result';
  const isIntro = card.kind === 'intro';
  const metadata = getLessonById(packet.id);
  const scene = card.kind === 'intro' ? undefined : packetScene(packet.order, card, reviewing);
  const boardText = card.board || (card.kind === 'voice' ? 'Dinlə və\nözün cavab ver' : card.words ? 'Sözlərdən\ncümlə qur' : card.kind === 'intro' ? 'BirFox ilə\nöyrən' : 'Düşün və\ncavabını hazırla');
  const dense = Boolean(task || card.body.length > 240);
  const artworkHeight = heroHeight(height - insets.top - insets.bottom, dense, keyboard, fontScale);
  const sceneHeight = audio && task ? Math.min(110, artworkHeight) : card.body.length > 240 ? Math.min(135, artworkHeight) : artworkHeight;
  const correct = feedback?.status === 'correct';
  const continueAfterMistake = Boolean(!reviewing && feedback && feedback.status !== 'unknown' && !correct);
  const locked = correct || continueAfterMistake;
  const meaning = audioMeaning(packet, audio);
  const prior = reviewing ? history[original.id] : undefined;
  const oldModel = (original.rule || original.turns?.[0]?.rule)?.answers[0];
  const hint = lessonHint(card);
  const canHelp = !reviewing && Boolean(hint);
  const disabled = busy || capturing || Boolean(task && !locked && (card.kind === 'voice' || audio && !heard || !answer.trim() && !built.length));
  const summary = Object.values(outcomes).reduce((totals, item) => ({ ...totals, [item.status]: totals[item.status] + 1 }), { independent: 0, assisted: 0, wrong: 0, unverified: 0 });
  return <KeyboardAvoidingView style={[s.screen, { paddingTop: insets.top }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
    <View style={s.header}>
      <Pressable accessibilityRole="button" accessibilityLabel="Dərsdən geri çıx" onPress={exit} style={s.backButton}><LessonIcon name="back" color={ink.text} /></Pressable>
      <View style={s.flex}><Text style={s.kicker}>İLK TANIŞLIQ · A1</Text>{!isIntro ? <Text style={s.small}>Dərs {packet.order} / 7</Text> : null}</View>
      <LessonEnergy />
    </View>
    {!isIntro ? <><Text accessibilityRole="header" style={[s.pageTitle, keyboard && { fontSize: 17, lineHeight: 22 }]}>{packet.title}</Text>
      <View style={s.progressRow}><View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: flow.length, now: index + 1 }} style={s.progress}><View style={[s.fill, { width: `${(index + 1) / flow.length * 100}%` }]} /></View><Text style={s.count}>{index + 1}/{flow.length}</Text></View></> : null}
    <ScrollView ref={scroll} style={s.flex} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" showsVerticalScrollIndicator={false}>
      {isIntro ? <LessonWelcome packet={packet} compact={height < 900 || fontScale > 1.15} sceneHeight={Math.max(110, Math.min(215, height - insets.top - insets.bottom - 580))} /> : <>
      <View style={s.badge}><Text style={s.badgeText}>{reviewing ? 'BİR DƏ MƏŞQ ET' : lessonMode(card)}</Text></View>
      {isResult ? <>
        <View style={s.resultHero}><View style={s.resultSeal}><LessonIcon name="check" size={44} color={ink.mint} /></View><Text style={s.resultHeading}>Bugünkü məşqin hazırdır</Text><Text style={s.note}>{packet.title}</Text></View>
        <View style={s.stats}>{([{ key: 'independent', title: 'Müstəqil', color: ink.mint }, { key: 'assisted', title: 'Köməklə', color: ink.orange }, { key: 'unverified', title: 'Keçilən', color: ink.violet }] as const).map(item => <View key={item.key} style={s.stat}><Text style={[s.statNumber, { color: item.color }]}>{summary[item.key]}</Text><Text style={s.small}>{item.title}</Text></View>)}</View>
        <Surface><Text style={s.cardTitle}>Bu dərsdə məşq etdin</Text><Text style={s.body}>{metadata?.canDo || packet.goal}</Text>{done ? <EarnedXP receiptId={receipt} /> : <Text style={s.note}>Nəticəni saxladıqda qazandığın XP görünəcək.</Text>}</Surface>
        <Pressable accessibilityRole="button" accessibilityState={{ expanded: detailsOpen }} style={s.detailButton} onPress={() => setDetailsOpen(v => !v)}><Text style={s.link}>Tapşırıqların nəticələri {detailsOpen ? '−' : '+'}</Text></Pressable>
        {detailsOpen ? packetFlow(packet).filter(c => c.kind === 'task' || c.kind === 'voice').map(c => <View key={c.id} style={s.resultRow}><Text style={s.body}>{c.turns?.[0]?.prompt || c.title}</Text><Text style={s.note}>{labels[outcomes[c.id]?.status || 'unverified']}</Text></View>) : null}
        {completionError ? <Text accessibilityLiveRegion="polite" style={s.error}>{completionError}</Text> : null}
      </> : <>
        {card.kind === 'voice' ? <View style={s.voiceHeading}><LessonIcon name="mic" size={34} color={ink.orange} /><Text style={s.resultHeading}>İndi sən danış</Text><Text style={s.note}>Dinlə, düşün və səsli cavab ver.</Text></View> : sceneHeight > 0 ? scene ? <ReusableLessonScene name={scene} height={sceneHeight} /> : <ClassroomScene height={sceneHeight} text={audio ? 'Diqqətlə dinlə' : boardText.slice(0, 90)} /> : null}
        {reviewing && prior ? <Surface><Text style={s.kicker}>ƏVVƏLKİ TAPŞIRIQ</Text><Text style={s.body}>{original.turns?.[0]?.prompt || original.body}</Text><Text style={s.note}>Sənin cavabın: {prior.answer || 'Cavab verilməyib'}</Text><Pressable accessibilityRole="button" accessibilityState={{ expanded: help }} onPress={() => { setHelp(v => !v); useUserStore.getState().useHelp(attempt); }}><Text style={s.helpLink}>Əvvəlki cavabın izahı {help ? '−' : '+'}</Text></Pressable>{help ? <><Text style={s.body}>Nümunə: {oldModel}</Text><Text style={s.note}>{original.explanation || prior.reason}</Text></> : null}<Text style={s.small}>Aşağıda yeni vəziyyətdə məşq et.</Text></Surface> : null}
        {audio && card.kind !== 'voice' ? <Text style={s.cardTitle}>{turn?.prompt || card.body}</Text> : <Surface accent={card.kind === 'intro' ? 'orange' : 'violet'}>
          <View style={s.scenario}><View style={s.ruleLine} /><View style={s.flex}>{reviewing ? <Text style={s.kicker}>YENİ TAPŞIRIQ</Text> : null}<Text style={card.kind === 'intro' ? s.cardTitle : s.body}>{turn?.prompt || teachingText(card)}</Text>{card.kind === 'teach' && card.body.includes('\n\n') ? <Text style={s.note}>{card.body.split(/\n\s*\n/).slice(1).join('\n\n')}</Text> : null}
            {canHelp && !reviewing ? <Pressable accessibilityRole="button" accessibilityState={{ expanded: help }} onPress={() => { setHelp(v => !v); useUserStore.getState().useHelp(attempt); }} style={s.help}><LessonIcon name="hint" size={16} /><Text style={s.helpLink}>Mənə başa sal {help ? '−' : '›'}</Text></Pressable> : null}
            {help && !reviewing && canHelp ? <Text style={s.note}>{hint}</Text> : null}
          </View></View>
        </Surface>}
        {card.examples?.length ? <View style={s.exampleList}>{card.examples.map((text, i) => <Pressable accessibilityRole="button" key={`${card.id}:example:${i}`} style={s.example} onPress={() => void speak(text)} accessibilityLabel={`İngiliscə dinlə: ${text}`}><LessonIcon name="sound" color={ink.orange} /><Text style={s.exampleText}>{text}</Text><LessonIcon name="play" size={15} /></Pressable>)}</View> : null}
        {audio ? <>
          <Pressable accessibilityRole="button" accessibilityLabel={playing ? 'Səsi dayandır' : 'Səsi dinlə'} disabled={capturing} style={s.audio} onPress={() => { if (playing) { sequence.current += 1; void Speech.stop(); setPlaying(false); } else void speak(audio, (turn?.rate || .75) * speed, true); }}><View style={s.play}><LessonIcon name={playing ? 'pause' : 'play'} color="#211727" size={24} /></View><View style={s.flex}><Text style={s.cardTitle}>{playing ? 'Dinləyirsən…' : heard ? 'Yenidən dinlə' : 'Səsi dinlə'}</Text><Text style={s.small}>{playing ? 'Səs oxunur' : 'Dinlədikdən sonra cavab ver'}</Text></View><SoundMark active={playing} /></Pressable>
          <View style={s.speeds}>{[{ value: .75, label: '🐢 Yavaş' }, { value: 1, label: '1× Normal' }, { value: 1.25, label: '1.25× Sürətli' }].map(item => <Pressable accessibilityRole="button" accessibilityState={{ selected: speed === item.value, disabled: capturing }} disabled={capturing} key={item.value} onPress={() => { setSpeed(item.value); if (playing) void speak(audio, (turn?.rate || .75) * item.value, true); }} style={[s.speed, speed === item.value && s.activeSpeed]}><Text style={[s.speedText, speed === item.value && { color: ink.orange }]}>{item.label}</Text></Pressable>)}</View>
        </> : null}
        {soundError ? <Text accessibilityLiveRegion="polite" style={s.error}>{soundError}</Text> : null}
        {task ? card.kind === 'voice' ? <>
          {turn?.sample ? <Surface><Text style={s.kicker}>KÖMƏKLƏ MƏŞQ · NÜMUNƏ</Text><Text style={s.body}>{turn.sample}</Text></Surface> : null}
          {!audio || heard ? locked ? null : <RecognizedVoiceComposer appearance="lesson" suspended={exitOpen} onPracticeComplete={skip} key={`${card.id}:${reviewing}`} onBusyChange={setCapturing}
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
            onValid={(voice) => record(voice.transcript, assessPacketAnswer(voice.transcript, rule!, true), voice.uri, true)} /> : <Text style={s.note}>Danışmazdan əvvəl yuxarıdakı səsi dinlə.</Text>}
        </> : card.options ? <View style={s.options}>{card.options.map((option, i) => <Pressable key={`${card.id}:${i}`} accessibilityRole="radio" accessibilityState={{ selected: answer === option, disabled: locked || Boolean(audio && !heard) }} disabled={locked || Boolean(audio && !heard)} style={({ pressed }) => [s.option, answer === option && (correct ? s.correctOption : s.selected), pressed && { transform: [{ scale: .985 }] }, Boolean(audio && !heard) && { opacity: .55 }]} onPress={() => { setAnswer(option); setFeedback(null); }}><SelectionMark selected={answer === option} correct={correct && answer === option} /><Text style={[s.body, s.flex]}>{option}</Text></Pressable>)}</View> : card.words ? <>
          <View style={s.answerTray}>{built.length ? built.map((wordIndex, position) => <Pressable key={`${wordIndex}:${position}`} accessibilityLabel={`${card.words![wordIndex]} sözünü çıxar`} disabled={locked || Boolean(audio && !heard)} style={s.word} onPress={() => { setBuilt(v => v.filter((_, i) => i !== position)); setFeedback(null); }}><Text style={s.body}>{card.words![wordIndex]}</Text></Pressable>) : <Text style={s.note}>Sözlərə toxunaraq cümlə qur.</Text>}</View>
          <View style={s.words}>{card.words.map((word, i) => <Pressable key={`${word}:${i}`} disabled={built.includes(i) || locked || Boolean(audio && !heard)} style={[s.word, built.includes(i) && { opacity: .25 }]} onPress={() => { setBuilt(v => [...v, i]); setFeedback(null); }}><Text style={s.body}>{word}</Text></Pressable>)}</View>
        </> : <WrittenAnswerInput key={`${card.id}:${reviewing}`} value={answer} onChange={v => { setAnswer(v); setFeedback(null); }} disabled={locked || Boolean(audio && !heard)} suspended={exitOpen} onBusyChange={setCapturing} onFocus={() => requestAnimationFrame(() => scroll.current?.scrollToEnd({ animated: true }))} /> : null}
      </>}
      </>}
    </ScrollView>
    {explanationOpen && feedback && feedback.status !== 'unknown' ? <View style={s.postAnswerExplanation}><Text style={s.kicker}>İZAH</Text><ScrollView style={{ maxHeight: 125 }}><Text style={s.body}>{card.explanation || `Nümunə cavab: ${rule?.answers[0] || ''}`}</Text></ScrollView></View> : null}
    <View style={[s.footer, { paddingBottom: keyboard ? 8 : Math.max(12, insets.bottom) }]}>
      {feedback && !isResult ? <View accessibilityLiveRegion="polite" style={[s.feedback, correct && s.correctFeedback]}><View style={s.feedbackTitle}><LessonIcon name={correct ? 'check' : 'hint'} color={correct ? ink.mint : ink.orange} /><Text style={[s.feedbackText, { color: correct ? ink.mint : ink.text }]}>{correct ? 'Düzdür!' : feedback.status === 'unknown' ? feedback.message : 'Səhv cavabdır'}</Text></View>{feedback.status !== 'unknown' ? <Text style={s.note}>{feedback.message}</Text> : null}{!correct && feedback.status !== 'unknown' ? <Pressable accessibilityRole="button" accessibilityState={{ expanded: explanationOpen }} onPress={() => setExplanationOpen(v => !v)}><Text style={s.helpLink}>İzahına bax {explanationOpen ? '−' : '›'}</Text></Pressable> : null}{correct && meaning ? <Pressable accessibilityRole="button" accessibilityState={{ expanded: meaningOpen }} onPress={() => setMeaningOpen(v => !v)}><Text style={s.helpLink}>{meaningOpen ? meaning : 'Mənasını göstər ›'}</Text></Pressable> : null}</View> : null}
      <LessonButton disabled={disabled} label={isResult ? done ? 'Bölməyə qayıt' : 'Nəticəni saxla' : card.kind === 'intro' ? 'Dərsə başla' : task && !locked ? 'Yoxla' : 'Davam et'} onPress={() => isResult ? done ? exit() : void finish() : !task || locked ? advance() : check()} />
      {task && !locked ? <Pressable accessibilityRole="button" disabled={capturing} onPress={skip}><Text style={s.skip}>{card.kind === 'voice' ? 'Səsli məşqi keç' : 'Bu sualı keç'}</Text></Pressable> : null}
    </View>
    <LessonExitDialog visible={exitOpen} onContinue={() => setExitOpen(false)} onExit={leave} busy={busy} />
  </KeyboardAvoidingView>;
}
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: ink.bg }, flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 13 }, backButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#18172F', borderWidth: 1, borderColor: ink.border, alignItems: 'center', justifyContent: 'center' },
  pageTitle: { color: ink.text, fontSize: 24, lineHeight: 30, fontWeight: '800', paddingHorizontal: 20, marginBottom: 13 }, postAnswerExplanation: { marginHorizontal: 20, padding: 14, borderRadius: 17, backgroundColor: '#201C38', borderWidth: 1, borderColor: '#685086' }, energy: { paddingRight: 5 }, kicker: { color: ink.muted, fontSize: 9, letterSpacing: 1.3, marginBottom: 5 }, heading: { color: ink.text, fontSize: 16, lineHeight: 21, fontWeight: '800' },
  progressRow: { marginHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 13 }, progress: { flex: 1, height: 6, borderRadius: 6, backgroundColor: '#282342', overflow: 'hidden' }, fill: { height: '100%', backgroundColor: ink.orange, borderRadius: 6 }, count: { color: ink.orange, fontSize: 11, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingBottom: 16, gap: 12, flexGrow: 1 }, badge: { alignSelf: 'flex-start', borderRadius: 18, backgroundColor: '#23203F', paddingVertical: 6, paddingHorizontal: 12 }, badgeText: { color: ink.violet, fontSize: 9, letterSpacing: 1, fontWeight: '800' },
  body: { color: ink.text, fontSize: 15, lineHeight: 22 }, note: { color: ink.muted, fontSize: 12, lineHeight: 18 }, small: { color: ink.muted, fontSize: 10, lineHeight: 16 }, cardTitle: { color: ink.text, fontSize: 16, lineHeight: 24, fontWeight: '700' },
  scenario: { flexDirection: 'row', gap: 12 }, ruleLine: { width: 2, backgroundColor: ink.orange, borderRadius: 2 }, help: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 6, paddingTop: 9 }, helpLink: { color: ink.violet, fontSize: 12, lineHeight: 20, paddingVertical: 4 },
  exampleList: { gap: 8 }, example: { flexDirection: 'row', gap: 12, alignItems: 'center', borderRadius: 16, borderWidth: 1, borderColor: ink.border, backgroundColor: ink.card, padding: 13 }, exampleText: { flex: 1, color: ink.text, fontWeight: '600', fontSize: 15 },
  audio: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 20, borderWidth: 1, borderColor: '#474068', padding: 12, backgroundColor: '#181A34' }, play: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22, backgroundColor: ink.orange }, speeds: { flexDirection: 'row', gap: 8 }, speed: { flex: 1, minHeight: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: ink.border, borderRadius: 14, backgroundColor: ink.card }, activeSpeed: { borderColor: ink.orange, backgroundColor: '#322330' }, speedText: { color: ink.muted, fontSize: 11, fontWeight: '700' },
  options: { gap: 9 }, option: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 54, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: '#413A62', backgroundColor: ink.card }, selected: { borderColor: ink.orange, backgroundColor: '#2B2334' }, correctOption: { borderColor: ink.mint, backgroundColor: '#143535' },
  inputFrame: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1.5, borderColor: '#A297ED', backgroundColor: '#22213F', shadowColor: '#8D77ED', shadowOffset: { width: 0, height: 2 }, shadowOpacity: .15, shadowRadius: 10 }, input: { flex: 1, paddingVertical: 16, minHeight: 62, maxHeight: 100, fontSize: 16, lineHeight: 23, color: ink.text },
  words: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, answerTray: { minHeight: 64, flexDirection: 'row', flexWrap: 'wrap', gap: 7, padding: 12, borderWidth: 1, borderColor: '#8274B7', borderRadius: 18, backgroundColor: '#1B1B35' }, word: { backgroundColor: '#282440', borderWidth: 1, borderColor: ink.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  footer: { paddingHorizontal: 20, paddingTop: 10, backgroundColor: ink.bg, gap: 8, borderTopWidth: 1, borderTopColor: '#1D1C35' }, skip: { color: ink.muted, textAlign: 'center', fontSize: 11, paddingVertical: 7 }, feedback: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, borderWidth: 1, borderColor: '#85613A', backgroundColor: '#282133', gap: 3 }, correctFeedback: { borderColor: '#4CAB9B', backgroundColor: '#12302F' }, feedbackTitle: { flexDirection: 'row', gap: 9, alignItems: 'center' }, feedbackText: { flex: 1, fontSize: 14, lineHeight: 20, fontWeight: '700' }, error: { color: '#FFB5A7', fontSize: 12, lineHeight: 18 },
  voiceHeading: { alignItems: 'center', gap: 8, paddingVertical: 14 }, resultHero: { alignItems: 'center', paddingVertical: 20, gap: 12 }, resultSeal: { width: 88, height: 88, borderRadius: 44, borderWidth: 1, borderColor: ink.mint, backgroundColor: '#173235', alignItems: 'center', justifyContent: 'center' }, resultHeading: { color: ink.text, fontSize: 22, lineHeight: 29, fontWeight: '800', textAlign: 'center' }, stats: { flexDirection: 'row', gap: 9 }, stat: { flex: 1, backgroundColor: ink.card, borderWidth: 1, borderColor: ink.border, borderRadius: 18, padding: 12, alignItems: 'center', gap: 5 }, statNumber: { fontSize: 26, fontWeight: '800' }, detailButton: { alignItems: 'center', padding: 10 }, link: { color: ink.violet, fontSize: 13, fontWeight: '700' }, resultRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: ink.border, gap: 5 },
});
