import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SpeakerIcon from '../../components/SpeakerIcon';
import { useVocabularyStore } from '../../store/vocabularyStore';

export default function WrongWordsListScreen() {
  const router = useRouter();
  const allWords = useVocabularyStore((s) => s.allWords);
  const wrongWords = useVocabularyStore((s) => s.wrongWords);

  const wrongWordObjects = wrongWords
    .map((ww) => ({
      ...ww,
      word: allWords.find((w) => w.id === ww.wordId),
    }))
    .filter((item) => item.word !== undefined);

  const speakWord = (word: string) => {
    Speech.stop();
    Speech.speak(word, { language: 'en-US', rate: 0.5, pitch: 1.0 });
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
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Səhv sözlər</Text>
            <View style={styles.spacer} />
          </View>

          <Text style={styles.title}>Təkrar etməli sözlər</Text>
          <Text style={styles.subtitle}>
            {wrongWordObjects.length} söz səni gözləyir
          </Text>

          {wrongWordObjects.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>🎉</Text>
              <Text style={styles.emptyTitle}>Səhv söz yoxdur!</Text>
              <Text style={styles.emptySubtitle}>
                Bütün sözləri düzgün cavablandırıbsan
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.wordsContainer}>
                {wrongWordObjects.map((item, index) => (
                  <TouchableOpacity
                    key={item.wordId}
                    style={styles.wordCard}
                    onPress={() =>
                      router.push(`/vocabulary/word?id=${item.wordId}`)
                    }
                    activeOpacity={0.85}
                  >
                    <View style={styles.wordNumberBox}>
                      <Text style={styles.wordNumber}>{index + 1}</Text>
                    </View>
                    <View style={styles.wordInfo}>
                      <Text style={styles.wordText}>{item.word!.word}</Text>
                      <Text style={styles.wordTranslation}>
                        {item.word!.translation}
                      </Text>
                      <View style={styles.statsRow}>
                        <Text style={styles.statWrong}>
                          ❌ {item.wrongCount}
                        </Text>
                        <Text style={styles.statCorrect}>
                          ✅ {item.correctCount}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.speakButton}
                      onPress={(e) => {
                        e.stopPropagation?.();
                        speakWord(item.word!.word);
                      }}
                    >
                      <SpeakerIcon size={16} color="#fca5a5" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.testButtonWrapper}
                onPress={() => router.push('/vocabulary/wrong-review')}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#ef4444', '#dc2626']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.testButton}
                >
                  <Text style={styles.testButtonText}>
                    🔁 Səhv sözləri məşq et
                  </Text>
                  <Text style={styles.testButtonArrow}>→</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
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
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#fca5a5',
    marginBottom: 24,
    fontWeight: '600',
  },
  wordsContainer: { marginBottom: 20 },
  wordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#13132b',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  wordNumberBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  wordNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fca5a5',
  },
  wordInfo: { flex: 1 },
  wordText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 3,
  },
  wordTranslation: {
    fontSize: 13,
    color: '#a1a1aa',
    fontWeight: '500',
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statWrong: {
    fontSize: 11,
    color: '#ef4444',
    fontWeight: '700',
  },
  statCorrect: {
    fontSize: 11,
    color: '#22c55e',
    fontWeight: '700',
  },
  speakButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  testButtonWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
    marginTop: 10,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 10,
  },
  testButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  testButtonArrow: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: { fontSize: 80, marginBottom: 20 },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#a1a1aa',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});