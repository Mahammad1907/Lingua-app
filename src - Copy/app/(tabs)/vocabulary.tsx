import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useVocabularyStore } from '../../store/vocabularyStore';

export default function VocabularyTab() {
  const router = useRouter();
  const pages = useVocabularyStore((s) => s.pages);
  const allWords = useVocabularyStore((s) => s.allWords);
  const wrongWords = useVocabularyStore((s) => s.wrongWords);
  const testResults = useVocabularyStore((s) => s.testResults);

  const getPageProgress = (pageNumber: number, totalWords: number) => {
    const pageResults = testResults.filter(
      (r) => r.pageNumber === pageNumber
    );
    if (pageResults.length === 0) {
      return { correct: 0, total: totalWords };
    }
    const last = pageResults[pageResults.length - 1];
    return { correct: last.correct, total: totalWords };
  };

  const getPageRange = (pageNumber: number) => {
    const start = (pageNumber - 1) * 30 + 1;
    const end = pageNumber * 30;
    return `${start}–${end}`;
  };

  return (
    <LinearGradient
      colors={['#0a0a1a', '#1e1b4b', '#0a0a1a']}
      style={styles.background}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Başlıq */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Lüğətim</Text>
            <Text style={styles.subtitle}>
              {allWords.length} söz • {pages.length} qrup
            </Text>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Statistika — 3 KLİKLƏNƏN KART */}
        <View style={styles.statsRow}>
          {/* Ümumi söz */}
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => router.push('/vocabulary/all-words')}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.statIconCircle,
                { backgroundColor: 'rgba(34, 197, 94, 0.2)' },
              ]}
            >
              <Text style={styles.statIcon}>📖</Text>
            </View>
            <Text style={styles.statLabel}>Ümumi söz</Text>
            <Text style={styles.statValue}>{allWords.length}</Text>
          </TouchableOpacity>

          {/* Qrup */}
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => router.push('/vocabulary/all-groups')}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.statIconCircle,
                { backgroundColor: 'rgba(139, 92, 246, 0.2)' },
              ]}
            >
              <Text style={styles.statIcon}>📄</Text>
            </View>
            <Text style={styles.statLabel}>Qrup</Text>
            <Text style={styles.statValue}>{pages.length}</Text>
          </TouchableOpacity>

          {/* Səhv */}
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => router.push('/vocabulary/wrong-words-list')}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.statIconCircle,
                { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
              ]}
            >
              <Text style={styles.statIcon}>⚠️</Text>
            </View>
            <Text style={styles.statLabel}>Səhv</Text>
            <Text style={styles.statValue}>{wrongWords.length}</Text>
          </TouchableOpacity>
        </View>

        {/* Boş vəziyyət */}
        {pages.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>📚</Text>
            <Text style={styles.emptyTitle}>Lüğətin boşdur</Text>
            <Text style={styles.emptySubtitle}>
              Dərs keçdikcə sözlər burada avtomatik görünəcək
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Söz qruplarım</Text>

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
                      {getPageRange(page.pageNumber)}-cu sözlər
                    </Text>
                    <Text style={styles.groupSubtitle}>
                      {page.words.length} söz
                    </Text>

                    {page.words.length > 0 && (
                      <>
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
                      </>
                    )}
                  </View>

                  <Text style={styles.groupArrow}>→</Text>
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {/* Səhv sözlər bölməsi */}
        {wrongWords.length > 0 && (
          <View style={styles.wrongSection}>
            <View style={styles.wrongHeader}>
              <View style={styles.wrongIconCircle}>
                <Text style={styles.wrongIcon}>⚠️</Text>
              </View>
              <View style={styles.wrongHeaderInfo}>
                <Text style={styles.wrongHeaderTitle}>Səhv sözlər</Text>
                <Text style={styles.wrongHeaderSubtitle}>
                  {wrongWords.length} sözü təkrar et
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.wrongButton}
              onPress={() => router.push('/vocabulary/wrong-review')}
              activeOpacity={0.85}
            >
              <Text style={styles.wrongButtonText}>
                Səhv sözləri məşq et
              </Text>
              <Text style={styles.wrongButtonArrow}>→</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 70 },

  // HEADER
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -1.2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#a1a1aa',
    fontWeight: '500',
  },
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#13132b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  settingsIcon: { fontSize: 22 },

  // STATS
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#13132b',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  statIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: { fontSize: 20 },
  statLabel: {
    fontSize: 11,
    color: '#a1a1aa',
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
  },

  // SECTION
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.3,
    marginBottom: 16,
  },

  // GROUP CARD
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

  // WRONG SECTION
  wrongSection: {
    marginTop: 24,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  wrongHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  wrongIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  wrongIcon: { fontSize: 22 },
  wrongHeaderInfo: { flex: 1 },
  wrongHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 3,
  },
  wrongHeaderSubtitle: {
    fontSize: 12,
    color: '#fca5a5',
    fontWeight: '600',
  },
  wrongButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    gap: 8,
  },
  wrongButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '800',
  },
  wrongButtonArrow: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '700',
  },

  // EMPTY
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
    lineHeight: 20,
    paddingHorizontal: 40,
  },
});