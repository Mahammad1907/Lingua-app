import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import Animated, { Keyframe, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

// New step (25 Nov 2026): a short fade + 8px slide-up. Reanimated skips layout animations under Reduce Motion.
const DimIn = new Keyframe({ 0: { opacity: 0 }, 100: { opacity: 1 } }).duration(220);
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { setAudioModeAsync } from 'expo-audio';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, BackHandler, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { DesignLesson as Lesson, IntroCard, TwoTask, Who } from '../../data/designLessonTypes';
import { useUserStore } from '../../store/userStore';
import { isPass } from '../../utils/examResults';
import { ART_MIN, ArtFit } from './fit';
import { useReviewStore } from '../../store/reviewStore';
import { useVocabularyStore } from '../../store/vocabularyStore';
import {
  gradeChoice, gradeDrag, gradeMatch, gradeProfile, gradeText, gradeTwo, isTask, joinTiles, lessonFlow, lessonTaskIds, resolveLesson, reviewTask, statusLabels, taskStatus,
  type FlowCard, type Graded, type TaskRecord, type TwoGraded,
} from '../../utils/designLesson';
import type { TaskEvidence } from '../../utils/lessonEvidence';
import type { SpokenAnswer, UnverifiedRecording } from '../../utils/speechTurn';
import HoldToTalk from './HoldToTalk';
import { gapVersion } from '../../utils/orderGaps';
import { ChatTimeline } from './ChatTimeline';
import { Avatar, ChatThread, TapText, SoundIcon, CountryMap, FormSheet, GapSentence, ImageSlot, LetterBoard, MatchBoard, PhoneKeypad, PhraseCard, PickedChips, SayBubble, SceneSpots, TeacherView, TileTray, WordView, LearnView, PlayButton } from './TaskScreens';
import Icon, { type IconName } from './Icons';
import { DragBoard, ProfileCard } from './NewTaskScreens';
import { PhotoCard } from './PhotoCard';
import { ordinal } from '../../utils/ordinal';
import { isEnglish, ExplainSheet, MenuPopover, ReportSheet, ResultPanel } from './LessonSheets';
import { AudioPanel, Capsule, accentTitle, Card, Chip, ChoiceOption, Field, Header, KindChip, LessonCaption, MainButton, Sheet, SheetOption, ds, nameSlot } from './parts';
import { d, shadow, font } from './theme';
import { sceneImage } from '../../config/sceneImages';
import { glossOf } from '../../data/unit1/glossary';
import { characterAz } from '../../config/characters';
import { meaningOf, taughtIn } from '../../utils/lessonLookup';
import { getRule, ruleOfTask } from '../../data/rules';
import { useRulesStore } from '../../store/rulesStore';

const mascotFull = require('../../../assets/mascot/hood_full.png');
const mascotHead = require('../../../assets/mascot/hood_head.png');

// iOS refuses to present a sheet while the previous one is still animating closed.
const SHEET_GAP = 650;

type Result = { kind: 'single'; graded: Graded } | { kind: 'two'; graded: TwoGraded } | { kind: 'unverified'; message: string; recording?: boolean; two?: TwoGraded };

const MIN_FIT = 0.78;
/** Pill label → real change of the speech rate (wider than the label so the difference is heard). */
const SPEED_FACTOR: Record<number, number> = { 1: 1, .75: .7, .5: .47, 1.25: 1.24 };
/** Vertical padding of the scroll content (s.content: 6 top + 16 bottom), which is not scaled. */
const CONTENT_PAD = 22;

export default function DesignLesson({ source }: { source: Lesson }) {
  const lesson = useMemo(() => resolveLesson(source), [source]);
  // The opening “Bu dərsdə” screen is not shown in lessons (user, 20 Nov 2026); exams keep theirs (rules, 70 %).
  const flow = useMemo(() => lessonFlow(lesson).filter(c => lesson.exam || c.type !== 'intro'), [lesson]);
  const router = useRouter(); const insets = useSafeAreaInsets(); const { height } = useWindowDimensions();

  const [attempt, setAttempt] = useState('');
  const [index, setIndex] = useState(0);
  // Audio speed: tapping the pill cycles 1x → 0.75x → 0.5x → 1.25x; kept for the whole lesson (23 Nov 2026).
  const [rate, setRate] = useState(1);
  // The chosen speed applies to every play button of the lesson (user, 23 Nov 2026). The real speech rates are
  // spread wider than the labels, because a small change (0.85 → 0.64) is hardly heard, above all on iPhone.
  const rateRef = useRef(1); rateRef.current = rate;
  const nextOf = (r: number) => r === 1 ? .75 : r === .75 ? .5 : r === .5 ? 1.25 : 1;
  const [streak, setStreak] = useState(0);
  const [queue, setQueue] = useState<string[]>([]);
  const [reviewing, setReviewing] = useState(false);
  const [reviewStep, setReviewStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [records, setRecords] = useState<Record<string, TaskRecord>>({});
  const [keepFields, setKeepFields] = useState<Record<string, { fields: TwoGraded['fields']; values: Record<string, string> }>>({});

  // Current answer state.
  const [choice, setChoice] = useState(''); const [text, setText] = useState('');
  const [two, setTwo] = useState<Record<string, string>>({});
  // Chat screens (25 Nov 2026): ↑ “sends” a message before Yoxla. twoSent = sent messages of a two-message chat, twoEdit = the one being typed.
  const [twoSent, setTwoSent] = useState<Record<string, boolean>>({}); const [twoEdit, setTwoEdit] = useState(0); const [chatPosted, setChatPosted] = useState(false);
  const [picked, setPicked] = useState<number[]>([]);
  const [pairs, setPairs] = useState<Record<string, string>>({}); const [activeRow, setActiveRow] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [notice, setNotice] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [hintUsed, setHintUsed] = useState(false); const [sampleShown, setSampleShown] = useState(false);
  // A word whose meaning is open; looking a word up during a task counts as help.
  const [gloss, setGloss] = useState(''); const [peeked, setPeeked] = useState(false);
  const [voiceRetry, setVoiceRetry] = useState(false); const [voiceRetried, setVoiceRetried] = useState(false);
  const [voiceBusy, setVoiceBusy] = useState(false);
  // Audio state.
  const [playing, setPlaying] = useState(false); const [heard, setHeard] = useState(false);
  const [soundError, setSoundError] = useState(false);
  const [textShown, setTextShown] = useState(false); const [textVisible, setTextVisible] = useState(false);
  const [technical, setTechnical] = useState(false);
  // Sheets.
  const [helpOpen, setHelpOpen] = useState(false); const [hintOpen, setHintOpen] = useState(false);
  const [explainOpen, setExplainOpen] = useState(false); const [ruleOpen, setRuleOpen] = useState<string | null>(null); const [reportOpen, setReportOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); const [word, setWord] = useState<string | null>(null);
  const [finish, setFinish] = useState<{ completed: boolean } | null>(null);
  // Fixed lesson screens, the same on iPhone and Android (user, 23 Nov 2026): the card never scrolls. When it is
  // taller than the space between header and footer, the pictures shrink first (ArtFit), then the whole card is
  // scaled down (never below MIN_FIT) while keeping its full width. Only the open keyboard (or extreme system text
  // sizes, below MIN_FIT) may scroll.
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [contentHeight, setContentHeight] = useState(0); const [keyboardOpen, setKeyboardOpen] = useState(false);
  // Keyboard open (25 Nov 2026): nothing shrinks (full size, easy to read); the page scrolls so the answer field sits
  // right above the main button and stays there while the message grows.
  const scrollRef = useRef<ScrollView>(null);
  useEffect(() => {
    if (!keyboardOpen) { scrollRef.current?.scrollTo({ y: 0, animated: true }); return; }
    const id = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 260);
    return () => clearTimeout(id);
  }, [keyboardOpen, contentHeight, viewport.h]);
  const [art, setArt] = useState(1); const [fitState, setFit] = useState(1);
  // Teaching cards start roomy; only if one does not fit do they switch to compact rows, then shrink (25 Nov 2026).
  const [dense, setDense] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setKeyboardOpen(true));
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKeyboardOpen(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  const sequence = useRef(0); const locked = useRef(false); const tokens = useRef(0);
  // Daily review: verdicts go to the review schedule, not to lesson progress (no attempt, XP, hearts or retry round).
  const reviewMode = Boolean(lesson.reviewOf);
  // The first two map lessons of Bölmə 1 show the spoken sample openly (by map number, so parts do not shift it).
  const early = (lesson.unit ?? 1) === 1 && (lesson.number ?? lesson.order) <= 2;
  const verdicts = useRef<Record<string, boolean>>({});
  const recordsRef = useRef<Record<string, TaskRecord>>({}); // for the schedule entry written when the lesson finishes
  const reviewIds = reviewing ? queue : [];
  const current: FlowCard | undefined = showResult ? undefined : reviewing ? reviewTask(lesson, reviewIds[reviewStep]) : flow[index];
  // “Söhbəti sırala” alternates with its word version “Söhbəti tamamla” across the course (user, 25 Nov 2026).
  const gapIds = useMemo(() => new Set(flow.filter(c => c.type === 'match' && c.mode === 'order').map(c => c.id)
    .filter((_, k) => (lesson.order + k) % 2 === 1)), [flow, lesson.order]);
  const task = useMemo(() => {
    const t0 = isTask(current) ? current : undefined;
    return t0 && t0.type === 'match' && t0.mode === 'order' && gapIds.has(t0.id) ? gapVersion(t0) ?? t0 : t0;
  }, [current, gapIds]);
  // A speaker label at the start (“{F}: …”, “Dostun: …”) is never read aloud or shown (user, 25 Nov 2026).
  const rawAudio = task && (task.type === 'choice' || task.type === 'write' || task.type === 'voice' || task.type === 'drag' || task.type === 'profile') ? task.audio : undefined;
  const audio = rawAudio?.replace(/^(?:\{[A-Za-z:]+\}|[^\s:]*[əğıöüşçƏĞİÖÜŞÇ][^\s:]*):\s+/, '');
  const listeningTask = Boolean(audio && task?.type !== 'voice');

  // Each new card starts at full size and only shrinks as far as it must (no back-and-forth).
  const cardKey = `${showResult ? 'result' : reviewing ? `r${reviewStep}` : index}`;
  // Grow (25 Nov 2026, user): a short Yeni söz / Öyrən card is scaled up as a whole (text, buttons, gaps) until it fills
  // the screen — at most 1.25×. Measured on the card's natural height; once set it only goes down (no back-and-forth).
  const [grow, setGrow] = useState(1); const naturalH = useRef(0);
  useEffect(() => { setArt(1); setFit(1); setDense(false); setGrow(1); naturalH.current = 0; }, [cardKey]);
  // When the screen grows back (keyboard closed), measure again from full size — otherwise a card shrunk while the
  // keyboard was closing stayed small (German card, user, 25 Nov 2026).
  const lastViewH = useRef(0);
  useEffect(() => {
    if (viewport.h > lastViewH.current + 2 && lastViewH.current > 0) { setArt(1); setFit(1); setDense(false); setGrow(1); }
    lastViewH.current = viewport.h;
  }, [viewport.h]);
  const shownHeight = (fitValue: number) => (contentHeight - CONTENT_PAD) * fitValue + CONTENT_PAD;
  useEffect(() => {
    if (keyboardOpen || !viewport.h || !contentHeight || shownHeight(fitState) <= viewport.h + 1) return;
    if (art > ART_MIN) { setArt(a => Math.max(ART_MIN, Math.round((a - .15) * 100) / 100)); return; }
    if (!dense && (current?.type === 'word' || current?.type === 'teach')) { setDense(true); return; }
    setFit(f => Math.max(MIN_FIT, Math.min(f, (viewport.h - CONTENT_PAD) / (contentHeight - CONTENT_PAD))));
  }, [contentHeight, viewport.h, keyboardOpen, art, fitState, dense]); // eslint-disable-line react-hooks/exhaustive-deps
  // A picture that was shrunk grows back when the screen has room again (27 Nov 2026: picture stayed small, space below).
  // Only while the card is being fitted (hidden) or after the screen itself grew, so it never jumps on screen.
  useEffect(() => {
    if (keyboardOpen || !viewport.h || !contentHeight || art >= 1 || fitState < 1) return;
    if (viewport.h - shownHeight(1) > 48) setArt(a => Math.min(1, Math.round((a + .15) * 100) / 100));
  }, [contentHeight, viewport.h, keyboardOpen, art, fitState]); // eslint-disable-line react-hooks/exhaustive-deps
  const fit = keyboardOpen ? 1 : fitState;
  // No jump between cards (27 Nov 2026, user: the screen shook on every step): a new card stays invisible while it
  // is measured and shrunk to fit, then fades in once, already at its final size.
  const shown = useSharedValue(0);
  const [settled, setSettled] = useState(false);
  useEffect(() => { setSettled(false); shown.value = 0; const id = setTimeout(() => setSettled(true), 400); return () => clearTimeout(id); }, [cardKey]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (settled || !viewport.h || !contentHeight) return;
    const fits = keyboardOpen || shownHeight(fitState) <= viewport.h + 1 || (fitState <= MIN_FIT && art <= ART_MIN);
    if (fits) { const id = setTimeout(() => setSettled(true), 30); return () => clearTimeout(id); }
  }, [settled, contentHeight, viewport.h, keyboardOpen, art, fitState, dense]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (settled) shown.value = withTiming(1, { duration: 160 }); }, [settled]); // eslint-disable-line react-hooks/exhaustive-deps
  const fadeStyle = useAnimatedStyle(() => ({ opacity: shown.value }));
  const stillOverflows = keyboardOpen || (viewport.h > 0 && shownHeight(fit) > viewport.h + 1 && fit <= MIN_FIT && art <= ART_MIN);
  // The scaled card keeps the full width: it is laid out wider by 1/fit and centred, so it does not look narrow.
  const growable = (current?.type === 'word' || current?.type === 'teach') && !keyboardOpen && fitState === 1 && !dense && !showResult;
  const onNatural = (h: number) => {
    naturalH.current = h;
    if (!growable || !viewport.h || h <= 0) return;
    const room = (viewport.h - CONTENT_PAD) / h;
    setGrow(g => g === 1 ? Math.max(1, Math.min(1.25, room)) : Math.max(1, Math.min(g, room)));
  };
  const scale = fit < 1 ? fit : growable ? grow : 1;
  const innerW = Math.max(0, viewport.w - 40), wideW = innerW / scale;

  useEffect(() => {
    if (attempt || reviewMode) return;
    const id = useUserStore.getState().beginLesson(lesson.id, 'session', [], lessonTaskIds(lesson));
    setAttempt(id);
  }, [attempt, lesson, reviewMode]);

  const stopAudio = useCallback(() => { sequence.current += 1; setPlaying(false); void Speech.stop(); }, []);
  useFocusEffect(useCallback(() => () => stopAudio(), [stopAudio]));

  const speak = useCallback((value: string, rate = 0.85, listening = false) => {
    const request = ++sequence.current; setSoundError(false);
    // Normal-speed buttons follow the speed pill; buttons that are slow on purpose (“Yavaş”) keep their own rate.
    if (rate >= 0.8) rate = rate * (SPEED_FACTOR[rateRef.current] ?? 1);
    const failed = () => { if (request !== sequence.current) return; setPlaying(false); if (listening) setSoundError(true); };
    const watchdog = setTimeout(failed, Math.max(8000, value.length * 200 / rate + 5000));
    // Slow listening: a lower rate alone is barely audible on iOS, so short pauses go between words and letters (15 Nov 2026).
    // Hyphens (letter spellings like M-A-double M-…) get a pause at any speed, so letters are not blurred together.
    const spelled = value.replace(/\[[^\]]*\]/g, ' ').replace(/(\S)-(?=\S)/g, '$1, ');
    const text = rate < 0.5 ? spelled.replace(/\s+/g, ', ').replace(/,\s*,/g, ',') : spelled;
    // The lesson must be heard even with the iPhone's silent switch on (15 Nov 2026).
    void Speech.stop().then(() => setAudioModeAsync({ playsInSilentMode: true }).catch(() => {})).then(() => {
      if (request !== sequence.current) { clearTimeout(watchdog); return; }
      setPlaying(true);
      Speech.speak(text, {
        language: 'en-US', rate,
        onDone: () => { clearTimeout(watchdog); if (request === sequence.current) { setPlaying(false); if (listening) setHeard(true); } },
        onStopped: () => { clearTimeout(watchdog); if (request === sequence.current) setPlaying(false); },
        onError: () => { clearTimeout(watchdog); failed(); },
      });
    }).catch(() => { clearTimeout(watchdog); failed(); });
  }, []);

  // “Sözü tamamla”: after the answer the full sentence is read piece by piece and each piece lights up green
  // (letters one by one in spellings like M-A-double M-…). Nothing is read before the answer (15 Nov 2026).
  const [lit, setLit] = useState<{ card: string; index: number } | null>(null);
  const playPieces = useCallback((card: string, pieces: string[]) => {
    const request = ++sequence.current;
    const step = (i: number) => {
      if (request !== sequence.current) return;
      if (i >= pieces.length) { setLit(null); setPlaying(false); return; }
      setLit({ card, index: i }); setPlaying(true);
      const spoken = pieces[i].replace(/[-.,!?]+$/, '').replace(/…/g, '');
      if (!spoken) { step(i + 1); return; }
      Speech.speak(spoken, { language: 'en-US', rate: 0.85 * (SPEED_FACTOR[rateRef.current] ?? 1), onDone: () => setTimeout(() => step(i + 1), 120), onStopped: () => setLit(null), onError: () => step(i + 1) });
    };
    void Speech.stop().then(() => setAudioModeAsync({ playsInSilentMode: true }).catch(() => {})).then(() => step(0));
  }, []);
  const gapDone = Boolean(task?.type === 'choice' && task.gap && result && result.kind !== 'unverified');
  useEffect(() => {
    if (!gapDone || !task || task.type !== 'choice' || !task.gap) return;
    playPieces(task.id, gapPieces(task.gap.before, task.answer, task.gap.after));
  }, [gapDone]); // eslint-disable-line react-hooks/exhaustive-deps

  // New words go into “Lüğətim” the moment they are first taught (no duplicates).
  useEffect(() => {
    if (current?.type !== 'teach' && current?.type !== 'word') return;
    const words = lesson.vocabulary.filter(v => v.teachCard === current.id).map(v => v.word);
    if (words.length) void useVocabularyStore.getState().addTaughtWords(lesson.id, words).catch(() => {});
  }, [current, lesson]);

  // Two-message retry: the part that was already correct stays filled and locked.
  const reviewKey = reviewing ? reviewIds[reviewStep] : '';
  useEffect(() => {
    const kept = reviewKey ? keepFields[reviewKey] : undefined;
    if (!kept) return;
    const ok = Object.entries(kept.values).filter(([id]) => kept.fields[id]?.status === 'correct');
    setTwo(Object.fromEntries(ok)); setTwoSent(Object.fromEntries(ok.map(([id]) => [id, true])));
  }, [reviewKey, keepFields]);

  const resetCard = () => {
    stopAudio(); Keyboard.dismiss(); locked.current = false;
    setChoice(''); setText(''); setTwo({}); setTwoSent({}); setTwoEdit(0); setChatPosted(false); setPicked([]); setPairs({}); setActiveRow(''); setResult(null); setNotice(''); setCollapsed(false); setHintUsed(false); setVoiceRetry(false); setVoiceRetried(false);
    setHeard(false); setSoundError(false); setTextShown(false); setTextVisible(false); setTechnical(false);
    setHelpOpen(false); setHintOpen(false); setExplainOpen(false); setSampleShown(false); setGloss(''); setPeeked(false);
  };

  const finishLesson = useCallback(async () => {
    if (reviewMode) { setFinish({ completed: true }); return; }
    try {
      const receipt = await useUserStore.getState().finishLesson(attempt);
      if (receipt.completed) {
        await useVocabularyStore.getState().addLessonWords(lesson.id);
        // Every task of a finished lesson enters the 1 / 3 / 7 / 14 day schedule (difficult ones tomorrow, the rest in 3 days).
        if (!lesson.exam) {
          const all = recordsRef.current;
          const tasks: { taskId: string; difficult: boolean; fresh?: boolean }[] = lessonFlow(lesson).filter(isTask).filter(t => t.type !== 'voice').map(t => ({
            taskId: t.id,
            difficult: (t.type === 'two' ? t.fields.map(f => f.id) : [t.id]).some(id => all[id]?.first === 'wrong' || all[id]?.assisted || all[id]?.unverified),
          }));
          // Practice kept out of the lesson (lesson.pool) comes in the review from tomorrow (26 Nov 2026).
          for (const t of lesson.pool ?? []) if (t.type !== 'voice') tasks.push({ taskId: t.id, difficult: false, fresh: true });
          useReviewStore.getState().registerLesson(lesson.id, tasks);
        }
      }
      setFinish({ completed: receipt.completed });
    } catch { setFinish({ completed: false }); }
  }, [attempt, lesson, reviewMode]);

  const next = () => {
    resetCard();
    // Daily review: the verdicts of the card just left are written to the schedule (a card with a wrong part counts as wrong).
    for (const [key, ok] of Object.entries(verdicts.current)) useReviewStore.getState().recordResult(key, ok);
    verdicts.current = {};
    if (!reviewing && !reviewMode) useUserStore.getState().setLessonPartial(lesson.id, (index + 1) / flow.length * 100);
    if (reviewing) {
      if (reviewStep + 1 < queue.length) setReviewStep(v => v + 1);
      else { setReviewing(false); setShowResult(true); void finishLesson(); }
      return;
    }
    if (index + 1 < flow.length) { setIndex(v => v + 1); return; }
    if (queue.length) { setReviewing(true); setReviewStep(0); return; }
    setShowResult(true); void finishLesson();
  };

  const update = (id: string, patch: Partial<TaskRecord>) => setRecords(all => { const next = { ...all, [id]: { ...all[id], ...patch } }; recordsRef.current = next; return next; });
  const enqueue = (id: string) => { if (!reviewing && !lesson.exam && !reviewMode) setQueue(q => q.includes(id) ? q : [...q, id]); };
  const meaningHint = Boolean(hintUsed && task?.hintAssists);

  const evidence = (spoken: boolean): TaskEvidence => ({
    input: spoken ? 'spoken' : 'written',
    assisted: Boolean(reviewing || meaningHint || sampleShown || peeked || (task?.type === 'voice' && task.sample && early)),
    listening: Boolean(listeningTask && heard && !textShown && !technical),
    technicalText: Boolean(listeningTask && technical), transcriptShown: Boolean(listeningTask && textShown && !technical),
  });

  /** Store a confirmed verdict for one task id. */
  const store = (id: string, correct: boolean, spoken: boolean) => {
    setStreak(c => correct ? c + 1 : 0);
    // Qaydalar: the rule this task practises gets weaker or stronger (21 Nov 2026).
    useRulesStore.getState().recordTask(id, correct);
    if (reviewMode) {
      const key = lesson.reviewOf?.[id];
      if (key) verdicts.current[key] = (verdicts.current[key] ?? true) && correct;
      update(id, { first: correct ? 'correct' : 'wrong', assisted: evidence(spoken).assisted });
      return;
    }
    const s = useUserStore.getState();
    if (reviewing) {
      if (correct) s.recordTask(attempt, id, true, `${id}:review:${++tokens.current}`, evidence(spoken));
      else s.settlePacketTask(attempt, id, 'needsPractice');
      update(id, { review: correct ? 'correct' : 'wrong' });
      return;
    }
    s.recordTask(attempt, id, correct, `${id}:${++tokens.current}`, evidence(spoken));
    update(id, { first: correct ? 'correct' : 'wrong', assisted: evidence(spoken).assisted });
    if (!correct) enqueue(task!.id);
  };

  const settleUnverified = (id: string, why: Partial<TaskRecord> = {}) => {
    if (attempt) useUserStore.getState().settlePacketTask(attempt, id, 'unverified');
    if (!reviewing) update(id, { unverified: true, ...why });
  };

  const textHelpActive = listeningTask && (textShown || technical);

  // A light buzz for confirmed verdicts only (never for unverified or technical states).
  // Opening Kömək shows the hint; a meaning hint makes a correct answer “Köməklə”.
  useEffect(() => {
    if (!helpOpen || !task?.hint || hintUsed) return;
    setHintUsed(true);
    if (task.hintAssists) (attempt && useUserStore.getState().useHelp(attempt));
  }, [helpOpen, task, hintUsed, attempt]);

  useEffect(() => {
    if (!result || result.kind === 'unverified') return;
    const status = result.graded.status;
    if (status === 'correct') void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    else if (status === 'wrong') void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
  }, [result]);

  const check = () => {
    if (!task || locked.current || result) return;
    if (task.type === 'two') {
      const graded = gradeTwo(task, two, reviewing ? keepFields[task.id]?.fields : undefined);
      if (graded.status === 'empty') { setNotice(graded.emptyNotice ?? ''); return; }
      if (graded.status === 'unknown') { setResult({ kind: 'unverified', message: lesson.notices.unknown, two: graded }); return; }
      setNotice(''); locked.current = true; Keyboard.dismiss();
      for (const field of task.fields) {
        if (reviewing && keepFields[task.id]?.fields[field.id]?.status === 'correct') continue;
        const status = graded.fields[field.id].status;
        // A part that could not be assessed is never stored as a language mistake.
        if (status === 'unknown') settleUnverified(field.id); else store(field.id, status === 'correct', false);
      }
      if (!reviewing && graded.status === 'wrong') { setKeepFields(k => ({ ...k, [task.id]: { fields: graded.fields, values: two } })); enqueue(task.id); }
      setResult({ kind: 'two', graded });
      return;
    }
    if (task.type === 'match') {
      const graded = gradeMatch(task, pairs);
      if (graded.status === 'empty') { setNotice(task.mode === 'order' ? (task.gaps ? 'Bütün boşluqları doldur.' : 'Bütün balonları yerləşdir.') : task.mode === 'reply' ? 'Hər cümləyə bir cavab qoy.' : 'Hər cümləyə bir məna qoy.'); return; }
      setNotice(''); locked.current = true; store(task.id, graded.status === 'correct', false);
      setResult({ kind: 'single', graded });
      return;
    }
    // Ailə ağacı = choice; Söz sürüklə / Profil kartı keep their answers in `pairs` (person/row id → word).
    const graded = task.type === 'choice' ? gradeChoice(task, choice) : task.type === 'write' ? gradeText(task, text)
      : task.type === 'drag' ? gradeDrag(task, pairs) : task.type === 'profile' ? gradeProfile(task, pairs) : undefined;
    if (graded?.status === 'empty' && (task.type === 'drag' || task.type === 'profile')) { setNotice(task.type === 'drag' ? 'Hər adamın altına bir söz qoy.' : 'Kartın bütün sətirlərini doldur.'); return; }
    if (!graded || graded.status === 'empty') return;
    Keyboard.dismiss();
    // Text help or a sound problem: the answer is practice, never a listening result or a language error.
    if (textHelpActive) {
      locked.current = true; settleUnverified(task.id, { listeningUnverified: true, technical });
      setResult({ kind: 'single', graded: { ...graded, status: graded.status === 'correct' ? 'correct' : 'unknown' } });
      return;
    }
    if (graded.status === 'unknown') { setResult({ kind: 'unverified', message: lesson.notices.unknown }); return; }
    locked.current = true; store(task.id, graded.status === 'correct', false);
    setResult({ kind: 'single', graded });
  };

  const continueUnverified = () => {
    if (!task) return;
    if (task.type === 'two') {
      const parts = result?.kind === 'unverified' ? result.two?.fields : undefined;
      locked.current = true;
      task.fields.forEach(f => {
        if (reviewing && keepFields[task.id]?.fields[f.id]?.status === 'correct') return;
        const status = parts?.[f.id]?.status;
        if (status === 'correct' || status === 'wrong') store(f.id, status === 'correct', false); else settleUnverified(f.id);
      });
    } else settleUnverified(task.id);
    next();
  };

  const cannotListen = () => {
    if (!task) return;
    stopAudio(); settleUnverified(task.id, { listeningUnverified: true });
    next();
  };

  const skipVoice = () => {
    if (!task) return;
    const s = useUserStore.getState();
    if (attempt) { s.recordTask(attempt, task.id, null, `${task.id}:skip`); s.settlePacketTask(attempt, task.id, 'skipped'); }
    if (!reviewing) update(task.id, { unverified: true });
    next();
  };

  const onSpoken = (answer: SpokenAnswer): string | null => {
    if (!task || task.type !== 'voice' || locked.current || (result && result.kind !== 'unverified' && !voiceRetry)) return null;
    const graded = gradeText(task, answer.text, true);
    if (graded.status === 'unknown' || graded.status === 'empty') {
      // A retry that is not recognised keeps the first verdict on screen.
      if (voiceRetry) { setNotice(lesson.notices.voiceUnknown); return null; }
      setResult({ kind: 'unverified', message: lesson.notices.voiceUnknown }); return null;
    }
    locked.current = true;
    if (voiceRetry) {
      // The first verdict stays recorded; the retry is practice and only updates the panel.
      setResult({ kind: 'single', graded }); setVoiceRetry(false); setCollapsed(false);
    } else { store(task.id, graded.status === 'correct', true); setResult({ kind: 'single', graded }); }
    if (graded.status === 'correct' && task.reply) setTimeout(() => speak(task.reply!), 350);
    return null;
  };
  const onRecording = (_recording: UnverifiedRecording) => {
    if (!task || locked.current || (result && result.kind !== 'unverified')) return;
    setResult({ kind: 'unverified', recording: true, message: 'Səsin yazıldı, amma bu cihazda yoxlanmadı. Yenidən danışa və ya yoxlanmadan davam edə bilərsən.' });
  };

  const exit = useCallback(() => {
    if (voiceBusy) return;
    stopAudio();
    if (showResult) { router.replace('/(tabs)'); return; }
    Alert.alert('Dərsdən çıxırsan?', 'Bu dərsdəki irəliləyiş saxlanmayacaq.', [
      { text: 'Davam et', style: 'cancel' },
      { text: 'Çıx', style: 'destructive', onPress: () => { if (attempt) useUserStore.getState().abandonLesson(attempt); router.replace('/(tabs)'); } },
    ]);
  }, [attempt, router, showResult, stopAudio, voiceBusy]);
  useFocusEffect(useCallback(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => { exit(); return true; });
    return () => sub.remove();
  }, [exit]));

  const progress = showResult ? 1 : reviewing ? .9 + .1 * reviewStep / Math.max(1, queue.length) : .9 * index / Math.max(1, flow.length - 1);
  const reportContext = { lesson: lesson.id, card: current?.id ?? 'result', answer: task?.type === 'choice' ? choice : task?.type === 'two' ? JSON.stringify(two) : task?.type === 'drag' || task?.type === 'profile' ? JSON.stringify(pairs) : text };

  // ---------- Content ----------
  const imageSize = Math.max(120, Math.min(250, (viewport || height * .6) * .32));
  const body = (() => {
    if (showResult) return lesson.exam ? <ExamResult lesson={lesson} records={records} finish={finish} /> : <ResultView lesson={lesson} records={records} finish={finish} />;
    if (!current) return null;
    if (current.type === 'intro') return <IntroView card={current} title={lesson.title} size={imageSize} />;
    if (current.type === 'word') return <WordView card={current} onPlay={(t, r) => speak(t, r ?? 0.85)} onWord={setGloss} rate={rate} playing={playing} dense={dense}
      onRate={() => { const n = nextOf(rate); setRate(n); rateRef.current = n; speak(current.word.split(/\s*·\s*/).join('. '), 0.85); }} />;
    if (current.type === 'explain') return <TeacherView card={current} onPlay={t => speak(t, 0.85)} />;
    if (current.type === 'teach') return <LearnView chip="Öyrən" title={current.title} lead={current.lead} phrases={current.phrases.map(p => p.en)} az={[...new Set(current.phrases.map(p => p.az))].join(' · ')} shortForm={current.shortForm}
      dialog={current.phrases.length > 2 ? current.phrases : undefined}
      structure={current.structure} notes={current.notes} example={current.example} scenes={current.scenes} onPlay={(t, r) => speak(t, r ?? 0.85)} onWord={setGloss}
      rate={rate} playing={playing} dense={dense} onRate={() => { const n = nextOf(rate); setRate(n); rateRef.current = n; speak(current.phrases.map(p => p.en).join('. '), 0.85); }} />;
    return taskView();
  })();

  function taskView() {
    if (!task) return null;
    const single = result?.kind === 'single' ? result.graded : undefined;
    const fieldState = (status?: string) => status === 'correct' ? 'correct' as const : status === 'wrong' ? 'wrong' as const : undefined;
    const markOf = (status: string) => status === 'correct' ? 'correct' as const : status === 'wrong' ? 'wrong' as const : undefined;
    const repeat = task.type === 'voice' ? task.repeat : undefined;
    const spotsShown = task.type === 'choice' && Boolean(task.map || task.spots && sceneImage(task.scenes));
    const say = (t: string) => speak(t.replace(/…/g, ''), 0.85);
    // Tapping an English option reads it aloud (20 Nov 2026) — not in exams, and not in listening tasks, where it would give the answer away.
    const sayOption = (o: string) => !lesson.exam && !listeningTask && /[A-Za-z]/.test(o) && !/[əğıöüçşƏĞİÖÜÇŞ]/.test(o) && o.split(/[^A-Za-z'’]+/).some(w => w && glossOf(w));
    const lookUp = result ? undefined : (w: string) => { setGloss(w); if (!peeked) { setPeeked(true); (attempt && useUserStore.getState().useHelp(attempt)); } };
    // Word tiles: punctuation is never a tile; the sentence's own end mark is added automatically.
    const tiles = task.type === 'write' && task.tiles ? task.tiles.filter(t => !/^[.,!?]+$/.test(t)) : undefined;
    const endMark = task.type === 'write' && task.tiles ? (task.rule.answers[0]?.match(/[.!?]$/)?.[0] ?? '') : '';
    const letters = task.type === 'write' ? task.letters : undefined;
    const pickLetters = (next: number[]) => {
      if (!letters) return;
      setPicked(next); setText(next.map(i => letters[i]).join(''));
      if (result?.kind === 'unverified') setResult(null);
    };
    const pickTiles = (next: number[]) => {
      if (!tiles) return;
      setPicked(next); setText(next.length ? joinTiles(next.map(i => tiles[i])) + endMark : '');
      if (result?.kind === 'unverified') setResult(null);
    };
    // “X deyir: “…”” in the task text becomes a speech bubble, so the quote is never a faint line.
    const lines = task.prompt.split('\n');
    const quoteAt = lines.findIndex(l => /“[^”]+”/.test(l) && /(deyir|yazır|soruşur|edir)\s*:/.test(l));
    const quote = quoteAt >= 0 ? lines[quoteAt].match(/“([^”]+)”/)![1] : undefined;
    const subject = quoteAt >= 0 ? lines[quoteAt].split(/\s/)[0] : '';
    const quoteWho: Who = /^Qız/.test(subject) ? 'G' : /^Oğlan/.test(subject) ? 'B' : task.speaker === 'mascot' ? 'M' : 'other';
    const clean = lines.map((l, i) => i === quoteAt ? l.replace(/\s*:\s*“[^”]+”/, '.').replace(/\.\.$/, '.') : l);
    const context = clean.length > 1 ? clean[0] : '';
    const instruction = clean.length > 1 ? clean.slice(1).join('\n') : clean[0];
    // Voice tasks: the counterpart's line is shown in a bubble (it is not listening evidence).
    const voiceBubble = task.type === 'voice' && audio && !repeat;
    const bubbleText = voiceBubble ? audio! : quote;
    const bubbleWho: Who = voiceBubble ? (task.speaker === 'mascot' ? 'M' : 'other') : quoteWho;
    const mascotTalks = task.speaker === 'mascot' && !audio && !quote;
    // A WRITTEN quote (“mesajda yazır: …”) is a message, not speech (27 Nov 2026, rule 6): it is shown as a chat
    // with the sender's name and avatar — no ▶ and no sound wave.
    const written = quoteAt >= 0 && /(mesaj|yazır|yazıb|yazdı)/i.test(lines[quoteAt]);
    const quoteChat = written && quote ? { partner: quoteWho === 'G' ? '{G}' : quoteWho === 'B' ? '{B}' : quoteWho === 'F' ? '{F}' : 'Yeni tanış', from: quoteWho, lines: [{ from: quoteWho, text: quote }], reply: undefined as string | undefined } : undefined;
    const chat = task.type === 'write' ? task.chat ?? quoteChat : undefined;
    const scene = sceneImage(task.scenes);
    // No Kömək on the tap-to-place screens (Kim nə dedi?, Cavab cütü, Söhbəti sırala) — user, 13 Nov 2026.
    // Section exams measure without help: no Kömək at all.
    const helpButton = !lesson.exam && !repeat && !result && task.type !== 'match' ? <Capsule tone="soft" small align="flex-end" icon="bulb" label="Kömək" onPress={() => setHelpOpen(true)} /> : null;
    const helpUnderAudio = Boolean(audio && !voiceBubble && !repeat);
    // Speaking screens (25 Nov 2026): a utility row under the audio card — sample pill (Dərs 1–2) left, Kömək right.
    const voiceRow = task.type === 'voice' && !repeat;
    // Chat, speaking and listening screens carry no picture (BIRTALK §5.3).
    const noArt = (task.type === 'write' && (Boolean(chat) || Boolean(task.photo))) || task.type === 'voice' || listeningTask;
    // The model answer: the task's own sample, or (opened through Kömək) the first accepted answer.
    // Bug fixed 13 Nov: tasks without a written sample offered “Nümunəni göstər” but showed nothing.
    const sampleText = task.type === 'voice' && !task.repeat ? task.sample ?? (sampleShown ? task.rule.answers[0] : undefined) : undefined;
    const sampleVisible = Boolean(sampleText) && ((early && task.type === 'voice' && Boolean(task.sample)) || sampleShown);
    return <View style={[s.gap, { flex: 1 }]}>
      {reviewing ? <View style={{ gap: 6 }}><Chip label="Təkrar" />{reviewStep === 0 ? <Text style={ds.small}>{lesson.notices.review}</Text> : null}</View> : null}
      <View style={{ gap: 4 }}>
        <KindChip kind={kindOf(task, listeningTask).kind} icon={kindOf(task, listeningTask).icon} />
        <Text accessibilityRole="header" style={ds.title}>{accentTitle(task.title)}</Text>
      </View>
      {/* Task line (25 Nov 2026): one crisp slate subtitle under the title on every task screen — no framed box. */}
      {/* Matching screens show only the instruction (user, 25 Nov 2026): the situation line adds nothing there. */}
      {mascotTalks ? <SayBubble who="M" text={instruction} /> : <Text style={s.taskSub}>{task.type === 'match'
        ? (task.mode === 'order' ? (task.gaps ? 'Boşluğa toxun, sonra sözü seç.' : 'Balonlara toxun, söhbəti sıraya düz.')
          : task.mode === 'reply' ? 'Cümləyə toxun, sonra cavabını seç.' : 'İfadəyə toxun, sonra mənasını seç.') : clean.join(' ')}</Text>}
      {mascotTalks && context ? <Text style={s.taskSub}>{context}</Text> : null}
      <View style={s.work}>
      {noArt ? null : scene && !spotsShown ? <Image source={scene} style={[s.scene, art < 1 && !keyboardOpen && { width: `${Math.round(art * 100)}%`, alignSelf: 'center' }]} contentFit="cover" accessibilityIgnoresInvertColors /> : !spotsShown ? <ImageSlot scenes={task.scenes} /> : null}
      {voiceBubble ? <AudioPanel playing={playing} onPlay={() => speak(audio!, 0.85)} rate={rate} onRate={() => { const n = nextOf(rate); setRate(n); rateRef.current = n; speak(audio!, 0.85); }}
        avatar={<Avatar who={bubbleWho} size={48} />} title={<TapText text={audio!} style={s.audioLine} onWord={lookUp} />}
        sub={bubbleWho === 'other' ? 'Danışan' : `{${bubbleWho}}`} seconds={Math.round(audio!.split(/\s+/).filter(Boolean).length * 0.55 / 0.85 + 0.6)} />
        : quoteChat && task.type !== 'write' ? <ChatThread partner={quoteChat.partner} from={quoteChat.from} lines={quoteChat.lines} mine="" placeholder="" onWord={lookUp} />
        : bubbleText && !quoteChat ? <SayBubble who={bubbleWho} text={bubbleText} onWord={listeningTask ? undefined : lookUp} playing={playing} onPlay={() => speak(bubbleText, 0.85)} /> : null}
      {audio && !voiceBubble && !repeat ? <AudioPanel playing={playing} onPlay={() => speak(audio, 0.85, listeningTask)} rate={rate} onRate={() => { const n = nextOf(rate); setRate(n); rateRef.current = n; speak(audio, 0.85, listeningTask); }}
        avatar={<Avatar who={quoteWho} size={48} />} name={quoteWho === 'other' ? 'Dostun' : `{${quoteWho}}`}
        seconds={Math.round(audio.split(/\s+/).filter(Boolean).length * 0.55 / 0.85 + 0.8)} /> : null}
      {/* Approved design: on listening tasks Kömək sits right under the audio card; elsewhere under the answers. */}
      {helpUnderAudio ? helpButton : null}
      {soundError && !textShown ? <Card style={{ gap: 10 }}><Text style={ds.body}>{lesson.notices.soundFailed}</Text>
        <View style={s.row}><Capsule small icon="retry" label="Yenidən dinlə" onPress={() => speak(audio!, 0.85, true)} /><Capsule small icon="doc" label="Mətnlə davam et" onPress={() => { setTechnical(true); setTextShown(true); setTextVisible(true); }} /></View></Card> : null}
      {textVisible && audio && listeningTask ? <Pressable accessibilityRole="button" accessibilityHint="Mətni gizlətmək üçün toxun" onPress={() => setTextVisible(false)} style={s.transcript}>
        <Text style={s.transcriptText}>{nameSlot(audio)}</Text>
        <Text style={ds.small}>Audio mətnini görürsən. Bu hissədə dinləmə yoxlanmadı.</Text>
      </Pressable> : null}
      {voiceRow && (sampleVisible || helpButton) ? <View style={s.utilRow}>
        {sampleVisible && sampleText ? <Pressable accessibilityRole="button" accessibilityLabel={`Nümunə: ${nameSlot(sampleText)}. Dinlə`} onPress={() => say(sampleText)} style={({ pressed }) => [s.samplePill, pressed && { opacity: .8 }]}>
          <Text style={s.sampleLabel}>Nümunə:</Text><Text style={s.sampleText} numberOfLines={1}>{nameSlot(sampleText)}</Text><SoundIcon size={16} color={d.purple} />
        </Pressable> : <View />}
        {helpButton}
      </View> : null}
      {repeat && audio ? <><AudioPanel playing={playing} onPlay={() => speak(audio, 0.85)} rate={rate} onRate={() => { const n = nextOf(rate); setRate(n); rateRef.current = n; speak(audio, 0.85); }} /><PhraseCard text={audio} stress={repeat.stress} note={repeat.note} reading={repeat.reading} /></> : null}
      {task.type === 'choice' && task.gap && task.dialog ? <View style={{ gap: 10 }}>{task.dialog.map((l, i) => <SayBubble key={i} who={l.from} text={l.text} onPlay={() => say(l.text)} onWord={lookUp} />)}</View> : null}
      {task.type === 'choice' && task.gap ? <GapSentence speaker={task.gap.speaker} before={task.gap.before} after={task.gap.after} options={task.options} value={choice} onSay={say}
        pieces={gapDone ? gapPieces(task.gap.before, task.answer, task.gap.after) : undefined} lit={lit?.card === task.id ? lit.index : -1}
        onReplay={gapDone ? () => playPieces(task.id, gapPieces(task.gap!.before, task.answer, task.gap!.after)) : undefined}
        onHelp={helpButton && !helpUnderAudio ? () => setHelpOpen(true) : undefined}
        disabled={Boolean(result && result.kind !== 'unverified')} mark={single ? markOf(single.status) : undefined}
        onPick={o => { setChoice(o); if (result?.kind === 'unverified') setResult(null); }} /> : null}
      {task.type === 'choice' && task.map ? <CountryMap map={task.map} options={task.options} value={choice} disabled={Boolean(result && result.kind !== 'unverified')}
        mark={single ? markOf(single.status) : undefined} onPick={o => { setChoice(o); if (result?.kind === 'unverified') setResult(null); }} /> : null}
      {task.type === 'choice' && spotsShown && !task.map ? <SceneSpots scenes={task.scenes} spots={task.spots!} value={choice} disabled={Boolean(result && result.kind !== 'unverified')}
        mark={single ? markOf(single.status) : undefined} onPick={o => { setChoice(o); if (result?.kind === 'unverified') setResult(null); }} /> : null}
      {task.type === 'match' ? <MatchBoard task={task} pairs={pairs} active={activeRow} disabled={Boolean(result)} marks={single?.rows} onSay={say}
        onActive={en => { setActiveRow(en); if (pairs[en]) setPairs(p => { const { [en]: _gone, ...rest } = p; return rest; }); setNotice(''); }}
        onPlace={az => { const target = activeRow && !pairs[activeRow] ? activeRow : task.rows.find(r => !pairs[r.en])?.en; if (!target) return;
          setPairs(p => ({ ...p, [target]: az })); setNotice(''); setActiveRow(task.rows.find(r => r.en !== target && !pairs[r.en])?.en ?? ''); }} /> : null}
      {chat ? <ChatThread partner={chat.partner} from={chat.from} lines={chat.lines} onSay={say} onWord={lookUp} placeholder={tiles ? 'Sözlərə toxun…' : 'Sənin cavabın…'}
        mine={text} mark={single ? markOf(single.status) : undefined} help={helpButton} sent={Boolean(result && result.kind !== 'unverified')} posted={chatPosted} reply={chat.reply}
        chips={tiles ? <PickedChips tiles={tiles} picked={picked} disabled={locked.current} placeholder="Sözlərə toxun…" onRemove={i => pickTiles(picked.filter(x => x !== i))} /> : undefined}>
        {tiles ? <TileTray tiles={tiles} picked={picked} disabled={locked.current} onSay={say} onPick={i => pickTiles([...picked, i])} /> : null}
      </ChatThread> : null}
      {/* Tile task without a chat (e.g. “Mesaj yaz”): the picked words and the tray are the whole screen (20 Nov 2026). */}
      {task.type === 'write' && task.photo ? <PhotoCard photo={task.photo} /> : null}
      {task.type === 'write' && tiles && !chat ? <View style={{ gap: 16 }}>
        <View style={s.transcript}><PickedChips tiles={tiles} picked={picked} disabled={locked.current} placeholder="Sözlərə toxun…" onRemove={i => pickTiles(picked.filter(x => x !== i))} /></View>
        <TileTray tiles={tiles} picked={picked} disabled={locked.current} onSay={say} onPick={i => pickTiles([...picked, i])} />
      </View> : null}
      {task.type === 'drag' ? <DragBoard task={task} placed={pairs} marks={single?.rows} disabled={Boolean(result && result.kind !== 'unverified')}
        onSay={o => { if (sayOption(o)) say(o); }} onChange={p => { setPairs(p); setNotice(''); if (result?.kind === 'unverified') setResult(null); }} /> : null}
      {task.type === 'profile' ? <ProfileCard task={task} values={pairs} marks={single?.rows} notes={single?.notes} disabled={Boolean(result && result.kind !== 'unverified')}
        onSay={o => { if (sayOption(o)) say(o); }} onChange={p => { setPairs(p); setNotice(''); if (result?.kind === 'unverified') setResult(null); }} /> : null}
      {(task.type === 'choice' && !task.gap && !spotsShown) ? <View style={s.gap}>{task.options.map(o => <ChoiceOption key={o} label={o} selected={choice === o} disabled={Boolean(result && result.kind !== 'unverified')}
        state={single && choice === o ? (single.status === 'correct' ? 'correct' : single.status === 'wrong' ? 'wrong' : undefined) : undefined}
        onPress={() => { if (sayOption(o)) say(o); setChoice(o); if (result?.kind === 'unverified') setResult(null); }} />)}</View> : null}
      {task.type === 'write' && task.keypad ? <PhoneKeypad label={task.placeholder} value={text} disabled={locked.current} mark={single ? markOf(single.status) : undefined}
        onChange={v => { setText(v.replace(/\D/g, '')); if (result?.kind === 'unverified') setResult(null); }} /> : null}
      {task.type === 'write' && letters ? <LetterBoard letters={letters} picked={picked} length={task.rule.answers[0]?.length ?? 4} disabled={locked.current}
        mark={single ? markOf(single.status) : undefined} onPick={i => pickLetters([...picked, i])} onRemove={i => pickLetters(picked.filter(x => x !== i))} /> : null}
      {task.type === 'write' && !task.tiles && !task.keypad && !letters ? <Field onSubmit={() => { if (text.trim() && !(listeningTask && !heard && !textShown && !technical)) check(); }} value={text} onChange={v => { setText(v); setChatPosted(false); if (result?.kind === 'unverified') setResult(null); }}
        onSend={chat ? () => { if (text.trim()) setChatPosted(true); } : undefined} placeholder={listeningTask && !task.tiles ? 'Sözü bura yaz...' : task.placeholder} editable={!locked.current} state={fieldState(single?.status)} /> : null}
      {task.type === 'two' && task.thread ? (() => {
        // “İki mesajı özün yaz” as a chat timeline (25 Nov 2026).
        const th = task.thread, fields = task.fields, at = Math.min(twoEdit, fields.length);
        const graded = result?.kind === 'two' ? result.graded : undefined;
        const steps = fields.map((f, i) => ({ id: f.id, pill: th.pills[i] ?? '', placeholder: f.placeholder, mine: two[f.id] ?? '', sent: Boolean(twoSent[f.id]),
          mark: markOf(graded?.fields[f.id]?.status ?? ''), reply: th.replies?.[i] }));
        const cur = fields[at];
        const send = () => {
          if (!cur || !(two[cur.id] ?? '').trim()) return;
          const sent = { ...twoSent, [cur.id]: true }; setTwoSent(sent);
          const nextAt = fields.findIndex(f => !sent[f.id]); setTwoEdit(nextAt < 0 ? fields.length : nextAt);
          if (nextAt < 0) Keyboard.dismiss();
          setNotice(''); if (result?.kind === 'unverified') setResult(null);
        };
        return <View style={{ gap: 12 }}>
          <ChatTimeline partner={th.partner} from={th.from} lines={th.lines} steps={steps} editing={cur ? at : -1} checked={Boolean(graded)} help={helpButton}
            onSay={say} onWord={lookUp} onEdit={i => { if (locked.current) return; setTwoSent(s0 => { const { [fields[i].id]: _x, ...rest } = s0; return rest; }); setTwoEdit(i); }} />
          <Field value={cur ? two[cur.id] ?? '' : ''} placeholder={cur ? cur.placeholder : 'Mesajlar hazırdır'} label={cur?.label} editable={Boolean(cur) && !locked.current}
            onChange={v => { if (!cur) return; setTwo(all => ({ ...all, [cur.id]: v })); setNotice(''); if (result?.kind === 'unverified') setResult(null); }} onSend={send} />
        </View>;
      })() : null}
      {task.type === 'two' && !task.thread ? <TwoFields task={task} values={two} onChange={(id, v) => { setTwo(all => ({ ...all, [id]: v })); setNotice(''); if (result?.kind === 'unverified') setResult(null); }}
        graded={result?.kind === 'two' ? result.graded : undefined} keep={reviewing ? keepFields[task.id]?.fields : undefined} /> : null}
      {/* Help sits under the answers, on the right: read the task, try, then ask for help. */}
      {!helpUnderAudio && !voiceRow && !(chat) && !(task.type === 'two' && task.thread) && !(task.type === 'choice' && task.gap) ? helpButton : null}
      {notice ? <Text accessibilityLiveRegion="polite" style={s.notice}>{notice}</Text> : null}
      {task.type === 'voice' && (!result || voiceRetry) ? <View style={s.micArea}>
        <HoldToTalk onFinal={onSpoken} onRecording={onRecording} onBusyChange={setVoiceBusy} suspended={helpOpen || explainOpen || reportOpen || menuOpen || Boolean(ruleOpen)} />
      </View> : null}
      </View>
    </View>;
  }

  // The post-check sheet replaces the padded footer (edge to edge, own safe-area padding).
  const sheetUp = Boolean(!showResult && task && result);
  // ---------- Footer ----------
  const footer = (() => {
    if (showResult) return finish ? <MainButton label={lesson.result.button} onPress={exit} arrow /> : null;
    if (!current) return null;
    if (current.type === 'intro') return <MainButton label={current.start} onPress={next} arrow />;
    if (current.type === 'explain') return <MainButton label="Başa düşdüm" onPress={() => { useRulesStore.getState().markSeen(current.id); next(); }} arrow />;
    if (current.type === 'teach') return <MainButton label="Davam et" onPress={next} arrow />;
    if (current.type === 'word') return <MainButton label="Davam et" onPress={next} arrow />;
    if (!task) return null;
    if (result?.kind === 'unverified') return <ResultPanel tone="neutral" title="Yoxlanmadı" short={result.message} collapsed={collapsed} onCollapse={() => setCollapsed(true)} onReport={() => setReportOpen(true)}
      actions={<>{task.type === 'voice' && !result.recording ? <Capsule small label="Keç" onPress={skipVoice} /> : null}<Capsule small icon="retry" label="Yenidən cəhd et" onPress={() => { setResult(null); setCollapsed(false); }} /></>}
      onContinue={task.type === 'voice' && !result.recording ? undefined : continueUnverified} continueLabel="Yoxlanmadı ilə davam et" />;
    if (result) {
      const graded = result.graded;
      const textHelp = textHelpActive && result.kind === 'single';
      if (textHelp) return <ResultPanel tone="neutral" title={graded.status === 'correct' ? 'Cavab uyğundur' : 'Mətnlə məşq etdin'} short={technical ? lesson.result.technical : 'Audio mətnini gördün. Dinləmə yoxlanmadı.'}
        collapsed={collapsed} onCollapse={() => setCollapsed(true)} onReport={() => setReportOpen(true)} onContinue={next} />;
      // Sheet content (25 Nov 2026): diff rows for two-part answers, phrases to hear again after a correct answer.
      const english = (x?: string) => Boolean(x && isEnglish(x));
      const parts = result.kind === 'two' && task.type === 'two' ? task.fields.map(f => ({ label: f.label, ok: result.graded.fields[f.id]?.status === 'correct', mine: (two[f.id] ?? '').trim() || undefined,
        answer: f.rule.answers.slice(0, 2).join(' / ') })) : undefined;
      const mineText = task.type === 'write' ? text.trim() : task.type === 'choice' ? choice : undefined;
      const listen = parts ? parts.map(p => p.mine ?? '').filter(english)
        : task.type === 'voice' ? [task.rule.answers[0]].filter(english)
        // Listening: hear the recording again (not the Azerbaijani option you picked).
        : listeningTask && audio ? [audio].filter(english) : [mineText ?? ''].filter(english);
      const assistedNow = !reviewing && Boolean(meaningHint || sampleShown || peeked || (task.type === 'voice' && task.sample && early));
      if (graded.status === 'correct') return <ResultPanel tone="correct" title={assistedNow ? 'Düzgündür' : 'Əla!'} short={task.why} listen={listen} onSay={t => speak(t.replace(/…/g, ''), 0.85)} corrections={result.kind === 'single' ? result.graded.spellingCorrections : undefined}
        assisted={assistedNow} collapsed={collapsed} onCollapse={() => setCollapsed(true)} onReport={() => setReportOpen(true)} onContinue={next} />;
      return <ResultPanel tone="wrong" title="Bir daha baxaq" short={graded.short} answers={graded.explain?.answers} parts={parts} mine={mineText} onSay={t => speak(t.replace(/…/g, ''), 0.85)}
        onRule={ruleOfTask(task.id) ? () => setRuleOpen(ruleOfTask(task.id)!.id) : undefined}
        meaning={meaningOf(graded.explain?.answers)} repeatFrom={taughtIn(graded.explain?.answers, lesson)} collapsed={collapsed} onCollapse={() => setCollapsed(true)}
        onExplain={graded.explain ? () => setExplainOpen(true) : undefined} onReport={() => setReportOpen(true)} onContinue={next}
        actions={task.type === 'voice' && !reviewing && !voiceRetried ? <Capsule small icon="retry" label="Yenidən cəhd et" onPress={() => { locked.current = false; setVoiceRetry(true); setVoiceRetried(true); setCollapsed(true); }} /> : undefined} />;
    }
    const empty = task.type === 'choice' ? !choice : task.type === 'drag' ? task.people.some(p => !pairs[p.id])
      : task.type === 'profile' ? task.rows.some(r => !(pairs[r.id] ?? '').trim()) : task.type === 'write' ? !text.trim() : task.type === 'two' ? (task.thread ? task.fields.some(f => !twoSent[f.id]) : !Object.values(two).some(v => v.trim()))
      : task.type === 'match' ? task.rows.some(r => !pairs[r.en]) : true;
    const needsAudio = listeningTask && !heard && !textShown && !technical;
    return <View style={{ gap: 12 }}>
      {listeningTask ? <Capsule tone="ghost" icon="muted" label="İndi dinləyə bilmirəm" onPress={cannotListen} /> : null}
      {/* Speaking: no main button — a quiet “can't speak now” link sits at the bottom instead (replaces the “Keç” pill). */}
      {task.type === 'voice' ? <Capsule tone="ghost" icon="micOff" label="İndi danışa bilmirəm" onPress={skipVoice} disabled={voiceBusy} /> : <MainButton label="Yoxla" disabled={empty || needsAudio} onPress={check} />}
      {needsAudio && !empty ? <Text style={[ds.small, { textAlign: 'center' }]}>Əvvəlcə səsi dinlə.</Text> : null}
    </View>;
  })();

  // Kömək: step 1 is the hint (shown at once); step 2 shows a model (voice) or the audio text (listening). Step 2 counts as help.
  const helpSample = task?.type === 'voice' && !task.repeat ? task.sample ?? task.rule.answers[0] : undefined;
  const help = task ? <Sheet visible={helpOpen} onClose={() => setHelpOpen(false)} title="Kömək" icon="bulb">
    {task.hint ? <Text style={ds.strong}>{task.hint}</Text> : null}
    {helpSample && !(early && task.type === 'voice' && task.sample) && !sampleShown ? <SheetOption icon="doc" highlight label="Nümunəni göstər" note="Nümunəyə baxıb desən, nəticə “Köməklə” olacaq."
      onPress={() => { setHelpOpen(false); setSampleShown(true); (attempt && useUserStore.getState().useHelp(attempt)); }} /> : null}
    {listeningTask ? <SheetOption icon="doc" label="Mətnlə davam et" note="Dinləmə yoxlanmamış qalacaq."
      onPress={() => { setHelpOpen(false); stopAudio(); setTextShown(true); setTextVisible(true); (attempt && useUserStore.getState().useHelp(attempt)); }} /> : null}
  </Sheet> : null;

  const glossInfo = gloss ? glossOf(gloss) : undefined;
  const glossSheet = <Sheet visible={Boolean(gloss)} onClose={() => setGloss('')} title={gloss}>
    {glossInfo ? <><Text style={ds.strong}>{glossInfo.az}</Text>{glossInfo.role ? <Text style={ds.body}>{glossInfo.role}</Text> : null}</> : null}
    <PlayButton onPress={() => speak(gloss)} size={48} label={`Dinlə: ${gloss}`} />
    {task && peeked ? <Text style={ds.small}>Bu tapşırıqda söz mənasına baxdın — nəticə “Köməklə” qeyd olunacaq.</Text> : null}
  </Sheet>;

  return <KeyboardAvoidingView style={[s.screen, { paddingTop: insets.top }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
    <Header title={lessonLabel(lesson)} progress={progress} streak={streak} onBack={exit} onMenu={showResult ? undefined : () => setMenuOpen(true)} />
    {/* Fits without scrolling on normal phones; scrolls only when the content is taller (large text, keyboard). */}
    <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" bounces={false} alwaysBounceVertical={false}
      overScrollMode="never" scrollEnabled={stillOverflows} showsVerticalScrollIndicator={stillOverflows}
      onLayout={e => setViewport({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
      onContentSizeChange={(_w, h) => setContentHeight(h)}>
      <View style={[{ flexGrow: 1, transform: [{ scale }], transformOrigin: 'top center' },
        scale !== 1 && innerW > 0 && { width: wideW, marginLeft: (innerW - wideW) / 2 }]}>
      <ArtFit.Provider value={keyboardOpen ? 1 : art}><LessonCaption.Provider value={lessonLabel(lesson)}>
      {/* Each new card fades in once it has its final size (no visible shrinking steps). */}
      <Animated.View key={cardKey} style={[{ flexGrow: 1 }, fadeStyle]}>
        {current?.type === 'word' || current?.type === 'teach' ? <View onLayout={e => onNatural(e.nativeEvent.layout.height)}>{body}</View> : body}
      </Animated.View>
      </LessonCaption.Provider></ArtFit.Provider>
      </View>
    </ScrollView>
    {/* The result sheet dims the lesson behind it (taps still reach the ▶ beside sent bubbles). */}
    {sheetUp && !collapsed ? <Animated.View pointerEvents="none" entering={DimIn} style={s.dim} /> : null}
    <View style={sheetUp ? null : [s.footer, { paddingBottom: Math.max(14, insets.bottom + 6) }]}>{footer}</View>

    {help}
    {glossSheet}
    {/* “Qaydaya bax” (21 Nov 2026): the rule behind a wrong answer, without leaving the lesson. */}
    <Sheet visible={Boolean(ruleOpen)} onClose={() => setRuleOpen(null)} tall title={ruleOpen ? ruleOfTaskTitle(ruleOpen) : ''} icon="layers">
      {ruleOpen ? <ScrollView style={{ maxHeight: 560 }}>{(() => { const c = ruleCard(ruleOpen); return c ? <TeacherView card={c} onPlay={t => speak(t, 0.85)} /> : null; })()}</ScrollView> : null}
    </Sheet>
    <ExplainSheet onSay={t => speak(t)} visible={explainOpen} explain={result && result.kind !== 'unverified' ? result.graded.explain : undefined} onClose={() => setExplainOpen(false)} onReport={() => { setExplainOpen(false); setTimeout(() => setReportOpen(true), SHEET_GAP); }} />
    <ReportSheet visible={reportOpen} onClose={() => setReportOpen(false)} context={reportContext} />
    <MenuPopover visible={menuOpen} onClose={() => setMenuOpen(false)} top={insets.top + 58} items={[
      { label: 'Xəta bildir', icon: 'alert', onPress: () => setTimeout(() => setReportOpen(true), SHEET_GAP) },
      ...(audio ? [{ label: 'Səs açılmır', icon: 'muted' as const, onPress: () => { stopAudio(); setTechnical(true); setTextShown(true); setTextVisible(true); } }] : []),
    ]} />
    <WordSheet word={word} lesson={lesson} onClose={() => setWord(null)} onPlay={t => speak(t)} />
  </KeyboardAvoidingView>;
}

// ---------- Cards ----------
function IntroView({ card, title, size }: { card: IntroCard; title: string; size: number }) {
  return <View style={s.gap}>
    <Chip label={card.badge} />
    <Text accessibilityRole="header" style={[ds.title, { fontSize: 34, lineHeight: 40 }]}>{title}</Text>
    <Text style={ds.subtitle}>{card.subtitle}</Text>
    <View style={{ alignItems: 'center' }}>
      <View style={[s.disc, { width: size * 1.25, height: size * 1.1, borderRadius: size }]}>
        <Image source={mascotFull} style={{ width: size, height: size * 1.05 }} contentFit="contain" accessibilityLabel="Maskot əl yelləyir" />
      </View>
    </View>
    <Card style={{ paddingVertical: 10 }}>
      <Text style={[ds.strong, { fontSize: 24, lineHeight: 30, marginBottom: 4 }]}>Bu dərsdə</Text>
      {card.goals.map((g, i) => <View key={g.text} style={[s.goal, i > 0 && { borderTopWidth: 1, borderTopColor: d.border }]}>
        <View style={s.goalIcon}><Icon name={g.icon} size={30} color={d.purple} stroke={1.8} /></View><View style={s.vline} /><Text style={[ds.strong, { flex: 1 }]}>{g.text}</Text>
      </View>)}
    </Card>
  </View>;
}

function TwoFields({ task, values, onChange, graded, keep }: { task: TwoTask; values: Record<string, string>; onChange: (id: string, v: string) => void; graded?: TwoGraded; keep?: TwoGraded['fields'] }) {
  if (task.form) return <FormSheet title={task.form.title} subtitle={task.form.subtitle}>{task.fields.map((f, i) => {
    const kept = keep?.[f.id]?.status === 'correct';
    const status = graded?.fields[f.id]?.status ?? (kept ? 'correct' : undefined);
    return <View key={f.id} style={{ gap: 4 }}>
      <Text style={[ds.label, { color: d.purple }]}>{i + 1}. {f.label}</Text>
      <Field label={f.label} value={values[f.id] ?? ''} onChange={v => onChange(f.id, v)} placeholder={f.placeholder}
        editable={!graded && !kept} state={status === 'correct' ? 'correct' : status === 'wrong' ? 'wrong' : undefined} />
    </View>;
  })}</FormSheet>;
  return <View style={s.gap}>{task.fields.map(f => {
    const kept = keep?.[f.id]?.status === 'correct';
    const status = graded?.fields[f.id]?.status ?? (kept ? 'correct' : undefined);
    return <View key={f.id} style={{ gap: 6 }}>
      <Text style={ds.strong}>{f.label}</Text>
      <Field label={f.label} value={values[f.id] ?? ''} onChange={v => onChange(f.id, v)} placeholder={f.placeholder}
        editable={!graded && !kept} state={status === 'correct' ? 'correct' : status === 'wrong' ? 'wrong' : undefined} />
    </View>;
  })}</View>;
}

function WordSheet({ word, lesson, onClose, onPlay }: { word: string | null; lesson: Lesson; onClose: () => void; onPlay: (t: string) => void }) {
  const v = lesson.vocabulary.find(x => x.word === word);
  if (!v) return null;
  return <Sheet visible={Boolean(word)} onClose={onClose} title={v.word}>
    <View style={s.row}><Text style={ds.small}>{v.pronunciation}</Text><PlayButton onPress={() => onPlay(v.word)} size={40} label={`Dinlə: ${v.word}`} /></View>
    <Text style={ds.label}>Mənası</Text><Text style={ds.strong}>{v.translation}</Text>
    <Text style={ds.body}>{v.usageNote}</Text>
    <Text style={ds.label}>Nümunə</Text>
    <View style={s.row}><View style={{ flex: 1 }}><Text style={ds.strong}>{v.example}</Text><Text style={ds.small}>{v.exampleAz}</Text></View><PlayButton onPress={() => onPlay(v.example)} size={40} label="Nümunəni dinlə" /></View>
  </Sheet>;
}

function ResultView({ lesson, records, finish }: { lesson: Lesson; records: Record<string, TaskRecord>; finish: { completed: boolean } | null }) {
  const groups = [...new Set(lesson.result.goals.map(g => g.group))];
  const color = { independent: d.greenText, assisted: d.orangeText, needsPractice: d.redText, unverified: d.lavenderText } as const;
  return <View style={s.gap}>
    <Image source={mascotFull} style={{ width: 120, height: 130, alignSelf: 'center' }} contentFit="contain" accessibilityLabel="Maskot" />
    {!finish ? <Text style={ds.subtitle}>Nəticə saxlanılır…</Text> : finish.completed
      ? <><Text accessibilityRole="header" style={ds.title}>{lesson.result.done[0]}</Text><Text style={ds.subtitle}>{lesson.result.done[1]}</Text></>
      : <Text accessibilityRole="header" style={ds.title}>{lesson.result.incomplete}</Text>}
    {groups.map(group => <Card key={group} style={{ gap: 8 }}>
      <Text style={[ds.strong, { fontSize: 20 }]}>{group}</Text>
      {lesson.result.goals.filter(g => g.group === group).map(g => {
        const r = records[g.tasks[0]]; const st = taskStatus(r);
        return <View key={g.text} style={s.resultRow}>
          <Text style={[ds.body, { flex: 1 }]}>{g.text}</Text>
          <View style={[s.status, { borderColor: color[st] }]}><Text style={[s.statusText, { color: color[st] }]}>{statusLabels[st]}</Text></View>
          {r?.technical ? <Text style={[ds.small, { width: '100%' }]}>{lesson.result.technical}</Text> : null}
        </View>;
      })}
    </Card>)}
    <Text style={ds.body}>{lesson.result.closing}</Text>
  </View>;
}

/** Pieces read one by one after a gap answer: words, and single letters inside spellings (M-A-double M → M · A · double M). */
export function gapPieces(before: string, answer: string, after: string) {
  const text = `${before} ${answer}${/^[.,!?]/.test(after) ? '' : ' '}${after}`.replace(/\s+/g, ' ').trim();
  return text.replace(/double /g, 'double\u00a0').split(' ').flatMap(w => w.includes('-') ? w.split('-').map((x, i, all) => i < all.length - 1 ? `${x}-` : x) : [w]).map(x => x.replace(/\u00a0/g, ' ')).filter(Boolean);
}

/** Header line: “Dərs 3” (Bölmə 1), “Dərs 1 · 2-ci hissə” (map lesson with parts), “Bölmə imtahanı”. */
/** What the learner does on a task, for the shared “DƏRS 1 · NÖV” chip (rule G7, 24 Nov 2026). */
function kindOf(task: { type: string; chat?: unknown }, listening: boolean): { kind: string; icon: IconName } {
  if (listening) return { kind: 'Dinləmə', icon: 'play' };
  switch (task.type) {
    case 'write': case 'two': return { kind: 'Yazı', icon: task.chat ? 'chat' : 'doc' };
    case 'voice': return { kind: 'Danışıq', icon: 'mic' };
    case 'match': return { kind: 'Uyğunlaşdır', icon: 'layers' };
    case 'drag': return { kind: 'Yerləşdir', icon: 'layers' };
    case 'profile': return { kind: 'Anket', icon: 'doc' };
    default: return { kind: 'Seçim', icon: 'check' };
  }
}

function lessonLabel(lesson: Lesson) {
  if (lesson.reviewOf) return 'Gündəlik təkrar';
  if (lesson.exam) return 'Bölmə imtahanı';
  const n = lesson.number ?? lesson.order;
  return lesson.part ? `Dərs ${n} · ${ordinal(lesson.part)} hissə` : `Dərs ${n}`;
}

/** Exam score: only verified first answers count (Expo Go cannot check speech — those stay “Yoxlanmadı”).
 *  Pass = at least 70 % of the verified answers, and at least 60 % of the tasks verified. */
export function examScore(lesson: Lesson, records: Record<string, TaskRecord>) {
  const ids = lessonTaskIds(lesson).required.concat(lessonTaskIds(lesson).optional);
  const verified = ids.filter(id => records[id]?.first);
  const correct = verified.filter(id => records[id]?.first === 'correct').length;
  const percent = verified.length ? Math.round(correct / verified.length * 100) : 0;
  const enough = ids.length > 0 && verified.length >= Math.ceil(ids.length * .6);
  return { percent, correct, verified: verified.length, total: ids.length, enough, passed: enough && isPass(percent) };
}

function ExamResult({ lesson, records, finish }: { lesson: Lesson; records: Record<string, TaskRecord>; finish: { completed: boolean } | null }) {
  const score = examScore(lesson, records);
  const saved = useRef(false);
  const tries = useUserStore(st => st.examHistory?.[lesson.id]) ?? [];
  useEffect(() => {
    if (!finish || saved.current || !score.enough) return;
    saved.current = true; useUserStore.getState().saveSectionExam(lesson.id, score.percent, score.passed);
  }, [finish, lesson.id, score.enough, score.percent, score.passed]);
  const color = { independent: d.greenText, assisted: d.orangeText, needsPractice: d.redText, unverified: d.lavenderText } as const;
  const tone = !score.enough ? d.lavenderText : score.passed ? d.greenText : d.redText;
  return <View style={s.gap}>
    <View style={[s.examScore, { borderColor: tone }]}>
      <Icon name="flag" size={30} color={tone} />
      <Text style={[s.examPct, { color: tone }]}>{score.enough ? `${score.percent}%` : '—'}</Text>
      <Text style={[ds.strong, { color: tone, textAlign: 'center' }]}>{!score.enough ? 'Nəticə yoxlanmadı' : score.passed ? 'İmtahandan keçdin' : 'Hələ keçmədin — 70% lazımdır'}</Text>
      <Text style={[ds.small, { textAlign: 'center' }]}>{score.enough ? `${score.verified} yoxlanan cavabdan ${score.correct}-i düzgündür.` : 'Çox tapşırıq yoxlanmadı (səs və ya keçid). Yenidən cəhd et.'}</Text>
    </View>
    {lesson.result.goals.map(g => {
      const st = g.tasks.every(id => records[id]?.first === 'correct') ? 'independent' as const : g.tasks.some(id => records[id]?.first === 'wrong') ? 'needsPractice' as const : 'unverified' as const;
      return <View key={g.text} style={s.resultRow}>
        <Text style={[ds.body, { flex: 1 }]}>{g.text}</Text>
        <View style={[s.status, { borderColor: color[st] }]}><Text style={[s.statusText, { color: color[st] }]}>{st === 'independent' ? 'Bacarırsan' : st === 'needsPractice' ? 'Məşq lazımdır' : 'Yoxlanmadı'}</Text></View>
      </View>;
    })}
    {tries.length > 1 ? <Text style={ds.small}>{`Cəhd ${tries.length} · ən yaxşı nəticə: ${Math.max(...tries.map(t => t.percent))}%`}</Text> : null}
    <Text style={ds.body}>{score.passed ? lesson.result.closing : '“Məşq lazımdır” yazılan bacarıqların dərslərinə qayıt, sonra imtahanı yenidən ver.'}</Text>
  </View>;
}

const s = StyleSheet.create({
  taskSub: { color: '#334155', fontSize: 20, lineHeight: 27, ...font.semibold, marginTop: -2 }, // larger, darker (user, 25 Nov 2026)
  audioLine: { color: d.title, fontSize: 22, lineHeight: 28, ...font.extrabold },
  utilRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  samplePill: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44, paddingHorizontal: 16, borderRadius: 999, backgroundColor: '#fff', borderWidth: 1, borderColor: '#DDD6FE', flexShrink: 1 },
  micArea: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 4 },
  examScore: { alignItems: 'center', gap: 6, padding: 18, borderRadius: 24, borderWidth: 2, backgroundColor: '#fff' },
  examPct: { fontSize: 46, lineHeight: 52, ...font.extrabold },
  screen: { flex: 1, backgroundColor: d.bg },
  dim: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,.25)' },
  content: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 16, flexGrow: 1 },
  footer: { paddingHorizontal: 20, paddingTop: 8, gap: 10 },
  gap: { gap: 14 },
  work: { flex: 1, justifyContent: 'center', gap: 14, paddingVertical: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  disc: { backgroundColor: 'rgba(142,99,232,.13)', alignItems: 'center', justifyContent: 'center' },
  goal: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 58 },
  goalIcon: { width: 44, alignItems: 'center' },
  vline: { width: 1, alignSelf: 'stretch', marginVertical: 8, backgroundColor: d.border },
  transcript: { borderRadius: 16, backgroundColor: d.purpleSoft, padding: 12, gap: 4 },
  transcriptText: { color: d.purple, fontSize: 20, ...font.extrabold },
  scene: { width: '100%', aspectRatio: 16 / 9, borderRadius: 22, backgroundColor: d.purpleSoft },
  sampleLabel: { color: d.inkSoft, fontSize: 16, ...font.semibold },
  sampleText: { flexShrink: 1, color: d.purple, fontSize: 20, lineHeight: 26, ...font.extrabold },
  notice: { color: d.purple, fontSize: 15, ...font.bold },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap', paddingVertical: 4 },
  status: { borderWidth: 1.5, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 13, ...font.bold },
});

// Qaydaya bax helpers.
function ruleOfTaskTitle(id: string) { return getRule(id)?.title ?? ''; }
function ruleCard(id: string) { return getRule(id)?.card; }
