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

export default function VocabularyPageScreen() {
  const params = useLocalSearchParams<{ number: string }>();
  const pageNumber = parseInt(params.number || '1');
  const router = useRouter();

  const pages = useVocabularyStore((s) => s.pages);
  const wrongWords = useVocabularyStore((s) => s.wrongWords);
  const page = pages.find((p) => p.pageNumber === pageNumber);

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
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              Səhifə {page.pageNumber}
            </Text>
            <View style={styles.spacer} />
          </View>

          <Text style={styles.title}>Səhifə {page.pageNumber}</Text>
          <Text style={styles.subtitle}>{page.words.length} söz</Text>

          <View style={styles.wordsContainer}>
            {page.words.map((word, index) => {
              const isWrong = wrongWords.some((w) => w.wordId === word.id);
              return (
                <View key={word.id} style={styles.wordCard}>
                  <View style={styles.wordHeader}>
                    <View style={styles.wordNumberBox}>
                      <Text style={styles.wordNumber}>
                        {String(index + 1).padStart(2, '0')}
                      </Text>
                    </View>
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
                    <TouchableOpacity
                      style={styles.speakButton}
                      onPress={() => speakWord(word.word)}
                    >
                      <Text style={styles.speakIcon}>🔊</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.exampleBox}>
                    <Text style={styles.exampleText}>{word.example}</Text>
                    <Text style={styles.exampleTranslation}>
                      {word.exampleAz}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.buttonsWrapper}>
            <TouchableOpacity
              style={styles.testButtonWrapper}
              onPress={() =>
                router.push(`/vocabulary/test?number=${page.pageNumber}`)
              }
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#06b6d4', '#8b5cf6', '#ec4899']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.testButton}
              >
                <Text style={styles.testButtonText}>🎯 Məni yoxla</Text>
                <Text style={styles.testButtonArrow}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
    fontSize: 14,
    color: '#a1a1aa',
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  spacer: { width: 44 },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#a1a1aa',
    marginBottom: 24,
  },
  wordsContainer: { marginBottom: 20 },
  wordCard: {
    backgroundColor: '#13132b',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  wordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    marginRight: 8,
  },
  wrongBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrongBadgeText: { fontSize: 12 },
  wordTranslation: {
    fontSize: 13,
    color: '#a1a1aa',
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
  exampleBox: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(139, 92, 246, 0.15)',
  },
  exampleText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 20,
  },
  exampleTranslation: {
    fontSize: 12,
    color: '#a1a1aa',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  buttonsWrapper: { gap: 10 },
  testButtonWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 12,
  },
  testButtonText: {
    color: '#ffffff',
    fontSize: 17,
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