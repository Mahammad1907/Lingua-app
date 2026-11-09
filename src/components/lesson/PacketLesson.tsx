import { LessonThemeProvider, useLessonTheme, useLessonStyles } from './LessonTheme';
import LessonWordChip from './LessonWordChip';
import LessonCardTransition from './LessonCardTransition';
import CurrentSceneArt from './CurrentSceneArt';
import { currentTeachingScene } from '../../utils/currentScenePlan';
import LessonDialogueScene from './LessonDialogueScene';
import LessonDialogueHistory, { DialogueTurn } from './LessonDialogueHistory';
import LessonLearnedCollection from './LessonLearnedCollection';
import LessonTeachingBoard from './LessonTeachingBoard';
import LessonStageHeading from './LessonStageHeading';
import LessonSkillResults, { skillResults } from './LessonSkillResults';
import { authoredRetry, spacedWarmups, restoreAuthoredFlow } from '../../utils/v2Flow';
import FixedLessonViewport from './FixedLessonViewport';
import LessonExplanationCard from './LessonExplanationCard';
import { mascotText } from '../../utils/mascot';
import { classroomSource, lessonSceneSources, warmLessonArtwork } from '../../utils/lessonAssets';
import { StatusBar } from 'expo-status-bar';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View, Pressable, TextInput, useWindowDimensions, BackHandler, AppState } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getLessonById } from '../../data/lessons';
import { b1Packet, packetFlow } from '../../data/b1Course';
import type { PacketCard, PacketLesson as Content, PacketRule } from '../../data/b1PacketTypes';
import { useUserStore } from '../../store/userStore';
import { useVocabularyStore } from '../../store/vocabularyStore';
import { assessPacketAnswer, goalLabels, type PacketVerdict } from '../../utils/packetAnswer';
import LessonProgressBar from './LessonProgressBar';
import LessonReviewNotice from './LessonReviewNotice';
import LessonReviewIntro from './LessonReviewIntro';
import AudioTranscript from './AudioTranscript';
import WrongAnswerBorder from './WrongAnswerBorder';
import { feedbackCopy } from '../../utils/lessonFeedbackCopy';
import EarnedXP from '../EarnedXP';
import LessonVoiceInput from './LessonVoiceInput';
import LessonFeedback from './LessonFeedback';
import { useLessonSpeed } from '../../hooks/useLessonSpeed';
import type { SpokenAnswer, UnverifiedRecording } from '../../utils/speechTurn';
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
import VocabularyMeaningPanel from './VocabularyMeaningPanel';
import { speechBoundary, type SpeechHighlight } from '../../utils/speechHighlight';
import { safeTeachingEntry } from '../../utils/pictureTeaching';
import { vocabularySegments } from '../../utils/contextVocabulary';
import type { VocabularyEntry } from '../../utils/contextVocabulary';
import { summarizeEvidence, type TaskEvidence } from '../../utils/lessonEvidence';
import { lessonRecall, withLessonRecall } from '../../utils/lessonReview';
import { newLessonWords } from '../../utils/lessonVocabulary';
import LessonTextMotion, { outcomeMotion, type LessonMotion } from './LessonTextMotion';
import { recognizeRecording, speechProxyEndpoint } from '../../utils/cloudSpeech';

interface Outcome { answer: string; status: 'independent' | 'assisted' | 'wrong' | 'unverified'; spoken: boolean; reason?: string; evidence?: TaskEvidence }
const labels = { independent: 'Müstəqil', assisted: 'Qəbul olundu', wrong: 'Yenidən məşq lazımdır', unverified: 'Yoxlanmadı' };

export default function PacketLesson({ packet }: { packet: Content }) {
  return <LessonThemeProvider light={Boolean(packet.version)}><PacketLessonContent packet={packet} /></LessonThemeProvider>;
}
function PacketLessonContent({ packet }: { packet: Content }) {
  const { colors: ink, light } = useLessonTheme();
  const s = useLessonStyles(baseStyles);
  const router = useRouter(); const insets = useSafeAreaInsets();
  const [restored] = useState(() => Object.values(useUserStore.getState().attempts).find(a => a.lessonId === packet.id && !a.finished));
  const [recall] = useState(() => packet.version ? undefined : lessonRecall(packet, b1Packet, useUserStore.getState().lessonProgress));
  const [flow] = useState(() => packet.version ? restoreAuthoredFlow(packet, restored?.flowIds, b1Packet) || spacedWarmups(packet, b1Packet, useUserStore.getState().lessonProgress) : withLessonRecall(packetFlow(packet).filter((c) => c.kind !== 'review'), recall));
  const [viewportHeight, setViewportHeight] = useState(0);
  const [index, setIndex] = useState(() => { const draft = Object.values(useUserStore.getState().attempts).find(a => a.lessonId === packet.id && !a.finished); return Math.max(0, flow.findIndex(c => c.id === draft?.cursor)); }); const [attempt, setAttempt] = useState('');
  const [initialCard] = useState(() => flow[index]);
  const initialSaved = restored?.tasks[initialCard?.id ?? ''];
  const initialRule = initialCard?.rule || initialCard?.turns?.[0]?.rule;
  const [answer, setAnswer] = useState(initialSaved?.answer || '');
  const [fieldAnswers, setFieldAnswers] = useState<string[]>(() => { try { return initialCard?.fields && initialSaved?.answer ? JSON.parse(initialSaved.answer) : []; } catch { return []; } }); const [built, setBuilt] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<PacketVerdict | null>(() => initialSaved?.answer && initialRule && (initialSaved.resolved || initialSaved.wrong > 0) ? assessPacketAnswer(initialSaved.answer, initialRule, initialSaved.evidence?.input === 'spoken') : null);
  const [continueReady, setContinueReady] = useState(true);
  const feedbackBlocked = useRef(false), feedbackTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined), submission = useRef(0);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [queue, setQueue] = useState<PacketCard[]>(() => flow.filter(c => (restored?.tasks[c.id]?.wrong ?? 0) > 0 && !restored?.tasks[c.id]?.resolved && !restored?.tasks[c.id]?.settled).map(c => { const saved = restored!.tasks[c.id]; const rule = c.rule || c.turns?.[0]?.rule; return saved.answer && rule ? { ...c, review: authoredRetry(c, assessPacketAnswer(saved.answer, rule, saved.evidence?.input === 'spoken'), saved.answer) } : c; })); const [reviewing, setReviewing] = useState(false);
  const [reviewIntro, setReviewIntro] = useState(false);
  const [outcomes, setOutcomes] = useState<Record<string, Outcome>>(() => Object.fromEntries(Object.entries(restored?.tasks ?? {}).map(([id, task]) => [id, { answer: task.answer || '', status: task.resolved ? task.evidence?.assisted ? 'assisted' : 'independent' : task.skipped || task.settled === 'unverified' ? 'unverified' : 'wrong', spoken: task.evidence?.input === 'spoken', evidence: task.evidence }])));
  const [taughtSave, setTaughtSave] = useState<{ id: string; error?: boolean } | null>(null);
  const [saveRetry, setSaveRetry] = useState(0);
  const [selectedMeaning, setSelectedMeaning] = useState<VocabularyEntry | null>(null);
  const [help, setHelp] = useState(false); const [heard, setHeard] = useState(false);
  const [technicalText, setTechnicalText] = useState(false);
  const [transcriptShown, setTranscriptShown] = useState(Boolean(restored?.transcriptTaskIds?.includes(initialCard?.id)));
  const [transcriptVisible, setTranscriptVisible] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [recordedReply, setRecordedReply] = useState<UnverifiedRecording | null>(null);
  const [cloudCandidate, setCloudCandidate] = useState<SpokenAnswer | null>(null);
  const [cloudPending, setCloudPending] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const cloudConsent = useRef(false), cloudSequence = useRef(0), cloudAbort = useRef<AbortController | null>(null);
  useEffect(() => {
    const listener = AppState.addEventListener('change', state => {
      if (state === 'active') return;
      cloudSequence.current += 1; cloudAbort.current?.abort(); cloudAbort.current = null;
      setCloudPending(false); setCloudCandidate(null);
    });
    return () => { listener.remove(); cloudSequence.current += 1; cloudAbort.current?.abort(); };
  }, []);
  const voiceBusyChange = useCallback((busy: boolean) => {
    setCapturing(busy);
    if (busy) {
      cloudSequence.current += 1; cloudAbort.current?.abort(); cloudAbort.current = null;
      setCloudPending(false); setCloudCandidate(null); setRecordedReply(null); setFeedback(null);
    }
  }, []);
  const [soundError, setSoundError] = useState(''); const [receipt, setReceipt] = useState('');
  const [completionError, setCompletionError] = useState(''); const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const [speechFocus, setSpeechFocus] = useState<SpeechHighlight | null>(null);
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
  const sequence = useRef(0); const starting = useRef('');
  const watchdog = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const backAction = useRef(() => {}); const moving = useRef(false);
  const finishing = useRef(false); const responseLocked = useRef(Boolean(initialSaved?.resolved || initialSaved?.wrong)); const judged = useRef(new Set<string>());
  const original = reviewing ? queue[0] : flow[index];
  const card = reviewing && original?.review ? original.review : original;
  const selectMeaning = (entry: VocabularyEntry) => setSelectedMeaning(safeTeachingEntry(entry, packet, card?.number || 0));
  useEffect(() => {
    if (card?.kind !== 'teach') return;
    const taught = [...new Set(vocabularySegments([card.body, card.board, ...(card.examples ?? [])].filter(Boolean).join(' '), packet.vocabulary).flatMap(p => p.entry ? [p.entry.word] : []))];
    let active = true;
    if (taught.length) void useVocabularyStore.getState().addLessonWords(packet.id, taught).then(() => { if (active) setTaughtSave({ id: card.id }); }).catch(() => { if (active) setTaughtSave({ id: card.id, error: true }); });
    return () => { active = false; };
  }, [packet.id, packet.vocabulary, card, saveRetry]);
  const turn = card?.turns?.[0]; const rule: PacketRule | undefined = turn?.rule || card?.rule;
  const audio = turn?.audio || card?.audio;
  const audioRate = (packet.order === 12 && card?.number === 8 || packet.order === 11 && card?.number === 11) ? .45 : turn?.rate || .75;
  useEffect(() => {
    const next = [classroomSource, ...flow.slice(index, index + 4).flatMap(c => { const id = packet.version ? undefined : packetScene(packet.order, c); return id ? [lessonSceneSources[id]] : []; })];
    void warmLessonArtwork(next);
  }, [flow, index, packet.order, packet.version]);
  const textPrompt = technicalText || transcriptShown;
  const promptReady = heard || textPrompt;
  const voiceLayout = Boolean((voiceOpen || card?.kind === 'voice' && promptReady) && (!feedback || feedback.status === 'unknown'));
  useEffect(() => { if (voiceLayout) { Keyboard.dismiss(); } }, [voiceLayout]);
  useEffect(() => { moving.current = false; }, [index, reviewing, original?.id]);
  const clearWatchdog = () => { if (watchdog.current !== undefined) clearTimeout(watchdog.current); watchdog.current = undefined; };
  const cursor = card?.id;
  useEffect(() => { if (attempt && cursor && !reviewing) useUserStore.getState().saveCursor(attempt, cursor); }, [attempt, cursor, reviewing]);
  const task = card?.kind === 'task' || card?.kind === 'voice';
  useEffect(() => {
    if (!starting.current) starting.current = useUserStore.getState().beginLesson(packet.id, 'session', flow.filter(c => c.id.startsWith('recheck:')).map(c => c.id));
    setAttempt(starting.current);
  }, [packet.id, recall, flow]);
  useFocusEffect(useCallback(() => () => { sequence.current += 1; if (watchdog.current !== undefined) clearTimeout(watchdog.current); setPlaying(false); void Speech.stop(); }, []));
  useEffect(() => {
    if (attempt && turn?.sample) useUserStore.getState().useHelp(attempt, card?.id);
  }, [attempt, card?.id, turn?.id, turn?.sample]);
  useFocusEffect(useCallback(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => { backAction.current(); return true; });
    return () => subscription.remove();
  }, []));
  const useTextPrompt = () => {
    if (transcriptVisible) { setTranscriptVisible(false); return; }
    sequence.current += 1; clearWatchdog(); void Speech.stop(); setPlaying(false);
    setTranscriptShown(true); setTranscriptVisible(true); if (card) useUserStore.getState().markTranscript(attempt, card.id); setSoundError(''); useUserStore.getState().useHelp(attempt, card?.id);
  };
  const speak = async (text: string, rate = 0.75, listenTask = false) => {
    const request = ++sequence.current; clearWatchdog(); setSoundError(''); setSpeechFocus(null);
    const failed = () => {
      if (request !== sequence.current) return;
      sequence.current += 1; clearWatchdog(); void Speech.stop(); setPlaying(false);
      setSoundError('Səs açılmadı. Bu, dil səhvi deyil. Yenidən dinlə və ya mətnlə davam et.');
      if (listenTask) { setTechnicalText(true); setTranscriptVisible(true); }
    };
    // Missing native callbacks must not leave a learner locked indefinitely.
    watchdog.current = setTimeout(failed, Math.max(10000, Math.min(60000, text.length * 160 / rate + 5000)));
    try {
      await Speech.stop(); if (request !== sequence.current) return;
      setPlaying(true);
      Speech.speak(text, { language: 'en-GB', rate,
        onBoundary: (event: { charIndex: number; charLength: number }) => { if (request === sequence.current) setSpeechFocus(speechBoundary(text, event.charIndex, event.charLength)); },
        onDone: () => { if (request === sequence.current) { clearWatchdog(); setPlaying(false); if (listenTask) setHeard(true); } },
        onStopped: () => { if (request === sequence.current) { clearWatchdog(); setPlaying(false); } },
        onError: failed,
      });
    } catch { failed(); }
  };
  useEffect(() => () => { if (feedbackTimer.current !== undefined) clearTimeout(feedbackTimer.current); }, []);
  useEffect(() => () => { cloudSequence.current += 1; cloudAbort.current?.abort(); }, []);
  const reset = () => {
    cloudSequence.current += 1; cloudAbort.current?.abort(); cloudAbort.current = null;
    setCloudCandidate(null); setCloudPending(false);
    if (feedbackTimer.current !== undefined) clearTimeout(feedbackTimer.current);
    responseLocked.current = false; setContinueReady(true); feedbackBlocked.current = false;
    sequence.current += 1; clearWatchdog(); void Speech.stop(); Keyboard.dismiss();
    setPlaying(false); setDetailsOpen(false); setExamplePulse(null);
    setAnswer(''); setFieldAnswers([]); setBuilt([]); setFeedback(null); setHelp(false); setHeard(false); setTechnicalText(false); setTranscriptShown(false); setTranscriptVisible(false); setVoiceOpen(false); setSelectedMeaning(null); setRecordedReply(null); setSoundError('');
  };
  const advance = (pending = queue) => {
    if (feedback && feedbackBlocked.current) return;
    if (moving.current) return; moving.current = true;
    reset();
    if (reviewing) {
      setQueue((q) => q.slice(1));
      if (queue.length <= 1) { setReviewing(false); setIndex(flow.length - 1); }
    } else if (flow[index + 1]?.kind === 'result' && pending.length) { setReviewTotal(pending.length); setReviewing(true); setReviewIntro(true); }
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
    const assisted = Boolean(useUserStore.getState().attempts[attempt]?.helpedTaskIds?.includes(card.id) || reviewing || help || transcriptShown || turn?.sample || prior?.status === 'wrong');
    const evidence: TaskEvidence = { input: spoken ? 'spoken' : 'written', assisted, listening: Boolean(audio && heard && !textPrompt), technicalText: Boolean(audio && technicalText), transcriptShown: Boolean(audio && (transcriptShown || useUserStore.getState().attempts[attempt]?.transcriptTaskIds?.includes(card.id))) };
    useUserStore.getState().recordTask(attempt, card.id, correct, token, evidence, value);
    setOutcomes((all) => ({ ...all, [card.id]: { answer: value, spoken, evidence, reason: verdict.message, status: correct ? assisted ? 'assisted' : 'independent' : 'wrong' } }));
    const replyAllowed = turn?.reply && (correct || turn.replyGoals?.every(g => verdict.criteria.some(c => c.goal === goalLabels[g] && c.passed)));
    if (replyAllowed) void speak(turn!.reply!, turn?.replyRate ?? .75);
    if (packet.order === 12 && card.number === 7 && !correct) {
      const hasSlow = verdict.criteria.some(c => c.goal === goalLabels.slow && c.passed);
      const hasRepeat = verdict.criteria.some(c => c.goal === goalLabels.repeat && c.passed);
      if (hasSlow || hasRepeat) void speak(audio || 'How are you?', hasSlow ? .45 : .75);
    }
    if (correct) { setRecordedReply(null); Keyboard.dismiss(); setFeedback(verdict); }
    else if (!reviewing) {
      const pending = queue.some((c) => c.id === card.id) ? queue : [...queue, { ...card, review: authoredRetry(card, verdict, value) }];
      setQueue(pending); setFeedback(verdict); Keyboard.dismiss();
    } else { useUserStore.getState().settlePacketTask(attempt, card.id, 'needsPractice'); setFeedback(verdict); }
  };
  const check = () => {
    if (responseLocked.current || !rule || !card || audio && !promptReady || !answer.trim() && !built.length || feedback) return;
    const value = card.words && built.length ? built.map((i) => card.words![i]).join(' ') : answer;
    const verdict = assessPacketAnswer(value, rule);
    if (textPrompt && audio && verdict.status !== 'correct') { setFeedback({ ...verdict, status: 'unknown', message: 'Mətnlə məşq edirsən. Yenidən cəhd edə və ya yoxlanmadan davam edə bilərsən.' }); return; }
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
    if (!card || !answer.trim() && !recordedReply || feedback?.status !== 'unknown') return;
    const evidence: TaskEvidence = { input: card.kind === 'voice' || recordedReply ? 'spoken' : 'written', assisted: help || transcriptShown || Boolean(turn?.sample), listening: false, technicalText: Boolean(audio && technicalText), transcriptShown: Boolean(audio && (transcriptShown || useUserStore.getState().attempts[attempt]?.transcriptTaskIds?.includes(card.id))) };
    useUserStore.getState().recordTask(attempt, card.id, null, `${card.id}:unverified:${++submission.current}`, evidence);
    useUserStore.getState().settlePacketTask(attempt, card.id, 'unverified');
    setOutcomes(all => ({ ...all, [card.id]: { answer: recordedReply ? '' : answer, evidence, status: 'unverified', spoken: card.kind === 'voice' || Boolean(recordedReply), reason: evidence.transcriptShown ? 'Audionun mətni açıldı. Dinləmə yoxlanmadı.' : evidence.technicalText ? 'Texniki səbəbdən mətnlə davam edildi. Dinləmə yoxlanmadı.' : 'Cavab etibarlı qiymətləndirilmədi.' } }));
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
    if (attempt && !done && !packet.version) useUserStore.getState().abandonLesson(attempt);
    setExitOpen(false); router.replace('/(tabs)');
  };
  const exit = () => {
    if (busy || capturing) return;
    if (!reviewIntro && card?.kind === 'voice' && !packet.version && packet.order < 7) { if (feedback && feedback.status !== 'unknown') advance(); else skip(); return; }
    if (done || !attempt) leave();
    else { Keyboard.dismiss(); sequence.current += 1; clearWatchdog(); void Speech.stop(); setPlaying(false); if (cloudAbort.current) { cloudSequence.current += 1; cloudAbort.current.abort(); cloudAbort.current = null; setCloudPending(false); setFeedback({ status: 'unknown', criteria: [], message: 'Səs yoxlanmadı. Yenidən danışa və ya yoxlanmadan davam edə bilərsən.' }); } setExitOpen(true); }
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
  const scene = packet.version || card.kind === 'intro' ? undefined : packetScene(packet.order, card, reviewing);
  const boardText = card.board || (card.kind === 'voice' ? 'Dinlə və\nözün cavab ver' : card.words ? 'Sözlərdən\ncümlə qur' : card.kind === 'intro' ? mascotText('BirFox ilə\nöyrən') : 'Düşün və\ncavabını hazırla');
  const dense = Boolean(task || card.body.length > 240);
  const artworkHeight = heroHeight(height - insets.top - insets.bottom, dense, keyboard, fontScale);
  const sceneHeight = keyboard || feedback || voiceOpen ? 0 : Math.min(audio ? 64 : 130, artworkHeight, Math.max(0, viewportHeight * .22));
  const correct = feedback?.status === 'correct';
  const answerMotion: LessonMotion = !feedback || feedback.status === 'unknown' ? 'idle' :
    correct ? outcomes[card.id]?.status === 'assisted' ? 'assisted' : 'correct' : 'incorrect';
  const locked = Boolean(feedback && feedback.status !== 'unknown');
  const meaning = audioMeaning(packet, audio);
  const hint = lessonHint(card);
  const canHelp = !reviewing && Boolean(hint);
  const disabled = busy || capturing || Boolean(card.fields && !locked && card.fields.some((_, i) => !(fieldAnswers[i] ?? card.retainedFields?.[i])?.trim())) || Boolean(locked && !continueReady) || Boolean(task && !locked && (card.kind === 'voice' || audio && !promptReady || !answer.trim() && !built.length));
  const submitSpeech = (spoken: SpokenAnswer): string | null => {
    if (!rule || responseLocked.current || locked || audio && !promptReady) return null;
    if (packet.version && !spoken.edited && (typeof spoken.confidence !== 'number' || !Number.isFinite(spoken.confidence) || spoken.confidence < .35 || spoken.confidence > 1)) return 'Səs etibarlı tanınmadı. Yenidən danış; bu, səhv sayılmır.';
    if (card.kind === 'voice' && spoken.edited) {
      return 'Mətnlə məşq edə bilərsən, amma bu tapşırığın danışıq nəticəsi üçün cavabını yenidən səslə de.';
    }
    const verdict = assessPacketAnswer(spoken.text, rule, !spoken.edited);
    if (card.kind === 'voice' && audio && verdict.status !== 'correct') {
      const slower = !rule.goals?.includes('slow') && assessPacketAnswer(spoken.text, { answers: [], goals: ['slow'] }, true).status === 'correct';
      const repeat = !rule.goals?.includes('repeat') && assessPacketAnswer(spoken.text, { answers: [], goals: ['repeat'] }, true).status === 'correct';
      if (slower || repeat) { void speak(audio, slower ? .45 : audioRate * speed, true); return 'Mesajı yenidən dinlə, sonra cavab ver. Bu xahiş səhv sayılmır.'; }
    }
    if (textPrompt && audio && verdict.status !== 'correct') { setAnswer(spoken.text); setFeedback({ ...verdict, status: 'unknown', message: 'Mətnlə məşq edirsən. Yenidən cəhd edə və ya yoxlanmadan davam edə bilərsən.' }); return 'Yenidən danışa və ya yoxlanmadan davam edə bilərsən.'; }
    if (verdict.status === 'unknown') { setAnswer(spoken.text); setFeedback({ ...verdict, message: 'Səsli cavabın dəqiq qiymətləndirilmədi. Yenidən cəhd edə və ya yoxlanmamış kimi davam edə bilərsən.' }); return 'Səsli cavab dəqiq tanınmadı. Yenidən danışa bilərsən.'; }
    setAnswer(spoken.text); record(spoken.text, verdict, `${card.id}:${spoken.token}`, !spoken.edited);
    return null;
  };
  const receiveUnverifiedRecording = (recording: UnverifiedRecording) => {
    if (responseLocked.current || locked || audio && !promptReady) return;
    const request = ++cloudSequence.current; cloudAbort.current?.abort(); setCloudCandidate(null);
    setRecordedReply(recording);
    setFeedback({ status: 'unknown', criteria: [], message: 'Səsin yazıldı, amma yoxlanmadı. Yenidən danışa və ya yoxlanmadan davam edə bilərsən.' });
    if (card.kind !== 'voice' || !speechProxyEndpoint()) return;
    const run = async () => {
      if (request !== cloudSequence.current) return;
      const controller = new AbortController(); cloudAbort.current = controller; setCloudPending(true);
      setFeedback({ status: 'unknown', criteria: [], message: 'Səs yoxlanılır…' });
      const result = await recognizeRecording(recording, 'en-US', controller.signal);
      if (request !== cloudSequence.current || controller.signal.aborted || AppState.currentState !== 'active') return;
      cloudAbort.current = null; setCloudPending(false);
      if (result.status === 'recognized') { const candidate = { text: result.text, confidence: result.confidence, token: recording.token, uri: recording.uri, edited: false }; if (packet.version) { const message = submitSpeech(candidate); if (message) setFeedback({ status: 'unknown', criteria: [], message }); } else setCloudCandidate(candidate); }
      else setFeedback({ status: 'unknown', criteria: [], message: 'Səs dəqiq tanınmadı və ya xidmət açılmadı. Yenidən danışa və ya yoxlanmadan davam edə bilərsən.' });
    };
    if (cloudConsent.current) { void run(); return; }
    Alert.alert('Səsli cavabı yoxla', 'Səsini mətnə çevirmək üçün səs yazın internetlə Microsoft Azure xidmətinə göndəriləcək.', [
      { text: 'İndi yox', style: 'cancel' },
      { text: 'Razıyam', onPress: () => { if (request === cloudSequence.current) { cloudConsent.current = true; void run(); } } },
    ], { cancelable: true });
  };
  const evidenceSummary = summarizeEvidence(Object.values(outcomes).map(o => ({ resolved: o.status === 'independent' || o.status === 'assisted', evidence: o.evidence })));
  const summary = Object.values(outcomes).reduce((totals, item) => ({ ...totals, [item.status]: totals[item.status] + 1 }), { independent: 0, assisted: 0, wrong: 0, unverified: 0 });
  return <KeyboardAvoidingView style={[s.screen, { paddingTop: insets.top }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
    {light ? <StatusBar style="dark" /> : null}
    <View style={[s.header, keyboard && { paddingBottom: 7 }]}>
      <Pressable accessibilityRole="button" accessibilityLabel="Dərsdən geri çıx" onPress={exit} style={s.backButton}><LessonIcon name="back" color={ink.text} /></Pressable>
      <View style={s.flex}><Text style={s.kicker}>{light ? `DƏRS ${packet.order} · İLK TANIŞLIQ` : `İLK TANIŞLIQ · ${packet.order}/${b1Packet.length}`}</Text>{!isIntro ? <Text style={s.heading}>{packet.title}</Text> : null}</View>
      {!keyboard && !light ? <LessonEnergy /> : null}
      {light && card.kind === 'voice' && !locked ? <Pressable accessibilityRole="button" accessibilityLabel="İndi danışa bilmirəm" disabled={capturing || cloudPending} onPress={skip} style={s.voiceSkip}><Text style={s.helpLink}>Keç</Text></Pressable> : null}
    </View>
    {!isIntro ? <>
      <View style={s.progressRow}><LessonProgressBar value={isResult ? missing.length ? .99 : 1 : reviewing ? .9 + .09 * (1 - queue.length / Math.max(1, reviewTotal)) : .9 * index / Math.max(1, flow.length - 1)} /></View></> : null}
    {reviewIntro ? <FixedLessonViewport preserveText={light}><LessonReviewIntro /></FixedLessonViewport> : <FixedLessonViewport preserveText={light} testID="packet-lesson-viewport" onHeight={setViewportHeight} contentContainerStyle={[s.content, voiceLayout && s.voiceContent]}>

      <LessonCardTransition cardId={card.id + (reviewing ? ":retry" : "")} >{isIntro ? <LessonWelcome packet={packet} compact={height < 900 || fontScale > 1.15} sceneHeight={Math.max(90, Math.min(200, (viewportHeight || height - insets.top - insets.bottom - 160) - 390))} /> : <>
      {!keyboard && light ? <LessonStageHeading card={card} reviewing={reviewing} /> : null}
      {light && (card.kind === 'voice' || isResult) ? <LessonDialogueHistory packet={packet} outcomes={outcomes} currentId={card.id} disabled={capturing || cloudPending} onOpen={() => { if (!locked && !isResult) { setHelp(true); useUserStore.getState().useHelp(attempt, card.id); } }} /> : null}
      {!keyboard && !light ? <View style={s.badge}><LessonTextMotion state={reviewing ? 'review' : 'idle'} trigger={card.id} style={s.badgeText}>{reviewing ? 'BİR DƏ MƏŞQ ET' : card.id.startsWith('recheck:') ? 'YENİDƏN YOXLА' : lessonMode(card)}</LessonTextMotion></View> : null}
      {isResult ? <>
        <View style={s.resultHero}><View style={s.resultSeal}><LessonIcon name={summary.wrong || summary.unverified || evidenceSummary.textHelp || evidenceSummary.technicalText ? 'book' : 'check'} size={44} color={ink.mint} /></View><Text style={s.resultHeading}>{missing.length ? 'Dərs hələ tamamlanmayıb' : light ? 'Bu dərsdə nə alındı?' : 'Sadə tanışlıq söhbətini məşq etdin'}</Text><Text style={s.note}>{packet.title}</Text></View>
        {packet.version ? <Text style={s.body}>{card.body}</Text> : null}
        {light ? <LessonSkillResults packet={packet} outcomes={outcomes} /> : null}
        {missing.length ? <Text accessibilityLiveRegion="polite" style={s.error}>{missing.length} məcburi tapşırıq qalır. Düzgün cavabların saxlanılıb.</Text> : null}
        <View style={s.stats}>{([{ key: 'independent', title: 'Müstəqil', color: ink.mint }, { key: 'assisted', title: 'Qəbul olundu', color: ink.orange }, { key: 'wrong', title: 'Məşq lazımdır', color: ink.orange }, { key: 'unverified', title: 'Yoxlanmadı', color: ink.violet }] as const).map(item => <View key={item.key} style={s.stat}><Text style={[s.statNumber, { color: item.color }]}>{summary[item.key]}</Text><Text style={s.small}>{item.title}</Text></View>)}</View>
        {summary.wrong ? <Text style={s.note}>Təkrarda da çətinlik qalan {summary.wrong} hissə var. Sonrakı dərsdə yenidən məşq edəcəyik.</Text> : null}
        {!light ? <><Surface><Text style={s.cardTitle}>Bacarıqlar üzrə nəticə</Text><Text style={s.body}>Yazılı cavab: {evidenceSummary.written} · Səsli cavab: {evidenceSummary.spoken}</Text><Text style={s.note}>Dinləmə: {evidenceSummary.listeningIndependent} müstəqil · {evidenceSummary.listeningAssisted} nümunə/mətn ilə</Text>{evidenceSummary.technicalText || evidenceSummary.textHelp ? <Text style={s.note}>Dinləmə yoxlanmadı: {evidenceSummary.technicalText + evidenceSummary.textHelp}. Mətnlə məşq etdin.</Text> : null}<Text style={s.note}>Səsli cavab sayı tələffüz balı deyil. Bu bölmə bütün A1 səviyyəsini əhatə etmir.</Text></Surface>
        <Surface><Text style={s.cardTitle}>Bu dərsdə məşq etdin</Text><Text style={s.body}>{metadata?.canDo || packet.goal}</Text>{done ? <EarnedXP receiptId={receipt} /> : <Text style={s.note}>Nəticəni saxladıqda qazandığın XP görünəcək.</Text>}</Surface>
        </> : null}
        <Pressable accessibilityRole="button" accessibilityState={{ expanded: detailsOpen }} style={s.detailButton} onPress={() => setDetailsOpen(v => !v)}><Text style={s.link}>Tapşırıqların nəticələri {detailsOpen ? '−' : '+'}</Text></Pressable>
        <LessonExplanationCard visible={detailsOpen} title="Tapşırıqların nəticələri" onClose={() => setDetailsOpen(false)}>{flow.filter(c => c.kind === 'task' || c.kind === 'voice').map(c => <View key={c.id} style={s.resultRow}><Text style={s.body}>{light ? skillResults(packet, outcomes).find(r => r.id === c.id)?.title : c.turns?.[0]?.prompt || c.title}</Text><LessonTextMotion state={outcomes[c.id]?.evidence?.technicalText || outcomes[c.id]?.evidence?.transcriptShown ? 'idle' : outcomeMotion(outcomes[c.id]?.status)} style={s.note}>{`${outcomes[c.id]?.evidence?.technicalText || outcomes[c.id]?.evidence?.transcriptShown ? 'Dinləmə yoxlanmadı · ' : ''}${labels[outcomes[c.id]?.status || 'unverified']} · ${outcomes[c.id]?.spoken ? 'Səsli cavab' : 'Yazılı cavab'}`}</LessonTextMotion></View>)}</LessonExplanationCard>
        {light ? <LessonLearnedCollection packet={packet} onSpeak={text => void speak(text)} /> : null}
        {light && done ? <EarnedXP receiptId={receipt} /> : null}
        {completionError ? <Text accessibilityLiveRegion="polite" style={s.error}>{completionError}</Text> : null}
      </> : <>
        {!light && card.kind !== 'voice' && !voiceLayout && sceneHeight > 0 ? audio ? <ListeningScene playing={playing} height={sceneHeight} /> : scene ? <ReusableLessonScene name={scene} height={sceneHeight} /> : <ClassroomScene height={sceneHeight} text={boardText.slice(0, 90)} freshWords={card.kind === 'teach' && !packet.version ? newLessonWords(packet, b1Packet) : undefined} /> : null}
        <View style={[s.taskBody, voiceLayout && s.voiceBody]}>
        {light && !keyboard && !feedback && !reviewing && card.kind === 'voice'  && height >= 760 && fontScale <= 1.15 ? <LessonDialogueScene order={packet.order} mascot={packet.order === 1 || /maskot/i.test(card.body)} /> : null}
        {light && card.kind === 'teach' && !card.board && currentTeachingScene(packet.order, card) ? <CurrentSceneArt scene={currentTeachingScene(packet.order, card)!} /> : null}
        {reviewing ? <LessonReviewNotice key={card.id} /> : card.id.startsWith('recheck:') ? <Text style={s.note}>Əvvəl məşq etdiyin bu bacarığı yenidən yoxlayaq.</Text> : null}
        {audio && card.kind !== 'voice' ? <Text style={s.cardTitle}>{turn?.prompt || card.body}</Text> : <Surface plain={light && (card.kind === 'teach' || card.kind === 'voice')} accent={card.kind === 'intro' ? 'orange' : 'violet'}>
          <View style={s.scenario}>{!(light && card.kind === 'teach') ? <View style={s.ruleLine} /> : null}<View style={s.flex}>{canHelp ? <Pressable accessibilityRole="button" accessibilityLabel="Kömək göstər" accessibilityState={{ expanded: help }} onPress={() => { setHelp(v => !v); useUserStore.getState().useHelp(attempt, card?.id); }} style={s.help}><LessonIcon name="hint" size={17} /><Text style={s.helpLink}>Kömək {help ? '−' : '+'}</Text></Pressable> : null}{reviewing ? <Text style={s.kicker}>YENİ TAPŞIRIQ</Text> : null}<Text style={card.kind === 'intro' ? s.cardTitle : s.body}>{card.kind === 'teach' ? <LessonVocabularyText key={card.id} text={teachingText(card)} packet={packet} onSelect={entry => selectMeaning(entry)} /> : <LessonVocabularyText key={card.id} text={turn?.prompt?.replace(/\n\nGörünən nümunə:[\s\S]*$/, '') || teachingText(card)} packet={packet} highlight={false} onSelect={entry => { setHelp(true); useUserStore.getState().useHelp(attempt, card?.id); selectMeaning(entry); }} />}</Text>{packet.version && card.board ? light && card.kind === 'teach' ? <LessonTeachingBoard text={card.board} packet={packet} cardId={card.id + ':board'} focus={playing ? speechFocus : null} onSelect={selectMeaning} onSpeak={text => void speak(text)} /> : <Text style={s.body}><LessonVocabularyText key={card.id + ':board'} text={card.board} packet={packet} highlight={card.kind === 'teach'} onSelect={entry => { if (task) { setHelp(true); useUserStore.getState().useHelp(attempt, card.id); } selectMeaning(entry); }} /></Text> : null}{card.kind === 'teach' && card.body.includes('\n\n') ? <Text style={s.note}><LessonVocabularyText key={card.id} text={card.body.split(/\n\s*\n/).slice(1).join('\n\n')} packet={packet} onSelect={entry => selectMeaning(entry)} /></Text> : null}

            {help && !reviewing && canHelp ? <Text style={s.note}>{hint}</Text> : null}
          </View></View>
        </Surface>}
        {light && card.kind === 'teach' && taughtSave?.id === card.id ? taughtSave.error ? <Pressable accessibilityRole="button" onPress={() => setSaveRetry(v => v + 1)}><Text style={s.error}>Lüğət saxlanmadı · Yenidən saxla</Text></Pressable> : <Text accessibilityLiveRegion="polite" style={s.savedVocabulary}>✓ İfadələr Lüğətimdədir</Text> : null}
        {card.examples?.length && !(light && card.kind === 'teach' && card.board) ? <View style={s.exampleList}>{[...new Set(card.examples)].map((text, i) => <Pressable accessibilityRole="button" key={`${card.id}:example:${i}`} style={s.example} onPress={() => { setExamplePulse(v => ({ text, token: (v?.token || 0) + 1 })); void speak(text); }} accessibilityLabel={`İngiliscə dinlə: ${text}`}><LessonIcon name="sound" color={ink.orange} /><View style={s.flex}><LessonTextMotion state={examplePulse?.text === text ? 'pulse' : 'idle'} trigger={examplePulse?.token} style={s.exampleText}>{card.kind === 'teach' ? <LessonVocabularyText key={card.id} text={text} packet={packet} onSelect={entry => selectMeaning(entry)} /> : text}</LessonTextMotion>{packet.order === 1 && card.kind === 'teach' ? <Text style={s.note}>{audioMeaning(packet, text)?.split(' — ').slice(1).join(' — ')}</Text> : null}</View><LessonIcon name="play" size={15} /></Pressable>)}</View> : null}
        {audio && !keyboard && !locked ? <>
          {light && card.kind !== 'voice' ? <ListeningScene playing={playing} height={42} /> : null}
          <Pressable accessibilityRole="button" accessibilityLabel={playing ? 'Səsi dayandır' : 'Səsi dinlə'} disabled={capturing} style={s.audio} onPress={() => { if (playing) { sequence.current += 1; clearWatchdog(); void Speech.stop(); setPlaying(false); } else void speak(audio, audioRate * speed, true); }}><View style={s.play}><LessonIcon name={playing ? 'pause' : 'play'} color={light ? '#301341' : '#211727'} size={24} /></View><View style={s.flex}><Text style={s.cardTitle}>{playing ? 'Dinləyirsən…' : heard ? 'Yenidən dinlə' : 'Səsi dinlə'}</Text><Text style={s.small}>{playing ? 'Səs oxunur' : 'Dinlədikdən sonra cavab ver'}</Text></View></Pressable>
          <View style={s.speeds}>{[{ value: .75, label: '🐢 Yavaş' }, { value: 1, label: '1× Normal' }, { value: 1.25, label: '1.25× Sürətli' }].map(item => <Pressable accessibilityRole="button" accessibilityState={{ selected: speed === item.value, disabled: capturing }} disabled={capturing} key={item.value} onPress={() => { setSpeed(item.value); if (playing) void speak(audio, audioRate * item.value, true); }} style={[s.speed, speed === item.value && s.activeSpeed]}><Text style={[s.speedText, speed === item.value && { color: light ? '#8735C9' : ink.orange }]}>{item.label}</Text></Pressable>)}</View>
        </> : null}
        {audio && (keyboard || locked) ? <Pressable accessibilityRole="button" disabled={capturing} onPress={() => void speak(audio, audioRate * speed, true)} style={s.keyboardAudio}><LessonIcon name="play" size={16} color={ink.orange} /><Text style={s.helpLink}>Yenidən dinlə</Text></Pressable> : null}
        {audio && task && !locked ? <Pressable accessibilityRole="button" accessibilityState={{ expanded: transcriptVisible }} disabled={capturing} onPress={useTextPrompt} style={s.technicalButton}><Text style={s.helpLink}>{transcriptVisible ? 'Mətni gizlət' : textPrompt ? 'Mətni göstər' : 'Səsi başa düşmürəm'}</Text></Pressable> : null}
        {audio && task && !locked && meaning ? <Pressable accessibilityRole="button" disabled={capturing} onPress={() => { setHelp(true); setTranscriptShown(true); useUserStore.getState().markTranscript(attempt, card.id); useUserStore.getState().useHelp(attempt, card.id); setSelectedMeaning({ word: audio, translation: meaning.split(' — ').slice(1).join(' — '), example: '', exampleAz: '', pronunciation: '', usageNote: '' }); }} style={s.technicalButton}><Text style={s.helpLink}>Mənasını göstər</Text></Pressable> : null}
        {audio && transcriptVisible ? <AudioTranscript text={audio} onHide={() => setTranscriptVisible(false)} /> : null}
        {soundError ? <Text accessibilityLiveRegion="polite" style={s.error}>{soundError}</Text> : null}
        {card.retainedCriteria?.length ? <Text style={s.note}>Saxlanılan hissələr: {card.retainedCriteria.join(' · ')}</Text> : null}
        {task ? card.fields ? <View style={{ gap: 8 }}>{card.fields.map((field, i) => <View key={field.label}><Text style={s.note}>{field.label}</Text><TextInput accessibilityLabel={field.label} value={fieldAnswers[i] ?? card.retainedFields?.[i] ?? ''} onChangeText={text => { const next = card.fields!.map((_, j) => j === i ? text : fieldAnswers[j] ?? card.retainedFields?.[j] ?? ''); setFieldAnswers(next); setAnswer(JSON.stringify(next)); }} editable={!locked && !card.retainedFields?.[i]} style={[s.body, { minHeight: 48, borderWidth: 1, borderColor: '#A297EF', borderRadius: 12, padding: 10 }]} /></View>)}</View> : card.kind === 'voice' ? <>

          {turn?.sample && !textPrompt ? <Surface><Text style={s.kicker}>NÜMUNƏ</Text><Text style={s.body}>{turn.sample}</Text></Surface> : null}
          {!audio || promptReady ? locked ? <View><WrongAnswerBorder active={locked && !correct} radius={16} /><DialogueTurn prompt={audio} answer={answer} /></View> : <LessonVoiceInput compact disabled={cloudPending} manualSend={false} cloudEnabled={Boolean(speechProxyEndpoint())} onUnverifiedRecording={receiveUnverifiedRecording} suspended={exitOpen} key={`${card.id}:${reviewing}`} onBusyChange={voiceBusyChange} onFinal={submitSpeech} /> : <Text style={s.note}>Danışmazdan əvvəl yuxarıdakı səsi dinlə.</Text>}
        </> : card.options ? <View style={s.options}>{card.options.map((option, i) => <Pressable key={`${card.id}:${i}`} accessibilityRole="radio" accessibilityState={{ selected: answer === option, disabled: locked || Boolean(audio && !promptReady) }} disabled={locked || Boolean(audio && !promptReady)} style={({ pressed }) => [s.option, answer === option && (correct ? s.correctOption : s.selected), pressed && { transform: [{ scale: .985 }] }, Boolean(audio && !promptReady) && { opacity: .55 }]} onPress={() => { if (responseLocked.current) return; setAnswer(option); setFeedback(null); }}><WrongAnswerBorder active={locked && !correct && answer === option} /><SelectionMark selected={answer === option} correct={correct && answer === option} /><LessonTextMotion state={answer === option ? answerMotion : 'idle'} style={[s.body, s.flex]}>{option}</LessonTextMotion></Pressable>)}</View> : card.words ? <>
          <View style={s.answerTray}><WrongAnswerBorder active={locked && !correct} />{built.length ? built.map((wordIndex, position) => <LessonWordChip key={`${wordIndex}:${position}`} word={card.words![wordIndex]} label={`${card.words![wordIndex]} sözünü çıxar`} disabled={locked || Boolean(audio && !promptReady)} state={answerMotion} onPress={() => { if (responseLocked.current) return; setBuilt(v => v.filter((_, i) => i !== position)); setFeedback(null); }} />) : <Text style={s.note}>Sözlərə toxunaraq cümlə qur.</Text>}</View>
          <View style={s.words}>{card.words.map((word, i) => <LessonWordChip key={`${word}:${i}`} word={word} used={built.includes(i)} disabled={built.includes(i) || locked || Boolean(audio && !promptReady)} onPress={() => { if (responseLocked.current) return; setBuilt(v => [...v, i]); setFeedback(null); }} />)}</View>
        </> : <WrittenAnswerInput key={`${card.id}:${reviewing}`} value={answer} onUnverifiedRecording={receiveUnverifiedRecording} manualSend={false} onVoiceModeChange={setVoiceOpen} onVoiceFinal={submitSpeech} onChange={v => { if (responseLocked.current) return; setAnswer(v); setFeedback(null); }} disabled={locked || Boolean(audio && !promptReady)} suspended={exitOpen} onBusyChange={setCapturing} onFocus={() => {}} motionState={answerMotion} /> : null}
        {cloudCandidate ? <Surface><Text style={s.body}>Belə eşitdik: {cloudCandidate.text}</Text><Pressable accessibilityRole="button" style={s.technicalButton} onPress={() => { const candidate = cloudCandidate; setCloudCandidate(null); setFeedback(null); void submitSpeech(candidate); }}><Text style={s.helpLink}>Bəli, bunu dedim</Text></Pressable><Pressable accessibilityRole="button" style={s.technicalButton} onPress={() => { cloudSequence.current += 1; cloudAbort.current?.abort(); setCloudCandidate(null); setRecordedReply(null); setFeedback(null); }}><Text style={s.helpLink}>Məni səhv eşitdi · Yenidən danış</Text></Pressable></Surface> : null}
        {feedback && !cloudCandidate ? <LessonFeedback key={`${card.id}:${feedback.status}`} verdict={feedback} explanation={feedback.status === 'unknown' ? feedback.message : feedbackCopy(card, answer).reason} example={feedbackCopy(card, answer).example} meaning={meaning} assisted={outcomes[card.id]?.status === 'assisted'} answer={answer || built.map(i => card.words![i]).join(' ')} accepted={rule?.answers} needsPractice={reviewing && feedback.status !== 'correct' && feedback.status !== 'unknown'} vocabulary={b1Packet.filter(lesson => lesson.order <= packet.order).flatMap(lesson => lesson.vocabulary)} vocabularyText={audio && card.options ? audio : correct && !feedback.spellingCorrections?.length ? answer || built.map(i => card.words![i]).join(' ') : rule?.answers[0] || ''} /> : null}
        </View>
      </>}
      </>}</LessonCardTransition>
    </FixedLessonViewport>}
    <View style={[s.footer, light && card.kind === 'voice' && !locked && feedback?.status !== 'unknown' && { paddingTop: 0, borderTopWidth: 0 }, { paddingBottom: keyboard ? 8 : Math.max(12, insets.bottom) }]}>
      {reviewIntro ? <LessonButton label="Davam et" onPress={() => setReviewIntro(false)} /> : <>
      {(!capturing || voiceLayout) && (card.kind !== 'voice' || locked) ? <LessonButton disabled={disabled} label={isResult ? done ? 'Bölməyə qayıt' : missing.length ? 'Qalan tapşırıqları tamamla' : 'Nəticəni saxla' : card.kind === 'intro' ? 'Dərsə başla' : task && !locked ? 'Yoxla' : 'Davam et'} onPress={() => isResult ? done ? exit() : missing.length ? retryMissing() : void finish() : !task || locked ? advance() : check()} /> : null}
      {task && !cloudPending && feedback?.status === 'unknown' && (answer.trim() || recordedReply) ? <Pressable accessibilityRole="button" style={s.technicalButton} onPress={continueUnverified}><Text style={s.helpLink}>Yoxlanmadı ilə davam et</Text></Pressable> : null}
      {task && !locked && !keyboard && !(light && card.kind === 'voice') && (card.kind === 'voice' || help || textPrompt) ? <Pressable accessibilityRole="button" disabled={capturing} onPress={skip}><Text style={s.skip}>{card.kind === 'voice' ? !packet.version && packet.order < 7 ? 'Səsli məşqi keç' : 'İndi danışa bilmirəm' : 'Sonra qayıt'}</Text></Pressable> : null}
      </>}
    </View>
    <VocabularyMeaningPanel entry={selectedMeaning} onClose={() => { setSelectedMeaning(null); sequence.current += 1; clearWatchdog(); void Speech.stop(); setPlaying(false); }} onSpeak={text => void speak(text)} />
    <LessonExitDialog visible={exitOpen} onContinue={() => setExitOpen(false)} onExit={leave} busy={busy} preservesDraft={Boolean(packet.version)} />
  </KeyboardAvoidingView>;
}
const baseStyles = StyleSheet.create({
  savedVocabulary: { color: '#79578C', fontSize: 12, lineHeight: 18, textAlign: 'center', paddingVertical: 3 }, voiceSkip: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }, voiceContent: { gap: 8, paddingBottom: 8 }, voiceBody: { gap: 10 },
  viewport: { flex: 1, minHeight: 0 }, taskBody: { gap: 7 }, spokenAnswer: { flexDirection: 'row', gap: 9, padding: 12, borderRadius: 16, backgroundColor: '#211F39' }, keyboardAudio: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 3 }, screen: { flex: 1, backgroundColor: ink.bg }, flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 16, paddingTop: 6, paddingBottom: 8, flexShrink: 0 }, backButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#18172F', borderWidth: 1, borderColor: ink.border, alignItems: 'center', justifyContent: 'center' },
  pageTitle: { color: ink.text, fontSize: 24, lineHeight: 30, fontWeight: '800', paddingHorizontal: 20, marginBottom: 13 }, postAnswerExplanation: { marginHorizontal: 20, padding: 14, borderRadius: 17, backgroundColor: '#201C38', borderWidth: 1, borderColor: '#685086' }, energy: { paddingRight: 5 }, kicker: { color: ink.muted, fontSize: 9, letterSpacing: 1.3, marginBottom: 5 }, heading: { color: ink.text, fontSize: 16, lineHeight: 21, fontWeight: '700' },
  progressRow: { marginHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 9, flexShrink: 0 }, progress: { flex: 1, height: 6, borderRadius: 6, backgroundColor: '#282342', overflow: 'hidden' }, fill: { height: '100%', backgroundColor: ink.orange, borderRadius: 6 }, count: { color: ink.orange, fontSize: 11, fontWeight: '700' },
  transcript: { color: ink.text, fontSize: 17, lineHeight: 24, paddingVertical: 6 },
  content: { paddingHorizontal: 16, paddingBottom: 8, gap: 7 }, badge: { alignSelf: 'flex-start', borderRadius: 18, backgroundColor: '#23203F', paddingVertical: 6, paddingHorizontal: 12 }, badgeText: { color: ink.violet, fontSize: 9, letterSpacing: 1, fontWeight: '800' },
  body: { color: ink.text, fontSize: 15, lineHeight: 22 }, note: { color: ink.muted, fontSize: 12, lineHeight: 18 }, small: { color: ink.muted, fontSize: 10, lineHeight: 16 }, cardTitle: { color: ink.text, fontSize: 16, lineHeight: 24, fontWeight: '700' },
  scenario: { flexDirection: 'row', gap: 12 }, ruleLine: { width: 2, backgroundColor: ink.orange, borderRadius: 2 }, help: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', gap: 5, minHeight: 36, paddingHorizontal: 4 }, helpLink: { color: '#C8B3FF', fontSize: 14, lineHeight: 21, fontWeight: '600', paddingVertical: 6 },
  exampleList: { gap: 8 }, example: { flexDirection: 'row', gap: 12, alignItems: 'center', borderRadius: 16, borderWidth: 1, borderColor: ink.border, backgroundColor: ink.card, padding: 13 }, exampleText: { flex: 1, color: ink.text, fontWeight: '600', fontSize: 15 },
  audio: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 20, borderWidth: 1, borderColor: '#474068', padding: 12, backgroundColor: '#181A34' }, play: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22, backgroundColor: ink.orange }, speeds: { flexDirection: 'row', gap: 8 }, speed: { flex: 1, minHeight: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: ink.border, borderRadius: 14, backgroundColor: ink.card }, activeSpeed: { borderColor: ink.orange, backgroundColor: '#322330' }, speedText: { color: ink.muted, fontSize: 11, fontWeight: '700' },
  options: { gap: 9 }, option: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 54, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: '#413A62', backgroundColor: ink.card }, selected: { borderColor: ink.orange, backgroundColor: '#2B2334' }, correctOption: { borderColor: ink.mint, backgroundColor: '#143535' },
  inputFrame: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1.5, borderColor: '#A297ED', backgroundColor: '#22213F', shadowColor: '#8D77ED', shadowOffset: { width: 0, height: 2 }, shadowOpacity: .15, shadowRadius: 10 }, input: { flex: 1, paddingVertical: 16, minHeight: 62, maxHeight: 100, fontSize: 16, lineHeight: 23, color: ink.text },
  words: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, answerTray: { minHeight: 64, flexDirection: 'row', flexWrap: 'wrap', gap: 7, padding: 12, borderWidth: 1, borderColor: '#8274B7', borderRadius: 18, backgroundColor: '#1B1B35' }, word: { backgroundColor: '#282440', borderWidth: 1, borderColor: ink.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  footer: { flexShrink: 0, paddingHorizontal: 20, paddingTop: 10, backgroundColor: ink.bg, gap: 8, borderTopWidth: 1, borderTopColor: '#1D1C35' }, skip: { color: '#C8B3FF', textAlign: 'center', fontSize: 15, fontWeight: '600', minHeight: 44, paddingVertical: 12 }, technicalButton: { minHeight: 44, justifyContent: 'center' }, feedback: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, borderWidth: 1, borderColor: '#85613A', backgroundColor: '#282133', gap: 3 }, correctFeedback: { borderColor: '#4CAB9B', backgroundColor: '#12302F' }, feedbackTitle: { flexDirection: 'row', gap: 9, alignItems: 'center' }, feedbackText: { flex: 1, fontSize: 14, lineHeight: 20, fontWeight: '700' }, error: { color: '#FFB5A7', fontSize: 12, lineHeight: 18 },
  voiceHeading: { alignItems: 'center', gap: 8, paddingVertical: 14 }, resultHero: { alignItems: 'center', paddingVertical: 8, gap: 8 }, resultSeal: { width: 54, height: 54, borderRadius: 27, borderWidth: 1, borderColor: ink.mint, backgroundColor: '#173235', alignItems: 'center', justifyContent: 'center' }, resultHeading: { color: ink.text, fontSize: 22, lineHeight: 29, fontWeight: '800', textAlign: 'center' }, stats: { flexDirection: 'row', gap: 9 }, stat: { flex: 1, backgroundColor: ink.card, borderWidth: 1, borderColor: ink.border, borderRadius: 18, padding: 12, alignItems: 'center', gap: 5 }, statNumber: { fontSize: 22, fontWeight: '800' }, detailButton: { alignItems: 'center', padding: 10 }, link: { color: ink.violet, fontSize: 13, fontWeight: '700' }, resultRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: ink.border, gap: 5 },
});
