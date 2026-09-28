import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../constants/colors';
import { getLessonById } from '../../data/lessons';

export default function VocabularyScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const lesson = getLessonById(id || '');

  // Fallback — dərs tapılmadıqda
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

  const speakWord = (word: string) => {
    Speech.stop();
    Speech.speak(word, {
      language: 'en-US',
      rate: 0.5,
      pitch: 1.0,
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Yeni sözlər</Text>
          <View style={styles.spacer} />
        </View>

        {/* Başlıq */}
        <Text style={styles.title}>{lesson.titleAz}</Text>
        <Text style={styles.subtitle}>
          {lesson.vocabulary.length} yeni söz
        </Text>

        {/* Sözlər — YIĞCAM */}
        <View style={styles.vocabContainer}>
          {lesson.vocabulary.map((vocab, index) => (
            <View key={vocab.id} style={styles.vocabItem}>
              <View style={styles.vocabNumberBox}>
                <Text style={styles.vocabNumber}>
                  {String(index + 1).padStart(2, '0')}
                </Text>
              </View>

              <View style={styles.vocabInfo}>
                <Text style={styles.vocabWord}>{vocab.word}</Text>
                <Text style={styles.vocabTranslation}>
                  {vocab.translation}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.speakButton}
                onPress={() => speakWord(vocab.word)}
              >
                <Text style={styles.speakIcon}>🔊</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Dərsə başla */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push(`/lesson/practice?id=${lesson.id}`)}
          activeOpacity={0.85}
        >
          <Text style={styles.startButtonText}>Dərsə başla</Text>
          <Text style={styles.startButtonArrow}>→</Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingTop: 55,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
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
  headerTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  spacer: { width: 44 },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  vocabContainer: { marginBottom: 20 },
  // YIĞCAM söz kartı
  vocabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  vocabNumberBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    marginRight: 14,
  },
  vocabNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryLight,
  },
  vocabInfo: { flex: 1 },
  vocabWord: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  vocabTranslation: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  speakButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  speakIcon: { fontSize: 20 },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },
  startButtonArrow: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  // ERROR
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