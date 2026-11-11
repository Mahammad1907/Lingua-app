import FixedLessonViewport from './FixedLessonViewport';
import LessonExplanationCard from './LessonExplanationSheet';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View, Pressable, useWindowDimensions, BackHandler, AppState } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getLessonById } from '../../data/lessons';
import { b1Packet, packetFlow } from '../../data/b1Course';
import type { PacketCard, PacketLesson as Content, PacketRule } from '../../data/b1PacketTypes';
import { useUserStore } from '../../store/userStore';
import { useVocabularyStore } from '../../store/vocabularyStore';
import { assessPacketAnswer, type PacketVerdict } from '../../utils/packetAnswer';
import LessonProgressBar from './ApprovedLessonProgressBar';
import AudioTranscript from './AudioTranscript';
import WrongAnswerBorder from './WrongAnswerBorder';
import { feedbackCopy } from '../../utils/lessonFeedbackCopy';
import LessonResult from './LessonResult';
import LessonTeaching from './LessonTeaching';
import TwoMessageInput from './TwoMessageInput';
import ObjectWordCard, { isReadyObjectWord } from './ObjectWordCard';
import { objectImage, contentScene } from '../../utils/lessonContentAssets';
import { assessMessages, messageValues, retainedMessages, messageAnswerText, type MessageResults } from '../../utils/messageTask';
import ApprovedLessonScene from './ApprovedLessonScene';
import { buildApprovedScenePlan } from '../../utils/approvedLessonScenes';
import { preparedAudioSource } from '../../data/preparedLessonAudio';
import { playPreparedAudio } from '../../utils/preparedAudioPlayback';
import HoldVoiceInput from './HoldVoiceInput';
import LessonAudioWave from './LessonAudioWave';
import LessonMascot from './LessonMascot';
import LessonSheet from './LessonSheet';
import LessonHelpSheet from './LessonHelpSheet';
import LessonReportSheet, { ReportAction } from './LessonReportSheet';
import LessonFeedback from './LessonFeedback';
import { useLessonSpeed } from '../../hooks/useLessonSpeed';
import type { SpokenAnswer, UnverifiedRecording } from '../../utils/speechTurn';
import { LessonButton, LessonIcon, SelectionMark, ink } from './ApprovedLessonSurface';
import { lessonHint } from '../../utils/lessonGuide';
import LessonWelcome from './LessonWelcome';
import LessonExitDialog from './LessonExitDialog';
import WrittenAnswerInput from './WrittenAnswerInput';
import { LessonVocabularyProvider } from './LessonVocabularyText';
import { summarizeEvidence, type TaskEvidence } from '../../utils/lessonEvidence';
import { lessonRecall, withLessonRecall } from '../../utils/lessonReview';
import { vocabularyKey } from '../../utils/vocabularyIdentity';
import { introducedVocabulary } from '../../utils/lessonVocabulary';
import { type LessonMotion } from './LessonTextMotion';


import { loadLessonCheckpoint, saveLessonCheckpoint, clearLessonCheckpoint, type PacketOutcome as Outcome } from '../../utils/lessonCheckpoint';
const labels = { independent: 'Müstəqil', assisted: 'Köməklə', wrong: 'Yenidən məşq lazımdır', unverified: 'Yoxlanmadı' };

export default function PacketLesson({ packet }: { packet: Content }) {
  return <LessonVocabularyProvider><PacketLessonBody packet={packet} /></LessonVocabularyProvider>;
}
function PacketLessonBody({ packet }: { packet: Content }) {
  const router = useRouter(); const insets = useSafeAreaInsets();
  const metadata = getLessonById(packet.id);
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
  const [helpOpen, setHelpOpen] = useState(false), [menuOpen, setMenuOpen] = useState(false), [reportOpen, setReportOpen] = useState(false), [feedbackOpen, setFeedbackOpen] = useState(false), [reportSerial, setReportSerial] = useState(0);
  const [exampleShown, setExampleShown] = useState(false), [voiceRetry, setVoiceRetry] = useState(0);
  const [vocabularyError, setVocabularyError] = useState('');
  const [checkpointError, setCheckpointError] = useState(''), [boot, setBoot] = useState(0);
  const savedAttempt = useUserStore(state => state.attempts[attempt]);
  useEffect(() => { const timer = setTimeout(() => setFeedbackOpen(Boolean(feedback)), 0); return () => clearTimeout(timer); }, [feedback]);
  const [help, setHelp] = useState(false); const [heard, setHeard] = useState(false);
  const [technicalText, setTechnicalText] = useState(false);
  const [transcriptShown, setTranscriptShown] = useState(false);
  const [transcriptVisible, setTranscriptVisible] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [recordedReply, setRecordedReply] = useState<UnverifiedRecording | null>(null);
  const [capturing, setCapturing] = useState(false);
  const voiceBusyChange = useCallback((busy: boolean) => {
    setCapturing(busy);
    if (busy) {
      setRecordedReply(null); setFeedback(null);
    }
  }, [setCapturing, setRecordedReply, setFeedback]);
  const [soundError, setSoundError] = useState(''); const [receipt, setReceipt] = useState('');
  const [completionError, setCompletionError] = useState(''); const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed] = useLessonSpeed();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const { height, fontScale } = useWindowDimensions();
  useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setKeyboard(true));
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKeyboard(false));
    return () => { show.remove(); hide.remove(); };
  }, []);
  const preparedStop = useRef<(() => void) | null>(null);
  const stopPlayback = useCallback(() => { preparedStop.current?.(); preparedStop.current = null; void Speech.stop(); }, []);
  const sequence = useRef(0); const starting = useRef('');
  const watchdog = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const backAction = useRef(() => {}); const moving = useRef(false);
  const finishing = useRef(false); const responseLocked = useRef(false); const judged = useRef(new Set<string>());
  const original = reviewing ? queue[0] : flow[index];
  const card = reviewing && original?.review ? original.review : original;
  const turn = card?.turns?.[0]; const rule: PacketRule | undefined = turn?.rule || card?.rule;
  const audio = turn?.audio || card?.audio;
  const retained = reviewing && card?.messages ? retainedMessages(card, outcomes[original.id]?.fields) : {};
  const messages = { ...retained, ...messageValues(answer) };
  const printableAnswer = card?.messages ? messageAnswerText(card, messages) : answer;
  const selectedScenes = reviewing ? [] : buildApprovedScenePlan(flow)[index] || [];
  const textPrompt = technicalText || transcriptShown;
  const promptReady = heard || textPrompt;
  const voiceLayout = Boolean(voiceOpen || card?.kind === 'voice' && promptReady);
  useEffect(() => { if (voiceLayout) { Keyboard.dismiss(); } }, [voiceLayout]);
  useEffect(() => { moving.current = false; }, [index, reviewing, original?.id]);
  const clearWatchdog = () => { if (watchdog.current !== undefined) clearTimeout(watchdog.current); watchdog.current = undefined; };
  const task = card?.kind === 'task' || card?.kind === 'voice';
  useEffect(() => {
    let active = true;
    const restore = async () => {
      try {
        const saved = await loadLessonCheckpoint(packet.id, flow.map(c => c.id));
        if (!active) return;
        if (saved) {
          starting.current = saved.attempt.id;
          useUserStore.setState(state => ({ attempts: { ...state.attempts, [saved.attempt.id]: saved.attempt } }));
          setIndex(saved.index); setAnswer(saved.answer); setBuilt(saved.built);
          const restoredFeedback = saved.feedback?.status === 'unknown' && !saved.answer ? null : saved.feedback;
          setFeedback(restoredFeedback); responseLocked.current = Boolean(restoredFeedback && restoredFeedback.status !== 'unknown');
          setQueue(saved.queue.map(q => flow.find(c => c.id === q.id)!).filter(Boolean)); setReviewing(saved.reviewing); setReviewTotal(saved.reviewTotal); setOutcomes(saved.outcomes);
          setHelp(saved.help); setHeard(saved.heard); setTechnicalText(saved.technicalText); setTranscriptShown(saved.transcriptShown); setTranscriptVisible(saved.transcriptVisible);
        } else if (!starting.current) starting.current = useUserStore.getState().beginLesson(packet.id, 'session', recall ? [recall.id] : []);
        setCheckpointError(''); setAttempt(starting.current);
      } catch { if (active) setCheckpointError('Dərsin yaddaşı oxunmadı. Yenidən cəhd et.'); }
    };
    void restore(); return () => { active = false; };
  }, [packet.id, recall, flow, boot]);
  useEffect(() => {
    if (!attempt || !savedAttempt) return;
    const save = done ? clearLessonCheckpoint(packet.id) : saveLessonCheckpoint({ version: 1, lessonId: packet.id, flowIds: flow.map(c => c.id), attempt: savedAttempt, index, answer, built, feedback, queue, reviewing, reviewTotal, outcomes, help, heard, technicalText, transcriptShown, transcriptVisible });
    void save.then(() => setCheckpointError(''), () => setCheckpointError('Cari irəliləyiş saxlanmadı. Dərsdən çıxmazdan əvvəl yenidən cəhd et.'));
  }, [attempt, savedAttempt, packet.id, flow, index, answer, built, feedback, queue, reviewing, reviewTotal, outcomes, help, heard, technicalText, transcriptShown, transcriptVisible, done]);

  useFocusEffect(useCallback(() => () => { sequence.current += 1; if (watchdog.current !== undefined) clearTimeout(watchdog.current); setPlaying(false); stopPlayback(); }, [stopPlayback, setPlaying]));
  useEffect(() => {
    if (attempt && turn?.sample) useUserStore.getState().useHelp(attempt);
  }, [attempt, turn?.id, turn?.sample]);
  useFocusEffect(useCallback(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => { backAction.current(); return true; });
    return () => subscription.remove();
  }, []));
  const revealTextPrompt = () => {
    if (transcriptVisible) { setTranscriptVisible(false); return; }
    sequence.current += 1; clearWatchdog(); stopPlayback(); setPlaying(false);
    setTranscriptShown(true); setTranscriptVisible(true); setSoundError(''); useUserStore.getState().useHelp(attempt);
  };
  const speak = async (text: string, rate = 0.75, listenTask = false) => {
    const request = ++sequence.current; clearWatchdog(); setSoundError('');
    const failed = () => {
      if (request !== sequence.current) return;
      sequence.current += 1; clearWatchdog(); stopPlayback(); setPlaying(false);
      setSoundError('Səs açılmadı. Bu, dil səhvi deyil. Yenidən dinlə və ya mətnlə davam et.');
      if (listenTask) { setTechnicalText(true); setTranscriptVisible(true); }
    };
    // Missing native callbacks must not leave a learner locked indefinitely.
    watchdog.current = setTimeout(failed, Math.max(10000, Math.min(60000, text.length * 160 / rate + 5000)));
    try {
      stopPlayback(); await Speech.stop(); if (request !== sequence.current) return;
      setPlaying(true);
      const prepared = preparedAudioSource(text);
      if (prepared !== undefined) {
        preparedStop.current = playPreparedAudio(prepared, rate / .75, () => { if (request === sequence.current) { clearWatchdog(); setPlaying(false); if (listenTask) setHeard(true); } }, failed);
        return;
      }
      Speech.speak(text, { language: 'en-GB', rate,
        onDone: () => { if (request === sequence.current) { clearWatchdog(); setPlaying(false); if (listenTask) setHeard(true); } },
        onStopped: () => { if (request === sequence.current) { clearWatchdog(); setPlaying(false); } },
        onError: failed,
      });
    } catch { failed(); }
  };
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state !== 'active') { sequence.current++; if (watchdog.current !== undefined) clearTimeout(watchdog.current); stopPlayback(); setPlaying(false); }
    });
    return () => subscription.remove();
  }, [stopPlayback]);
  useEffect(() => () => { if (feedbackTimer.current !== undefined) clearTimeout(feedbackTimer.current); }, []);
  const reset = () => {
    if (feedbackTimer.current !== undefined) clearTimeout(feedbackTimer.current);
    responseLocked.current = false; setContinueReady(true); feedbackBlocked.current = false;
    sequence.current += 1; clearWatchdog(); stopPlayback(); Keyboard.dismiss();
    setPlaying(false); setExampleShown(false); setDetailsOpen(false); setFeedbackOpen(false); setHelpOpen(false);
    setAnswer(''); setBuilt([]); setFeedback(null); setHelp(false); setHeard(false); setTechnicalText(false); setTranscriptShown(false); setTranscriptVisible(false); setVoiceOpen(false); setRecordedReply(null); setSoundError('');
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
  const record = (value: string, verdict: PacketVerdict, token: string, spoken: boolean, fields?: MessageResults) => {
    if (!card || responseLocked.current || judged.current.has(token)) return;
    responseLocked.current = true; judged.current.add(token);
    feedbackBlocked.current = true; setContinueReady(false);
    if (feedbackTimer.current !== undefined) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => { feedbackBlocked.current = false; setContinueReady(true); }, 650);
    const correct = verdict.status === 'correct';
    const prior = outcomes[card.id];
    const assisted = Boolean(reviewing || help || transcriptShown || turn?.sample || prior?.status === 'wrong');
    const evidence: TaskEvidence = { input: spoken ? 'spoken' : 'written', assisted, listening: Boolean(audio && heard && !textPrompt), technicalText: Boolean(audio && technicalText), transcriptShown: Boolean(audio && transcriptShown) };
    useUserStore.getState().recordTask(attempt, card.id, correct, token, evidence);
    setOutcomes((all) => ({ ...all, [card.id]: { answer: value, spoken, evidence, fields, voiceRetryUsed: prior?.voiceRetryUsed, reason: verdict.message, status: correct ? assisted ? 'assisted' : 'independent' : 'wrong' } }));
    if (correct) { setRecordedReply(null); Keyboard.dismiss(); setFeedback(verdict); if (turn?.reply) void speak(turn.reply); }
    else if (!reviewing) {
      const pending = queue.some((c) => c.id === card.id) ? queue : [...queue, card];
      setQueue(pending); setFeedback(verdict); Keyboard.dismiss();
    } else { useUserStore.getState().settlePacketTask(attempt, card.id, 'needsPractice'); setFeedback(verdict); }
  };
  const check = () => {
    if (responseLocked.current || !card || feedback || audio && !promptReady) return;
    if (card.messages) {
      if (card.messages.some(field => !messages[field.id]?.trim())) return;
      const result = assessMessages(card, messages);
      if (result.verdict.status === 'unknown') { setFeedback(result.verdict); return; }
      record(messageAnswerText(card, messages), result.verdict, `${card.id}:messages:${++submission.current}`, false, result.fields); return;
    }
    if (!rule || !answer.trim() && !built.length) return;
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
    useUserStore.getState().settlePacketTask(attempt, card.id, 'skipped');
    advance();
  };
  const continueUnverified = () => {
    if (!card || !answer.trim() && !recordedReply || feedback?.status !== 'unknown') return;
    const evidence: TaskEvidence = { input: card.kind === 'voice' || recordedReply ? 'spoken' : 'written', assisted: help || transcriptShown || Boolean(turn?.sample), listening: false, technicalText: Boolean(audio && technicalText), transcriptShown: Boolean(audio && transcriptShown) };
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
  const leave = async () => {
    if (busy) return;
    setBusy(true);
    sequence.current += 1; clearWatchdog(); stopPlayback(); Keyboard.dismiss();
    try {
      if (done) await clearLessonCheckpoint(packet.id);
      else if (savedAttempt) await saveLessonCheckpoint({ version: 1, lessonId: packet.id, flowIds: flow.map(c => c.id), attempt: savedAttempt, index, answer, built, feedback, queue, reviewing, reviewTotal, outcomes, help, heard, technicalText, transcriptShown, transcriptVisible });
      setExitOpen(false); router.replace({ pathname: '/module/[id]', params: { id: metadata?.moduleId || 'module_1' } });
    } catch { setCheckpointError('Cari irəliləyiş saxlanmadı. Yenidən cəhd et.'); }
    finally { setBusy(false); }
  };

  const exit = () => {
    if (busy || capturing) return;
    if (done || !attempt) leave();
    else { Keyboard.dismiss(); sequence.current += 1; clearWatchdog(); stopPlayback(); setPlaying(false); setExitOpen(true); }
  };
  useEffect(() => { backAction.current = exit; });
  const missing = (useUserStore.getState().attempts[attempt]?.expected ?? []).filter(id => !useUserStore.getState().attempts[attempt]?.tasks[id]?.resolved && !useUserStore.getState().attempts[attempt]?.tasks[id]?.settled);
  const retryMissing = () => {
    const pending = flow.filter(c => missing.includes(c.id));
    if (!pending.length) return;
    judged.current.clear(); reset(); setReviewTotal(pending.length); setQueue(pending); setReviewing(true); setCompletionError(''); finishing.current = false;
  };
  const saveTaughtWords = useCallback(async () => {
    if (!card) return;
    const words = introducedVocabulary(card, packet);
    if (!words.length) return;
    try { await useVocabularyStore.getState().addTaughtWords(packet.id, words, packet.vocabulary.map((entry, index) => ({ ...entry, id: `${packet.id}_v${index + 1}` }))); setVocabularyError(''); }
    catch { setVocabularyError('Yeni sözlər lüğətə saxlanmadı. Yenidən cəhd et.'); }
  }, [card, packet]);
  useEffect(() => { const timer = setTimeout(() => void saveTaughtWords(), 0); return () => clearTimeout(timer); }, [saveTaughtWords]);
  if (!card || !attempt) return <View style={[s.screen, { padding: 24 }]}><Text style={s.body}>{checkpointError || 'Dərs hazırlanır…'}</Text>{checkpointError ? <LessonButton label="Yenidən cəhd et" onPress={() => setBoot(v => v + 1)} /> : null}<TouchableOpacity onPress={() => router.back()}><Text style={s.link}>Geri</Text></TouchableOpacity></View>;
  const isResult = card.kind === 'result';
  const isIntro = card.kind === 'intro';
  const correct = feedback?.status === 'correct';
  const answerMotion: LessonMotion = !feedback || feedback.status === 'unknown' ? 'idle' :
    correct ? outcomes[card.id]?.status === 'assisted' ? 'assisted' : 'correct' : 'incorrect';
  const locked = Boolean(feedback && feedback.status !== 'unknown');
  const hint = card.messageHint || lessonHint(card);
  const disabled = busy || capturing || Boolean(locked && !continueReady) || Boolean(task && !locked && (card.kind === 'voice' || audio && !promptReady || (card.messages ? card.messages.some(field => !messages[field.id]?.trim()) : !answer.trim() && !built.length)));
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
    if (textPrompt && audio && verdict.status !== 'correct') { setAnswer(spoken.text); setFeedback({ ...verdict, status: 'unknown', message: 'Mətnlə məşq edirsən. Yenidən cəhd edə və ya yoxlanmadan davam edə bilərsən.' }); return 'Yenidən danışa və ya yoxlanmadan davam edə bilərsən.'; }
    if (verdict.status === 'unknown') { setAnswer(spoken.text); setFeedback({ ...verdict, message: 'Səsli cavabın dəqiq qiymətləndirilmədi. Yenidən cəhd edə və ya yoxlanmamış kimi davam edə bilərsən.' }); return 'Səsli cavab dəqiq tanınmadı. Yenidən danışa bilərsən.'; }
    setAnswer(spoken.text); record(spoken.text, verdict, `${card.id}:${spoken.token}`, !spoken.edited);
    return null;
  };
  const receiveUnverifiedRecording = (recording: UnverifiedRecording) => {
    if (responseLocked.current || locked || audio && !promptReady) return;
    setRecordedReply(recording);
    setFeedback({ status: 'unknown', criteria: [], message: 'Səsin yazıldı, amma yoxlanmadı. Yenidən danışa və ya yoxlanmadan davam edə bilərsən.' });
  };

  const evidenceSummary = summarizeEvidence(Object.values(outcomes).map(o => ({ resolved: o.status === 'independent' || o.status === 'assisted', evidence: o.evidence })));
  const summary = Object.values(outcomes).reduce((totals, item) => ({ ...totals, [item.status]: totals[item.status] + 1 }), { independent: 0, assisted: 0, wrong: 0, unverified: 0 });
  const exampleEntry = packet.vocabulary.find(v => vocabularyKey(v.word) === vocabularyKey(audio || rule?.answers[0] || ''));
  const authoredExample = exampleEntry?.example ? `${exampleEntry.example}${exampleEntry.exampleAz ? ` — ${exampleEntry.exampleAz}` : ''}` : feedbackCopy(card, answer).example;
  const objectEntry = card.objectWord && objectImage(card.objectWord.image) ? { ...card.objectWord, image: objectImage(card.objectWord.image)! } : undefined;
  const readyObject = objectEntry && isReadyObjectWord(objectEntry) ? objectEntry : undefined;
  const title = card.messages ? 'İki mesaj yaz' : card.kind === 'teach' ? 'Öyrən' : card.kind === 'voice' ? 'Səslə cavab ver' : audio ? card.options ? 'Dinlə və seç' : 'Dinlə və yaz' : card.options ? 'Cavabı seç' : card.words ? 'Cümlə qur' : rule?.goals?.length === 1 && rule.goals[0] === 'greet' ? 'Qısa salam yaz' : rule?.goals?.length === 1 && rule.goals[0] === 'farewell' ? 'Sağollaşma yaz' : 'Cavabını yaz';
  const continueAnswer = () => feedback?.status === 'unknown' ? continueUnverified() : advance();
  const primaryAction = () => isResult ? done ? leave() : missing.length ? retryMissing() : void finish() : !task || locked ? advance() : check();
  const primaryLabel = isResult ? done ? 'Bölməyə qayıt' : missing.length ? 'Qalan tapşırıqları tamamla' : 'Nəticəni saxla' : isIntro ? 'Dərsə başla' : task && !locked ? 'Yoxla' : 'Davam et';
  return <KeyboardAvoidingView style={[s.screen, { paddingTop: insets.top }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <LinearGradient pointerEvents="none" colors={['#F5EEFF', '#EFE3FC', '#F6F0FF']} style={StyleSheet.absoluteFill} />
    <StatusBar style="dark" />
    <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
    <View style={s.header}>
      <Pressable accessibilityRole="button" accessibilityLabel="Dərsdən geri çıx" onPress={exit} style={s.round}><LessonIcon name="back" color={ink.text} /></Pressable>
      <Text style={s.lessonName}>Dərs {packet.order}</Text><View style={{ width: 1, height: 25, backgroundColor: ink.violet }} />
      <LessonProgressBar value={isResult ? missing.length ? .99 : 1 : reviewing ? .9 + .09 * (1 - queue.length / Math.max(1, reviewTotal)) : .9 * index / Math.max(1, flow.length - 1)} />
      <Pressable accessibilityRole="button" accessibilityLabel="Dərs menyusu" disabled={capturing} onPress={() => setMenuOpen(true)} style={s.menu}><Text style={s.dots}>⋮</Text></Pressable>
    </View>
    <FixedLessonViewport fill={Boolean(card.options && !keyboard)} testID="packet-lesson-viewport" onHeight={setViewportHeight} contentContainerStyle={s.content}>
      {isIntro ? <LessonWelcome packet={packet} compact={height < 850 || fontScale > 1.15} sceneHeight={Math.max(110, Math.min(180, viewportHeight * .29))} /> : isResult ? <>
        <LessonResult title={packet.title} goal={metadata?.canDo || packet.goal} done={done} missing={missing.length} summary={summary} evidence={evidenceSummary} receipt={receipt} error={completionError} onDetails={() => setDetailsOpen(true)} />
      </> : <>
        {reviewing ? <Text style={s.review}>↻ Təkrar</Text> : null}
        {card.kind !== 'teach' ? <Text accessibilityRole="header" style={s.title}>{title}</Text> : null}
        {card.kind === 'teach' ? readyObject ? <ObjectWordCard entry={readyObject} onSpeak={text => void speak(text)} onPractice={() => { if (!vocabularyError) advance(); }} /> : <LessonTeaching key={card.id} card={card} packet={packet} onSpeak={text => void speak(text)} scenes={selectedScenes} artworkHeight={keyboard || fontScale > 1.35 ? 0 : Math.max(85, Math.min(145, viewportHeight * .24))} /> : <>
          <Text style={s.instruction}>{turn?.prompt || card.body}</Text>
          {selectedScenes.length && !keyboard && fontScale <= 1.35 ? <ApprovedLessonScene ids={selectedScenes} height={Math.max(95, Math.min(145, viewportHeight * .25))} /> : null}
          {audio ? <View style={s.audio}>
            {card.kind === 'voice' ? <LessonMascot height={60} pose="listening" style={{ width: 44 }} /> : null}
            <Pressable accessibilityRole="button" accessibilityLabel={playing ? 'Səsi dayandır' : 'Səsi dinlə'} disabled={capturing} onPress={() => { if (playing) { sequence.current++; clearWatchdog(); stopPlayback(); setPlaying(false); } else void speak(audio, turn?.rate || .75, true); }} style={s.play}><LessonIcon name={playing ? 'pause' : 'play'} color="#FFF" /></Pressable>
            <View style={{ flex: 1 }}><LessonAudioWave playing={playing} /></View>
            <Pressable accessibilityRole="button" accessibilityLabel="Yavaş dinlə" disabled={capturing} onPress={() => void speak(audio, Math.min(.45, turn?.rate || .75), true)} style={s.slow}><LessonIcon name="turtle" size={25} /><Text style={s.small}>Yavaş dinlə</Text></Pressable>
          </View> : null}
          {task ? <Pressable accessibilityRole="button" accessibilityLabel="İpucu" disabled={capturing || locked} onPress={() => setHelpOpen(true)} style={[s.pill, { alignSelf: 'flex-end' }]}><LessonIcon name="hint" size={18} /><Text style={s.link}>İpucu</Text></Pressable> : null}
          {audio && transcriptVisible ? <AudioTranscript text={audio} onHide={() => setTranscriptVisible(false)} /> : null}
          {soundError ? <Text accessibilityLiveRegion="polite" style={s.note}>ⓘ {soundError}</Text> : null}
          {card.kind === 'voice' ? <>
            {turn?.sample && !textPrompt ? <View style={s.example}><Text style={s.note}>Nümunə</Text><Text style={s.expression}>{turn.sample}</Text></View> : null}
            {!audio || promptReady ? locked ? <Text style={s.answer}>{answer}</Text> : <HoldVoiceInput key={`${card.id}:${reviewing}:${voiceRetry}`} onBusyChange={voiceBusyChange} suspended={exitOpen || helpOpen || menuOpen || reportOpen} onFinal={submitSpeech} onUnverifiedRecording={receiveUnverifiedRecording} /> : <Text style={s.note}>Danışmazdan əvvəl səsi dinlə.</Text>}
          </> : card.messages ? <TwoMessageInput fields={card.messages} values={messages} retained={retained} results={locked ? outcomes[card.id]?.fields : undefined} onChange={(id, value) => { if (!responseLocked.current && !retained[id]) { setAnswer(previous => JSON.stringify({ ...retained, ...messageValues(previous), [id]: value })); setFeedback(null); } }} disabled={locked} scenes={card.scenes?.map(contentScene).filter((source): source is NonNullable<typeof source> => Boolean(source))} /> : card.options ? <View style={s.choiceArea}><View style={s.options}>{card.options.map((option, i) => <Pressable key={i} accessibilityRole="radio" accessibilityState={{ selected: answer === option, disabled: locked || Boolean(audio && !promptReady) }} disabled={locked || Boolean(audio && !promptReady)} onPress={() => { if (responseLocked.current) return; setAnswer(option); setFeedback(null); }} style={[s.option, answer === option && s.selected]}><WrongAnswerBorder active={locked && !correct && answer === option} /><SelectionMark selected={answer === option} correct={locked && correct && answer === option} /><Text style={s.optionText}>{option}</Text></Pressable>)}</View></View> : card.words ? <>
            <View style={s.answerTray}><WrongAnswerBorder active={locked && !correct} />{built.length ? built.map((i, pos) => <Pressable key={`${i}:${pos}`} disabled={locked} onPress={() => { setBuilt(v => v.filter((_, j) => j !== pos)); setFeedback(null); }} style={s.word}><Text style={s.body}>{card.words![i]}</Text></Pressable>) : <Text style={s.note}>Sözlərə toxunaraq cümlə qur.</Text>}</View>
            <View style={s.words}>{card.words.map((word, i) => <Pressable key={i} disabled={locked || built.includes(i) || Boolean(audio && !promptReady)} onPress={() => { setBuilt(v => [...v, i]); setFeedback(null); }} style={[s.word, built.includes(i) && { opacity: .4 }]}><Text style={s.body}>{word}</Text></Pressable>)}</View>
          </> : task ? <WrittenAnswerInput allowVoice={false} key={`${card.id}:${reviewing}`} value={answer} onUnverifiedRecording={receiveUnverifiedRecording} onVoiceModeChange={setVoiceOpen} onVoiceFinal={submitSpeech} onChange={v => { if (responseLocked.current) return; setAnswer(v); setFeedback(null); }} disabled={locked || Boolean(audio && !promptReady)} suspended={exitOpen} onBusyChange={setCapturing} onFocus={() => {}} motionState={answerMotion} /> : null}
          {feedback ? <Pressable accessibilityRole="button" onPress={() => setFeedbackOpen(true)} style={s.pill}><Text style={s.link}>Nəticəni göstər</Text></Pressable> : null}
        </>}
      </>}
      {checkpointError ? <Text accessibilityLiveRegion="polite" style={s.error}>{checkpointError}</Text> : null}
      {vocabularyError ? <View><Text style={s.error}>{vocabularyError}</Text><Pressable accessibilityRole="button" onPress={() => void saveTaughtWords()} style={s.pill}><Text style={s.link}>Lüğəti yenidən saxla</Text></Pressable></View> : null}
    </FixedLessonViewport>
    <View style={[s.footer, { paddingBottom: keyboard ? 8 : Math.max(14, insets.bottom) }]}>
      {task && audio && card.kind !== 'voice' && !locked ? <Pressable accessibilityRole="button" disabled={capturing} onPress={() => { setHelpOpen(true); }} style={[s.pill, { alignSelf: 'center' }]}><Text style={s.link}>♬ İndi dinləyə bilmirəm</Text></Pressable> : null}
      {(card.kind !== 'voice' || locked || isResult) && !readyObject ? <LessonButton label={primaryLabel} onPress={primaryAction} disabled={disabled || Boolean(vocabularyError)} tone={locked ? correct ? 'correct' : 'wrong' : 'primary'} /> : null}
      {task && feedback?.status === 'unknown' && (answer.trim() || recordedReply) ? <LessonButton label="Yoxlanmadı ilə davam et" onPress={continueUnverified} /> : null}
      {card.kind === 'voice' && !locked && !keyboard ? <Pressable accessibilityRole="button" disabled={capturing} onPress={skip} style={[s.pill, { alignSelf: 'center' }]}><Text style={s.link}>Keç</Text></Pressable> : null}
    </View>
    <LessonHelpSheet visible={helpOpen} onClose={() => setHelpOpen(false)} hint={hint || (card.kind === 'voice' ? 'Qarşı tərəfin dediyini dinlə və vəziyyətə uyğun qısa cavab ver.' : 'Səsi dinlə və tapşırıqda istənən cavabı seç və ya yaz.')} audio={Boolean(audio)} speaking={card.kind === 'voice'} revealed={help} example={card.messageExample?.join(' / ')} exampleRevealed={exampleShown} onExample={() => { setExampleShown(true); setHelp(true); useUserStore.getState().useHelp(attempt); }} onHint={() => { setHelp(true); useUserStore.getState().useHelp(attempt); }} onText={() => { if (!transcriptVisible) revealTextPrompt(); setHelpOpen(false); }} />
    {feedback ? <LessonFeedback key={`${card.id}:${feedback.status}`} verdict={feedback} explanation={feedback.status === 'unknown' || correct ? feedback.message : card.messages ? feedback.message : feedbackCopy(card, answer).reason} shortRule={card.explanation || hint || feedback.message} example={authoredExample} assisted={outcomes[card.id]?.status === 'assisted'} answer={printableAnswer || built.map(i => card.words![i]).join(' ')} accepted={card.messages ? card.messages.map(field => `${field.label}: ${field.rule.answers.join(' / ')}`) : rule?.answers} needsPractice={reviewing && !correct && locked} open={feedbackOpen && !reportOpen} onClose={() => setFeedbackOpen(false)} onReport={() => { setFeedbackOpen(false); setReportOpen(true); }} onContinue={feedback.status === 'unknown' && !answer.trim() && !recordedReply ? undefined : continueAnswer} disabled={!continueReady} onRetry={card.kind === 'voice' && (feedback.status === 'unknown' || !reviewing && !correct && !outcomes[card.id]?.voiceRetryUsed) ? () => {
      if (!continueReady) return;
      responseLocked.current = false; setFeedback(null); setAnswer(''); setRecordedReply(null); setFeedbackOpen(false); setVoiceRetry(v => v + 1);
      if (outcomes[card.id]) setOutcomes(all => ({ ...all, [card.id]: { ...all[card.id], voiceRetryUsed: true } }));
    } : undefined} /> : null}
    <LessonSheet visible={menuOpen} onClose={() => setMenuOpen(false)} title="Dərs menyusu">{__DEV__ ? <Pressable accessibilityRole="button" onPress={() => { setMenuOpen(false); router.push('./preview'); }} style={s.pill}><Text style={s.link}>Ekran nümunələri</Text></Pressable> : null}<ReportAction onPress={() => { setMenuOpen(false); setReportOpen(true); }} />{audio ? <Pressable accessibilityRole="button" onPress={() => { setMenuOpen(false); setHelpOpen(true); }} style={s.pill}><Text style={s.link}>Səs açılmır</Text></Pressable> : null}<Pressable accessibilityRole="button" onPress={() => { setMenuOpen(false); exit(); }} style={s.pill}><Text style={s.link}>Dərsdən çıx</Text></Pressable></LessonSheet>
    <LessonReportSheet key={`${card.id}:${reportSerial}`} visible={reportOpen} onClose={() => { setReportOpen(false); setReportSerial(v => v + 1); }} context={{ lessonId: packet.id, cardId: card.id, answer: printableAnswer || built.map(i => card.words![i]).join(' '), verdict: feedback?.status }} />
    <LessonExplanationCard visible={detailsOpen} title="Tapşırıqların nəticələri" onClose={() => setDetailsOpen(false)}>{flow.filter(c => c.kind === 'task' || c.kind === 'voice').map(c => <View key={c.id} style={s.resultRow}><Text style={s.body}>{c.turns?.[0]?.prompt || c.title}</Text><Text style={s.note}>{labels[outcomes[c.id]?.status || 'unverified']}{outcomes[c.id]?.evidence?.transcriptShown || outcomes[c.id]?.evidence?.technicalText ? ' · Dinləmə yoxlanmadı' : ''}</Text></View>)}</LessonExplanationCard>
    <LessonExitDialog visible={exitOpen} onContinue={() => setExitOpen(false)} onExit={() => void leave()} busy={busy} error={checkpointError} />
  </KeyboardAvoidingView>;
}
const s = StyleSheet.create({
  instruction: { color: ink.muted, fontSize: 16, lineHeight: 23, fontWeight: '500' }, choiceArea: { flex: 1, justifyContent: 'flex-end', paddingTop: 20 }, menu: { width: 32, minHeight: 44, alignItems: 'center', justifyContent: 'center' }, screen: { flex: 1, backgroundColor: ink.bg }, header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 18, paddingVertical: 10 }, round: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E9DCFA', borderWidth: 1, borderColor: '#D6BDF0', shadowColor: '#804AB6', shadowOffset: { width: 0, height: 2 }, shadowOpacity: .09, shadowRadius: 4 }, dots: { fontSize: 29, color: ink.text }, lessonName: { color: ink.text, fontSize: 17, fontWeight: '800' }, content: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10, gap: 12 }, title: { color: ink.text, fontSize: 28, lineHeight: 34, fontWeight: '800', letterSpacing: -.4 }, body: { color: ink.text, fontSize: 16, lineHeight: 23 }, note: { color: ink.muted, fontSize: 14, lineHeight: 20 }, small: { color: ink.muted, fontSize: 12, lineHeight: 17 }, cardTitle: { color: ink.text, fontSize: 18, fontWeight: '700' }, error: { color: ink.error, fontSize: 13, lineHeight: 19 }, link: { color: ink.violet, fontSize: 14, fontWeight: '600' }, review: { color: ink.violet, alignSelf: 'flex-start', backgroundColor: '#E5D6F8', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 5, fontSize: 12, fontWeight: '700' }, pill: { flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', minHeight: 42, paddingHorizontal: 15, paddingVertical: 7, borderRadius: 22, borderWidth: 1, borderColor: ink.border, backgroundColor: '#EEE2FC', shadowColor: '#7043A0', shadowOffset: { width: 0, height: 2 }, shadowOpacity: .08, shadowRadius: 4 }, teachHero: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#5726B2', borderRadius: 24, padding: 12, gap: 10 }, bubble: { flex: 1, alignItems: 'center', gap: 9, backgroundColor: ink.card, padding: 13, borderRadius: 22 }, expression: { color: ink.violet, fontSize: 25, lineHeight: 31, fontWeight: '800' }, play: { width: 46, height: 46, borderRadius: 23, backgroundColor: ink.violet, alignItems: 'center', justifyContent: 'center' }, example: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 18, padding: 12, backgroundColor: '#EADFf8' }, audio: { flexDirection: 'row', alignItems: 'center', gap: 9, padding: 12, borderWidth: 1, borderColor: ink.border, borderRadius: 22, backgroundColor: '#F7F0FF' }, slow: { alignItems: 'center', borderLeftWidth: 1, borderColor: ink.border, paddingLeft: 9, minWidth: 65 }, options: { gap: 10 }, option: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1, borderColor: ink.border, backgroundColor: ink.card, borderRadius: 18, padding: 14 }, optionText: { color: ink.text, fontSize: 17, lineHeight: 23, fontWeight: '600', flex: 1 }, selected: { borderColor: ink.violet, backgroundColor: '#E9DAFB' }, answer: { borderWidth: 1, borderColor: ink.border, padding: 14, borderRadius: 18, color: ink.text, fontSize: 17 }, answerTray: { minHeight: 60, flexDirection: 'row', flexWrap: 'wrap', gap: 7, padding: 10, borderWidth: 1, borderColor: ink.border, borderRadius: 18 }, words: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, word: { borderWidth: 1, borderColor: ink.border, borderRadius: 13, paddingHorizontal: 12, paddingVertical: 9, backgroundColor: ink.card }, footer: { paddingTop: 10, paddingHorizontal: 20, gap: 9, backgroundColor: 'transparent' }, stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }, stat: { width: '45%', gap: 3 }, statNumber: { color: ink.violet, fontSize: 22, fontWeight: '800' }, resultRow: { borderBottomWidth: 1, borderColor: ink.border, paddingVertical: 12, gap: 5 },
});
