import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AudioSceneActivity from '../../components/AudioSceneActivity';
import LessonScene, { AnimatedFox, ScenePlace } from '../../components/LessonScene';
import ConversationAvatar from '../../components/ConversationAvatar';
import { lessonTheme as t } from '../../constants/lessonTheme';
import VoiceChatLesson, { VoiceStats } from '../../components/VoiceChatLesson';
import { getShortSession, ShortSession } from '../../data/firstConversation';
import { getLessonById } from '../../data/lessons';
import { Lesson } from '../../data/types';
import { useUserStore } from '../../store/userStore';
import { useVocabularyStore } from '../../store/vocabularyStore';
import { isSessionAnswerCorrect } from '../../utils/sessionAnswer';

export default function LessonSessionScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const lesson = getLessonById(params.id || '');
  const content = getShortSession(params.id || '');
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
  const attempts = useRef<Record<number, boolean>>({});
  const completing = useRef(false);
  const current = warmup ? content.warmup! : content.steps[index];
  const exercise = current?.exercise;
  const activity = current?.activity || content.style;
  const place: ScenePlace = current?.place || (lesson.order === 4 ? 'park' : lesson.order === 5 ? 'cafe' : 'classroom');

  useEffect(() => () => { void Speech.stop(); }, []);
  const backToMap = () => { void Speech.stop(); router.replace(`/module/${lesson.moduleId}`); };

  const complete = (spoken?: VoiceStats) => {
    if (completing.current) return;
    completing.current = true;
    const user = useUserStore.getState();
    const alreadyCompleted = user.completedLessons.includes(lesson.id);
    const writtenCorrect = Object.values(attempts.current).filter(Boolean).length;
    const correct = writtenCorrect + (spoken?.correct || 0);
    const wrong = lesson.exercises.length - writtenCorrect + (spoken?.wrong || 0);
    // Skipped voice tasks and recognition failures never enter the accuracy denominator.
    user.markLessonComplete(lesson.id, correct, wrong, lesson.xpReward);
    if (spoken) setVoiceStats(spoken);
    if (!alreadyCompleted) user.addXP(lesson.xpReward);
    useVocabularyStore.getState().addLessonWords(lesson.id);
    setFinished(true);
  };

  const check = (value = answer) => {
    if (!exercise || !value.trim() || feedback === 'correct') return;
    const correct = isSessionAnswerCorrect(value, exercise.correctAnswer, exercise.answerLang || 'en', exercise.acceptedAnswers, exercise.type === 'fill_blank' || exercise.type === 'translation');
    if (!warmup && !(index in attempts.current)) attempts.current[index] = correct;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) Keyboard.dismiss();
  };
  const next = () => {
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
    <AnimatedFox mood="celebrate" size={135} />
    <Text style={styles.title}>Bu dərs bitdi!</Text>
    <Text style={styles.body}>{lesson.titleAz}</Text>
    <Text style={styles.goal}>{lesson.canDo}</Text>
    <Text style={styles.body}>{lesson.focus === 'speaking' ? 'Səsli söhbəti məşq etdin. Tələffüz balı verilmir.' : `${lesson.exercises.length} yazılı/dinləmə tapşırığını məşq etdin.`}</Text>
    {voiceStats ? <Text style={styles.note}>Danışıq: ilk cəhddə uyğun {voiceStats.correct} · Təkrar {voiceStats.wrong} · Keçildi {voiceStats.skipped}</Text> : null}
    <TouchableOpacity style={styles.primary} onPress={backToMap}><Text style={styles.primaryText}>Bölmə xəritəsinə qayıt</Text></TouchableOpacity>
    <Text style={styles.note}>Növbəti dərsi xəritədən özün açacaqsan.</Text>
  </View>;

  if (oralStage && content.speaking) return <VoiceChatLesson turns={[content.speaking]} initialName={name} onFinish={complete} onBack={backToMap} />;
  if (content.style === 'voice_chat') return <VoiceChatLesson turns={content.turns || []} onFinish={complete} onBack={backToMap} />;

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
      <View style={styles.level}><Text style={styles.counter}>A1</Text></View>
    </View>
    <View style={styles.progressRow}><View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${ownCard ? 100 : warmup ? 0 : (index + 1) / content.steps.length * 100}%` }]} /></View><Text style={styles.counter}>{warmup ? 'Təkrar' : ownCard ? 'Kartın' : `${index + 1}/${content.steps.length}`}</Text></View>
    <ScrollView ref={scroll} style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      {ownCard ? <>
        <LessonScene place="cafe" mood="celebrate" label="Yeni dostunla tanış ol" />
        <Text style={styles.title}>İndi öz kartını hazırla</Text>
        <Text style={styles.body}>Adını yaz. Hazır cümləni dinlə, sonra özün ucadan de.</Text>
        <TextInput accessibilityLabel="Adın" value={name} onChangeText={setName} maxLength={30} placeholder="Adın" placeholderTextColor={t.muted} style={styles.input} returnKeyType="done" onSubmitEditing={() => { if (name.trim()) action(); }} />
        {name.trim() ? <TouchableOpacity style={styles.nameCard} onPress={() => void speak(`Hi! I'm ${name.trim()}.`)}><Text style={styles.nameLabel}>SƏNİN TANIŞLIQ KARTIN</Text><Text style={styles.nameTitle}>Hi! I’m {name.trim()}.</Text><Text style={styles.note}>▶ Dinlə və özün de</Text></TouchableOpacity> : null}
      </> : <>
        {warmup ? <Text style={styles.warmup}>Əvvəlki dərsdən bir qısa təkrar</Text> : null}
        <TouchableOpacity accessibilityRole="button" accessibilityState={{ expanded: teacherOpen }} onPress={() => setTeacherOpen((value) => !value)} style={styles.teacher}>
          <AnimatedFox mood={feedback === 'correct' ? 'celebrate' : 'idle'} size={30} />
          <View style={{ flex: 1 }}><Text style={styles.tipLabel}>Kiçik ipucu</Text>{teacherOpen ? <Text style={styles.teacherText}>{current.teacher}</Text> : <Text style={styles.note}>İzahı açmaq üçün toxun</Text>}</View>
          <Text style={styles.counter}>{teacherOpen ? '−' : '+'}</Text>
        </TouchableOpacity>
        {!warmup ? <LessonScene key={exercise.id} place={place} mood={feedback === 'correct' ? 'celebrate' : feedback === 'wrong' ? 'thinking' : 'idle'} evening={current.audio?.includes('evening') || index === 6} label={activity === 'scene' ? 'Dinlə və səhnəni seç' : undefined} /> : null}
        {activity === 'repair' && current.foxSays && !warmup ? <View style={styles.foxMistake}><Text style={styles.label}>TÜLKÜ BELƏ DEDİ</Text><Text style={styles.wrongSentence}>{current.foxSays}</Text></View> : null}
        <Text style={styles.question}>{exercise.question}</Text>
        {activity === 'order' && !warmup ? <View style={styles.messageDraft}><Text style={styles.label}>SƏNİN MESAJIN</Text><Text style={styles.draftText}>{exercise.type === 'sentence_build' ? (built.map((i) => exercise.words![i]).join(' ') || 'Mesajı hazırla…') : (answer || 'Uyğun mesajı seç…')}</Text></View> : null}
        {activity === 'scene' && !warmup ? <AudioSceneActivity key={exercise.id} audio={current.audio!} options={exercise.options || []} selected={answer} disabled={feedback === 'correct'} onAnswer={(value) => { setAnswer(value); check(value); }} /> : <>
          {current.audio ? <TouchableOpacity style={styles.audio} onPress={() => void speak(current.audio!)} accessibilityLabel="İngiliscə səsi dinlə">{activity === 'dialogue' ? <ConversationAvatar person="emma" size={28} /> : null}<Text style={styles.audioText}>▶ {activity === 'dialogue' ? 'Səsli mesaj' : 'Səsi dinlə'}</Text></TouchableOpacity> : null}
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
        <TouchableOpacity onPress={() => setShowPhrases((value) => !value)}><Text style={styles.link}>{showPhrases ? 'İfadələri gizlət ↑' : 'Bu dərsin ifadələri ↓'}</Text></TouchableOpacity>
        {showPhrases ? lesson.vocabulary.map((word) => <TouchableOpacity key={word.id} style={styles.phrase} onPress={() => void speak(word.word)}><Text style={styles.phraseWord}>▶ {word.word}</Text><Text style={styles.note}>{word.translation}</Text><Text style={styles.note}>{word.usageNote}</Text></TouchableOpacity>) : null}
      </> : null}
    </ScrollView>
    <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
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
  foxMistake: { backgroundColor: t.errorBg, padding: 14, borderRadius: 16, marginBottom: 14 }, wrongSentence: { color: t.error, fontSize: 19, fontWeight: '700', marginTop: 5 },
  audio: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 16, marginBottom: 12 }, audioText: { color: t.orange, fontSize: 14, fontWeight: '700' },
  phrase: { padding: 14, backgroundColor: t.surface, borderRadius: 16, marginBottom: 8 }, phraseWord: { color: t.text, fontWeight: '700', fontSize: 15 },
  messageDraft: { alignSelf: 'flex-end', maxWidth: '90%', backgroundColor: t.successBg, borderRadius: 16, borderTopRightRadius: 4, padding: 14, marginBottom: 14 }, draftText: { color: t.text, fontSize: 16, lineHeight: 23 },
  nameCard: { padding: 22, backgroundColor: t.surface, borderWidth: 1, borderColor: t.orange, borderRadius: 20, marginVertical: 16 }, nameLabel: { color: t.orange, fontSize: 10, fontWeight: '800' }, nameTitle: { color: t.text, fontSize: 23, fontWeight: '800', marginTop: 10 },
  result: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }, errorScreen: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: t.background },
});
