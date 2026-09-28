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

export default function VocabularyGroupScreen() {
  const params = useLocalSearchParams<{ number: string }>();
  const groupNumber = parseInt(params.number || '1');
  const router = useRouter();

  const pages = useVocabularyStore((s) => s.pages);
  const wrongWords = useVocabularyStore((s) => s.wrongWords);

  const page = pages.find((p) => p.pageNumber === groupNumber);

  const getRange = () => {
    const start = (groupNumber - 1) * 30 + 1;
    const end = groupNumber * 30;
    return `${start}–${end}`;
  };

  if (!page) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>😕</Text>
          <Text style={styles.errorTitle}>Qrup tapılmadı</Text>
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
            <Text style={styles.headerTitle}>Söz qrupu</Text>
            <View style={styles.spacer} />
          </View>

          {/* Başlıq */}
          <Text style={styles.title}>{getRange()}-cu sözlər</Text>
          <Text style={styles.subtitle}>
            {page.words.length} söz öyrən
          </Text>

          {/* Sözlər */}
          <View style={styles.wordsContainer}>
            {page.words.map((word, index) => {
              const globalIndex = (groupNumber - 1) * 30 + index + 1;
              const isWrong = wrongWords.some((w) => w.wordId === word.id);

              return (
                <TouchableOpacity
                  key={word.id}
                  style={styles.wordCard}
                  onPress={() =>
                    router.push(`/vocabulary/word?id=${word.id}`)
                  }
                  activeOpacity={0.85}
                >
                  {/* Nömrə */}
                  <View style={styles.wordNumberBox}>
                    <Text style={styles.wordNumber}>{globalIndex}</Text>
                  </View>

                  {/* Söz + tərcümə */}
                  <View style={styles.wordInfo}>
                    <View style={styles.wordTitleRow}>
                      <Text style={styles.wordText}>{word.word}</Text>
                      {isWrong && (
                        <View style={styles.wrongBadge}>
                          <Text style={styles.wrongBadgeText}>⚠️</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.wordTranslation}>
                      {word.translation}
                    </Text>
                  </View>

                  {/* 🔊 */}
                  <TouchableOpacity
                    style={styles.speakButton}
                    onPress={(e) => {
                      e.stopPropagation?.();
                      speakWord(word.word);
                    }}
                  >
                    <Text style={styles.speakIcon}>🔊</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Test düyməsi */}
          <TouchableOpacity
            style={styles.testButtonWrapper}
            onPress={() =>
              router.push(`/vocabulary/test?number=${groupNumber}`)
            }
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#06b6d4', '#8b5cf6', '#ec4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.testButton}
            >
              <Text style={styles.testButtonText}>
                📝 Bu {page.words.length} sözü yoxla
              </Text>
              <Text style={styles.testButtonArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>
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
    color: '#a1a1aa',
    marginBottom: 24,
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
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  wordNumberBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  wordNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#a78bfa',
  },
  wordInfo: { flex: 1 },
  wordTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  wordText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
    marginRight: 8,
  },
  wrongBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrongBadgeText: { fontSize: 10 },
  wordTranslation: {
    fontSize: 13,
    color: '#a1a1aa',
    fontWeight: '500',
  },
  speakButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  speakIcon: { fontSize: 18 },
  testButtonWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#8b5cf6',
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