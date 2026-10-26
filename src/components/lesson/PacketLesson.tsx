import { classroomSource, lessonSceneSources, warmLessonArtwork } from '../../utils/lessonAssets';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, Pressable, useWindowDimensions, BackHandler } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getLessonById } from '../../data/lessons';
import { b1Packet, packetFlow } from '../../data/b1Course';
import type { PacketCard, PacketLesson as Content, PacketRule } from '../../data/b1PacketTypes';
import { useUserStore } from '../../store/userStore';
import { useVocabularyStore } from '../../store/vocabularyStore';
import { assessPacketAnswer, type PacketVerdict } from '../../utils/packetAnswer';
import LessonProgressBar from './LessonProgressBar';
import WrongAnswerBorder from './WrongAnswerBorder';
import { feedbackCopy } from '../../utils/lessonFeedbackCopy';
import EarnedXP from '../EarnedXP';
import LessonVoiceInput from './LessonVoiceInput';
import LessonFeedback from './LessonFeedback';
import { useLessonSpeed } from '../../hooks/useLessonSpeed';
import type { SpokenAnswer } from '../../utils/speechTurn';
import { ClassroomScene, LessonButton, LessonIcon, SelectionMark, Surface, LessonEnergy, ink } from './LessonSurface';
import { audioMeaning, heroHeight, lessonMode } from '../../utils/lessonPresentation';
import ReusableLessonScene from './ReusableLessonScene';
import { packetScene } from '../../utils/packetScene';
import { lessonHint, teachingText } from '../../utils/lessonGuide';
import LessonWelcome from './LessonWelcome';
import LessonExitDialog from './LessonExitDialog';
import WrittenAnswerInput from './WrittenAnswerInput';
import ListeningScene from './ListeningScene';
import LessonVocabularyText from './LessonVocabularyText';
import { summarizeEvidence, type TaskEvidence } from '../../utils/lessonEvidence';
import { lessonRecall, withLessonRecall } from '../../utils/lessonReview';
import { newLessonWords } from '../../utils/lessonVocabulary';
import LessonTextMotion, { outcomeMotion, type LessonMotion } from './LessonTextMotion';

interface Outcome { answer: string; status: 'independent' | 'assisted' | 'wrong' | 'unverified'; spoken: boolean; reason?: string; evidence?: TaskEvidence }
const labels = { independent: 'Müstəqil', assisted: 'Köməklə', wrong: 'Yenidən məşq lazımdır', unverified: 'Yoxlanmadı' };

export default function PacketLesson({ packet }: { packet: Content }) {
  const router = useRouter(); const insets = useSafeAreaInsets();
  const [recall] = useState(() => lessonRecall(packet, b1Packet, useUserStore.getState().lessonProgress));
  const [flow] = useState(() => withLessonRecall(packetFlow(packet).filter((c) => c.kind !== 'review'), recall));
  const [viewportHeight, setViewportHeight] = useState(0);
  const [index, setIndex] = useState(0); const [attempt, setAttempt] = useState('');
  const [answer, setAnswer] = useState(''); const [built, setBuilt] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<PacketVerdict | null>(null);
  const [continueReady, setContinueReady] = useState(true);
  const feedbackBlocked = useRef(false), feedbackTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined), submission = useRef(0);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [queue, setQueue] = useState<PacketCard[]>([]); const [reviewing, setReviewing] = useState(false);
  const [outcomes, setOutcomes] = useState<Record<string, Outcome>>({});
  const [help, setHelp] = useState(false); const [heard, setHeard] = useState(false);
  const [technicalText, setTechnicalText] = useState(false);
  const [soundError, setSoundError] = useState(''); const [receipt, setReceipt] = useState('');
  const [completionError, setCompletionError] = useState(''); const [done, setDone] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useLessonSpeed();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [examplePulse, setExamplePulse] = useState<{ text: string; token: number } | null>(null);
  const [exitOpen, setExitOpen] = useState(false);
  const { height, fontScale } = useWindowDimensions();
  useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setKeyboard(true));
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKeyboard(false));
    return () => { show.remove(); hide.remove(); };
  }, []);
  const feedbackShown = Boolean(feedback);
  const scroll = useRef<ScrollView>(null); const sequence = useRef(0); const starting = useRef('');
  const watchdog = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const backAction = useRef(() => {}); const moving = useRef(false);
  const finishing = useRef(false); const responseLocked = useRef(false); const judged = useRef(new Set<string>());
  useEffect(() => { if (keyboard) requestAnimationFrame(() => scroll.current?.scrollToEnd({ animated: true })); }, [keyboard]);
  useEffect(() => { if (feedbackShown) requestAnimationFrame(() => scroll.current?.scrollToEnd({ animated: true })); }, [feedbackShown]);
  const original = reviewing ? queue[0] : flow[index];
  const card = reviewing && original?.review ? original.review : original;
  const turn = card?.turns?.[0]; const rule: PacketRule | undefined = turn?.rule || card?.rule;
  const audio = turn?.audio || card?.audio;
  useEffect(() => {
    const next = [classroomSource, ...flow.slice(index, index + 4).flatMap(c => { const id = packetScene(packet.order, c); return id ? [lessonSceneSources[id]] : []; })];
    void warmLessonArtwork(next);
  }, [flow, index, packet.order]);
  const promptReady = heard || technicalText;
  useEffect(() => { moving.current = false; }, [index, reviewing, original?.id]);
  const clearWatchdog = () => { if (watchdog.current !== undefined) clearTimeout(watchdog.current); watchdog.current = undefined; };
  const task = card?.kind === 'task' || card?.kind === 'voice';
  useEffect(() => {
    if (!starting.current) starting.current = useUserStore.getState().beginLesson(packet.id, 'session', recall ? [recall.id] : []);
    setAttempt(starting.current);
  }, [packet.id, recall]);
  useFocusEffect(useCallback(() => () => { sequence.current += 1; if (watchdog.current !== undefined) clearTimeout(watchdog.current); setPlaying(false); void Speech.stop(); }, []));
  useEffect(() => {
    if (attempt && turn?.sample) useUserStore.getState().useHelp(attempt);
  }, [attempt, turn?.id, turn?.sample]);
  useFocusEffect(useCallback(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => { backAction.current(); return true; });
    return () => subscription.remove();
  }, []));
  const useTextPrompt = () => {
    sequence.current += 1; clearWatchdog(); void Speech.stop(); setPlaying(false);
    setTechnicalText(true); setSoundError('Texniki səbəbdən mətnlə davam edirsən. Bu cavab dinləmə nəticəsinə daxil edilməyəcək.');
  };
  const speak = async (text: string, rate = 0.75, listenTask = false) => {
    const request = ++sequence.current; clearWatchdog(); setSoundError('');
    const failed = () => {
      if (request !== sequence.current) return;
      sequence.current += 1; clearWatchdog(); void Speech.stop(); setPlaying(false);
      setSoundError('Səs açılmadı. Bu, dil səhvi deyil. Yenidən dinlə və ya mətnlə davam et.');
      if (listenTask) setTechnicalText(true);
    };
    // Missing native callbacks must not leave a learner locked indefinitely.
    watchdog.current = setTimeout(failed, Math.max(10000, Math.min(60000, text.length * 160 / rate + 5000)));
    try {
      await Speech.stop(); if (request !== sequence.current) return;
      setPlaying(true);
      Speech.speak(text, { language: 'en-GB', rate,
        onDone: () => { if (request === sequence.current) { clearWatchdog(); setPlaying(false); if (listenTask) setHeard(true); } },
        onStopped: () => { if (request === sequence.current) { clearWatchdog(); setPlaying(false); } },
        onError: failed,
      });
    } catch { failed(); }
  };
  useEffect(() => () => { if (feedbackTimer.current !== undefined) clearTimeout(feedbackTimer.current); }, []);
  const reset = () => {
    if (feedbackTimer.current !== undefined) clearTimeout(feedbackTimer.current);
    responseLocked.current = false; setContinueReady(true); feedbackBlocked.current = false;
    sequence.current += 1; clearWatchdog(); void Speech.stop(); Keyboard.dismiss();
    setPlaying(false); setDetailsOpen(false); setExamplePulse(null);
    setAnswer(''); setBuilt([]); setFeedback(null); setHelp(false); setHeard(false); setTechnicalText(false); setSoundError('');
    scroll.current?.scrollTo({ y: 0, animated: false });
  };
  const advance = (pending = queue) => {
    if (feedback && feedbackBlocked.current) return;
    if (moving.current) return; moving.current = true;
    reset();
    if (reviewing) {
      setQueue((q) => q.slice(1));
      if (queue.length <= 1) { setReviewing(false); setIndex(flow.length - 1); }
    } else if (flow[index + 1]?.kind === 'result' && pending.length) { setReviewTotal(pending.length); setReviewing(true); }
    else setIndex((v) => Math.min(v + 1, flow.length - 1));
  };
  const record = (value: string, verdict: PacketVerdict, token: string, spoken: boolean) => {
    if (!card || responseLocked.current || judged.current.has(token)) return;
    responseLocked.current = true; judged.current.add(token);
    feedbackBlocked.current = true; setContinueReady(false);
    if (feedbackTimer.current !== undefined) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => { feedbackBlocked.current = false; setContinueReady(true); }, 650);
    const correct = verdict.status === 'correct';
    const prior = outcomes[card.id];
    const assisted = Boolean(reviewing || help || turn?.sample || prior?.status === 'wrong');
    const evidence: TaskEvidence = { input: spoken ? 'spoken' : 'written', assisted, listening: Boolean(audio && heard && !technicalText), technicalText: Boolean(audio && technicalText) };
    useUserStore.getState().recordTask(attempt, card.id, correct, token, evidence);
    setOutcomes((all) => ({ ...all, [card.id]: { answer: value, spoken, evidence, reason: verdict.message, status: correct ? assisted ? 'assisted' : 'independent' : 'wrong' } }));
    if (correct) { Keyboard.dismiss(); setFeedback(verdict); if (turn?.reply) void speak(turn.reply); }
    else if (!reviewing) {
      const pending = queue.some((c) => c.id === card.id) ? queue : [...queue, card];
      setQueue(pending); setFeedback(verdict); Keyboard.dismiss();
    } else { useUserStore.getState().settlePacketTask(attempt, card.id, 'needsPractice'); setFeedback(verdict); }
  };
  const check = () => {
    if (responseLocked.current || !rule || !card || audio && !promptReady || !answer.trim() && !built.length || feedback) return;
    const value = card.words && built.length ? built.map((i) => card.words![i]).join(' ') : answer;
    const verdict = assessPacketAnswer(value, rule);
    if (technicalText && audio && verdict.status !== 'correct') { setFeedback({ ...verdict, status: 'unknown', message: 'Bu hissə texniki səbəbdən mətnlə məşq edilir. Dinləmə yoxlanmadı; yenidən cəhd edə və ya yoxlanmamış kimi davam edə bilərsən.' }); return; }
    if (verdict.status === 'unknown') { setFeedback(verdict); return; }
    record(value, verdict, `${card.id}:typed:${++submission.current}`, false);
  };
  const skip = () => {
    if (!card) return;
    useUserStore.getState().recordTask(attempt, card.id, null, `${card.id}:skip`);
    setOutcomes((all) => ({ ...all, [card.id]: { answer: '', status: 'unverified', spoken: card.kind === 'voice' } }));
    if (card.kind === 'voice') useUserStore.getState().settlePacketTask(attempt, card.id, 'skipped');
    advance();
  };
  const continueUnverified = () => {
    if (!card || !answer.trim() || feedback?.status !== 'unknown') return;
    const evidence: TaskEvidence = { input: card.kind === 'voice' ? 'spoken' : 'written', assisted: help || Boolean(turn?.sample), listening: false, technicalText: Boolean(audio && technicalText) };
    useUserStore.getState().recordTask(attempt, card.id, null, `${card.id}:unverified:${++submission.current}`, evidence);
    useUserStore.getState().settlePacketTask(attempt, card.id, 'unverified');
    setOutcomes(all => ({ ...all, [card.id]: { answer, evidence, status: 'unverified', spoken: card.kind === 'voice', reason: evidence.technicalText ? 'Texniki səbəbdən mətnlə davam edildi. Dinləmə yoxlanmadı.' : 'Cavab etibarlı qiymətləndirilmədi.' } }));
    advance();
  };
  const finish = async () => {
    if (finishing.current) return;
    finishing.current = true; setBusy(true); setCompletionError('');
    try {
      const result = await useUserStore.getState().finishLesson(attempt);
      if (result.completed) await useVocabularyStore.getState().addLessonWords(packet.id);
      if (result.completed) { setReceipt(result.id); setDone(true); }
      else setCompletionError('Dərs hələ tamamlanmayıb. Məcburi tapşırıqları tamamla; düzgün cavabların saxlanılıb.');
      finishing.current = false;
    } catch { setCompletionError(useVocabularyStore.getState().storageError || 'Nəticə saxlanmadı. Yenidən cəhd et.'); finishing.current = false; }
    finally { setBusy(false); }
  };
  const leave = () => {
    if (busy) return;
    sequence.current += 1; clearWatchdog(); void Speech.stop(); Keyboard.dismiss();
    if (attempt && !done) useUserStore.getState().abandonLesson(attempt);
    setExitOpen(false); router.replace({ pathname: '/module/[id]', params: { id: 'module_1' } });
  };
  const exit = () => {
    if (busy || capturing) return;
    if (card?.kind === 'voice' && packet.order < 7) { if (feedback && feedback.status !== 'unknown') advance(); else skip(); return; }
    if (done || !attempt) leave();
    else { Keyboard.dismiss(); sequence.current += 1; clearWatchdog(); void Speech.stop(); setPlaying(false); setExitOpen(true); }
  };
  useEffect(() => { backAction.current = exit; });
  const missing = (useUserStore.getState().attempts[attempt]?.expected ?? []).filter(id => !useUserStore.getState().attempts[attempt]?.tasks[id]?.resolved && !useUserStore.getState().attempts[attempt]?.tasks[id]?.settled);
  const retryMissing = () => {
    const pending = flow.filter(c => missing.includes(c.id));
    if (!pending.length) return;
    judged.current.clear(); reset(); setReviewTotal(pending.length); setQueue(pending); setReviewing(true); setCompletionError(''); finishing.current = false;
  };
  if (!card || !attempt) return <View style={s.screen}><Text style={s.body}>Dərs hazırlanır. Bölmənin açıq olduğunu yoxla.</Text><TouchableOpacity onPress={exit}><Text style={s.link}>Geri</Text></TouchableOpacity></View>;
  const isResult = card.kind === 'result';
  const isIntro = card.kind === 'intro';
  const metadata = getLessonById(packet.id);
  const scene = card.kind === 'intro' ? undefined : packetScene(packet.order, card, reviewing);
  const boardText = card.board || (card.kind === 'voice' ? 'Dinlə və\nözün cavab ver' : card.words ? 'Sözlərdən\ncümlə qur' : card.kind === 'intro' ? 'BirFox ilə\nöyrən' : 'Düşün və\ncavabını hazırla');
  const dense = Boolean(task || card.body.length > 240);
  const artworkHeight = heroHeight(height - insets.top - insets.bottom, dense, keyboard, fontScale);
  const sceneHeight = audio ? Math.min(110, artworkHeight) : card.body.length > 240 ? Math.min(135, artworkHeight) : artworkHeight;
  const correct = feedback?.status === 'correct';
  const answerMotion: LessonMotion = !feedback || feedback.status === 'unknown' ? 'idle' :
    correct ? outcomes[card.id]?.status === 'assisted' ? 'assisted' : 'correct' : 'incorrect';
  const locked = Boolean(feedback && feedback.status !== 'unknown');
  const meaning = audioMeaning(packet, audio);
  const hint = lessonHint(card);
  const canHelp = !reviewing && Boolean(hint);
  const disabled = busy || capturing || Boolean(locked && !continueReady) || Boolean(task && !locked && (card.kind === 'voice' || audio && !promptReady || !answer.trim() && !built.length));
  const submitSpeech = (spoken: SpokenAnswer): string | null => {
    if (!rule || responseLocked.current || locked || audio && !promptReady) return null;
    if (card.kind === 'voice' && spoken.edited) {
      return 'Mətnlə məşq edə bilərsən, amma bu tapşırığın danışıq nəticəsi üçün cavabını yenidən səslə de.';
    }
    const verdict = assessPacketAnswer(spoken.text, rule, !spoken.edited);
    if (card.kind === 'voice' && audio && verdict.status !== 'correct') {
      const slower = !rule.goals?.includes('slow') && assessPacketAnswer(spoken.text, { answers: [], goals: ['slow'] }, true).status === 'correct';
      const repeat = !rule.goals?.includes('repeat') && assessPacketAnswer(spoken.text, { answers: [], goals: ['repeat'] }, true).status === 'correct';
      if (slower || repeat) { void speak(audio, slower ? .45 : (turn?.rate || .75) * speed, true); return 'Mesajı yenidən dinlə, sonra cavab ver. Bu xahiş səhv sayılmır.'; }
    }
    if (verdict.status === 'unknown') { setAnswer(spoken.text); setFeedback({ ...verdict, message: 'Səsli cavabın dəqiq qiymətləndirilmədi. Yenidən cəhd edə və ya yoxlanmamış kimi davam edə bilərsən.' }); return 'Səsli cavab dəqiq tanınmadı. Yenidən danışa bilərsən.'; }
    setAnswer(spoken.text); record(spoken.text, verdict, `${card.id}:${spoken.token}`, !spoken.edited);
    return null;
  };
  const evidenceSummary = summarizeEvidence(Object.values(outcomes).map(o => ({ resolved: o.status === 'independent' || o.status === 'assisted', evidence: o.evidence })));
  const summary = Object.values(outcomes).filter(o => !o.evidence?.technicalText).reduce((totals, item) => ({ ...totals, [item.status]: totals[item.status] + 1 }), { independent: 0, assisted: 0, wrong: 0, unverified: 0 });
  return <KeyboardAvoidingView style={[s.screen, { paddingTop: insets.top }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
    <View style={[s.header, keyboard && { paddingBottom: 7 }]}>
      <Pressable accessibilityRole="button" accessibilityLabel="Dərsdən geri çıx" onPress={exit} style={s.backButton}><LessonIcon name="back" color={ink.text} /></Pressable>
      <View style={s.flex}><Text style={s.kicker}>İLK TANIŞLIQ · {isIntro ? 'A1' : `${packet.order}/7`}</Text>{!isIntro ? <Text accessibilityRole="header" style={s.heading}>{packet.title}</Text> : null}</View>
      {!keyboard ? <LessonEnergy /> : null}
    </View>
    {!isIntro ? <>
      <View style={s.progressRow}><LessonProgressBar value={isResult ? missing.length ? .99 : 1 : reviewing ? .9 + .09 * (1 - queue.length / Math.max(1, reviewTotal)) : .9 * index / Math.max(1, flow.length - 1)} /></View></> : null}
    <ScrollView ref={scroll} onLayout={e => setViewportHeight(e.nativeEvent.layout.height)} style={s.viewport} contentContainerStyle={[s.content, isIntro && { justifyContent: 'center' }]} contentInsetAdjustmentBehavior="never" automaticallyAdjustContentInsets={false} keyboardShouldPersistTaps="always" keyboardDismissMode="on-drag" showsVerticalScrollIndicator={false}>
      {isIntro ? <LessonWelcome packet={packet} compact={height < 900 || fontScale > 1.15} sceneHeight={Math.max(160, Math.min(340, (viewportHeight || height - insets.top - insets.bottom - 160) - (fontScale > 1.15 ? 430 : 370)))} /> : <>
      {!keyboard ? <View style={s.badge}><LessonTextMotion state={reviewing ? 'review' : 'idle'} trigger={card.id} style={s.badgeText}>{reviewing ? 'BİR DƏ MƏŞQ ET' : card.id.startsWith('recheck:') ? 'YENİDƏN YOXLА' : lessonMode(card)}</LessonTextMotion></View> : null}
      {isResult ? <>
        <View style={s.resultHero}><View style={s.resultSeal}><LessonIcon name="check" size={44} color={ink.mint} /></View><Text style={s.resultHeading}>{missing.length ? 'Dərs hələ tamamlanmayıb' : 'Sadə tanışlıq söhbətini məşq etdin'}</Text><Text style={s.note}>{packet.title}</Text></View>
        {missing.length ? <Text accessibilityLiveRegion="polite" style={s.error}>{missing.length} məcburi tapşırıq qalır. Düzgün cavabların saxlanılıb.</Text> : null}
        <View style={s.stats}>{([{ key: 'independent', title: 'Müstəqil', color: ink.mint }, { key: 'assisted', title: 'Köməklə', color: ink.orange }, { key: 'wrong', title: 'Məşq lazımdır', color: ink.orange }, { key: 'unverified', title: 'Yoxlanmadı', color: ink.violet }] as const).map(item => <View key={item.key} style={s.stat}><Text style={[s.statNumber, { color: item.color }]}>{summary[item.key]}</Text><Text style={s.small}>{item.title}</Text></View>)}</View>
        {summary.wrong ? <Text style={s.note}>Təkrarda da çətinlik qalan {summary.wrong} hissə var. Sonrakı dərsdə yenidən məşq edəcəyik.</Text> : null}
        <Surface><Text style={s.cardTitle}>Bacarıqlar üzrə nəticə</Text><Text style={s.body}>Yazılı cavab: {evidenceSummary.written} · Səsli cavab: {evidenceSummary.spoken}</Text><Text style={s.note}>Dinləmə: {evidenceSummary.listeningIndependent} müstəqil · {evidenceSummary.listeningAssisted} köməklə</Text>{evidenceSummary.technicalText ? <Text style={s.note}>Texniki səbəbdən mətnlə: {evidenceSummary.technicalText}. Dinləmə sübutu sayılmır.</Text> : null}<Text style={s.note}>Səsli cavab sayı tələffüz balı deyil. Bu bölmə bütün A1 səviyyəsini əhatə etmir.</Text></Surface>
        <Surface><Text style={s.cardTitle}>Bu dərsdə məşq etdin</Text><Text style={s.body}>{metadata?.canDo || packet.goal}</Text>{done ? <EarnedXP receiptId={receipt} /> : <Text style={s.note}>Nəticəni saxladıqda qazandığın XP görünəcək.</Text>}</Surface>
        <Pressable accessibilityRole="button" accessibilityState={{ expanded: detailsOpen }} style={s.detailButton} onPress={() => setDetailsOpen(v => !v)}><Text style={s.link}>Tapşırıqların nəticələri {detailsOpen ? '−' : '+'}</Text></Pressable>
        {detailsOpen ? flow.filter(c => c.kind === 'task' || c.kind === 'voice').map(c => <View key={c.id} style={s.resultRow}><Text style={s.body}>{c.turns?.[0]?.prompt || c.title}</Text><LessonTextMotion state={outcomes[c.id]?.evidence?.technicalText ? 'idle' : outcomeMotion(outcomes[c.id]?.status)} style={s.note}>{`${outcomes[c.id]?.evidence?.technicalText ? 'Texniki səbəbdən mətnlə · ' : ''}${labels[outcomes[c.id]?.status || 'unverified']} · ${outcomes[c.id]?.spoken ? 'Səsli cavab' : 'Yazılı cavab'}`}</LessonTextMotion></View>) : null}
        {completionError ? <Text accessibilityLiveRegion="polite" style={s.error}>{completionError}</Text> : null}
      </> : <>
        {card.kind !== 'voice' ? audio ? <ListeningScene playing={playing} height={sceneHeight} /> : scene ? <ReusableLessonScene name={scene} height={sceneHeight} /> : <ClassroomScene height={sceneHeight} text={boardText.slice(0, 90)} freshWords={card.kind === 'teach' ? newLessonWords(packet, b1Packet) : undefined} /> : null}
        <View style={s.taskBody}>
        {reviewing ? <Text style={s.note}>Bu hissədə çətinlik oldu. İndi başqa vəziyyətdə yenidən məşq edək.</Text> : card.id.startsWith('recheck:') ? <Text style={s.note}>Əvvəl məşq etdiyin bu bacarığı yenidən yoxlayaq.</Text> : null}
        {audio && card.kind !== 'voice' ? <Text style={s.cardTitle}>{turn?.prompt || card.body}</Text> : <Surface accent={card.kind === 'intro' ? 'orange' : 'violet'}>
          <View style={s.scenario}><View style={s.ruleLine} /><View style={s.flex}>{canHelp ? <Pressable accessibilityRole="button" accessibilityLabel="Kömək göstər" accessibilityState={{ expanded: help }} onPress={() => { setHelp(v => !v); useUserStore.getState().useHelp(attempt); }} style={s.help}><LessonIcon name="hint" size={17} /><Text style={s.helpLink}>Kömək {help ? '−' : '+'}</Text></Pressable> : null}{reviewing ? <Text style={s.kicker}>YENİ TAPŞIRIQ</Text> : null}<Text style={card.kind === 'intro' ? s.cardTitle : s.body}>{card.kind === 'teach' ? <LessonVocabularyText text={teachingText(card)} packet={packet} /> : turn?.prompt || teachingText(card)}</Text>{card.kind === 'teach' && packet.order !== 1 && card.body.includes('\n\n') ? <Text style={s.note}><LessonVocabularyText text={card.body.split(/\n\s*\n/).slice(1).join('\n\n')} packet={packet} /></Text> : null}

            {help && !reviewing && canHelp ? <Text style={s.note}>{hint}</Text> : null}
          </View></View>
        </Surface>}
        {card.examples?.length ? <View style={s.exampleList}>{[...new Set(card.examples)].map((text, i) => <Pressable accessibilityRole="button" key={`${card.id}:example:${i}`} style={s.example} onPress={() => { setExamplePulse(v => ({ text, token: (v?.token || 0) + 1 })); void speak(text); }} accessibilityLabel={`İngiliscə dinlə: ${text}`}><LessonIcon name="sound" color={ink.orange} /><View style={s.flex}><LessonTextMotion state={examplePulse?.text === text ? 'pulse' : 'idle'} trigger={examplePulse?.token} style={s.exampleText}>{card.kind === 'teach' ? <LessonVocabularyText text={text} packet={packet} /> : text}</LessonTextMotion>{packet.order === 1 && card.kind === 'teach' ? <Text style={s.note}>{audioMeaning(packet, text)?.split(' — ').slice(1).join(' — ')}</Text> : null}</View><LessonIcon name="play" size={15} /></Pressable>)}</View> : null}
        {audio && !keyboard ? <>
          <Pressable accessibilityRole="button" accessibilityLabel={playing ? 'Səsi dayandır' : 'Səsi dinlə'} disabled={capturing} style={s.audio} onPress={() => { if (playing) { sequence.current += 1; clearWatchdog(); void Speech.stop(); setPlaying(false); } else void speak(audio, (turn?.rate || .75) * speed, true); }}><View style={s.play}><LessonIcon name={playing ? 'pause' : 'play'} color="#211727" size={24} /></View><View style={s.flex}><Text style={s.cardTitle}>{playing ? 'Dinləyirsən…' : heard ? 'Yenidən dinlə' : 'Səsi dinlə'}</Text><Text style={s.small}>{playing ? 'Səs oxunur' : 'Dinlədikdən sonra cavab ver'}</Text></View></Pressable>
          <View style={s.speeds}>{[{ value: .75, label: '🐢 Yavaş' }, { value: 1, label: '1× Normal' }, { value: 1.25, label: '1.25× Sürətli' }].map(item => <Pressable accessibilityRole="button" accessibilityState={{ selected: speed === item.value, disabled: capturing }} disabled={capturing} key={item.value} onPress={() => { setSpeed(item.value); if (playing) void speak(audio, (turn?.rate || .75) * item.value, true); }} style={[s.speed, speed === item.value && s.activeSpeed]}><Text style={[s.speedText, speed === item.value && { color: ink.orange }]}>{item.label}</Text></Pressable>)}</View>
        </> : null}
        {audio && keyboard ? <Pressable accessibilityRole="button" disabled={capturing} onPress={() => void speak(audio, (turn?.rate || .75) * speed, true)} style={s.keyboardAudio}><LessonIcon name="play" size={16} color={ink.orange} /><Text style={s.helpLink}>Yenidən dinlə</Text></Pressable> : null}
        {audio && task && !locked ? <Pressable accessibilityRole="button" disabled={capturing} onPress={useTextPrompt} style={s.technicalButton}><Text style={s.helpLink}>Səs eşidilmir · mətnlə davam et</Text></Pressable> : null}
        {audio && technicalText ? <Surface><Text style={s.kicker}>TEXNİKİ SƏBƏBDƏN MƏTNLƏ</Text><Text style={s.body}>{audio}</Text><Text style={s.note}>Dinləmə nəticəsi kimi hesablanmır.</Text></Surface> : null}
        {soundError ? <Text accessibilityLiveRegion="polite" style={s.error}>{soundError}</Text> : null}
        {task ? card.kind === 'voice' ? <>
          {turn?.sample ? <Surface><Text style={s.kicker}>KÖMƏKLƏ MƏŞQ · NÜMUNƏ</Text><Text style={s.body}>{turn.sample}</Text></Surface> : null}
          {!audio || promptReady ? locked ? <View style={s.spokenAnswer}><WrongAnswerBorder active={locked && !correct} radius={16} /><LessonIcon name="mic" size={18} /><LessonTextMotion state={answerMotion} style={s.body}>{answer}</LessonTextMotion></View> : <LessonVoiceInput suspended={exitOpen} key={`${card.id}:${reviewing}`} onBusyChange={setCapturing} onFinal={submitSpeech} /> : <Text style={s.note}>Danışmazdan əvvəl yuxarıdakı səsi dinlə.</Text>}
        </> : card.options ? <View style={s.options}>{card.options.map((option, i) => <Pressable key={`${card.id}:${i}`} accessibilityRole="radio" accessibilityState={{ selected: answer === option, disabled: locked || Boolean(audio && !promptReady) }} disabled={locked || Boolean(audio && !promptReady)} style={({ pressed }) => [s.option, answer === option && (correct ? s.correctOption : s.selected), pressed && { transform: [{ scale: .985 }] }, Boolean(audio && !promptReady) && { opacity: .55 }]} onPress={() => { if (responseLocked.current) return; setAnswer(option); setFeedback(null); }}><WrongAnswerBorder active={locked && !correct && answer === option} /><SelectionMark selected={answer === option} correct={correct && answer === option} /><LessonTextMotion state={answer === option ? answerMotion : 'idle'} style={[s.body, s.flex]}>{option}</LessonTextMotion></Pressable>)}</View> : card.words ? <>
          <View style={s.answerTray}><WrongAnswerBorder active={locked && !correct} />{built.length ? built.map((wordIndex, position) => <Pressable key={`${wordIndex}:${position}`} accessibilityLabel={`${card.words![wordIndex]} sözünü çıxar`} disabled={locked || Boolean(audio && !promptReady)} style={s.word} onPress={() => { if (responseLocked.current) return; setBuilt(v => v.filter((_, i) => i !== position)); setFeedback(null); }}><LessonTextMotion state={answerMotion} style={s.body}>{card.words![wordIndex]}</LessonTextMotion></Pressable>) : <Text style={s.note}>Sözlərə toxunaraq cümlə qur.</Text>}</View>
          <View style={s.words}>{card.words.map((word, i) => <Pressable key={`${word}:${i}`} disabled={built.includes(i) || locked || Boolean(audio && !promptReady)} style={[s.word, built.includes(i) && { opacity: .25 }]} onPress={() => { if (responseLocked.current) return; setBuilt(v => [...v, i]); setFeedback(null); }}><Text style={s.body}>{word}</Text></Pressable>)}</View>
        </> : <WrittenAnswerInput key={`${card.id}:${reviewing}`} value={answer} onVoiceFinal={submitSpeech} onChange={v => { if (responseLocked.current) return; setAnswer(v); setFeedback(null); }} disabled={locked || Boolean(audio && !promptReady)} suspended={exitOpen} onBusyChange={setCapturing} onFocus={() => requestAnimationFrame(() => scroll.current?.scrollToEnd({ animated: true }))} motionState={answerMotion} /> : null}
        {feedback ? <LessonFeedback key={`${card.id}:${feedback.status}`} verdict={feedback} explanation={feedback.status === 'unknown' ? feedback.message : feedbackCopy(card, answer).reason} example={feedbackCopy(card, answer).example} meaning={meaning} assisted={outcomes[card.id]?.status === 'assisted'} answer={answer || built.map(i => card.words![i]).join(' ')} accepted={rule?.answers} needsPractice={reviewing && feedback.status !== 'correct' && feedback.status !== 'unknown'} /> : null}
        </View>
      </>}
      </>}
    </ScrollView>
    <View style={[s.footer, { paddingBottom: keyboard ? 8 : Math.max(12, insets.bottom) }]}>
      {!capturing && (card.kind !== 'voice' || locked) ? <LessonButton disabled={disabled} label={isResult ? done ? 'Bölməyə qayıt' : missing.length ? 'Qalan tapşırıqları tamamla' : 'Nəticəni saxla' : card.kind === 'intro' ? 'Dərsə başla' : task && !locked ? 'Yoxla' : 'Davam et'} onPress={() => isResult ? done ? exit() : missing.length ? retryMissing() : void finish() : !task || locked ? advance() : check()} /> : null}
      {task && feedback?.status === 'unknown' && answer.trim() ? <Pressable accessibilityRole="button" style={s.technicalButton} onPress={continueUnverified}><Text style={s.helpLink}>Yoxlanmadı ilə davam et</Text></Pressable> : null}
      {task && !locked && !keyboard && (card.kind === 'voice' || help || technicalText) ? <Pressable accessibilityRole="button" disabled={capturing} onPress={skip}><Text style={s.skip}>{card.kind === 'voice' ? packet.order < 7 ? 'Səsli məşqi keç' : 'İndi danışa bilmirəm' : 'Sonra qayıt'}</Text></Pressable> : null}
    </View>
    <LessonExitDialog visible={exitOpen} onContinue={() => setExitOpen(false)} onExit={leave} busy={busy} />
  </KeyboardAvoidingView>;
}
const s = StyleSheet.create({
  viewport: { flex: 1, minHeight: 0 }, taskBody: { gap: 10 }, spokenAnswer: { flexDirection: 'row', gap: 9, padding: 12, borderRadius: 16, backgroundColor: '#211F39' }, keyboardAudio: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 3 }, screen: { flex: 1, backgroundColor: ink.bg }, flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 9, flexShrink: 0 }, backButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#18172F', borderWidth: 1, borderColor: ink.border, alignItems: 'center', justifyContent: 'center' },
  pageTitle: { color: ink.text, fontSize: 24, lineHeight: 30, fontWeight: '800', paddingHorizontal: 20, marginBottom: 13 }, postAnswerExplanation: { marginHorizontal: 20, padding: 14, borderRadius: 17, backgroundColor: '#201C38', borderWidth: 1, borderColor: '#685086' }, energy: { paddingRight: 5 }, kicker: { color: ink.muted, fontSize: 9, letterSpacing: 1.3, marginBottom: 5 }, heading: { color: ink.text, fontSize: 16, lineHeight: 21, fontWeight: '700' },
  progressRow: { marginHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 9, flexShrink: 0 }, progress: { flex: 1, height: 6, borderRadius: 6, backgroundColor: '#282342', overflow: 'hidden' }, fill: { height: '100%', backgroundColor: ink.orange, borderRadius: 6 }, count: { color: ink.orange, fontSize: 11, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingBottom: 16, gap: 12, flexGrow: 1 }, badge: { alignSelf: 'flex-start', borderRadius: 18, backgroundColor: '#23203F', paddingVertical: 6, paddingHorizontal: 12 }, badgeText: { color: ink.violet, fontSize: 9, letterSpacing: 1, fontWeight: '800' },
  body: { color: ink.text, fontSize: 15, lineHeight: 22 }, note: { color: ink.muted, fontSize: 12, lineHeight: 18 }, small: { color: ink.muted, fontSize: 10, lineHeight: 16 }, cardTitle: { color: ink.text, fontSize: 16, lineHeight: 24, fontWeight: '700' },
  scenario: { flexDirection: 'row', gap: 12 }, ruleLine: { width: 2, backgroundColor: ink.orange, borderRadius: 2 }, help: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', gap: 5, minHeight: 36, paddingHorizontal: 4 }, helpLink: { color: ink.violet, fontSize: 12, lineHeight: 20, paddingVertical: 4 },
  exampleList: { gap: 8 }, example: { flexDirection: 'row', gap: 12, alignItems: 'center', borderRadius: 16, borderWidth: 1, borderColor: ink.border, backgroundColor: ink.card, padding: 13 }, exampleText: { flex: 1, color: ink.text, fontWeight: '600', fontSize: 15 },
  audio: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 20, borderWidth: 1, borderColor: '#474068', padding: 12, backgroundColor: '#181A34' }, play: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22, backgroundColor: ink.orange }, speeds: { flexDirection: 'row', gap: 8 }, speed: { flex: 1, minHeight: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: ink.border, borderRadius: 14, backgroundColor: ink.card }, activeSpeed: { borderColor: ink.orange, backgroundColor: '#322330' }, speedText: { color: ink.muted, fontSize: 11, fontWeight: '700' },
  options: { gap: 9 }, option: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 54, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: '#413A62', backgroundColor: ink.card }, selected: { borderColor: ink.orange, backgroundColor: '#2B2334' }, correctOption: { borderColor: ink.mint, backgroundColor: '#143535' },
  inputFrame: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1.5, borderColor: '#A297ED', backgroundColor: '#22213F', shadowColor: '#8D77ED', shadowOffset: { width: 0, height: 2 }, shadowOpacity: .15, shadowRadius: 10 }, input: { flex: 1, paddingVertical: 16, minHeight: 62, maxHeight: 100, fontSize: 16, lineHeight: 23, color: ink.text },
  words: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, answerTray: { minHeight: 64, flexDirection: 'row', flexWrap: 'wrap', gap: 7, padding: 12, borderWidth: 1, borderColor: '#8274B7', borderRadius: 18, backgroundColor: '#1B1B35' }, word: { backgroundColor: '#282440', borderWidth: 1, borderColor: ink.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  footer: { flexShrink: 0, paddingHorizontal: 20, paddingTop: 10, backgroundColor: ink.bg, gap: 8, borderTopWidth: 1, borderTopColor: '#1D1C35' }, skip: { color: ink.muted, textAlign: 'center', fontSize: 13, minHeight: 44, paddingVertical: 12 }, technicalButton: { minHeight: 44, justifyContent: 'center' }, feedback: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, borderWidth: 1, borderColor: '#85613A', backgroundColor: '#282133', gap: 3 }, correctFeedback: { borderColor: '#4CAB9B', backgroundColor: '#12302F' }, feedbackTitle: { flexDirection: 'row', gap: 9, alignItems: 'center' }, feedbackText: { flex: 1, fontSize: 14, lineHeight: 20, fontWeight: '700' }, error: { color: '#FFB5A7', fontSize: 12, lineHeight: 18 },
  voiceHeading: { alignItems: 'center', gap: 8, paddingVertical: 14 }, resultHero: { alignItems: 'center', paddingVertical: 20, gap: 12 }, resultSeal: { width: 88, height: 88, borderRadius: 44, borderWidth: 1, borderColor: ink.mint, backgroundColor: '#173235', alignItems: 'center', justifyContent: 'center' }, resultHeading: { color: ink.text, fontSize: 22, lineHeight: 29, fontWeight: '800', textAlign: 'center' }, stats: { flexDirection: 'row', gap: 9 }, stat: { flex: 1, backgroundColor: ink.card, borderWidth: 1, borderColor: ink.border, borderRadius: 18, padding: 12, alignItems: 'center', gap: 5 }, statNumber: { fontSize: 26, fontWeight: '800' }, detailButton: { alignItems: 'center', padding: 10 }, link: { color: ink.violet, fontSize: 13, fontWeight: '700' }, resultRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: ink.border, gap: 5 },
});
