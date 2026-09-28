import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useVocabularyStore, VocabWord } from '../../store/vocabularyStore';
import { playCorrectSound, playWrongSound } from '../../utils/sound';

interface TestQuestion {
  word: VocabWord;
  direction: 'en_to_az' | 'az_to_en';
  question: string;
  correctAnswers: string[];
}

function normalizeAnswer(text: string): string {
  return text.trim().replace(/\s+/g, ' ').toLowerCase();
}

function generateQuestions(words: VocabWord[]): TestQuestion[] {
  return words.map((word) => {
    const direction: 'en_to_az' | 'az_to_en' =
      Math.random() < 0.5 ? 'en_to_az' : 'az_to_en';

    if (direction === 'en_to_az') {
      return {
        word,
        direction,
        question: `"${word.word}" nə deməkdir?`,
        correctAnswers: [word.translation],
      };
    }
    return {
      word,
      direction,
      question: `"${word.translation}" ingiliscə necə deyilir?`,
      correctAnswers: [word.word],
    };
  });
}

export default function VocabularyTestScreen() {
  const params = useLocalSearchParams<{ number: string }>();
  const pageNumber = parseInt(params.number || '1');
  const router = useRouter();

  const pages = useVocabularyStore((s) => s.pages);
  const saveTestResult = useVocabularyStore((s) => s.saveTestResult);

  const page = pages.find((p) => p.pageNumber === pageNumber);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [userAnswers, setUserAnswers] = useState<
    { wordId: string; isCorrect: boolean }[]
  >([]);
  const [finished, setFinished] = useState(false);

  const questions = useMemo(() => {
    if (!page) return [];
    return generateQuestions(page.words);
  }, [page]);

  if (!page) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>😕</Text>
          <Text style={styles.errorTitle}>Səhifə tapılmadı</Text>
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

  if (questions.length === 0) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>📭</Text>
          <Text style={styles.errorTitle}>Test yaradılmadı</Text>
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

  const question = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const finalCorrectCount = userAnswers.filter((a) => a.isCorrect).length;
  const finalWrongCount = userAnswers.filter((a) => !a.isCorrect).length;
  const finalAccuracy =
    questions.length > 0
      ? Math.round((finalCorrectCount / questions.length) * 100)
      : 0;

  const handleCheck = () => {
    if (!typedAnswer.trim()) return;

    const normalizedUser = normalizeAnswer(typedAnswer);
    const normalizedCorrect = question.correctAnswers.map((a) =>
      normalizeAnswer(a)
    );
    const correct = normalizedCorrect.includes(normalizedUser);

    setIsCorrect(correct);
    setShowResult(true);

    setUserAnswers((prev) => [
      ...prev,
      { wordId: question.word.id, isCorrect: correct },
    ]);

    if (correct) playCorrectSound();
    else playWrongSound();
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setTypedAnswer('');
      setShowResult(false);
    } else {
      const finalCorrect = userAnswers.filter((a) => a.isCorrect).length;
      const finalWrong = userAnswers.filter((a) => !a.isCorrect).length;
      const finalWrongWordIds = userAnswers
        .filter((a) => !a.isCorrect)
        .map((a) => a.wordId);
      const finalCorrectWordIds = userAnswers
        .filter((a) => a.isCorrect)
        .map((a) => a.wordId);

      saveTestResult(
        pageNumber,
        finalCorrect,
        finalWrong,
        finalWrongWordIds,
        finalCorrectWordIds
      );
      setFinished(true);
    }
  };

  if (finished) {
    const getMessage = () => {
      if (finalAccuracy === 100) return 'MÜKƏMMƏL!';
      if (finalAccuracy >= 80) return 'ƏLA!';
      if (finalAccuracy >= 60) return 'YAXŞI!';
      if (finalAccuracy >= 40) return 'DAVAM ET!';
      return 'CƏHD ET!';
    };

    const getEmoji = () => {
      if (finalAccuracy === 100) return '🏆';
      if (finalAccuracy >= 80) return '🎉';
      if (finalAccuracy >= 60) return '👍';
      if (finalAccuracy >= 40) return '💪';
      return '🌱';
    };

    const wrongWordIds = userAnswers
      .filter((a) => !a.isCorrect)
      .map((a) => a.wordId);

    return (
      <>
        <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
        <LinearGradient
          colors={['#0a0a1a', '#1e1b4b', '#0a0a1a']}
          style={styles.background}
        >
          <ScrollView
            contentContainerStyle={styles.resultContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.resultBigEmoji}>{getEmoji()}</Text>
            <Text style={styles.resultTitle}>{getMessage()}</Text>
            <Text style={styles.resultSubtitle}>
              Səhifə {pageNumber} testi tamamlandı
            </Text>

            <View style={styles.resultStatsRow}>
              <View style={styles.resultStatCard}>
                <Text style={styles.resultStatEmoji}>✅</Text>
                <Text style={styles.resultStatValue}>
                  {finalCorrectCount}
                </Text>
                <Text style={styles.resultStatLabel}>Düzgün</Text>
              </View>

              <View style={styles.resultStatCard}>
                <Text style={styles.resultStatEmoji}>❌</Text>
                <Text style={styles.resultStatValue}>
                  {finalWrongCount}
                </Text>
                <Text style={styles.resultStatLabel}>Səhv</Text>
              </View>

              <View style={styles.resultStatCard}>
                <Text style={styles.resultStatEmoji}>📊</Text>
                <Text style={styles.resultStatValue}>{finalAccuracy}%</Text>
                <Text style={styles.resultStatLabel}>Dəqiqlik</Text>
              </View>
            </View>

            {finalWrongCount > 0 && (
              <View style={styles.wrongWordsBox}>
                <Text style={styles.wrongWordsTitle}>
                  ⚠️ Səhv etdiyin sözlər
                </Text>
                {wrongWordIds.map((wordId) => {
                  const wrongWord = page.words.find((w) => w.id === wordId);
                  if (!wrongWord) return null;
                  return (
                    <View key={wordId} style={styles.wrongWordRow}>
                      <Text style={styles.wrongWordText}>
                        {wrongWord.word}
                      </Text>
                      <Text style={styles.wrongWordTranslation}>
                        {wrongWord.translation}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            <View style={styles.resultButtons}>
              <TouchableOpacity
                style={styles.resultPrimaryButton}
                onPress={() => router.back()}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#06b6d4', '#8b5cf6', '#ec4899']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.resultPrimaryButtonInner}
                >
                  <Text style={styles.resultPrimaryButtonText}>
                    Səhifəyə qayıt
                  </Text>
                  <Text style={styles.resultPrimaryButtonArrow}>→</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <LinearGradient
          colors={['#0a0a1a', '#1e1b4b', '#0a0a1a']}
          style={styles.background}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Text style={styles.backText}>←</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                Səhifə {pageNumber} · Test
              </Text>
              <View style={styles.counterBox}>
                <Text style={styles.counterText}>
                  {currentIndex + 1}/{questions.length}
                </Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>

            <ScrollView
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.questionCard}>
                <Text style={styles.questionLabel}>
                  {question.direction === 'en_to_az'
                    ? 'İNGİLİS → AZƏRBAYCAN'
                    : 'AZƏRBAYCAN → İNGİLİS'}
                </Text>
                <Text style={styles.questionText}>{question.question}</Text>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Cavabı yaz..."
                  placeholderTextColor="#52525b"
                  value={typedAnswer}
                  onChangeText={setTypedAnswer}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!showResult}
                  returnKeyType="done"
                  onSubmitEditing={showResult ? undefined : handleCheck}
                />
              </View>

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
                  <Text style={styles.resultTitle2}>
                    {isCorrect ? 'Düzdür!' : 'Səhvdir'}
                  </Text>
                  {!isCorrect && (
                    <View style={styles.correctAnswerContainer}>
                      <Text style={styles.correctAnswerLabel}>
                        Düzgün cavab:
                      </Text>
                      <Text style={styles.correctAnswerText}>
                        {question.correctAnswers[0]}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={showResult ? handleNext : handleCheck}
              disabled={!typedAnswer.trim() && !showResult}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={
                  typedAnswer.trim() || showResult
                    ? ['#06b6d4', '#8b5cf6', '#ec4899']
                    : ['#3f3f46', '#3f3f46']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {showResult
                    ? currentIndex + 1 === questions.length
                      ? 'Bitir'
                      : 'Növbəti'
                    : 'Yoxla'}
                </Text>
                <Text style={styles.buttonArrow}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
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
    backgroundColor: '#13132b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  backText: { fontSize: 22, color: '#ffffff', fontWeight: '600' },
  headerTitle: {
    fontSize: 13,
    color: '#a1a1aa',
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  counterBox: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#13132b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  counterText: { fontSize: 12, color: '#ffffff', fontWeight: '700' },
  progressContainer: {
    height: 4,
    backgroundColor: '#13132b',
    marginHorizontal: 20,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBar: { height: '100%', backgroundColor: '#8b5cf6' },
  content: { padding: 20, paddingBottom: 20 },
  questionCard: {
    backgroundColor: '#13132b',
    borderRadius: 22,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.5)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  questionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#a78bfa',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 34,
  },
  inputContainer: { marginBottom: 16 },
  input: {
    backgroundColor: '#13132b',
    borderRadius: 18,
    padding: 20,
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.4)',
  },
  resultBox: {
    padding: 18,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  resultCorrect: {
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
    borderColor: '#22c55e',
  },
  resultWrong: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: '#ef4444',
  },
  resultEmoji: { fontSize: 28, marginBottom: 6 },
  resultTitle2: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  correctAnswerContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(239, 68, 68, 0.2)',
  },
  correctAnswerLabel: {
    fontSize: 12,
    color: '#a1a1aa',
    fontWeight: '600',
    marginBottom: 4,
  },
  correctAnswerText: {
    fontSize: 18,
    color: '#22c55e',
    fontWeight: '800',
  },
  buttonWrapper: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#8b5cf6',
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
  },
  buttonArrow: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  resultContent: {
    padding: 24,
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
  },
  resultBigEmoji: { fontSize: 100, marginBottom: 16 },
  resultTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  resultSubtitle: {
    fontSize: 15,
    color: '#c4b5fd',
    fontWeight: '500',
    marginBottom: 32,
    textAlign: 'center',
  },
  resultStatsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
    width: '100%',
  },
  resultStatCard: {
    flex: 1,
    backgroundColor: '#13132b',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  resultStatEmoji: { fontSize: 22, marginBottom: 6 },
  resultStatValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 2,
  },
  resultStatLabel: {
    fontSize: 10,
    color: '#52525b',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  wrongWordsBox: {
    width: '100%',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  wrongWordsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ef4444',
    marginBottom: 12,
  },
  wrongWordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(239, 68, 68, 0.15)',
  },
  wrongWordText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  wrongWordTranslation: {
    fontSize: 13,
    color: '#a1a1aa',
    fontWeight: '500',
  },
  resultButtons: { width: '100%', gap: 10 },
  resultPrimaryButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  resultPrimaryButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 12,
  },
  resultPrimaryButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },
  resultPrimaryButtonArrow: {
    color: '#ffffff',
    fontSize: 20,
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