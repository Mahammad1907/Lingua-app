import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, BackHandler, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { DesignLesson as Lesson, IntroCard, TwoTask, Who } from '../../data/designLessonTypes';
import { useUserStore } from '../../store/userStore';
import { useVocabularyStore } from '../../store/vocabularyStore';
import {
  gradeChoice, gradeMatch, gradeText, gradeTwo, isTask, joinTiles, lessonFlow, lessonTaskIds, resolveLesson, reviewTask, statusLabels, taskStatus,
  type FlowCard, type Graded, type TaskRecord, type TwoGraded,
} from '../../utils/designLesson';
import type { TaskEvidence } from '../../utils/lessonEvidence';
import type { SpokenAnswer, UnverifiedRecording } from '../../utils/speechTurn';
import HoldToTalk from './HoldToTalk';
import { ChatThread, GapSentence, ImageSlot, MatchBoard, PhraseCard, PickedChips, SayBubble, SceneSpots, TileTray, WordView, LearnView, PlayButton } from './TaskScreens';
import Icon from './Icons';
import { ExplainSheet, MenuPopover, ReportSheet, ResultPanel } from './LessonSheets';
import { AudioPanel, Capsule, Card, Chip, ChoiceOption, Field, Header, MainButton, Sheet, SheetOption, ds, nameSlot } from './parts';
import { d, shadow, font } from './theme';
import { sceneImage } from '../../config/sceneImages';
import { glossOf } from '../../data/unit1/glossary';
import { characterAz } from '../../config/characters';

const mascotFull = require('../../../assets/mascot/hood_full.png');
const mascotHead = require('../../../assets/mascot/hood_head.png');

// iOS refuses to present a sheet while the previous one is still animating closed.
const SHEET_GAP = 650;

type Result = { kind: 'single'; graded: Graded } | { kind: 'two'; graded: TwoGraded } | { kind: 'unverified'; message: string; recording?: boolean; two?: TwoGraded };

export default function DesignLesson({ source }: { source: Lesson }) {
  const lesson = useMemo(() => resolveLesson(source), [source]);
  const flow = useMemo(() => lessonFlow(lesson), [lesson]);
  const router = useRouter(); const insets = useSafeAreaInsets(); const { height } = useWindowDimensions();

  const [attempt, setAttempt] = useState('');
  const [index, setIndex] = useState(0);
  const [queue, setQueue] = useState<string[]>([]);
  const [reviewing, setReviewing] = useState(false);
  const [reviewStep, setReviewStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [records, setRecords] = useState<Record<string, TaskRecord>>({});
  const [keepFields, setKeepFields] = useState<Record<string, { fields: TwoGraded['fields']; values: Record<string, string> }>>({});

  // Current answer state.
  const [choice, setChoice] = useState(''); const [text, setText] = useState('');
  const [two, setTwo] = useState<Record<string, string>>({});
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
  const [explainOpen, setExplainOpen] = useState(false); const [reportOpen, setReportOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); const [word, setWord] = useState<string | null>(null);
  const [finish, setFinish] = useState<{ completed: boolean } | null>(null);
  const [viewport, setViewport] = useState(0);

  const sequence = useRef(0); const locked = useRef(false); const tokens = useRef(0);
  const reviewIds = reviewing ? queue : [];
  const current: FlowCard | undefined = showResult ? undefined : reviewing ? reviewTask(lesson, reviewIds[reviewStep]) : flow[index];
  const task = isTask(current) ? current : undefined;
  const audio = task && (task.type === 'choice' || task.type === 'write' || task.type === 'voice') ? task.audio : undefined;
  const listeningTask = Boolean(audio && task?.type !== 'voice');

  useEffect(() => {
    if (attempt) return;
    const id = useUserStore.getState().beginLesson(lesson.id, 'session', [], lessonTaskIds(lesson));
    setAttempt(id);
  }, [attempt, lesson]);

  const stopAudio = useCallback(() => { sequence.current += 1; setPlaying(false); void Speech.stop(); }, []);
  useFocusEffect(useCallback(() => () => stopAudio(), [stopAudio]));

  const speak = useCallback((value: string, rate = 0.85, listening = false) => {
    const request = ++sequence.current; setSoundError(false);
    const failed = () => { if (request !== sequence.current) return; setPlaying(false); if (listening) setSoundError(true); };
    const watchdog = setTimeout(failed, Math.max(8000, value.length * 200 / rate + 5000));
    void Speech.stop().then(() => {
      if (request !== sequence.current) { clearTimeout(watchdog); return; }
      setPlaying(true);
      Speech.speak(value, {
        language: 'en-GB', rate,
        onDone: () => { clearTimeout(watchdog); if (request === sequence.current) { setPlaying(false); if (listening) setHeard(true); } },
        onStopped: () => { clearTimeout(watchdog); if (request === sequence.current) setPlaying(false); },
        onError: () => { clearTimeout(watchdog); failed(); },
      });
    }).catch(() => { clearTimeout(watchdog); failed(); });
  }, []);

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
    setTwo(Object.fromEntries(Object.entries(kept.values).filter(([id]) => kept.fields[id]?.status === 'correct')));
  }, [reviewKey, keepFields]);

  const resetCard = () => {
    stopAudio(); Keyboard.dismiss(); locked.current = false;
    setChoice(''); setText(''); setTwo({}); setPicked([]); setPairs({}); setActiveRow(''); setResult(null); setNotice(''); setCollapsed(false); setHintUsed(false); setVoiceRetry(false); setVoiceRetried(false);
    setHeard(false); setSoundError(false); setTextShown(false); setTextVisible(false); setTechnical(false);
    setHelpOpen(false); setHintOpen(false); setExplainOpen(false); setSampleShown(false); setGloss(''); setPeeked(false);
  };

  const finishLesson = useCallback(async () => {
    try {
      const receipt = await useUserStore.getState().finishLesson(attempt);
      if (receipt.completed) await useVocabularyStore.getState().addLessonWords(lesson.id);
      setFinish({ completed: receipt.completed });
    } catch { setFinish({ completed: false }); }
  }, [attempt, lesson.id]);

  const next = () => {
    resetCard();
    if (!reviewing) useUserStore.getState().setLessonPartial(lesson.id, (index + 1) / flow.length * 100);
    if (reviewing) {
      if (reviewStep + 1 < queue.length) setReviewStep(v => v + 1);
      else { setReviewing(false); setShowResult(true); void finishLesson(); }
      return;
    }
    if (index + 1 < flow.length) { setIndex(v => v + 1); return; }
    if (queue.length) { setReviewing(true); setReviewStep(0); return; }
    setShowResult(true); void finishLesson();
  };

  const update = (id: string, patch: Partial<TaskRecord>) => setRecords(all => ({ ...all, [id]: { ...all[id], ...patch } }));
  const enqueue = (id: string) => { if (!reviewing) setQueue(q => q.includes(id) ? q : [...q, id]); };
  const meaningHint = Boolean(hintUsed && task?.hintAssists);

  const evidence = (spoken: boolean): TaskEvidence => ({
    input: spoken ? 'spoken' : 'written',
    assisted: Boolean(reviewing || meaningHint || sampleShown || peeked || (task?.type === 'voice' && task.sample && lesson.order <= 2)),
    listening: Boolean(listeningTask && heard && !textShown && !technical),
    technicalText: Boolean(listeningTask && technical), transcriptShown: Boolean(listeningTask && textShown && !technical),
  });

  /** Store a confirmed verdict for one task id. */
  const store = (id: string, correct: boolean, spoken: boolean) => {
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
    useUserStore.getState().settlePacketTask(attempt, id, 'unverified');
    if (!reviewing) update(id, { unverified: true, ...why });
  };

  const textHelpActive = listeningTask && (textShown || technical);

  // A light buzz for confirmed verdicts only (never for unverified or technical states).
  // Opening Kömək shows the hint; a meaning hint makes a correct answer “Köməklə”.
  useEffect(() => {
    if (!helpOpen || !task?.hint || hintUsed) return;
    setHintUsed(true);
    if (task.hintAssists) useUserStore.getState().useHelp(attempt);
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
      if (graded.status === 'empty') { setNotice('Hər cümləyə bir məna qoy.'); return; }
      setNotice(''); locked.current = true; store(task.id, graded.status === 'correct', false);
      setResult({ kind: 'single', graded });
      return;
    }
    const graded = task.type === 'choice' ? gradeChoice(task, choice) : task.type === 'write' ? gradeText(task, text) : undefined;
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
    s.recordTask(attempt, task.id, null, `${task.id}:skip`); s.settlePacketTask(attempt, task.id, 'skipped');
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
  const reportContext = { lesson: lesson.id, card: current?.id ?? 'result', answer: task?.type === 'choice' ? choice : task?.type === 'two' ? JSON.stringify(two) : text };

  // ---------- Content ----------
  const imageSize = Math.max(120, Math.min(250, (viewport || height * .6) * .32));
  const body = (() => {
    if (showResult) return <ResultView lesson={lesson} records={records} finish={finish} />;
    if (!current) return null;
    if (current.type === 'intro') return <IntroView card={current} title={lesson.title} size={imageSize} />;
    if (current.type === 'word') return <WordView card={current} onPlay={(t, rate) => speak(t, rate ?? 0.85)} onWord={setGloss} />;
    if (current.type === 'teach') return <LearnView chip="Öyrən" title={current.title} lead={current.lead} phrases={current.phrases.map(p => p.en)} az={current.phrases.map(p => p.az).join(' · ')}
      dialog={current.phrases.length > 2 ? current.phrases : undefined}
      structure={current.structure} notes={current.notes} example={current.example} onPlay={(t, rate) => speak(t, rate ?? 0.85)} onWord={setGloss} />;
    return taskView();
  })();

  function taskView() {
    if (!task) return null;
    const single = result?.kind === 'single' ? result.graded : undefined;
    const fieldState = (status?: string) => status === 'correct' ? 'correct' as const : status === 'wrong' ? 'wrong' as const : undefined;
    const markOf = (status: string) => status === 'correct' ? 'correct' as const : status === 'wrong' ? 'wrong' as const : undefined;
    const repeat = task.type === 'voice' ? task.repeat : undefined;
    const spotsShown = task.type === 'choice' && Boolean(task.spots && sceneImage(task.scenes));
    const say = (t: string) => speak(t.replace(/…/g, ''), 0.85);
    const lookUp = result ? undefined : (w: string) => { setGloss(w); if (!peeked) { setPeeked(true); useUserStore.getState().useHelp(attempt); } };
    // Word tiles: punctuation is never a tile; the sentence's own end mark is added automatically.
    const tiles = task.type === 'write' && task.tiles ? task.tiles.filter(t => !/^[.,!?]+$/.test(t)) : undefined;
    const endMark = task.type === 'write' && task.tiles ? (task.rule.answers[0]?.match(/[.!?]$/)?.[0] ?? '') : '';
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
    const scene = sceneImage(task.scenes);
    const helpButton = !repeat && !result ? <Capsule tone="outline" small align="flex-end" icon="bulb" label="Kömək" onPress={() => setHelpOpen(true)} /> : null;
    const helpUnderAudio = Boolean(audio && !voiceBubble && !repeat);
    const sampleVisible = task.type === 'voice' && Boolean(task.sample) && (lesson.order <= 2 || sampleShown);
    return <View style={[s.gap, { flex: 1 }]}>
      {reviewing ? <View style={{ gap: 6 }}><Chip label="Təkrar" />{reviewStep === 0 ? <Text style={ds.small}>{lesson.notices.review}</Text> : null}</View> : null}
      <Text accessibilityRole="header" style={ds.title}>{task.title}</Text>
      {mascotTalks ? <SayBubble who="M" text={instruction} />
        : <View style={{ gap: 2 }}>{context ? <Text style={ds.subtitle}>{context}</Text> : null}<Text style={ds.instruction}>{instruction}</Text></View>}
      {mascotTalks && context ? <Text style={ds.subtitle}>{context}</Text> : null}
      <View style={s.work}>
      {scene && !spotsShown ? <Image source={scene} style={s.scene} contentFit="cover" accessibilityIgnoresInvertColors /> : !spotsShown ? <ImageSlot scenes={task.scenes} /> : null}
      {bubbleText ? <SayBubble who={bubbleWho} text={bubbleText} onWord={listeningTask ? undefined : lookUp} playing={playing} onPlay={() => speak(bubbleText, 0.85)} onSlow={() => speak(bubbleText, 0.45)} /> : null}
      {audio && !voiceBubble && !repeat ? <AudioPanel playing={playing} onPlay={() => speak(audio, 0.85, listeningTask)} onSlow={() => speak(audio, 0.45, listeningTask)} /> : null}
      {/* Approved design: on listening tasks Kömək sits right under the audio card; elsewhere under the answers. */}
      {helpUnderAudio ? helpButton : null}
      {soundError && !textShown ? <Card style={{ gap: 10 }}><Text style={ds.body}>{lesson.notices.soundFailed}</Text>
        <View style={s.row}><Capsule small icon="retry" label="Yenidən dinlə" onPress={() => speak(audio!, 0.85, true)} /><Capsule small icon="doc" label="Mətnlə davam et" onPress={() => { setTechnical(true); setTextShown(true); setTextVisible(true); }} /></View></Card> : null}
      {textVisible && audio && listeningTask ? <Pressable accessibilityRole="button" accessibilityHint="Mətni gizlətmək üçün toxun" onPress={() => setTextVisible(false)} style={s.transcript}>
        <Text style={s.transcriptText}>{nameSlot(audio)}</Text>
        <Text style={ds.small}>Audio mətnini görürsən. Bu hissədə dinləmə yoxlanmadı.</Text>
      </Pressable> : null}
      {sampleVisible ? <View style={s.sample}><Text style={s.sampleLabel}>Nümunə</Text><View style={s.vline} /><Text style={s.sampleText}>{task.type === 'voice' && task.sample ? nameSlot(task.sample) : ''}</Text></View> : null}
      {repeat && audio ? <><AudioPanel playing={playing} onPlay={() => speak(audio, 0.85)} onSlow={() => speak(audio, 0.45)} /><PhraseCard text={audio} stress={repeat.stress} note={repeat.note} reading={repeat.reading} /></> : null}
      {task.type === 'choice' && task.gap ? <GapSentence speaker={task.gap.speaker} before={task.gap.before} after={task.gap.after} options={task.options} value={choice} onSay={say}
        disabled={Boolean(result && result.kind !== 'unverified')} mark={single ? markOf(single.status) : undefined}
        onPick={o => { setChoice(o); if (result?.kind === 'unverified') setResult(null); }} /> : null}
      {task.type === 'choice' && spotsShown ? <SceneSpots scenes={task.scenes} spots={task.spots!} value={choice} disabled={Boolean(result && result.kind !== 'unverified')}
        mark={single ? markOf(single.status) : undefined} onPick={o => { setChoice(o); if (result?.kind === 'unverified') setResult(null); }} /> : null}
      {task.type === 'match' ? <MatchBoard task={task} pairs={pairs} active={activeRow} disabled={Boolean(result)} marks={single?.rows} onSay={say}
        onActive={en => { setActiveRow(en); if (pairs[en]) setPairs(p => { const { [en]: _gone, ...rest } = p; return rest; }); setNotice(''); }}
        onPlace={az => { const target = activeRow && !pairs[activeRow] ? activeRow : task.rows.find(r => !pairs[r.en])?.en; if (!target) return;
          setPairs(p => ({ ...p, [target]: az })); setNotice(''); setActiveRow(task.rows.find(r => r.en !== target && !pairs[r.en])?.en ?? ''); }} /> : null}
      {task.type === 'write' && task.chat ? <ChatThread partner={task.chat.partner} from={task.chat.from} lines={task.chat.lines} onSay={say} onWord={lookUp} placeholder={tiles ? 'Sözlərə toxun…' : 'Sənin cavabın…'}
        mine={text} mark={single ? markOf(single.status) : undefined}
        chips={tiles ? <PickedChips tiles={tiles} picked={picked} disabled={locked.current} placeholder="Sözlərə toxun…" onRemove={i => pickTiles(picked.filter(x => x !== i))} /> : undefined}>
        {tiles ? <TileTray tiles={tiles} picked={picked} disabled={locked.current} onSay={say} onPick={i => pickTiles([...picked, i])} /> : null}
      </ChatThread> : null}
      {task.type === 'choice' && !task.gap && !spotsShown ? <View style={s.gap}>{task.options.map(o => <ChoiceOption key={o} label={o} selected={choice === o} disabled={Boolean(result && result.kind !== 'unverified')}
        state={single && choice === o ? (single.status === 'correct' ? 'correct' : single.status === 'wrong' ? 'wrong' : undefined) : undefined}
        onPress={() => { setChoice(o); if (result?.kind === 'unverified') setResult(null); }} />)}</View> : null}
      {task.type === 'write' && !task.tiles ? <Field onSubmit={() => { if (text.trim() && !(listeningTask && !heard && !textShown && !technical)) check(); }} value={text} onChange={v => { setText(v); if (result?.kind === 'unverified') setResult(null); }} placeholder={task.placeholder} editable={!locked.current} state={fieldState(single?.status)} /> : null}
      {task.type === 'two' ? <TwoFields task={task} values={two} onChange={(id, v) => { setTwo(all => ({ ...all, [id]: v })); setNotice(''); if (result?.kind === 'unverified') setResult(null); }}
        graded={result?.kind === 'two' ? result.graded : undefined} keep={reviewing ? keepFields[task.id]?.fields : undefined} /> : null}
      {/* Help sits under the answers, on the right: read the task, try, then ask for help. */}
      {!helpUnderAudio ? helpButton : null}
      {notice ? <Text accessibilityLiveRegion="polite" style={s.notice}>{notice}</Text> : null}
      {task.type === 'voice' && (!result || voiceRetry) ? <View style={{ paddingTop: 4, gap: 12, alignItems: 'center' }}>
        <HoldToTalk onFinal={onSpoken} onRecording={onRecording} onBusyChange={setVoiceBusy} suspended={helpOpen || explainOpen || reportOpen || menuOpen} />
        {!result ? <Capsule label="Keç" onPress={skipVoice} disabled={voiceBusy} /> : null}
      </View> : null}
      </View>
    </View>;
  }

  // ---------- Footer ----------
  const footer = (() => {
    if (showResult) return finish ? <MainButton label={lesson.result.button} onPress={exit} arrow /> : null;
    if (!current) return null;
    if (current.type === 'intro') return <MainButton label={current.start} onPress={next} arrow />;
    if (current.type === 'teach') return <MainButton label="Davam et" tone="green" onPress={next} arrow />;
    if (current.type === 'word') return <MainButton label="Davam et" tone="green" onPress={next} arrow />;
    if (!task) return null;
    if (result?.kind === 'unverified') return <ResultPanel tone="neutral" title="Yoxlanmadı" short={result.message} collapsed={collapsed} onCollapse={() => setCollapsed(true)} onReport={() => setReportOpen(true)}
      actions={<>{task.type === 'voice' && !result.recording ? <Capsule small label="Keç" onPress={skipVoice} /> : null}<Capsule small icon="retry" label="Yenidən cəhd et" onPress={() => { setResult(null); setCollapsed(false); }} /></>}
      onContinue={task.type === 'voice' && !result.recording ? undefined : continueUnverified} continueLabel="Yoxlanmadı ilə davam et" />;
    if (result) {
      const graded = result.graded;
      const textHelp = textHelpActive && result.kind === 'single';
      if (textHelp) return <ResultPanel tone="neutral" title={graded.status === 'correct' ? 'Cavab uyğundur' : 'Mətnlə məşq etdin'} short={technical ? lesson.result.technical : 'Audio mətnini gördün. Dinləmə yoxlanmadı.'}
        collapsed={collapsed} onCollapse={() => setCollapsed(true)} onReport={() => setReportOpen(true)} onContinue={next} />;
      if (graded.status === 'correct') return <ResultPanel tone="correct" title="Düzgündür" short={task.why} corrections={result.kind === 'single' ? result.graded.spellingCorrections : undefined}
        assisted={!reviewing && Boolean(meaningHint || sampleShown || peeked || (task.type === 'voice' && task.sample && lesson.order <= 2))} collapsed={collapsed} onCollapse={() => setCollapsed(true)} onReport={() => setReportOpen(true)} onContinue={next} />;
      return <ResultPanel tone="wrong" title="Bir daha baxaq" short={graded.short} answers={graded.explain?.answers} collapsed={collapsed} onCollapse={() => setCollapsed(true)}
        onExplain={graded.explain ? () => setExplainOpen(true) : undefined} onReport={() => setReportOpen(true)} onContinue={next}
        actions={task.type === 'voice' && !reviewing && !voiceRetried ? <Capsule small icon="retry" label="Yenidən cəhd et" onPress={() => { locked.current = false; setVoiceRetry(true); setVoiceRetried(true); setCollapsed(true); }} /> : undefined} />;
    }
    const empty = task.type === 'choice' ? !choice : task.type === 'write' ? !text.trim() : task.type === 'two' ? !Object.values(two).some(v => v.trim())
      : task.type === 'match' ? task.rows.some(r => !pairs[r.en]) : true;
    const needsAudio = listeningTask && !heard && !textShown && !technical;
    return <View style={{ gap: 12 }}>
      {listeningTask ? <Capsule icon="muted" label="İndi dinləyə bilmirəm" onPress={cannotListen} /> : null}
      {task.type === 'voice' ? null : <MainButton label="Yoxla" disabled={empty || needsAudio} onPress={check} />}
      {needsAudio && !empty ? <Text style={[ds.small, { textAlign: 'center' }]}>Əvvəlcə səsi dinlə.</Text> : null}
    </View>;
  })();

  // Kömək: step 1 is the hint (shown at once); step 2 shows a model (voice) or the audio text (listening). Step 2 counts as help.
  const helpSample = task?.type === 'voice' && !task.repeat ? task.sample ?? task.rule.answers[0] : undefined;
  const help = task ? <Sheet visible={helpOpen} onClose={() => setHelpOpen(false)} title="Kömək" icon="bulb">
    {task.hint ? <Text style={ds.strong}>{task.hint}</Text> : null}
    {helpSample && !(lesson.order <= 2 && task.type === 'voice' && task.sample) && !sampleShown ? <SheetOption icon="doc" highlight label="Nümunəni göstər" note="Nümunəyə baxıb desən, nəticə “Köməklə” olacaq."
      onPress={() => { setHelpOpen(false); setSampleShown(true); useUserStore.getState().useHelp(attempt); }} /> : null}
    {listeningTask ? <SheetOption icon="doc" label="Mətnlə davam et" note="Dinləmə yoxlanmamış qalacaq."
      onPress={() => { setHelpOpen(false); stopAudio(); setTextShown(true); setTextVisible(true); useUserStore.getState().useHelp(attempt); }} /> : null}
  </Sheet> : null;

  const glossInfo = gloss ? glossOf(gloss) : undefined;
  const glossSheet = <Sheet visible={Boolean(gloss)} onClose={() => setGloss('')} title={gloss}>
    {glossInfo ? <><Text style={ds.strong}>{glossInfo.az}</Text>{glossInfo.role ? <Text style={ds.body}>{glossInfo.role}</Text> : null}</> : null}
    <PlayButton onPress={() => speak(gloss)} size={48} label={`Dinlə: ${gloss}`} />
    {task && peeked ? <Text style={ds.small}>Bu tapşırıqda söz mənasına baxdın — nəticə “Köməklə” qeyd olunacaq.</Text> : null}
  </Sheet>;

  return <KeyboardAvoidingView style={[s.screen, { paddingTop: insets.top }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
    <Header title={`Dərs ${lesson.order}`} progress={progress} onBack={exit} onMenu={showResult ? undefined : () => setMenuOpen(true)} />
    {/* Fits without scrolling on normal phones; scrolls only when the content is taller (large text, keyboard). */}
    <ScrollView style={{ flex: 1 }} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" bounces={false} alwaysBounceVertical={false}
      overScrollMode="never" onLayout={e => setViewport(e.nativeEvent.layout.height)}>
      {/* A short slide-in marks each new card; Reanimated skips it when the system asks for reduced motion. */}
      <Animated.View key={`${showResult ? 'result' : reviewing ? `r${reviewStep}` : index}`} entering={FadeIn.duration(180)} style={{ flexGrow: 1 }}>
        {body}
      </Animated.View>
    </ScrollView>
    <View style={[s.footer, { paddingBottom: Math.max(14, insets.bottom + 6) }]}>{footer}</View>

    {help}
    {glossSheet}
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
  const color = { independent: d.green, assisted: d.orange, needsPractice: d.red, unverified: d.lavender } as const;
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

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: d.bg },
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
  sample: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 18, backgroundColor: '#E8DDFB', paddingHorizontal: 18, minHeight: 56 },
  sampleLabel: { color: d.purple, fontSize: 17, ...font.bold },
  sampleText: { flex: 1, flexShrink: 1, color: d.purple, fontSize: 22, lineHeight: 28, paddingVertical: 10, ...font.extrabold },
  notice: { color: d.purple, fontSize: 15, ...font.bold },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap', paddingVertical: 4 },
  status: { borderWidth: 1.5, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 13, ...font.bold },
});
