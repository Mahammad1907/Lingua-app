import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useVocabularyStore } from '../../store/vocabularyStore';

export default function WordDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const wordId = params.id;
  const router = useRouter();

  const allWords = useVocabularyStore((s) => s.allWords);
  const wrongWords = useVocabularyStore((s) => s.wrongWords);

  const word = allWords.find((w) => w.id === wordId);
  const wrongInfo = wrongWords.find((w) => w.wordId === wordId);

  if (!word) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>😕</Text>
          <Text style={styles.errorTitle}>Söz tapılmadı</Text>
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

  const speak = () => {
    Speech.stop();
    Speech.speak(word.word, {
      language: 'en-US',
      rate: 0.5,
      pitch: 1.0,
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={['#0a0a1a', '#1e1b4b', '#0a0a1a']}
        style={styles.background}
      >
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
            <Text style={styles.headerTitle}>Söz məlumatı</Text>
            <View style={styles.spacer} />
          </View>

          {/* Əsas söz */}
          <View style={styles.mainCard}>
            <Text style={styles.mainWord}>{word.word}</Text>
            <Text style={styles.mainTranslation}>{word.translation}</Text>

            <View style={styles.pronunciationBox}>
              <Text style={styles.pronunciationLabel}>TƏLƏFFÜZ</Text>
              <Text style={styles.pronunciationText}>
                {word.pronunciation}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.speakButton}
              onPress={speak}
              activeOpacity={0.85}
            >
              <Text style={styles.speakIcon}>🔊</Text>
              <Text style={styles.speakText}>Dinlə</Text>
            </TouchableOpacity>
          </View>

          {/* Nümunə cümlə */}
          {word.example && (
            <View style={styles.exampleCard}>
              <Text style={styles.exampleLabel}>NÜMUNƏ CÜMLƏ</Text>
              <Text style={styles.exampleText}>{word.example}</Text>
              {word.exampleAz && (
                <Text style={styles.exampleTranslation}>
                  {word.exampleAz}
                </Text>
              )}
            </View>
          )}

          {/* Statistika */}
          {wrongInfo && (
            <View style={styles.statsCard}>
              <Text style={styles.statsLabel}>STATİSTİKA</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValueWrong}>
                    {wrongInfo.wrongCount}
                  </Text>
                  <Text style={styles.statLabel}>Səhv</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValueCorrect}>
                    {wrongInfo.correctCount}
                  </Text>
                  <Text style={styles.statLabel}>Düzgün</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 55, paddingBottom: 40 },
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
  spacer: { width: 44 },
  mainCard: {
    backgroundColor: '#13132b',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  mainWord: {
    fontSize: 38,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
    textAlign: 'center',
  },
  mainTranslation: {
    fontSize: 20,
    color: '#c4b5fd',
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  pronunciationBox: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  pronunciationLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fbbf24',
    letterSpacing: 1.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  pronunciationText: {
    fontSize: 16,
    color: '#fbbf24',
    fontWeight: '600',
    fontStyle: 'italic',
  },
  speakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  speakIcon: { fontSize: 18 },
  speakText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  exampleCard: {
    backgroundColor: '#13132b',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  exampleLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#a78bfa',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  exampleText: {
    fontSize: 17,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 24,
  },
  exampleTranslation: {
    fontSize: 14,
    color: '#a1a1aa',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  statsCard: {
    backgroundColor: '#13132b',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  statsLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#a78bfa',
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  statValueWrong: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ef4444',
    marginBottom: 4,
  },
  statValueCorrect: {
    fontSize: 28,
    fontWeight: '800',
    color: '#22c55e',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#a1a1aa',
    fontWeight: '600',
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