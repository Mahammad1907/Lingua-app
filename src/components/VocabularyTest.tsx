import { LinearGradient } from 'expo-linear-gradient';
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
import { colors } from '../constants/colors';
import { VocabWord } from '../store/vocabularyStore';
import { isAnswerCorrect } from '../utils/answerCheck';
import { playCorrectSound, playWrongSound } from '../utils/sound';
import { AnswerLanguage } from '../utils/wordDatabase';

interface TestQuestion {
  word: VocabWord;
  direction: 'en_to_az' | 'az_to_en';
  question: string;
  correctAnswers: string[];
  acceptedAnswers?: string[];
}

export interface VocabularyTestResult {
  correct: number;
  wrong: number;
  wrongWordIds: string[];
  correctWordIds: string[];
}

interface VocabularyTestProps {
  words: VocabWord[];
  title: string;
  onFinish: (result: VocabularyTestResult) => void;
  onBack: () => void;
  emptyMessage?: string;
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
        acceptedAnswers: word.acceptedAnswers,
      };
    }
    return {
      word,
      direction,
      question: `"${word.translation}" ingiliscə necə deyilir?`,
      correctAnswers: [word.word],
      acceptedAnswers: word.acceptedAnswers,
    };
  });
}

export default function VocabularyTest({
  words,
  title,
  onFinish,
  onBack,
  emptyMessage = 'Test yaradılmadı',
}: VocabularyTestProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [userAnswers, setUserAnswers] = useState<
    { wordId: string; isCorrect: boolean }[]
  >([]);
  const [finished, setFinished] = useState(false);

  const questions = useMemo(() => {
    if (words.length === 0) return [];
    return generateQuestions(words);
  }, [words]);

  if (words.length === 0 || questions.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorEmoji}>📭</Text>
        <Text style={styles.errorTitle}>{emptyMessage}</Text>
        <TouchableOpacity style={styles.errorButton} onPress={onBack}>
          <Text style={styles.errorButtonText}>Geri qayıt</Text>
        </TouchableOpacity>
      </View>
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

    const answerLang: AnswerLanguage =
      question.direction === 'en_to_az'
        ? 'az'
        : (question.word.language as AnswerLanguage);

    const correct = question.correctAnswers.some((correctAns) =>
      isAnswerCorrect(
        typedAnswer,
        correctAns,
        answerLang,
        question.acceptedAnswers
      )
    );

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
      const finalWrongWordIds = userAnswers
        .filter((a) => !a.isCorrect)
        .map((a) => a.wordId);
      const finalCorrectWordIds = userAnswers
        .filter((a) => a.isCorrect)
        .map((a) => a.wordId);

      onFinish({
        correct: finalCorrectCount,
        wrong: finalWrongCount,
        wrongWordIds: finalWrongWordIds,
        correctWordIds: finalCorrectWordIds,
      });

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
          <Text style={styles.resultSubtitle}>{title} tamamlandı</Text>

          <View style={styles.resultStatsRow}>
            <View style={styles.resultStatCard}>
              <Text style={styles.resultStatEmoji}>✅</Text>
              <Text style={styles.resultStatValue}>{finalCorrectCount}</Text>
              <Text style={styles.resultStatLabel}>Düzgün</Text>
            </View>

            <View style={styles.resultStatCard}>
              <Text style={styles.resultStatEmoji}>❌</Text>
              <Text style={styles.resultStatValue}>{finalWrongCount}</Text>
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
                const wrongWord = words.find((w) => w.id === wordId);
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
              onPress={onBack}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={colors.mascot.gradient as unknown as [string, string, ...string[]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.resultPrimaryButtonInner}
              >
                <Text style={styles.resultPrimaryButtonText}>
                  Geri qayıt
                </Text>
                <Text style={styles.resultPrimaryButtonArrow}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
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
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
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
                placeholderTextColor={colors.textMuted}
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
                <View style={styles.correctAnswerContainer}>
                  <Text style={styles.correctAnswerLabel}>
                    Düzgün cavab:
                  </Text>
                  <Text style={styles.correctAnswerText}>
                    {question.correctAnswers[0]}
                  </Text>
                </View>
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
                  ? (colors.mascot.gradient as unknown as [string, string, ...string[]])
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
    borderColor: colors.brd.light,
  },
  backText: { fontSize: 22, color: colors.textPrimary, fontWeight: '600' },
  headerTitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  counterBox: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.brd.light,
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
  progressBar: { height: '100%', backgroundColor: colors.mascot.orange },
  content: { padding: 20, paddingBottom: 20 },
  questionCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: colors.brd.strong,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  questionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryLight,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 34,
  },
  inputContainer: { marginBottom: 16 },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 20,
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: '600',
    borderWidth: 1.5,
    borderColor: colors.brd.strong,
  },
  resultBox: {
    padding: 18,
    borderRadius: 18,
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
  resultTitle2: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  correctAnswerContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.brd.default,
  },
  correctAnswerLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  correctAnswerText: {
    fontSize: 18,
    color: colors.success,
    fontWeight: '800',
  },
  buttonWrapper: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.mascot.orange,
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
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
  },
  buttonArrow: {
    color: colors.textPrimary,
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
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  resultSubtitle: {
    fontSize: 15,
    color: colors.txt.accent,
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
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.brd.light,
  },
  resultStatEmoji: { fontSize: 22, marginBottom: 6 },
  resultStatValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  resultStatLabel: {
    fontSize: 10,
    color: colors.textMuted,
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
    color: colors.error,
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
    color: colors.textPrimary,
  },
  wrongWordTranslation: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  resultButtons: { width: '100%', gap: 10 },
  resultPrimaryButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.mascot.orange,
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
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
  },
  resultPrimaryButtonArrow: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorEmoji: { fontSize: 80, marginBottom: 20 },
  errorTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 30,
    textAlign: 'center',
  },
  errorButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: colors.mascot.orange,
    borderRadius: 16,
  },
  errorButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});