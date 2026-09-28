import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../constants/colors';
import { getLessonById } from '../../data/lessons';
import { useUserStore } from '../../store/userStore';
import { playCorrectSound, playWrongSound } from '../../utils/sound';

// ═══════════════════════════════════════
// DİL AŞKARLAMA
// TTS yalnız İNGİLİS üçün
// Azərbaycan hərfləri (ə, ı, ö, ü, ş, ç, ğ) → false
// ═══════════════════════════════════════
function isEnglishText(text: string): boolean {
  if (!text) return false;
  // Yalnız Latın hərfləri + işarələr
  return /^[a-zA-Z\s.,!?'"()-]+$/.test(text);
}

export default function PracticeScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const lesson = getLessonById(id || '');

  const [currentEx, setCurrentEx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [builtWords, setBuiltWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [inputMode, setInputMode] = useState<'tap' | 'type'>('tap');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [bestVoice, setBestVoice] = useState<string | undefined>(undefined);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime] = useState(Date.now());

  const addXP = useUserStore((s) => s.addXP);
  const loseHeart = useUserStore((s) => s.loseHeart);
  const hearts = useUserStore((s) => s.hearts);
  const xp = useUserStore((s) => s.xp);

  useEffect(() => {
    const findBestVoice = async () => {
      try {
        const voices = await Speech.getAvailableVoicesAsync();
        const samantha = voices.find(
          (v) => v.language === 'en-US' && v.name.includes('Samantha')
        );
        const google = voices.find(
          (v) => v.language === 'en-US' && v.name.includes('Google')
        );
        const chosen =
          samantha || google || voices.find((v) => v.language === 'en-US');
        setBestVoice(chosen?.identifier);
      } catch (e) {
        console.log(e);
      }
    };
    findBestVoice();
  }, []);

  if (!lesson) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>😕</Text>
          <Text style={styles.errorTitle}>Dərs tapılmadı</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.back()}
          >
            <Text style={styles.errorButtonText}>Geri qayıt</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  const exercise = lesson.exercises[currentEx];

  if (!exercise) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>📭</Text>
          <Text style={styles.errorTitle}>Məşq yoxdur</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.back()}
          >
            <Text style={styles.errorButtonText}>Geri qayıt</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  const progress = ((currentEx + 1) / lesson.exercises.length) * 100;
  const isSentenceBuild = exercise.type === 'sentence_build';

  if (
    isSentenceBuild &&
    availableWords.length === 0 &&
    exercise.words &&
    !showResult &&
    builtWords.length === 0
  ) {
    setAvailableWords([...exercise.words]);
  }

  // ═══════════════════════════════════════
  // SƏS — YALNIZ İNGİLİS MƏTNİ ÜÇÜN
  // Azərbaycan mətni səsləndirilmir
  // ═══════════════════════════════════════
  const speak = (text: string) => {
    // ⚠️ Yalnız İngilis mətni səsləndir
    if (!isEnglishText(text)) return;

    Speech.stop();
    Speech.speak(text, {
      language: 'en-US',
      voice: bestVoice,
      rate: 0.5,
      pitch: 1.0,
    });
  };

  // Sualı oxu — yalnız İngilis hissəsini
  const handleSpeakQuestion = () => {
    // 1. Sualdan dırnaq içindəki mətni çıxar
    const match = exercise.question.match(/"([^"]+)"/);
    if (match && isEnglishText(match[1])) {
      speak(match[1]);
      return;
    }
    // 2. Sual tam İngiliscədirsə — oxu
    if (isEnglishText(exercise.question)) {
      speak(exercise.question);
    }
    // 3. Yoxsa — Azərbaycan sualıdır, səsləndirmə
  };

  // ═══════════════════════════════════════
  // CAVAB SEÇ
  // ═══════════════════════════════════════
  const handleSelect = (answer: string) => {
    if (showResult) return;
    setSelected(answer);
  };

  const handleAddWord = (word: string, index: number) => {
    if (showResult) return;
    const newAvailable = [...availableWords];
    newAvailable.splice(index, 1);
    setAvailableWords(newAvailable);
    setBuiltWords([...builtWords, word]);
  };

  const handleRemoveWord = (word: string, index: number) => {
    if (showResult) return;
    const newBuilt = [...builtWords];
    newBuilt.splice(index, 1);
    setBuiltWords(newBuilt);
    setAvailableWords([...availableWords, word]);
  };

  // ═══════════════════════════════════════
  // CAVABI YOXLA
  // ═══════════════════════════════════════
  const handleCheck = () => {
    let userAnswer = '';
    if (isSentenceBuild) {
      userAnswer =
        inputMode === 'tap' ? builtWords.join(' ') : typedAnswer.trim();
    } else {
      userAnswer = selected || '';
    }

    if (!userAnswer) return;

    const correct =
      userAnswer.toLowerCase().trim() ===
      exercise.correctAnswer.toLowerCase().trim();
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      playCorrectSound();
      addXP(10);
      setCorrectCount((c) => c + 1);
    } else {
      playWrongSound();
      loseHeart();
    }
  };

  // ═══════════════════════════════════════
  // NÖVBƏTİ MƏŞQ
  // ═══════════════════════════════════════
  const handleNext = () => {
    if (currentEx + 1 < lesson.exercises.length) {
      setCurrentEx(currentEx + 1);
      setSelected(null);
      setBuiltWords([]);
      setAvailableWords([]);
      setTypedAnswer('');
      setInputMode('tap');
      setShowResult(false);
    } else {
      addXP(lesson.xpReward);

      const elapsed = Math.max(
        1,
        Math.round((Date.now() - startTime) / 60000)
      );

      const totalWrong = lesson.exercises.length - correctCount;

      router.replace(
        `/lesson/complete?id=${lesson.id}&correct=${correctCount}&total=${
          lesson.exercises.length
        }&time=${elapsed}&wrong=${totalWrong}`
      );
    }
  };

  const isButtonDisabled =
    (!isSentenceBuild && !selected) ||
    (isSentenceBuild && inputMode === 'tap' && builtWords.length === 0) ||
    (isSentenceBuild && inputMode === 'type' && !typedAnswer.trim());

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={['#0a0a1a', '#1e1b4b', '#0a0a1a']}
        style={styles.background}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>

            <View style={styles.statsRow}>
              <View style={styles.statBadge}>
                <Text style={styles.statEmoji}>⭐</Text>
                <Text style={styles.statValue}>{xp}</Text>
              </View>
              <View style={styles.statBadge}>
                <Text style={styles.statEmoji}>❤️</Text>
                <Text style={styles.statValue}>{hearts}</Text>
              </View>
            </View>

            <View style={styles.counterBox}>
              <Text style={styles.counterText}>
                {currentEx + 1}/{lesson.exercises.length}
              </Text>
            </View>
          </View>

          {/* Progress */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Sual */}
            <View style={styles.questionCard}>
              <Text style={styles.questionType}>
                {exercise.type === 'multiple_choice' && '🎯 VARIANT SEÇ'}
                {exercise.type === 'translation' && '🌐 TƏRCÜMƏ ET'}
                {exercise.type === 'fill_blank' && '✏️ BOŞLUĞU DOLDUR'}
                {exercise.type === 'sentence_build' && '🔤 CÜMLƏ QUR'}
              </Text>
              <Text style={styles.questionText}>{exercise.question}</Text>

              {/* Dinləmə düyməsi — yalnız İngilis mətni üçün */}
              {(isEnglishText(exercise.question) ||
                exercise.question.match(/"([^"]+)"/)) && (
                <TouchableOpacity
                  style={styles.listenButton}
                  onPress={handleSpeakQuestion}
                >
                  <Text style={styles.listenIcon}>🔈</Text>
                  <Text style={styles.listenText}>Dinlə</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* SENTENCE BUILD */}
            {isSentenceBuild && (
              <>
                <View style={styles.modeToggle}>
                  <TouchableOpacity
                    style={[
                      styles.modeButton,
                      inputMode === 'tap' && styles.modeActive,
                    ]}
                    onPress={() => setInputMode('tap')}
                  >
                    <Text
                      style={[
                        styles.modeText,
                        inputMode === 'tap' && styles.modeTextActive,
                      ]}
                    >
                      Sözlərdən seç
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modeButton,
                      inputMode === 'type' && styles.modeActive,
                    ]}
                    onPress={() => setInputMode('type')}
                  >
                    <Text
                      style={[
                        styles.modeText,
                        inputMode === 'type' && styles.modeTextActive,
                      ]}
                    >
                      Yaz
                    </Text>
                  </TouchableOpacity>
                </View>

                {inputMode === 'tap' && (
                  <>
                    <View style={styles.buildArea}>
                      {builtWords.length === 0 && (
                        <Text style={styles.placeholder}>
                          Sözləri aşağıdan seç
                        </Text>
                      )}
                      <View style={styles.builtWordsRow}>
                        {builtWords.map((word, i) => (
                          <TouchableOpacity
                            key={`built-${i}`}
                            style={styles.builtWord}
                            onPress={() => handleRemoveWord(word, i)}
                          >
                            <Text style={styles.builtWordText}>{word}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    <View style={styles.wordsContainer}>
                      {availableWords.map((word, i) => (
                        <TouchableOpacity
                          key={`avail-${i}`}
                          style={styles.wordButton}
                          onPress={() => handleAddWord(word, i)}
                        >
                          <Text style={styles.wordText}>{word}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                )}

                {inputMode === 'type' && (
                  <TextInput
                    style={styles.input}
                    placeholder="Cümləni yaz..."
                    placeholderTextColor={colors.textMuted}
                    value={typedAnswer}
                    onChangeText={setTypedAnswer}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              </>
            )}

            {/* MULTIPLE CHOICE + TRANSLATION + FILL BLANK */}
            {!isSentenceBuild &&
              exercise.options?.map((opt) => {
                const isSel = selected === opt;
                const isRight = showResult && opt === exercise.correctAnswer;
                const isWrong =
                  showResult && isSel && opt !== exercise.correctAnswer;

                return (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.option,
                      isSel && styles.optionSelected,
                      isRight && styles.optionRight,
                      isWrong && styles.optionWrong,
                    ]}
                    onPress={() => handleSelect(opt)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.radio,
                        isSel && styles.radioSelected,
                        isRight && styles.radioRight,
                        isWrong && styles.radioWrong,
                      ]}
                    >
                      {isSel && <View style={styles.radioDot} />}
                    </View>
                    <Text style={styles.optionText}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}

            {/* NƏTİCƏ — yoxlama sonrası */}
            {showResult && (
              <View
                style={[
                  styles.resultBox,
                  isCorrect ? styles.resultCorrect : styles.resultWrong,
                ]}
              >
                <Text style={styles.resultEmoji}>
                  {isCorrect ? '✅' : '❌'}
                </Text>
                <Text style={styles.resultTitle}>
                  {isCorrect ? 'Düzdür! +10 XP' : 'Səhvdir'}
                </Text>

                {!isCorrect && (
                  <View style={styles.correctAnswerContainer}>
                    <Text style={styles.correctAnswerLabel}>
                      Düzgün cavab:
                    </Text>
                    <Text style={styles.correctAnswerText}>
                      {exercise.correctAnswer}
                    </Text>

                    {/* 🔊 yalnız İngilis cavabı üçün */}
                    {isEnglishText(exercise.correctAnswer) && (
                      <TouchableOpacity
                        style={styles.listenSmallButton}
                        onPress={() => speak(exercise.correctAnswer)}
                      >
                        <Text style={styles.listenSmallText}>🔊 Dinlə</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                <Text style={styles.resultExplanation}>
                  {exercise.explanation}
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Button */}
          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={showResult ? handleNext : handleCheck}
            disabled={isButtonDisabled}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={
                !isButtonDisabled
                  ? ['#06b6d4', '#8b5cf6', '#ec4899']
                  : ['#3f3f46', '#3f3f46']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {showResult
                  ? currentEx + 1 === lesson.exercises.length
                    ? 'Bitir'
                    : 'Davam et'
                  : 'Yoxla'}
              </Text>
              <Text style={styles.buttonArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  backText: { fontSize: 22, color: colors.textPrimary, fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: 8 },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  statEmoji: { fontSize: 14 },
  statValue: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  counterBox: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  counterText: { fontSize: 12, color: colors.textPrimary, fontWeight: '700' },
  progressContainer: {
    height: 4,
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBar: { height: '100%', backgroundColor: colors.primary },
  content: { padding: 20, paddingBottom: 20 },
  questionCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: colors.borderFocus,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  questionType: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryLight,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 32,
    marginBottom: 14,
  },
  listenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  listenIcon: { fontSize: 14, marginRight: 6 },
  listenText: {
    color: colors.primaryLight,
    fontSize: 13,
    fontWeight: '700',
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modeActive: { backgroundColor: colors.primary },
  modeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  modeTextActive: { color: '#ffffff' },
  buildArea: {
    minHeight: 70,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderStyle: 'dashed',
    justifyContent: 'center',
  },
  builtWordsRow: { flexDirection: 'row', flexWrap: 'wrap' },
  placeholder: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
  builtWord: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 3,
  },
  builtWordText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 14,
  },
  wordButton: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    margin: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  wordText: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  optionRight: {
    borderColor: colors.success,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  optionWrong: {
    borderColor: colors.error,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  radioSelected: { borderColor: colors.primary },
  radioRight: { borderColor: colors.success },
  radioWrong: { borderColor: colors.error },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  resultBox: {
    padding: 18,
    borderRadius: 18,
    marginTop: 10,
    borderWidth: 1.5,
  },
  resultCorrect: {
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
    borderColor: colors.success,
  },
  resultWrong: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: colors.error,
  },
  resultEmoji: { fontSize: 28, marginBottom: 6 },
  resultTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  correctAnswerContainer: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  correctAnswerLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 1,
  },
  correctAnswerText: {
    fontSize: 18,
    color: colors.success,
    fontWeight: '800',
    marginBottom: 8,
  },
  listenSmallButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  listenSmallText: {
    color: colors.primaryLight,
    fontSize: 12,
    fontWeight: '700',
  },
  resultExplanation: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  buttonWrapper: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 28,
    gap: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  buttonArrow: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#0a0a1a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorEmoji: { fontSize: 80, marginBottom: 20 },
  errorTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 30,
    textAlign: 'center',
  },
  errorButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
  },
  errorButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});