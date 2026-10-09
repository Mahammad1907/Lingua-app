// src/app/lesson/vocabulary.tsx

import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SpeakerIcon from '../../components/SpeakerIcon';
import { colors } from '../../constants/colors';
import { getLessonById } from '../../data/lessons';
import { Language } from '../../data/types';

const TTS_LANG_MAP: Partial<Record<Language, string>> = {
  en: 'en-US',
};
// ═══════════════════════════════════════
// VOCABULARY ŞƏKİLLƏRİ
// ═══════════════════════════════════════
const VOCAB_IMAGES: Record<string, number> = {
  a1_en_01_nice_to_meet_you: require('../../../assets/vocab/nice_to_meet_you.png'),
};

export default function VocabularyScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const lesson = getLessonById(id || '');

  const [currentIndex, setCurrentIndex] = useState(0);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

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

  const vocab = lesson.vocabulary;
  const total = vocab.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;
  const currentWord = vocab[currentIndex];

  const progressPercent = ((currentIndex + 1) / total) * 100;

  const lastSpeakRef = useRef<number>(0);

const speakWord = async (word: string) => {
  const ttsLang = TTS_LANG_MAP[lesson.language];
  if (!ttsLang) return;
  if (!word?.trim()) return;

  const now = Date.now();
  if (now - lastSpeakRef.current < 300) return;
  lastSpeakRef.current = now;

  try {
    const isSpeaking = await Speech.isSpeakingAsync();
    if (isSpeaking) {
      await Speech.stop();
    }
    Speech.speak(word, {
      language: ttsLang,
      rate: 0.45,
      pitch: 1.0,
    });
  } catch (error) {
    console.log('TTS xətası:', error);
  }
};

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercent,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [currentIndex, progressPercent]);

  const animateTransition = (
    direction: 'next' | 'prev',
    callback: () => void
  ) => {
    const slideOut = direction === 'next' ? -60 : 60;
    const slideIn = direction === 'next' ? 60 : -60;

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: slideOut,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      slideAnim.setValue(slideIn);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (isLast) return;
    animateTransition('next', () => setCurrentIndex((i) => i + 1));
  };

  const handlePrev = () => {
    if (isFirst) return;
    animateTransition('prev', () => setCurrentIndex((i) => i - 1));
  };

  const handleWordPress = () => {
    speakWord(currentWord.word);

    Animated.sequence([
      Animated.timing(pressScale, {
        toValue: 1.02,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pressScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleStartPractice = () => {
    router.push(`/lesson/practice?id=${lesson.id}`);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.counterText}>
            {currentIndex + 1} / {total}
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* PROGRESS BAR */}
        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* CAN DO BLOKU */}
          <View style={styles.introBlock}>
            <Text style={styles.introTitle}>
              🦊 Bu dərsdə nə öyrənəcəyik?
            </Text>
            {lesson.canDo ? (
              <Text style={styles.introText}>{lesson.canDo}</Text>
            ) : null}
          </View>

          {/* SÖZ KARTI */}
          <Animated.View
            style={[
              styles.cardWrapper,
              {
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <View style={styles.card}>
             {/* Şəkil (varsa) */}
{currentWord.imageKey && VOCAB_IMAGES[currentWord.imageKey] ? (
  <Image
    source={VOCAB_IMAGES[currentWord.imageKey]}
    style={styles.wordImage}
    resizeMode="contain"
  />
) : null}

              {/* ƏSAS SÖZ + AUDIO */}
              <View style={styles.wordRow}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={handleWordPress}
                  style={styles.wordTouchable}
                >
                  <Animated.Text
                    style={[
                      styles.wordText,
                      { transform: [{ scale: pressScale }] },
                    ]}
                  >
                    {currentWord.word}
                  </Animated.Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.audioButton}
                  onPress={() => speakWord(currentWord.word)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <SpeakerIcon size={18} />
                </TouchableOpacity>
              </View>

              {/* TƏRCÜMƏ */}
              <Text style={styles.translationText}>
                {currentWord.translation}
              </Text>

              {/* TƏLƏFFÜZ */}
              {currentWord.pronunciation ? (
                <Text style={styles.pronunciationText}>
                  {currentWord.pronunciation}
                </Text>
              ) : null}

              {/* NƏ VAXT İŞLƏNİR? — yalnız usageNote varsa */}
              {currentWord.usageNote ? (
                <View style={styles.usageBlock}>
                  <Text style={styles.usageTitle}>🦊 Nə vaxt işlənir?</Text>
                  <Text style={styles.usageText}>
                    {currentWord.usageNote}
                  </Text>
                </View>
              ) : null}

              {/* NÜMUNƏ */}
              {currentWord.example ? (
                <View style={styles.exampleBlock}>
                  <View style={styles.exampleHeader}>
                    <Text style={styles.exampleLabel}>NÜMUNƏ</Text>
                    <TouchableOpacity
                      style={styles.exampleAudioButton}
                      onPress={() => speakWord(currentWord.example)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <SpeakerIcon size={12} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.exampleText}>
                    {currentWord.example}
                  </Text>
                  {currentWord.exampleAz ? (
                    <Text style={styles.exampleAzText}>
                      {currentWord.exampleAz}
                    </Text>
                  ) : null}
                </View>
              ) : null}
            </View>
          </Animated.View>

          {/* SON SÖZ — CELEBRATION */}
          {isLast ? (
            <View style={styles.celebrationBlock}>
              <Text style={styles.celebrationTitle}>
                🎉 Əla! {total} ifadə öyrəndin!
              </Text>
              <Text style={styles.celebrationText}>
                🦊 İndi görək onları nə qədər yaxşı xatırladığın.
              </Text>
            </View>
          ) : null}
        </ScrollView>

        {/* NAVİQASİYA */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={[styles.navButton, isFirst && styles.navButtonDisabled]}
            onPress={handlePrev}
            disabled={isFirst}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.navButtonText,
                isFirst && styles.navButtonTextDisabled,
              ]}
            >
              ← Əvvəlki
            </Text>
          </TouchableOpacity>

          {isLast ? (
            <TouchableOpacity
              style={styles.practiceButtonWrapper}
              onPress={handleStartPractice}
              activeOpacity={0.85}
            >
              <View style={styles.practiceButton}>
                <Text style={styles.practiceButtonText}>
                  🎮 Sözləri yoxla
                </Text>
                <Text style={styles.practiceButtonArrow}>→</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.nextButtonWrapper}
              onPress={handleNext}
              activeOpacity={0.85}
            >
              <View style={styles.nextButton}>
                <Text style={styles.nextButtonText}>Növbəti →</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },

  // HEADER
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
  backText: {
    fontSize: 22,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  counterText: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerSpacer: {
    width: 44,
  },

  // PROGRESS
  progressContainer: {
    height: 4,
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.mascot.orange,
    borderRadius: 2,
  },

  // INTRO
  introBlock: {
    marginBottom: 20,
  },
  introTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  introText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },

  // CARD
  cardWrapper: {
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1.5,
    borderColor: colors.brd.light,
    shadowColor: colors.mascot.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  wordImage: {
    width: '100%',
    height: 180,
    borderRadius: 18,
    marginBottom: 18,
    backgroundColor: colors.brd.default,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 12,
  },
  wordTouchable: {
    flex: 1,
  },
  wordText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.6,
    lineHeight: 34,
  },
  audioButton: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: colors.mascot.bgSoft,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.mascot.border,
  },
  translationText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.mascot.orange,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  pronunciationText: {
    fontSize: 13,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginBottom: 16,
  },

  // USAGE NOTE
  usageBlock: {
    marginTop: 4,
    marginBottom: 16,
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 14,
    backgroundColor: colors.mascot.bgSoft,
    borderRadius: 14,
    borderLeftWidth: 3,
    borderLeftColor: colors.mascot.orange,
  },
  usageTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.mascot.orange,
    marginBottom: 5,
    letterSpacing: 0.2,
  },
  usageText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    fontWeight: '500',
  },

  // EXAMPLE
  exampleBlock: {
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.brd.default,
  },
  exampleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  exampleLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.mascot.orange,
    letterSpacing: 1.5,
  },
  exampleAudioButton: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.mascot.bgSoft,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.mascot.border,
  },
  exampleText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: 5,
  },
  exampleAzText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
  },

  // CELEBRATION
  celebrationBlock: {
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    marginBottom: 10,
  },
  celebrationTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.success,
    marginBottom: 6,
  },
  celebrationText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },

  // NAV
  navRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 16,
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.brd.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  navButtonTextDisabled: {
    color: colors.textMuted,
  },
  nextButtonWrapper: {
    flex: 1.4,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: colors.mascot.orange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.mascot.orange,
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.2,
  },
  practiceButtonWrapper: {
    flex: 1.4,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: colors.mascot.orange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
  practiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.mascot.orange,
    gap: 8,
  },
  practiceButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  practiceButtonArrow: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },

  // ERROR
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
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});