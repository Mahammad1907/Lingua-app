import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MascotBubble from '../../components/MascotBubble';
import SpeakerIcon from '../../components/SpeakerIcon';
import { colors } from '../../constants/colors';
import { getLessonById } from '../../data/lessons';
import { Language, QuestionWord, TranslationWord } from '../../data/types';
import { useUserStore } from '../../store/userStore';
import { useVocabularyStore } from '../../store/vocabularyStore';
import { isAnswerCorrect } from '../../utils/answerCheck';
import { playCorrectSound, playWrongSound } from '../../utils/sound';
import { AnswerLanguage } from '../../utils/wordDatabase';

const TTS_LANG_MAP: Partial<Record<Language, string>> = {
  en: 'en-US',
};

function normalizeWord(raw: string): string {
  return raw.toLowerCase().trim().replace(/[.,!?;:'"()[\]{}]/g, '');
}

function prepareForTTS(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return text;

  if (trimmed.length === 1) {
    const lower = trimmed.toLowerCase();
    if (lower === 'i') return 'eye';
    if (lower === 'a') return 'ah';
    return trimmed;
  }

  return text;
}

function buildTTSPhrase(tokens: QuestionWord[]): string | null {
  const spoken: string[] = [];
  for (const t of tokens) {
    if (!t.text.trim()) continue;
    const isTTS =
      t.lang !== 'az' &&
      t.lang !== 'punctuation' &&
      TTS_LANG_MAP[t.lang as Language];
    if (isTTS) {
      spoken.push(t.text.trim());
    }
  }
  if (spoken.length === 0) return null;
  return spoken.join(' ');
}

function lookupTranslation(
  rawText: string,
  vocabularyWord: string | undefined,
  vocabulary: { word: string; translation: string }[],
  sentenceDictionary: Record<string, string> | undefined
): string | undefined {
  if (vocabularyWord) {
    const found = vocabulary.find(
      (v) =>
        v.word.trim().toLowerCase() === vocabularyWord.trim().toLowerCase()
    );
    if (found) return found.translation;
  }
  if (sentenceDictionary) {
    const key = normalizeWord(rawText);
    if (key && sentenceDictionary[key]) {
      return sentenceDictionary[key];
    }
  }
  return undefined;
}

function getMascotForRetry(wrongCount: number) {
  if (wrongCount >= 4) {
    return require('../../../assets/mascot/fox_sad.png');
  }
  return require('../../../assets/mascot/fox_normal.png');
}

function getRetryTitle(wrongCount: number): string {
  if (wrongCount === 1) return '1 səhvin var!';
  return `${wrongCount} səhvin var!`;
}

function getRetryMessage(wrongCount: number): string {
  if (wrongCount === 1) return 'Gəl onu birlikdə təkrar edək?';
  if (wrongCount >= 4) return 'Qorxma, birlikdə düzəldək!';
  return 'Gəl onları birlikdə təkrar edək?';
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
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);
  const [tappedAzIndex, setTappedAzIndex] = useState<number | null>(null);

  const [wrongQueue, setWrongQueue] = useState<number[]>([]);
  const [isRetryMode, setIsRetryMode] = useState(false);
  const [showRetryModal, setShowRetryModal] = useState(false);

  const mascotFade = useRef(new Animated.Value(0)).current;
  const mascotShake = useRef(new Animated.Value(0)).current;

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

  const lastSpeakRef = useRef<number>(0);

const speak = async (text: string, lang: Language | undefined) => {
  if (!lang) return;
  const ttsLang = TTS_LANG_MAP[lang];
  if (!ttsLang) return;
  if (!text || !text.trim()) return;

  const now = Date.now();
  if (now - lastSpeakRef.current < 300) return;
  lastSpeakRef.current = now;

  const ttsText = lang === 'en' ? prepareForTTS(text) : text;

  try {
    const isSpeaking = await Speech.isSpeakingAsync();
    if (isSpeaking) {
      await Speech.stop();
    }
    Speech.speak(ttsText, {
      language: ttsLang,
      voice: lang === 'en' ? bestVoice : undefined,
      rate: 0.45,
      pitch: 1.0,
    });
  } catch (error) {
    console.log('TTS xətası:', error);
  }
};

  useEffect(() => {
    setTappedIndex(null);
    setTappedAzIndex(null);
  }, [currentEx]);

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
  const isTranslation = exercise.type === 'translation';
  const isFillBlank = exercise.type === 'fill_blank';
  const isMultipleChoice = exercise.type === 'multiple_choice';

  const questionTokens: QuestionWord[] = useMemo(() => {
    if (exercise.questionWords && exercise.questionWords.length > 0) {
      return exercise.questionWords;
    }
    return [{ text: exercise.question, lang: 'az' as const }];
  }, [exercise.questionWords, exercise.question]);

  const ttsPhrase = useMemo(
    () => buildTTSPhrase(questionTokens),
    [questionTokens]
  );
  const hasTTS = ttsPhrase !== null;

  const tokenTranslations = useMemo(() => {
    return questionTokens.map((tok) => {
      if (tok.lang === 'az' || tok.lang === 'punctuation') {
        return { interactive: false, translation: undefined };
      }
      const translation = lookupTranslation(
        tok.text,
        tok.vocabularyWord,
        lesson.vocabulary,
        lesson.sentenceDictionary
      );
      return { interactive: true, translation };
    });
  }, [questionTokens, lesson.vocabulary, lesson.sentenceDictionary]);

  const tappedToken =
    tappedIndex !== null ? questionTokens[tappedIndex] : null;
  const tappedTranslation =
    tappedIndex !== null
      ? tokenTranslations[tappedIndex]?.translation
      : undefined;

  const translationWords: TranslationWord[] = useMemo(() => {
    if (isSentenceBuild && exercise.translationWords) {
      return exercise.translationWords;
    }
    return [];
  }, [isSentenceBuild, exercise.translationWords]);

  const hasTranslationWords = translationWords.length > 0;
  const tappedAzWord =
    tappedAzIndex !== null ? translationWords[tappedAzIndex] : null;

  const listenableResultText =
    exercise.fullSentence && exercise.fullSentence.trim().length > 0
      ? exercise.fullSentence
      : exercise.correctAnswer;

  const canSpeakResult =
    exercise.answerLang === 'en' && listenableResultText.trim().length > 0;

  useEffect(() => {
    if (
      isSentenceBuild &&
      exercise.words &&
      builtWords.length === 0 &&
      availableWords.length === 0 &&
      !showResult
    ) {
      setAvailableWords([...exercise.words]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEx]);

  const handleTokenTap = (index: number) => {
    const tok = questionTokens[index];
    if (!tok) return;
    if (tok.lang === 'az' || tok.lang === 'punctuation') return;

    const same = tappedIndex === index;
    setTappedIndex(same ? null : index);

    if (same) {
      Speech.stop();
      return;
    }
    if (TTS_LANG_MAP[tok.lang as Language]) {
      speak(tok.text, tok.lang as Language);
    }
  };

  const handleAzWordTap = (index: number) => {
    const tw = translationWords[index];
    if (!tw) return;

    Speech.stop();

    const same = tappedAzIndex === index;
    setTappedAzIndex(same ? null : index);
  };

  const handleAvailableWordTap = (word: string) => {
    speak(word, 'en');
  };

  const handleListenQuestion = () => {
    if (!ttsPhrase) return;
    speak(ttsPhrase, 'en');
  };

  const handleListenResult = () => {
    if (!canSpeakResult) return;
    speak(listenableResultText, 'en');
  };

  const handleSelect = (answer: string, optionLang?: Language) => {
    if (showResult) return;
    setSelected(answer);
    if (optionLang === 'en') {
      speak(answer, 'en');
    } else {
      Speech.stop();
    }
  };

  const handleAddWord = (word: string, index: number) => {
    if (showResult) return;
    handleAvailableWordTap(word);
    const newAvailable = [...availableWords];
    newAvailable.splice(index, 1);
    setAvailableWords(newAvailable);
    setBuiltWords([...builtWords, word]);
  };

  const handleRemoveWord = (word: string, index: number) => {
    if (showResult) return;
    speak(word, 'en');
    const newBuilt = [...builtWords];
    newBuilt.splice(index, 1);
    setBuiltWords(newBuilt);
    setAvailableWords([...availableWords, word]);
  };

  const handleCheck = () => {
    let userAnswer = '';
        if (isSentenceBuild) {
      userAnswer =
        inputMode === 'tap' ? builtWords.join(' ') : typedAnswer.trim();
        } else if (isTranslation || isFillBlank) {
      userAnswer = typedAnswer.trim();
    } else {
      userAnswer = selected || '';
    }

    if (!userAnswer) return;

    const answerLang: AnswerLanguage =
      exercise.answerLang || lesson.language;

    const correct = isAnswerCorrect(
      userAnswer,
      exercise.correctAnswer,
      answerLang
    );
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      playCorrectSound();

      if (isRetryMode) {
        addXP(5);
        setWrongQueue((q) => q.filter((idx) => idx !== currentEx));
      } else {
        addXP(10);
        setCorrectCount((c) => c + 1);
      }
    } else {
      playWrongSound();

      if (isRetryMode) {
        // səhv qalır queue-da
      } else {
        loseHeart();
        setWrongQueue((q) =>
          q.includes(currentEx) ? q : [...q, currentEx]
        );
      }
    }
  };

  const resetExerciseState = () => {
    Speech.stop();
    setSelected(null);
    setBuiltWords([]);
    setAvailableWords([]);
    setTypedAnswer('');
    setInputMode('tap');
    setShowResult(false);
    setTappedIndex(null);
    setTappedAzIndex(null);
  };

  const finishLesson = () => {
    const totalWrong = lesson.exercises.length - correctCount;

    addXP(lesson.xpReward);

    useUserStore
      .getState()
      .markLessonComplete(
        lesson.id,
        correctCount,
        totalWrong,
        lesson.xpReward
      );

    useVocabularyStore.getState().addLessonWords(lesson.id);

    const elapsed = Math.max(
      1,
      Math.round((Date.now() - startTime) / 60000)
    );

    router.replace(
      `/lesson/complete?id=${lesson.id}&correct=${correctCount}&total=${
        lesson.exercises.length
      }&time=${elapsed}&wrong=${totalWrong}`
    );
  };

  const openRetryModal = () => {
    setShowRetryModal(true);
    mascotFade.setValue(0);
    mascotShake.setValue(0);

    Animated.timing(mascotFade, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.sequence([
        Animated.timing(mascotShake, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(mascotShake, {
          toValue: -1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(mascotShake, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(mascotShake, {
          toValue: -1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(mascotShake, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }, 500);
  };

  const handleNext = () => {
    if (!isRetryMode) {
      if (currentEx + 1 < lesson.exercises.length) {
        setCurrentEx(currentEx + 1);
        resetExerciseState();
      } else {
        if (wrongQueue.length > 0) {
          openRetryModal();
        } else {
          finishLesson();
        }
      }
    } else {
      const currentQueueIndex = wrongQueue.indexOf(currentEx);

      if (wrongQueue.length === 0) {
        finishLesson();
      } else if (
        currentQueueIndex === -1 ||
        currentQueueIndex === wrongQueue.length - 1
      ) {
        openRetryModal();
      } else {
        setCurrentEx(wrongQueue[currentQueueIndex + 1]);
        resetExerciseState();
      }
    }
  };

  const handleStartRetry = () => {
    setShowRetryModal(false);
    setIsRetryMode(true);
    if (wrongQueue.length > 0) {
      setCurrentEx(wrongQueue[0]);
      resetExerciseState();
    }
  };

  const handleSkipRetry = () => {
    setShowRetryModal(false);
    finishLesson();
  };

    const isButtonDisabled =
        ((isTranslation || isFillBlank) && !typedAnswer.trim()) ||
        (isMultipleChoice && !selected) ||
    (isSentenceBuild && inputMode === 'tap' && builtWords.length === 0) ||
    (isSentenceBuild && inputMode === 'type' && !typedAnswer.trim());

  const counterText = isRetryMode
    ? `🔁 ${wrongQueue.indexOf(currentEx) + 1}/${wrongQueue.length}`
    : `${currentEx + 1}/${lesson.exercises.length}`;

  const progressPercent = isRetryMode
    ? ((wrongQueue.indexOf(currentEx) + 1) / wrongQueue.length) * 100
    : progress;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
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
              <Text style={styles.counterText}>{counterText}</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${progressPercent}%`,
                  backgroundColor: isRetryMode
                    ? colors.warning
                    : colors.mascot.orange,
                },
              ]}
            />
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.questionCard}>
              <View style={styles.questionHeaderRow}>
                <Text style={styles.questionType}>
                  {isRetryMode && '🔁 TƏKRAR · '}
                  {exercise.type === 'multiple_choice' && '🎯 VARIANT SEÇ'}
                  {exercise.type === 'translation' && '🌐 TƏRCÜMƏ ET'}
                  {exercise.type === 'fill_blank' && '✏️ BOŞLUĞU DOLDUR'}
                  {exercise.type === 'sentence_build' && '🔤 CÜMLƏ QUR'}
                </Text>

                {hasTTS && (
                  <TouchableOpacity
                    style={styles.listenBtn}
                    onPress={handleListenQuestion}
                    activeOpacity={0.7}
                    accessibilityLabel="İngilis hissəsini dinlə"
                  >
                    <SpeakerIcon size={14} />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.questionWordsWrap}>
                {questionTokens.map((tok, i) => {
                  const meta = tokenTranslations[i];
                  const isInteractive = meta?.interactive === true;
                  const isTapped = tappedIndex === i;

                  if (!isInteractive) {
                    return (
                      <Text key={`t-${i}`} style={styles.questionText}>
                        {tok.text}
                      </Text>
                    );
                  }

                  return (
                    <TouchableOpacity
                      key={`t-${i}`}
                      onPress={() => handleTokenTap(i)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.questionText,
                          styles.questionWordEnglish,
                          isTapped && styles.questionWordEnglishActive,
                        ]}
                      >
                        {tok.text}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {isSentenceBuild && hasTranslationWords && (
                <View style={styles.sentenceTranslationBox}>
                  <Text style={styles.sentenceTranslationLabel}>
                    AZƏRBAYCANCA
                  </Text>
                  <View style={styles.translationWordsWrap}>
                    {translationWords.map((tw, i) => {
                      const isTapped = tappedAzIndex === i;
                      return (
                        <TouchableOpacity
                          key={`tw-${i}`}
                          onPress={() => handleAzWordTap(i)}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.translationWordText,
                              isTapped && styles.translationWordTextActive,
                            ]}
                          >
                            {tw.text}{' '}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  {tappedAzWord && (
                    <View style={styles.azAnswerBox}>
                      <Text style={styles.azAnswerLabel}>İNGİLİSCƏ</Text>
                      <Text style={styles.azAnswerText}>
                        {tappedAzWord.en}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {tappedToken &&
                tappedTranslation !== undefined &&
                tappedTranslation !== null && (
                  <View style={styles.translationBox}>
                    <Text style={styles.translationLabel}>
                      AZƏRBAYCANCA
                    </Text>
                    <Text style={styles.translationText}>
                      {tappedTranslation}
                    </Text>
                  </View>
                )}
            </View>

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
                        {(isTranslation || isFillBlank) && (
              <TextInput
                style={styles.input}
                                placeholder={isTranslation ? 'Tərcüməni yaz...' : 'Cavabı yaz...'}
                placeholderTextColor={colors.textMuted}
                value={typedAnswer}
                onChangeText={setTypedAnswer}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!showResult}
                returnKeyType="done"
                onSubmitEditing={showResult ? undefined : handleCheck}
              />
            )}
                        {isMultipleChoice &&
                          exercise.options?.map((opt, idx) => {
                const isSel = selected === opt;
                const isRight = showResult && opt === exercise.correctAnswer;
                const isWrong =
                  showResult && isSel && opt !== exercise.correctAnswer;
                const optLang = exercise.optionLangs?.[idx];

                return (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.option,
                      isSel && styles.optionSelected,
                      isRight && styles.optionRight,
                      isWrong && styles.optionWrong,
                    ]}
                    onPress={() => handleSelect(opt, optLang)}
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


          
          </ScrollView>
            {showResult && (
              <View
                style={[
                  styles.resultBox,
                  isCorrect ? styles.resultCorrect : styles.resultWrong,
                ]}
              >
                <Text style={styles.resultEmoji}>
                  {isCorrect ? '🎉' : '❌'}
                </Text>
                <Text style={styles.resultTitle}>
                  {isCorrect ? 'Doğrudur!' : 'Səhvdir'}
                </Text>

                {isCorrect ? (
                  <View style={styles.mascotHintWrapper}>
                    <MascotBubble
                      message={exercise.explanation}
                      variant="success"
                      mascotSize={120}
                    />
                  </View>
                ) : exercise.mascotHint ? (
                  <View style={styles.mascotHintWrapper}>
                    <MascotBubble
                      message={exercise.mascotHint}
                      variant="hint"
                      mascotSize={120}
                    />
                  </View>
                ) : null}

                <View style={styles.correctAnswerContainer}>
                  <View style={styles.correctAnswerHeader}>
                    <Text style={styles.correctAnswerLabel}>
                      {isCorrect ? 'Sənin cavabın:' : 'Düzgün cavab:'}
                    </Text>
                    {canSpeakResult && (
                      <TouchableOpacity
                        style={styles.resultListenBtn}
                        onPress={handleListenResult}
                        activeOpacity={0.7}
                        accessibilityLabel="Cavabı dinlə"
                      >
                        <SpeakerIcon size={12} />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={styles.correctAnswerText}>
                    {listenableResultText}
                  </Text>
                </View>

                {!isCorrect && (
                  <Text style={styles.resultExplanation}>
                    {exercise.explanation}
                  </Text>
                )}
              </View>
            )}
          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={showResult ? handleNext : handleCheck}
            disabled={isButtonDisabled}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={
                !isButtonDisabled
                  ? (colors.mascot.gradient as unknown as [string, string, ...string[]])
                  : ['#3f3f46', '#3f3f46']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {showResult
                  ? !isRetryMode && currentEx + 1 === lesson.exercises.length
                    ? 'Bitir'
                    : 'Davam et'
                  : 'Yoxla'}
              </Text>
              <Text style={styles.buttonArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Modal
          visible={showRetryModal}
          transparent
          animationType="fade"
          onRequestClose={() => {}}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Animated.View
                style={[
                  styles.modalMascotWrapper,
                  {
                    opacity: mascotFade,
                    transform: [
                      { translateY: 70 },
                      {
                        rotate: mascotShake.interpolate({
                          inputRange: [-1, 0, 1],
                          outputRange: ['-12deg', '0deg', '12deg'],
                        }),
                      },
                      { translateY: -70 },
                    ],
                  },
                ]}
              >
                <Image
                  source={getMascotForRetry(wrongQueue.length)}
                  style={styles.modalMascot}
                  resizeMode="contain"
                />
              </Animated.View>

              <Text style={styles.modalTitle}>
                {getRetryTitle(wrongQueue.length)}
              </Text>
              <Text style={styles.modalMessage}>
                {getRetryMessage(wrongQueue.length)}
              </Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalPrimaryButton}
                  onPress={handleStartRetry}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={colors.mascot.gradient as unknown as [string, string, ...string[]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.modalPrimaryButtonInner}
                  >
                    <Text style={styles.modalPrimaryButtonText}>
                      Təkrar et
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalSecondaryButton}
                  onPress={handleSkipRetry}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalSecondaryButtonText}>
                    Yox, bitir
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  progressBar: { height: '100%', backgroundColor: colors.mascot.orange },
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
  questionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  questionType: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryLight,
    letterSpacing: 1.5,
  },
  listenBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.brd.default,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.brd.strong,
  },
  questionWordsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
  },
  questionText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 32,
  },
  questionWordEnglish: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
    textDecorationColor: colors.primaryLight + 'B3',
    color: colors.primaryLight,
  },
  questionWordEnglishActive: {
    color: colors.success,
    textDecorationColor: colors.success,
  },
  sentenceTranslationBox: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.brd.light,
  },
  sentenceTranslationLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryLight,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  translationWordsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
  },
  translationWordText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
    textDecorationColor: colors.primaryLight + 'B3',
  },
  translationWordTextActive: {
    color: colors.success,
    textDecorationColor: colors.success,
  },
  azAnswerBox: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.brd.default,
  },
  azAnswerLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primaryLight,
    letterSpacing: 1.2,
    marginBottom: 3,
  },
  azAnswerText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.success,
  },
  translationBox: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.brd.light,
  },
  translationLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryLight,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  translationText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.success,
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
  modeActive: { backgroundColor: colors.mascot.orange },
  modeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  modeTextActive: { color: colors.textPrimary },
  buildArea: {
    minHeight: 70,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: colors.brd.strong,
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
    backgroundColor: colors.mascot.orange,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 3,
  },
  builtWordText: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },
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
    borderColor: colors.brd.strong,
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
    borderColor: colors.mascot.orange,
    backgroundColor: colors.mascot.bgSoft,
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
  radioSelected: { borderColor: colors.mascot.orange },
  radioRight: { borderColor: colors.success },
  radioWrong: { borderColor: colors.error },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.mascot.orange,
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
  correctAnswerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  correctAnswerLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 1,
  },
  resultListenBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.brd.default,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.brd.strong,
  },
  correctAnswerText: {
    fontSize: 18,
    color: colors.success,
    fontWeight: '800',
  },
  resultExplanation: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
    mascotHintWrapper: {
    marginTop: 8,
    marginBottom: 12,
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
    letterSpacing: 0.3,
  },
  buttonArrow: {
    color: colors.textPrimary,
    fontSize: 22,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.brd.strong,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 12,
  },
  modalMascotWrapper: {
    marginBottom: 8,
    marginTop: -20,
    marginHorizontal: -20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalMascot: {
    width: 280,
    height: 280,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  modalMessage: {
    fontSize: 15,
    color: colors.txt.accent,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButtons: {
    width: '100%',
    gap: 10,
  },
  modalPrimaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalPrimaryButtonInner: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPrimaryButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  modalSecondaryButton: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.brd.light,
  },
  modalSecondaryButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
});