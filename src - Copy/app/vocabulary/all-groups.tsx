import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useVocabularyStore } from '../../store/vocabularyStore';

export default function AllGroupsScreen() {
  const router = useRouter();
  const pages = useVocabularyStore((s) => s.pages);
  const testResults = useVocabularyStore((s) => s.testResults);

  const getRange = (pageNumber: number) => {
    const start = (pageNumber - 1) * 30 + 1;
    const end = pageNumber * 30;
    return `${start}–${end}`;
  };

  const getPageProgress = (pageNumber: number, totalWords: number) => {
    const pageResults = testResults.filter(
      (r) => r.pageNumber === pageNumber
    );
    if (pageResults.length === 0) return { correct: 0, total: totalWords };
    const last = pageResults[pageResults.length - 1];
    return { correct: last.correct, total: totalWords };
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
            <Text style={styles.headerTitle}>Qruplar</Text>
            <View style={styles.spacer} />
          </View>

          <Text style={styles.title}>Söz qruplarım</Text>
          <Text style={styles.subtitle}>{pages.length} qrup</Text>

          {pages.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>📚</Text>
              <Text style={styles.emptyTitle}>Hələ qrup yoxdur</Text>
            </View>
          ) : (
            <View style={styles.groupsContainer}>
              {pages.map((page) => {
                const progress = getPageProgress(
                  page.pageNumber,
                  page.words.length
                );
                const progressPercent =
                  page.words.length > 0
                    ? (progress.correct / page.words.length) * 100
                    : 0;

                return (
                  <TouchableOpacity
                    key={page.pageNumber}
                    style={styles.groupCard}
                    onPress={() =>
                      router.push(
                        `/vocabulary/group?number=${page.pageNumber}`
                      )
                    }
                    activeOpacity={0.85}
                  >
                    <View style={styles.groupIconCircle}>
                      <Text style={styles.groupIcon}>📖</Text>
                    </View>
                    <View style={styles.groupInfo}>
                      <Text style={styles.groupTitle}>
                        {getRange(page.pageNumber)}-cu sözlər
                      </Text>
                      <Text style={styles.groupSubtitle}>
                        {page.words.length} söz
                      </Text>
                      <View style={styles.progressBarBg}>
                        <View
                          style={[
                            styles.progressBarFill,
                            { width: `${progressPercent}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>
                        {progress.correct}/{page.words.length}
                      </Text>
                    </View>
                    <Text style={styles.groupArrow}>→</Text>
                  </TouchableOpacity>
                );
              })}
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
  groupsContainer: { marginBottom: 20 },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#13132b',
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  groupIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.4)',
  },
  groupIcon: { fontSize: 26 },
  groupInfo: { flex: 1, marginRight: 10 },
  groupTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 3,
  },
  groupSubtitle: {
    fontSize: 12,
    color: '#a1a1aa',
    fontWeight: '500',
    marginBottom: 6,
  },
  progressBarBg: {
    height: 5,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    color: '#a1a1aa',
    fontWeight: '600',
    textAlign: 'right',
  },
  groupArrow: {
    fontSize: 22,
    color: '#8b5cf6',
    fontWeight: '700',
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