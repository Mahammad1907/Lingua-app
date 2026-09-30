import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import LearningPath from '../../components/LearningPath';
import { colors } from '../../constants/colors';
import { getLessonById } from '../../data/lessons';
import { getModuleById } from '../../data/modules';
import { Lesson } from '../../data/types';
import { useUserStore } from '../../store/userStore';

export default function ModuleScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const moduleId = params.id;
  const router = useRouter();

  const moduleData = getModuleById(moduleId || '');
  const completedLessons = useUserStore((s) => s.completedLessons);
  const lessonProgress = useUserStore((s) => s.lessonProgress);

  // ═══ Dərsləri module-dan götür ═══
  const lessons: Lesson[] = useMemo(() => {
    if (!moduleData) return [];
    return moduleData.lessonIds
      .map((id) => getLessonById(id))
      .filter((l): l is Lesson => l !== undefined);
  }, [moduleData]);

  // ═══ Ümumi progress hesabla ═══
  const overallProgress = useMemo(() => {
    if (lessons.length === 0) {
      return { percent: 0, completedCount: 0, total: 0 };
    }
    const completedCount = lessons.filter((l) =>
      completedLessons.includes(l.id)
    ).length;
    const totalScore = lessons.reduce((sum, l) => {
      const p = lessonProgress.find((p) => p.lessonId === l.id);
      return sum + (p?.score || 0);
    }, 0);
    const percent = Math.round(totalScore / lessons.length);
    return { percent, completedCount, total: lessons.length };
  }, [lessons, completedLessons, lessonProgress]);

  // ═══ Modul tapılmadı ═══
  if (!moduleData) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>😕</Text>
          <Text style={styles.errorTitle}>Modul tapılmadı</Text>
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

  const handleLessonPress = (lessonId: string) => {
    router.push(`/lesson/vocabulary?id=${lessonId}`);
  };

  const handleSpeakingPractice = () => {
    // Gələcəkdə speaking practice ekranına yönləndir
    // Hazırda heç nə etmir
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
          {/* ═══ HEADER ═══ */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>

            <View style={styles.headerIconWrapper}>
              <Text style={styles.headerIcon}>{moduleData.icon}</Text>
            </View>

            <View style={styles.headerSpacer} />
          </View>

          {/* ═══ MODUL BAŞLIĞI ═══ */}
          <View style={styles.titleBlock}>
            <Text style={styles.levelBadge}>
              {moduleData.level} · {moduleData.language.toUpperCase()}
            </Text>
            <Text style={styles.title}>{moduleData.titleAz}</Text>
            <Text style={styles.description}>{moduleData.description}</Text>
          </View>

          {/* ═══ ÜMUMİ PROGRESS ═══ */}
          <View style={styles.overallProgressCard}>
            <View style={styles.overallProgressHeader}>
              <Text style={styles.overallProgressLabel}>ÜMUMİ PROGRESS</Text>
              <Text style={styles.overallProgressValue}>
                {overallProgress.percent}%
              </Text>
            </View>
            <View style={styles.overallProgressBarBg}>
              <View
                style={[
                  styles.overallProgressBarFill,
                  { width: `${overallProgress.percent}%` },
                ]}
              />
            </View>
            <View style={styles.overallProgressFooter}>
              <Text style={styles.overallProgressFooterText}>
                {overallProgress.completedCount}/{overallProgress.total} dərs tamamlandı
              </Text>
            </View>
          </View>

          {/* ═══ LEARNING PATH ═══ */}
          <View style={styles.pathSectionHeader}>
            <Text style={styles.sectionTitle}>Öyrənmə yolu</Text>
            <Text style={styles.sectionSubtitle}>
              Addım-addım irəlilə
            </Text>
          </View>

          <LearningPath
            lessons={lessons}
            onLessonPress={handleLessonPress}
          />

          {/* ═══ SPEAKING PRACTICE (əgər varsa) ═══ */}
          {moduleData.hasSpeakingPractice && (
            <TouchableOpacity
              style={styles.speakingCard}
              onPress={handleSpeakingPractice}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#6366f1', '#a855f7', '#ec4899']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.speakingCardGradient}
              >
                <View style={styles.speakingIconWrapper}>
                  <Text style={styles.speakingIcon}>🤖</Text>
                </View>
                <View style={styles.speakingContent}>
                  <Text style={styles.speakingTitle}>
                    {moduleData.speakingTitle || 'Speaking Practice'}
                  </Text>
                  <Text style={styles.speakingDesc}>
                    {moduleData.speakingDescription ||
                      'Öyrəndiklərini danışıqda istifadə et'}
                  </Text>
                </View>
                <Text style={styles.speakingArrow}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <View style={{ height: 60 }} />
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 55, paddingBottom: 40 },

  // ═══ HEADER ═══
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  headerIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.35)',
  },
  headerIcon: { fontSize: 22 },
  headerSpacer: { width: 44 },

  // ═══ TITLE ═══
  titleBlock: {
    marginBottom: 24,
  },
  levelBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryLight,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -1,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  // ═══ OVERALL PROGRESS ═══
  overallProgressCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.35)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  overallProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  overallProgressLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryLight,
    letterSpacing: 1.5,
  },
  overallProgressValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  overallProgressBarBg: {
    height: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  overallProgressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  overallProgressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overallProgressFooterText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },

  // ═══ PATH SECTION ═══
  pathSectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  // ═══ SPEAKING CARD ═══
  speakingCard: {
    marginTop: 20,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  speakingCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 14,
  },
  speakingIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  speakingIcon: { fontSize: 26 },
  speakingContent: { flex: 1 },
  speakingTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  speakingDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 17,
  },
  speakingArrow: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: '700',
  },

  // ═══ ERROR ═══
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