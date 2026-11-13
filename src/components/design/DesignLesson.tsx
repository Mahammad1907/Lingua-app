import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, BackHandler, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { DesignLesson as Lesson, IntroCard, TeachCard, TwoTask } from '../../data/designLessonTypes';
import { useUserStore } from '../../store/userStore';
import { useVocabularyStore } from '../../store/vocabularyStore';
import {
  gradeChoice, gradeMatch, gradeText, gradeTwo, isTask, joinTiles, lessonFlow, lessonTaskIds, resolveLesson, reviewTask, statusLabels, taskStatus,
  type FlowCard, type Graded, type TaskRecord, type TwoGraded,
} from '../../utils/designLesson';
import type { TaskEvidence } from '../../utils/lessonEvidence';
import type { SpokenAnswer, UnverifiedRecording } from '../../utils/speechTurn';
import HoldToTalk from './HoldToTalk';
import { ChatThread, GapSentence, MatchBoard, PhraseCard, SceneSpots, TileTray, WordView } from './TaskScreens';
import Icon from './Icons';
import { ExplainSheet, MenuPopover, ReportSheet, ResultPanel } from './LessonSheets';
import { AudioPanel, Capsule, Card, Chip, ChoiceOption, Field, Header, MainButton, Sheet, SheetOption, ds } from './parts';
import { d, shadow, font } from './theme';
import { sceneImage } from '../../config/sceneImages';
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
  const [hintUsed, setHintUsed] = useState(false);
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
    setHelpOpen(false); setHintOpen(false); setExplainOpen(false);
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
    assisted: Boolean(reviewing || meaningHint || (task?.type === 'voice' && task.sample)),
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
    if (showResult) { router.replace({ pathname: '/module/[id]', params: { id: 'module_1' } }); return; }
    Alert.alert('Dərsdən çıxırsan?', 'Bu dərsdəki irəliləyiş saxlanmayacaq.', [
      { text: 'Davam et', style: 'cancel' },
      { text: 'Çıx', style: 'destructive', onPress: () => { if (attempt) useUserStore.getState().abandonLesson(attempt); router.replace({ pathname: '/module/[id]', params: { id: 'module_1' } }); } },
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
    if (current.type === 'word') return <WordView card={current} onPlay={t => speak(t)} />;
    if (current.type === 'teach') return <TeachView card={current} lesson={lesson} onPlay={t => speak(t)} onWord={setWord} />;
    return taskView();
  })();

  function taskView() {
    if (!task) return null;
    const single = result?.kind === 'single' ? result.graded : undefined;
    const fieldState = (status?: string) => status === 'correct' ? 'correct' as const : status === 'wrong' ? 'wrong' as const : undefined;
    const repeat = task.type === 'voice' ? task.repeat : undefined;
    const hasHelp = Boolean(task.hint || (audio && !repeat));
    // Voice tasks: the only help is the text, so the button toggles it directly.
    const directText = task.type === 'voice' && Boolean(audio) && !task.hint;
    const helpLabel = directText ? (textVisible ? 'Mətni gizlət' : 'Mətni göstər') : audio ? 'Kömək' : 'İpucu';
    const helpIcon = directText ? 'doc' as const : 'bulb' as const;
    const markOf = (status: string) => status === 'correct' ? 'correct' as const : status === 'wrong' ? 'wrong' as const : undefined;
    const spotsShown = task.type === 'choice' && Boolean(task.spots && sceneImage(task.scenes));
    const pickTiles = (next: number[]) => {
      if (task.type !== 'write' || !task.tiles) return;
      setPicked(next); setText(joinTiles(next.map(i => task.tiles![i])));
      if (result?.kind === 'unverified') setResult(null);
    };
    const lines = task.prompt.split('\n');
    const context = lines.length > 1 ? lines[0] : '';
    const instruction = lines.length > 1 ? lines.slice(1).join('\n') : lines[0];
    const mascotRow = task.speaker === 'mascot' && !audio;
    const scene = sceneImage(task.scenes);
    const openHelp = () => {
      if (directText) { stopAudio(); setTextShown(true); setTextVisible(v => !v); return; }
      if (audio) { setHelpOpen(true); return; }
      setHintOpen(true); setHintUsed(true);
      if (task.hintAssists) useUserStore.getState().useHelp(attempt);
    };
    return <View style={s.gap}>
      {reviewing ? <View style={{ gap: 6 }}><Chip label="Təkrar" />{reviewStep === 0 ? <Text style={ds.small}>{lesson.notices.review}</Text> : null}</View> : null}
      <Text accessibilityRole="header" style={ds.title}>{task.title}</Text>
      {/* Situation lines are quieter; the line that says what to do is the strongest. */}
      <View style={mascotRow ? s.speakerRow : undefined}>
        {mascotRow ? <Image source={mascotHead} style={s.speakerHead} contentFit="contain" accessibilityLabel={characterAz('mascot') || 'Dostun'} /> : null}
        <View style={{ flex: 1, gap: 2 }}>
          {context ? <Text style={ds.subtitle}>{context}</Text> : null}
          <Text style={ds.instruction}>{instruction}</Text>
        </View>
      </View>
      {scene && !spotsShown ? <Image source={scene} style={s.scene} contentFit="cover" accessibilityIgnoresInvertColors /> : null}
      {audio ? <AudioPanel playing={playing} onPlay={() => speak(audio, 0.85, listeningTask)} onSlow={() => speak(audio, 0.45, listeningTask)}
        avatar={task.speaker === 'mascot' && !repeat ? <Image source={mascotHead} style={{ width: 62, height: 48 }} contentFit="contain" accessibilityLabel={characterAz('mascot') || 'Danışan'} /> : undefined} /> : null}
      {soundError && !textShown ? <Card style={{ gap: 10 }}><Text style={ds.body}>{lesson.notices.soundFailed}</Text>
        <View style={s.row}><Capsule small icon="retry" label="Yenidən dinlə" onPress={() => speak(audio!, 0.85, true)} /><Capsule small icon="doc" label="Mətnlə davam et" onPress={() => { setTechnical(true); setTextShown(true); setTextVisible(true); }} /></View></Card> : null}
      {textVisible && audio ? <Pressable accessibilityRole="button" accessibilityHint="Mətni gizlətmək üçün toxun" onPress={() => setTextVisible(false)} style={s.transcript}>
        <Text style={s.transcriptText}>{audio}</Text>
        {listeningTask ? <Text style={ds.small}>Audio mətnini görürsən. Bu hissədə dinləmə yoxlanmadı.</Text> : null}
      </Pressable> : null}
      {task.type === 'voice' && task.sample ? <View style={s.sample}><Text style={s.sampleLabel}>Nümunə</Text><View style={s.vline} /><Text style={s.sampleText}>{task.sample}</Text></View> : null}
      {repeat && audio ? <PhraseCard text={audio} stress={repeat.stress} note={repeat.note} /> : null}
      {task.type === 'choice' && task.gap ? <GapSentence speaker={task.gap.speaker} before={task.gap.before} after={task.gap.after} options={task.options} value={choice}
        disabled={Boolean(result && result.kind !== 'unverified')} mark={single ? markOf(single.status) : undefined}
        onPick={o => { setChoice(o); if (result?.kind === 'unverified') setResult(null); }} /> : null}
      {task.type === 'choice' && spotsShown ? <SceneSpots scenes={task.scenes} spots={task.spots!} value={choice} disabled={Boolean(result && result.kind !== 'unverified')}
        mark={single ? markOf(single.status) : undefined} onPick={o => { setChoice(o); if (result?.kind === 'unverified') setResult(null); }} /> : null}
      {task.type === 'match' ? <MatchBoard task={task} pairs={pairs} active={activeRow} disabled={Boolean(result)} marks={single?.rows}
        onActive={en => { setActiveRow(en); if (pairs[en]) setPairs(p => { const { [en]: _gone, ...rest } = p; return rest; }); setNotice(''); }}
        onPlace={az => { const target = activeRow && !pairs[activeRow] ? activeRow : task.rows.find(r => !pairs[r.en])?.en; if (!target) return;
          setPairs(p => ({ ...p, [target]: az })); setNotice(''); setActiveRow(task.rows.find(r => r.en !== target && !pairs[r.en])?.en ?? ''); }} /> : null}
      {task.type === 'write' && task.chat ? <ChatThread partner={task.chat.partner} from={task.chat.from} lines={task.chat.lines} placeholder={task.tiles ? 'Sözlərə toxun…' : 'Sənin cavabın…'}
        mine={text} mark={single ? markOf(single.status) : undefined}>
        {task.tiles ? <TileTray tiles={task.tiles} picked={picked} disabled={locked.current}
          onPick={i => pickTiles(picked.includes(i) ? picked.filter(x => x !== i) : [...picked, i])} /> : null}
      </ChatThread> : null}
      {task.type === 'choice' && !task.gap && !spotsShown ? <View style={s.gap}>{task.options.map(o => <ChoiceOption key={o} label={o} selected={choice === o} disabled={Boolean(result && result.kind !== 'unverified')}
        state={single && choice === o ? (single.status === 'correct' ? 'correct' : single.status === 'wrong' ? 'wrong' : undefined) : undefined}
        onPress={() => { setChoice(o); if (result?.kind === 'unverified') setResult(null); }} />)}</View> : null}
      {task.type === 'write' && !task.tiles ? <Field onSubmit={() => { if (text.trim() && !(listeningTask && !heard && !textShown && !technical)) check(); }} value={text} onChange={v => { setText(v); if (result?.kind === 'unverified') setResult(null); }} placeholder={task.placeholder} editable={!locked.current} state={fieldState(single?.status)} /> : null}
      {task.type === 'two' ? <TwoFields task={task} values={two} onChange={(id, v) => { setTwo(all => ({ ...all, [id]: v })); setNotice(''); if (result?.kind === 'unverified') setResult(null); }}
        graded={result?.kind === 'two' ? result.graded : undefined} keep={reviewing ? keepFields[task.id]?.fields : undefined} /> : null}
      {/* Help sits under the answers, on the right: read the task, try, then ask for help. */}
      {hasHelp ? <Capsule tone="outline" small align="flex-end" icon={helpIcon} label={helpLabel} onPress={openHelp} /> : null}
      {notice ? <Text accessibilityLiveRegion="polite" style={s.notice}>{notice}</Text> : null}
      {task.type === 'voice' && (!result || result.kind === 'unverified' || voiceRetry) ? <View style={{ paddingTop: 6 }}>
        <HoldToTalk onFinal={onSpoken} onRecording={onRecording} onBusyChange={setVoiceBusy} suspended={helpOpen || explainOpen || reportOpen || menuOpen} />
      </View> : null}
    </View>;
  }

  // ---------- Footer ----------
  const footer = (() => {
    if (showResult) return finish ? <MainButton label={lesson.result.button} onPress={exit} arrow /> : null;
    if (!current) return null;
    if (current.type === 'intro') return <MainButton label={current.start} onPress={next} arrow />;
    if (current.type === 'teach') return <MainButton label="Davam et" tone="green" onPress={next} arrow />;
    if (current.type === 'word') return <MainButton label="Anladım" onPress={next} />;
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
        assisted={!reviewing && Boolean(meaningHint || (task.type === 'voice' && task.sample))} collapsed={collapsed} onCollapse={() => setCollapsed(true)} onReport={() => setReportOpen(true)} onContinue={next} />;
      return <ResultPanel tone="wrong" title="Bir daha baxaq" short={graded.short} answers={graded.explain?.answers} collapsed={collapsed} onCollapse={() => setCollapsed(true)}
        onExplain={graded.explain ? () => setExplainOpen(true) : undefined} onReport={() => setReportOpen(true)} onContinue={next}
        actions={task.type === 'voice' && !reviewing && !voiceRetried ? <Capsule small icon="retry" label="Yenidən cəhd et" onPress={() => { locked.current = false; setVoiceRetry(true); setVoiceRetried(true); setCollapsed(true); }} /> : undefined} />;
    }
    const empty = task.type === 'choice' ? !choice : task.type === 'write' ? !text.trim() : task.type === 'two' ? !Object.values(two).some(v => v.trim())
      : task.type === 'match' ? task.rows.some(r => !pairs[r.en]) : true;
    const needsAudio = listeningTask && !heard && !textShown && !technical;
    return <View style={{ gap: 12 }}>
      {listeningTask ? <Capsule icon="muted" label="İndi dinləyə bilmirəm" onPress={cannotListen} /> : null}
      {task.type === 'voice' ? <Capsule label="Keç" onPress={skipVoice} disabled={voiceBusy} /> : <MainButton label="Yoxla" disabled={empty || needsAudio} onPress={check} />}
      {needsAudio && !empty ? <Text style={[ds.small, { textAlign: 'center' }]}>Əvvəlcə səsi dinlə.</Text> : null}
    </View>;
  })();

  const help = task && audio ? <Sheet visible={helpOpen} onClose={() => setHelpOpen(false)} title="Kömək seç">
    <Text style={[ds.subtitle, { marginTop: -6 }]}>Necə davam etmək istəyirsən?</Text>
    {task.hint ? <SheetOption icon="bulb" label="İpucu" onPress={() => { setHelpOpen(false); setHintUsed(true); if (task.hintAssists) useUserStore.getState().useHelp(attempt); setTimeout(() => setHintOpen(true), SHEET_GAP); }} /> : null}
    <SheetOption icon="doc" highlight label={task.type === 'voice' ? (textVisible ? 'Mətni gizlət' : 'Mətni göstər') : 'Mətnlə davam et'} note={listeningTask ? 'Dinləmə yoxlanmamış qalacaq.' : undefined}
      onPress={() => { setHelpOpen(false); stopAudio(); setTextShown(true); setTextVisible(v => task.type === 'voice' ? !v : true); if (listeningTask) useUserStore.getState().useHelp(attempt); }} />
  </Sheet> : null;

  return <KeyboardAvoidingView style={[s.screen, { paddingTop: insets.top }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
    <Header title={`Dərs ${lesson.order}`} progress={progress} onBack={exit} onMenu={showResult ? undefined : () => setMenuOpen(true)} />
    {/* Fits without scrolling on normal phones; scrolls only when the content is taller (large text, keyboard). */}
    <ScrollView style={{ flex: 1 }} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" bounces={false} alwaysBounceVertical={false}
      overScrollMode="never" onLayout={e => setViewport(e.nativeEvent.layout.height)}>
      {/* A short slide-in marks each new card; Reanimated skips it when the system asks for reduced motion. */}
      <Animated.View key={`${showResult ? 'result' : reviewing ? `r${reviewStep}` : index}`} entering={showResult ? FadeIn.duration(260) : FadeInRight.duration(240).springify().damping(22)}>
        {body}
      </Animated.View>
    </ScrollView>
    <View style={[s.footer, { paddingBottom: Math.max(14, insets.bottom + 6) }]}>{footer}</View>

    {help}
    {task?.hint ? <Sheet visible={hintOpen} onClose={() => setHintOpen(false)} title="İpucu" icon="bulb"><Text style={ds.strong}>{task.hint}</Text></Sheet> : null}
    <ExplainSheet visible={explainOpen} explain={result && result.kind !== 'unverified' ? result.graded.explain : undefined} onClose={() => setExplainOpen(false)} onReport={() => { setExplainOpen(false); setTimeout(() => setReportOpen(true), SHEET_GAP); }} />
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

function NewWordText({ text, lesson, onWord, style }: { text: string; lesson: Lesson; onWord: (w: string) => void; style: object }) {
  const words = new Map(lesson.vocabulary.map(v => [v.word.toLowerCase(), v.word]));
  return <Text style={style}>{text.split(/(\b[A-Za-z]+\b)/).map((part, i) => {
    const key = words.get(part.toLowerCase());
    return key ? <Text key={i} accessibilityRole="link" accessibilityHint="Sözün mənasını aç" onPress={() => onWord(key)} style={{ color: d.purple }}>{part}</Text> : part;
  })}</Text>;
}

function TeachView({ card, lesson, onPlay, onWord }: { card: TeachCard; lesson: Lesson; onPlay: (t: string) => void; onWord: (w: string) => void }) {
  const first = card.phrases[0];
  return <View style={s.gap}>
    <Chip label="Öyrən" />
    <Text accessibilityRole="header" style={ds.title}>{card.title}</Text>
    {card.lead ? <Text style={ds.subtitle}>{card.lead}</Text> : null}
    <View style={s.hero}>
      <Image source={mascotFull} style={{ width: 130, height: 150 }} contentFit="contain" accessibilityLabel="Maskot" />
      <View style={s.bubble}>
        <NewWordText text={first.en} lesson={lesson} onWord={onWord} style={s.bubbleText} />
        <Pressable accessibilityRole="button" accessibilityLabel={`Dinlə: ${first.en}`} onPress={() => onPlay(first.en)} style={s.smallPlay}><Icon name="play" size={20} color={d.purple} /></Pressable>
      </View>
    </View>
    <Card style={{ gap: 0, paddingVertical: 6 }}>
      <View style={s.infoRow}>
        <View style={s.infoIcon}><Icon name="tag" size={22} color={d.purple} /></View>
        <View style={{ flex: 1, gap: 6 }}><Text style={ds.label}>Mənası</Text>
          {card.phrases.map(p => <View key={p.en} style={s.phrase}>
            <Text style={[ds.strong, { flex: 1 }]}><NewWordText text={p.en} lesson={lesson} onWord={onWord} style={ds.strong} /> — {p.az}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel={`Dinlə: ${p.en}`} onPress={() => onPlay(p.en)} style={s.smallPlay}><Icon name="play" size={18} color={d.purple} /></Pressable>
          </View>)}
        </View>
      </View>
      {card.notes.length ? <View style={[s.infoRow, { borderTopWidth: 1, borderTopColor: d.border }]}>
        <View style={s.infoIcon}><Icon name="chat" size={22} color={d.purple} /></View>
        <View style={{ flex: 1, gap: 4 }}><Text style={ds.label}>Qısa izah</Text>{card.notes.map(n => <NewWordText key={n} text={n} lesson={lesson} onWord={onWord} style={ds.body} />)}</View>
      </View> : null}
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
    <View style={s.row}><Text style={ds.small}>{v.pronunciation}</Text><Capsule small icon="speaker" label="Dinlə" onPress={() => onPlay(v.word)} /></View>
    <Text style={ds.label}>Mənası</Text><Text style={ds.strong}>{v.translation}</Text>
    <Text style={ds.body}>{v.usageNote}</Text>
    <Text style={ds.label}>Nümunə</Text>
    <View style={s.row}><View style={{ flex: 1 }}><Text style={ds.strong}>{v.example}</Text><Text style={ds.small}>{v.exampleAz}</Text></View><Capsule small icon="play" label="Dinlə" onPress={() => onPlay(v.example)} /></View>
    <Text style={ds.small}>Bu söz “Lüğətim”ə əlavə olunub.</Text>
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
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  disc: { backgroundColor: 'rgba(142,99,232,.13)', alignItems: 'center', justifyContent: 'center' },
  goal: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 58 },
  goalIcon: { width: 44, alignItems: 'center' },
  vline: { width: 1, alignSelf: 'stretch', marginVertical: 8, backgroundColor: d.border },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 26, backgroundColor: '#5B2BC9', padding: 14, ...shadow },
  bubble: { flex: 1, alignItems: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 22, paddingVertical: 16, paddingHorizontal: 12 },
  bubbleText: { color: d.ink, fontSize: 34, ...font.extrabold },
  smallPlay: { width: 44, height: 44, borderRadius: 22, backgroundColor: d.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  infoRow: { flexDirection: 'row', gap: 12, paddingVertical: 10 },
  infoIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: d.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  phrase: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  transcript: { borderRadius: 16, backgroundColor: d.purpleSoft, padding: 12, gap: 4 },
  transcriptText: { color: d.purple, fontSize: 20, ...font.extrabold },
  speakerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  speakerHead: { width: 52, height: 52, borderRadius: 26, backgroundColor: d.purpleSoft },
  scene: { width: '100%', aspectRatio: 16 / 9, borderRadius: 22, backgroundColor: d.purpleSoft },
  sample: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 18, backgroundColor: '#E8DDFB', paddingHorizontal: 18, minHeight: 56 },
  sampleLabel: { color: d.lavenderText, fontSize: 17, ...font.semibold },
  sampleText: { color: d.purple, fontSize: 24, ...font.extrabold },
  notice: { color: d.purple, fontSize: 15, ...font.bold },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap', paddingVertical: 4 },
  status: { borderWidth: 1.5, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 13, ...font.bold },
});
