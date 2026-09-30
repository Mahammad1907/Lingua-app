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

export default function AllWordsScreen() {
  const router = useRouter();
  const allWords = useVocabularyStore((s) => s.allWords);

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
            <Text style={styles.headerTitle}>Bütün sözlər</Text>
            <View style={styles.spacer} />
          </View>

          <Text style={styles.title}>Bütün sözlərim</Text>
          <Text style={styles.subtitle}>{allWords.length} söz</Text>

          {allWords.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>📚</Text>
              <Text style={styles.emptyTitle}>Hələ söz yoxdur</Text>
            </View>
          ) : (
            <View style={styles.wordsContainer}>
              {allWords.map((word, index) => (
                <TouchableOpacity
                  key={word.id}
                  style={styles.wordCard}
                  onPress={() =>
                    router.push(`/vocabulary/word?id=${word.id}`)
                  }
                  activeOpacity={0.85}
                >
                  <View style={styles.wordNumberBox}>
                    <Text style={styles.wordNumber}>{index + 1}</Text>
                  </View>
                  <View style={styles.wordInfo}>
                    <Text style={styles.wordText}>{word.word}</Text>
                    <Text style={styles.wordTranslation}>
                      {word.translation}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.speakButton}
                    onPress={(e) => {
                      e.stopPropagation?.();
                      speakWord(word.word);
                    }}
                  >
                    <SpeakerIcon size={16} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
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
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: { fontSize: 80, marginBottom: 20 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
});