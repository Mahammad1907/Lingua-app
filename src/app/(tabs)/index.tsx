import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../constants/colors';
import { getLessonById } from '../../data/lessons';
import { getAllModules } from '../../data/modules';
import { useUserStore } from '../../store/userStore';

// ═══════════════════════════════════════
// DİL KONFİQURASİYASI
// ═══════════════════════════════════════
const LANGUAGE_META: Record<
  string,
  { flag: string; name: string; code: string }
> = {
  en: { flag: '🇬🇧', name: 'İngilis', code: 'EN' },
  de: { flag: '🇩🇪', name: 'Alman', code: 'DE' },
  ru: { flag: '🇷🇺', name: 'Rus', code: 'RU' },
};

const MODULE_COLORS = colors.mod.colors;

export default function Home() {
  const router = useRouter();
  const completedLessons = useUserStore((s) => s.completedLessons);
  const lessonProgress = useUserStore((s) => s.lessonProgress);
  const userLevel = useUserStore((s) => s.level);

  const allModules = useMemo(() => getAllModules(), []);

  // Aktiv dil (hazırda 'en')
  const activeLanguage = 'en';
  const languageMeta = LANGUAGE_META[activeLanguage];

  // ═══ Hər modul üçün progress hesabla ═══
  const modulesWithProgress = useMemo(() => {
    return allModules.map((m) => {
      const lessons = m.lessonIds
        .map((id) => getLessonById(id))
        .filter((l): l is NonNullable<typeof l> => l !== undefined);

      const completedCount = lessons.filter((l) =>
        completedLessons.includes(l.id)
      ).length;

      const totalScore = lessons.reduce((sum, l) => {
        const p = lessonProgress.find((p) => p.lessonId === l.id);
        return sum + (p?.score || 0);
      }, 0);

      const percent =
        lessons.length > 0 ? Math.round(totalScore / lessons.length) : 0;

      // Ümumi vaxt (təxmini)
      const totalMinutes = lessons.reduce(
        (sum, l) => sum + (l.estimatedTime || 5),
        0
      );

      return {
        module: m,
        lessonsCount: lessons.length,
        completedCount,
        percent,
        totalMinutes,
      };
    });
  }, [allModules, completedLessons, lessonProgress]);

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
        {/* ═══ HEADER ═══ */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Salam! 👋</Text>
            <Text style={styles.title}>Dərslər</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* ═══ FOX MASKOT + DİL SEÇİMİ ═══ */}
        <View style={styles.heroCard}>
          <Image
            source={require('../../../assets/mascot/fox_normal.png')}
            style={styles.heroMascot}
            resizeMode="contain"
          />

          <View style={styles.languageRow}>
            <TouchableOpacity style={styles.languagePicker}>
              <Text style={styles.languageFlag}>{languageMeta.flag}</Text>
              <Text style={styles.languageName}>{languageMeta.name}</Text>
              <Text style={styles.languageChevron}>▼</Text>
            </TouchableOpacity>

            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{userLevel}</Text>
            </View>
          </View>
        </View>

        {/* ═══ BÖLMƏLƏR BAŞLIĞI ═══ */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Bölmələr</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>Hamısına →</Text>
          </TouchableOpacity>
        </View>

        {/* ═══ MODUL KARTLARI ═══ */}
        {modulesWithProgress.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>📚</Text>
            <Text style={styles.emptyTitle}>Hələ modul yoxdur</Text>
            <Text style={styles.emptySubtitle}>
              Yeni modullar tezliklə əlavə olunacaq
            </Text>
          </View>
        ) : (
          modulesWithProgress.map((item, index) => {
            const color = MODULE_COLORS[index % MODULE_COLORS.length];
            const meta = LANGUAGE_META[item.module.language];
            const isCompleted =
              item.lessonsCount > 0 &&
              item.completedCount === item.lessonsCount;

            // Locked: əvvəlki modul tamamlanmayıbsa
            const previousModule = index > 0 ? modulesWithProgress[index - 1] : null;
            const isLocked =
              previousModule !== null &&
              previousModule.completedCount < previousModule.lessonsCount;

            return (
              <TouchableOpacity
                key={item.module.id}
                style={[
                  styles.moduleCard,
                  {
                    borderColor: isCompleted
                      ? 'rgba(34, 197, 94, 0.5)'
                      : isLocked
                      ? colors.brd.muted
                      : colors.brd.strong,
                    opacity: isLocked ? 0.6 : 1,
                  },
                ]}
                onPress={() => {
                  if (isLocked) return;
                  router.push(`/module/${item.module.id}`);
                }}
                activeOpacity={isLocked ? 1 : 0.85}
                disabled={isLocked}
              >
                <View style={styles.moduleRow}>
                  {/* Sol: ikon */}
                  <View
                    style={[
                      styles.moduleIconWrapper,
                      {
                        backgroundColor: `${color}22`,
                        borderColor: isLocked ? colors.brd.muted : color,
                      },
                    ]}
                  >
                    <Text style={styles.moduleIcon}>
                      {isLocked ? '🔒' : item.module.icon}
                    </Text>
                  </View>

                  {/* Orta: məlumat */}
                  <View style={styles.moduleInfo}>
                    <Text style={styles.moduleTitle}>
                      {item.module.titleAz}
                    </Text>
                    <Text style={styles.moduleDesc} numberOfLines={1}>
                      {item.module.description}
                    </Text>

                    <View style={styles.moduleMetaRow}>
                      <Text style={styles.moduleMetaText}>
                        {item.completedCount}/{item.lessonsCount} dərs
                      </Text>
                      <Text style={styles.moduleMetaDot}>·</Text>
                      <Text style={styles.moduleMetaText}>
                        ~{item.totalMinutes} dəq
                      </Text>
                    </View>

                    {/* Progress bar */}
                    <View style={styles.progressBarBg}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${item.percent}%`,
                            backgroundColor: isCompleted
                              ? colors.success
                              : color,
                          },
                        ]}
                      />
                    </View>
                  </View>

                  {/* Sağ: status */}
                  <View style={styles.moduleStatus}>
                    {isCompleted ? (
                      <View style={styles.completedCircle}>
                        <Text style={styles.completedCheck}>✓</Text>
                      </View>
                    ) : isLocked ? (
                      <Text style={styles.lockIcon}>🔒</Text>
                    ) : (
                      <View style={[styles.arrowCircle, { borderColor: color }]}>
                        <Text style={[styles.arrowIcon, { color }]}>→</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 60 },

  // ═══ HEADER ═══
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -1.2,
  },
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.brd.light,
  },
  settingsIcon: { fontSize: 22 },

  // ═══ HERO (FOX + DİL SEÇİMİ) ═══
  heroCard: {
    alignItems: 'center',
    marginBottom: 24,
  },
  heroMascot: {
    width: 140,
    height: 140,
    marginBottom: 12,
  },
  languageRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  languagePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.brd.light,
    gap: 8,
  },
  languageFlag: { fontSize: 20 },
  languageName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  languageChevron: {
    fontSize: 10,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  levelBadge: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.mascot.bgMedium,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.mascot.borderStrong,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.mascot.orange,
    letterSpacing: 0.5,
  },

  // ═══ SECTION HEADER ═══
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.mascot.orange,
  },

  // ═══ MODUL KARTI ═══
  moduleCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    shadowColor: colors.mascot.orange,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  moduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  moduleIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  moduleIcon: { fontSize: 26 },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  moduleDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  moduleMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  moduleMetaText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  moduleMetaDot: {
    fontSize: 11,
    color: colors.textMuted,
  },
  progressBarBg: {
    height: 5,
    backgroundColor: colors.brd.default,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  // ═══ STATUS (sağ) ═══
  moduleStatus: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
  },
  completedCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.moduleCompletedBg,
    borderWidth: 1.5,
    borderColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedCheck: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.success,
  },
  lockIcon: {
    fontSize: 22,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.brd.default,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    fontSize: 16,
    fontWeight: '800',
  },

  // ═══ EMPTY ═══
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: { fontSize: 60, marginBottom: 16 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});