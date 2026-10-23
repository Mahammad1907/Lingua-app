import EnergyMeter from '../../components/EnergyMeter';
import EarnedXP from '../../components/EarnedXP';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AudioSceneActivity from '../../components/AudioSceneActivity';
import LessonArtwork3D from '../../components/lesson/LessonArtwork3D';
import { HomeArtwork } from '../../components/home/HomeArtwork';
import { lessonArtworkKind, lessonBoardText } from '../../utils/lessonArtwork';
import { lessonTheme as t } from '../../constants/lessonTheme';
import VoiceChatLesson, { VoiceStats } from '../../components/VoiceChatLesson';
import { getShortSession, ShortSession } from '../../data/firstConversation';
import { getLessonById } from '../../data/lessons';
import { Lesson } from '../../data/types';
import { useUserStore } from '../../store/userStore';
import { useVocabularyStore } from '../../store/vocabularyStore';
import { isSessionAnswerCorrect } from '../../utils/sessionAnswer';
import { getPacketLesson } from '../../data/b1Course';
import PacketLesson from '../../components/lesson/PacketLesson';

export default function LessonSessionScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const lesson = getLessonById(params.id || '');
  const content = getShortSession(params.id || '');
  const packet = getPacketLesson(params.id || '');
  if (packet) return <PacketLesson key={packet.id} packet={packet} />;
  if (!lesson || !content) return <View style={styles.errorScreen}><Text style={styles.title}>Dərs tapılmadı</Text><TouchableOpacity onPress={() => router.back()}><Text style={styles.link}>Geri qayıt</Text></TouchableOpacity></View>;
  return <ShortLesson key={lesson.id} lesson={lesson} content={content} />;
}

function ShortLesson({ lesson, content }: { lesson: Lesson; content: ShortSession }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [warmup, setWarmup] = useState(Boolean(content.warmup));
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [built, setBuilt] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [name, setName] = useState('');
  const [ownCard, setOwnCard] = useState(false);
  const [finished, setFinished] = useState(false);
  const [oralStage, setOralStage] = useState(false);
  const [voiceStats, setVoiceStats] = useState<VoiceStats | null>(null);
  const [showPhrases, setShowPhrases] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const scroll = useRef<ScrollView>(null);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const completing = useRef(false);
  const lastAdvance = useRef('');
  const attempt = useRef('');
  const [attemptId, setAttemptId] = useState('');
  const [receiptId, setReceiptId] = useState('');
  const [completionError, setCompletionError] = useState('');
  useEffect(() => {
    if (!attempt.current) attempt.current = useUserStore.getState().beginLesson(lesson.id);
    setAttemptId(attempt.current);
  }, [lesson.id]);
  const current = warmup ? content.warmup! : content.steps[index];
  const exercise = current?.exercise;
  const activity = current?.activity || content.style;

  useEffect(() => () => { void Speech.stop(); }, []);
  const backToMap = () => { void Speech.stop(); router.replace(`/module/${lesson.moduleId}`); };

  const complete = async (spoken?: VoiceStats) => {
    if (completing.current) return;
    completing.current = true; setCompletionError('');
    try {
      const receipt = await useUserStore.getState().finishLesson(attempt.current);
      setReceiptId(receipt.id);
      setSessionCompleted(receipt.completed);
      if (spoken) setVoiceStats(spoken);
      if (receipt.completed) await useVocabularyStore.getState().addLessonWords(lesson.id);
      setFinished(true);
    } catch {
      setCompletionError('Nəticə saxlanmadı. Yenidən cəhd et.');
      completing.current = false;
      lastAdvance.current = '';
    }
  };

  const check = (value = answer) => {
    if (!exercise || !value.trim() || feedback === 'correct') return;
    const correct = isSessionAnswerCorrect(value, exercise.correctAnswer, exercise.answerLang || 'en', exercise.acceptedAnswers, exercise.type === 'fill_blank' || exercise.type === 'translation');
    useUserStore.getState().recordTask(attempt.current, exercise.id, correct, value);
    if (!correct) useUserStore.getState().useHelp(attempt.current);
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) Keyboard.dismiss();
  };
  const next = () => {
    const key = `${warmup}:${index}`;
    if (lastAdvance.current === key) return;
    lastAdvance.current = key;
    void Speech.stop();
    setAnswer(''); setBuilt([]); setFeedback(null); setShowPhrases(false); setTeacherOpen(false);
    scroll.current?.scrollTo({ y: 0, animated: false });
    if (warmup) { setWarmup(false); return; }
    if (index + 1 < content.steps.length) setIndex((value) => value + 1);
    else if (content.personalCard) setOwnCard(true);
    else if (content.speaking) setOralStage(true);
    else complete();
  };
  const speak = async (text: string) => {
    await Speech.stop();
    Speech.speak(text, { language: 'en-GB', rate: 0.75 });
  };

  if (finished) return <View style={[styles.screen, styles.result, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
    <Stack.Screen options={{ headerShown: false }} />
    <HomeArtwork name="fox" style={{ width: 150, height: 145 }} />
    <Text style={styles.title}>{sessionCompleted ? 'Bu dərs bitdi!' : 'Məşq bitdi · cavabsız tapşırıqlar qalıb'}</Text>
    <EarnedXP receiptId={receiptId} />
    <Text style={styles.body}>{lesson.titleAz}</Text>
    <Text style={styles.goal}>{lesson.canDo}</Text>
    <Text style={styles.body}>{lesson.focus === 'speaking' ? 'Səsli söhbəti məşq etdin. Tələffüz balı verilmir.' : `${lesson.exercises.length} yazılı/dinləmə tapşırığını məşq etdin.`}</Text>
    {voiceStats ? <Text style={styles.note}>Danışıq: ilk cəhddə uyğun {voiceStats.correct} · Təkrar {voiceStats.wrong} · Keçildi {voiceStats.skipped}</Text> : null}
    <TouchableOpacity style={styles.primary} onPress={backToMap}><Text style={styles.primaryText}>Bölmə xəritəsinə qayıt</Text></TouchableOpacity>
    <Text style={styles.note}>Növbəti dərsi xəritədən özün açacaqsan.</Text>
  </View>;

  if (!attemptId) return <View style={styles.errorScreen}><Text style={styles.title}>Dərs hazır deyil və ya bölmə kilidlidir.</Text><TouchableOpacity onPress={backToMap}><Text style={styles.link}>Geri</Text></TouchableOpacity></View>;
  if (oralStage && content.speaking) return <VoiceChatLesson turns={[content.speaking]} initialName={name} attemptId={attemptId} completionError={completionError} onFinish={complete} onBack={backToMap} />;
  if (content.style === 'voice_chat') return <VoiceChatLesson turns={content.turns || []} attemptId={attemptId} completionError={completionError} onFinish={complete} onBack={backToMap} />;

  const needsCheck = exercise?.type === 'sentence_build' || exercise?.type === 'fill_blank' || exercise?.type === 'translation';
  const canCheck = exercise?.type === 'sentence_build' ? built.length > 0 : Boolean(answer.trim());
  const actionLabel = ownCard ? 'Bu dərsi bitir' : feedback === 'correct'
    ? warmup ? 'Əsas dərsə başla' : index + 1 < content.steps.length ? 'Davam et' : content.personalCard ? 'Öz kartımı hazırla' : 'Bu dərsi bitir'
    : needsCheck ? 'Yoxla' : 'Cavabı seç';
  const action = () => {
    if (ownCard) { Keyboard.dismiss(); if (content.speaking) setOralStage(true); else complete(); }
    else if (feedback === 'correct') next();
    else if (exercise.type === 'sentence_build') check(built.map((i) => exercise.words![i]).join(' '));
    else check();
  };
  const actionEnabled = ownCard ? Boolean(name.trim()) : feedback === 'correct' || (needsCheck && canCheck);
  return <KeyboardAvoidingView style={[styles.screen, { paddingTop: insets.top }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <Stack.Screen options={{ headerShown: false }} />
    <View style={styles.header}>
      <TouchableOpacity accessibilityLabel="Bölmə xəritəsinə qayıt" style={styles.back} onPress={backToMap}><Text style={styles.backText}>‹</Text></TouchableOpacity>
      <View style={{ flex: 1 }}><Text style={styles.label}>{lesson.order}/6 · İLK TANIŞLIQ</Text><Text style={styles.headerTitle}>{lesson.titleAz}</Text></View>
      <EnergyMeter compact />
    </View>
    <View style={styles.progressRow}><View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${ownCard ? 100 : warmup ? 0 : (index + 1) / content.steps.length * 100}%` }]} /></View><Text style={styles.counter}>{warmup ? 'Təkrar' : ownCard ? 'Kartın' : `${index + 1}/${content.steps.length}`}</Text></View>
    <ScrollView ref={scroll} style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      {ownCard ? <>
        <LessonArtwork3D kind="identity" />
        <Text style={styles.title}>İndi öz kartını hazırla</Text>
        <Text style={styles.body}>Adını yaz. Hazır cümləni dinlə, sonra özün ucadan de.</Text>
        <TextInput accessibilityLabel="Adın" value={name} onChangeText={setName} maxLength={30} placeholder="Adın" placeholderTextColor={t.muted} style={styles.input} returnKeyType="done" onSubmitEditing={() => { if (name.trim()) action(); }} />
        {name.trim() ? <TouchableOpacity style={styles.nameCard} onPress={() => void speak(`Hi! I'm ${name.trim()}.`)}><Text style={styles.nameLabel}>SƏNİN TANIŞLIQ KARTIN</Text><Text style={styles.nameTitle}>Hi! I’m {name.trim()}.</Text><Text style={styles.note}>▶ Dinlə və özün de</Text></TouchableOpacity> : null}
      </> : <>
        {warmup ? <Text style={styles.warmup}>Əvvəlki dərsdən bir qısa təkrar</Text> : null}
        <TouchableOpacity accessibilityRole="button" accessibilityState={{ expanded: teacherOpen }} onPress={() => { useUserStore.getState().useHelp(attempt.current); setTeacherOpen((value) => !value); }} style={styles.teacher}>
          <View style={styles.tipIcon}><Text style={styles.tipQuestion}>?</Text></View>
          <View style={{ flex: 1 }}><Text style={styles.tipLabel}>Kiçik ipucu</Text>{teacherOpen ? <Text style={styles.teacherText}>{current.teacher}</Text> : <Text style={styles.note}>İzahı açmaq üçün toxun</Text>}</View>
          <Text style={styles.counter}>{teacherOpen ? '−' : '+'}</Text>
        </TouchableOpacity>
        {!warmup ? <LessonArtwork3D kind={lessonArtworkKind(current, content.style, lesson.order, index)} boardText={lessonBoardText(current)} correction={Boolean(current.foxSays)} /> : null}
        <Text style={styles.question}>{exercise.question}</Text>
        {activity === 'order' && !warmup ? <View style={styles.messageDraft}><Text style={styles.label}>SƏNİN MESAJIN</Text><Text style={styles.draftText}>{exercise.type === 'sentence_build' ? (built.map((i) => exercise.words![i]).join(' ') || 'Mesajı hazırla…') : (answer || 'Uyğun mesajı seç…')}</Text></View> : null}
        {activity === 'scene' && !warmup ? <AudioSceneActivity key={exercise.id} audio={current.audio!} options={exercise.options || []} selected={answer} disabled={feedback === 'correct'} onAnswer={(value) => { setAnswer(value); check(value); }} /> : <>
          {current.audio ? <TouchableOpacity style={styles.audio} onPress={() => void speak(current.audio!)} accessibilityLabel="İngiliscə səsi dinlə"><Text style={styles.audioText}>▶ {activity === 'dialogue' ? 'Səsli mesaj' : 'Səsi dinlə'}</Text></TouchableOpacity> : null}
          {exercise.type === 'sentence_build' ? <>
            <View style={styles.sentence}>
              {built.length ? built.map((wordIndex, position) => <TouchableOpacity key={`${wordIndex}-${position}`} disabled={feedback === 'correct'} style={styles.word} onPress={() => { setBuilt((value) => value.filter((_, i) => i !== position)); setFeedback(null); }}><Text style={styles.wordText}>{exercise.words![wordIndex]}</Text></TouchableOpacity>) : <Text style={styles.note}>Sözləri seçərək cümləni qur</Text>}
            </View>
            <View style={styles.words}>{exercise.words?.map((word, wordIndex) => <TouchableOpacity key={wordIndex} disabled={built.includes(wordIndex) || feedback === 'correct'} style={[styles.word, built.includes(wordIndex) && styles.usedWord]} onPress={() => { setBuilt((value) => [...value, wordIndex]); setFeedback(null); }}><Text style={styles.wordText}>{word}</Text></TouchableOpacity>)}</View>
          </> : exercise.type === 'fill_blank' || exercise.type === 'translation' ? <>
            <TextInput accessibilityLabel="Cavabın" style={styles.input} placeholder={exercise.type === 'translation' ? 'İngiliscə yaz' : 'Yalnız boşluğa uyğun hissəni yaz'} placeholderTextColor={t.muted} value={answer} autoCorrect={false} autoCapitalize="none" editable={feedback !== 'correct'} returnKeyType="done" onSubmitEditing={() => check()} onChangeText={(value) => { setAnswer(value); setFeedback(null); }} />
          </> : exercise.options?.map((option) => <TouchableOpacity key={option} accessibilityRole="button" accessibilityState={{ selected: answer === option }} disabled={feedback === 'correct'} style={[styles.option, answer === option && styles.selectedOption]} onPress={() => { setAnswer(option); check(option); }}><Text style={styles.optionText}>{option}</Text><Text style={styles.optionMark}>{answer === option ? feedback === 'correct' ? '✓' : '•' : '○'}</Text></TouchableOpacity>)}
        </>}
      </>}
      {!warmup && lesson.vocabulary.length ? <>
        <TouchableOpacity onPress={() => { useUserStore.getState().useHelp(attempt.current); setShowPhrases((value) => !value); }}><Text style={styles.link}>{showPhrases ? 'İfadələri gizlət ↑' : 'Bu dərsin ifadələri ↓'}</Text></TouchableOpacity>
        {showPhrases ? lesson.vocabulary.map((word) => <TouchableOpacity key={word.id} style={styles.phrase} onPress={() => void speak(word.word)}><Text style={styles.phraseWord}>▶ {word.word}</Text><Text style={styles.note}>{word.translation}</Text><Text style={styles.note}>{word.usageNote}</Text></TouchableOpacity>) : null}
      </> : null}
    </ScrollView>
    <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {completionError ? <Text style={styles.note}>{completionError}</Text> : null}
      {feedback && !ownCard ? <View accessibilityLiveRegion="polite" style={[styles.feedback, feedback === 'wrong' && styles.feedbackWrong]}>
        <Text style={[styles.feedbackTitle, feedback === 'wrong' && { color: t.error }]}>{feedback === 'correct' ? '✓ Düzdür!' : 'Bir də yoxlayaq'}</Text>
        <Text style={styles.feedbackText} numberOfLines={3}>{exercise.explanation}</Text>
      </View> : null}
      <TouchableOpacity accessibilityRole="button" disabled={!actionEnabled} style={[styles.primary, !actionEnabled && styles.disabled]} onPress={action}><Text style={styles.primaryText}>{actionLabel}</Text><Text style={styles.primaryArrow}>›</Text></TouchableOpacity>
    </View>
  </KeyboardAvoidingView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: t.background },
  tipIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: t.raised, alignItems: 'center', justifyContent: 'center' },
  tipQuestion: { color: t.orange, fontWeight: '800', fontSize: 18 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 8 },
  back: { width: 34, minHeight: 44, justifyContent: 'center' }, backText: { color: t.text, fontSize: 36 }, label: { color: t.muted, fontSize: 9, letterSpacing: 1, marginBottom: 5 },
  headerTitle: { color: t.text, fontSize: 18, fontWeight: '800' }, counter: { color: t.orange, fontSize: 11, fontWeight: '700' }, level: { backgroundColor: t.surface, paddingHorizontal: 11, paddingVertical: 7, borderRadius: 10 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, marginBottom: 10 }, progressTrack: { height: 5, borderRadius: 3, flex: 1, backgroundColor: t.raised, overflow: 'hidden' }, progressFill: { height: '100%', backgroundColor: t.orange },
  scroll: { flex: 1, minHeight: 0 }, content: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 12 }, title: { color: t.text, fontSize: 25, lineHeight: 32, fontWeight: '800', marginVertical: 12 },
  body: { color: t.muted, fontSize: 14, lineHeight: 22 }, goal: { color: t.text, fontSize: 17, lineHeight: 26, textAlign: 'center', marginVertical: 15 },
  teacher: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 16, padding: 10, marginBottom: 14 },
  tipLabel: { color: t.orange, fontSize: 12, fontWeight: '700' }, teacherText: { color: t.muted, fontSize: 13, lineHeight: 20, marginTop: 5 },
  warmup: { color: t.muted, fontSize: 12, marginBottom: 12 }, question: { color: t.text, fontSize: 18, lineHeight: 25, fontWeight: '700', marginBottom: 14 },
  option: { backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, paddingHorizontal: 14, paddingVertical: 13, borderRadius: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 8 }, selectedOption: { borderColor: t.orange }, optionText: { flex: 1, color: t.text, fontSize: 15, fontWeight: '600' }, optionMark: { color: t.orange, fontSize: 19 },
  input: { backgroundColor: t.surface, borderColor: t.border, borderWidth: 1, borderRadius: 16, padding: 15, color: t.text, fontSize: 16, marginVertical: 8 },
  sentence: { minHeight: 65, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 16, padding: 12, marginBottom: 14 },
  words: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, word: { backgroundColor: t.raised, borderWidth: 1, borderColor: t.border, paddingHorizontal: 14, paddingVertical: 11, borderRadius: 12 }, wordText: { color: t.text, fontSize: 16, fontWeight: '600' }, usedWord: { opacity: .25 },
  disabled: { opacity: .4 }, footer: { paddingTop: 10, paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: t.border, backgroundColor: t.background },
  feedback: { backgroundColor: t.successBg, padding: 12, borderRadius: 14, marginBottom: 10 }, feedbackWrong: { backgroundColor: t.errorBg }, feedbackTitle: { color: t.success, fontSize: 13, fontWeight: '800' }, feedbackText: { color: t.text, fontSize: 12, lineHeight: 18, marginTop: 3 },
  primary: { alignSelf: 'stretch', minHeight: 52, backgroundColor: t.orange, borderRadius: 16, paddingHorizontal: 18, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }, primaryText: { color: '#241321', fontSize: 16, fontWeight: '800' }, primaryArrow: { color: '#241321', fontSize: 25, lineHeight: 26 },
  link: { color: t.orange, fontSize: 12, fontWeight: '700', paddingVertical: 14 }, note: { color: t.muted, fontSize: 11, lineHeight: 17, marginTop: 4 },
  audio: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 16, marginBottom: 12 }, audioText: { color: t.orange, fontSize: 14, fontWeight: '700' },
  phrase: { padding: 14, backgroundColor: t.surface, borderRadius: 16, marginBottom: 8 }, phraseWord: { color: t.text, fontWeight: '700', fontSize: 15 },
  messageDraft: { alignSelf: 'flex-end', maxWidth: '90%', backgroundColor: t.successBg, borderRadius: 16, borderTopRightRadius: 4, padding: 14, marginBottom: 14 }, draftText: { color: t.text, fontSize: 16, lineHeight: 23 },
  nameCard: { padding: 22, backgroundColor: t.surface, borderWidth: 1, borderColor: t.orange, borderRadius: 20, marginVertical: 16 }, nameLabel: { color: t.orange, fontSize: 10, fontWeight: '800' }, nameTitle: { color: t.text, fontSize: 23, fontWeight: '800', marginTop: 10 },
  result: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }, errorScreen: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: t.background },
});
