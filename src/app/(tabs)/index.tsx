import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
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
// Yeni dil əlavə etmək üçün yalnız buraya 1 sətir əlavə et
// ═══════════════════════════════════════
const LANGUAGE_META: Record<string, { flag: string; name: string }> = {
  en: { flag: '🇬🇧', name: 'İngilis' },
  de: { flag: '🇩🇪', name: 'Alman' },
  ru: { flag: '🇷🇺', name: 'Rus' },
};

// ═══════════════════════════════════════
// SƏVİYYƏ RƏNGLƏRİ (index-ə görə dövr edir)
// ═══════════════════════════════════════
const MODULE_COLORS = ['#a855f7', '#06b6d4', '#22c55e', '#ef4444', '#f59e0b'];

export default function Home() {
  const router = useRouter();
  const completedLessons = useUserStore((s) => s.completedLessons);
  const lessonProgress = useUserStore((s) => s.lessonProgress);

  const allModules = useMemo(() => getAllModules(), []);

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

      return {
        module: m,
        lessonsCount: lessons.length,
        completedCount,
        percent,
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
            <Text style={styles.greeting}>Salam 👋</Text>
            <Text style={styles.title}>Modullar</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* ═══ MODUL KARTLARI ═══ */}
        <Text style={styles.sectionTitle}>Öyrənmə yolları</Text>

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

            return (
              <TouchableOpacity
                key={item.module.id}
                style={[
                  styles.moduleCard,
                  {
                    borderColor: isCompleted
                      ? 'rgba(34, 197, 94, 0.5)'
                      : 'rgba(139, 92, 246, 0.3)',
                    shadowColor: color,
                  },
                ]}
                onPress={() =>
                  router.push(`/module/${item.module.id}`)
                }
                activeOpacity={0.85}
              >
                {/* ═══ YUXARI SƏTİR — ikon + flag ═══ */}
                <View style={styles.moduleTopRow}>
                  <View
                    style={[
                      styles.moduleIconWrapper,
                      { backgroundColor: `${color}22`, borderColor: color },
                    ]}
                  >
                    <Text style={styles.moduleIcon}>{item.module.icon}</Text>
                  </View>

                  <View style={styles.moduleBadges}>
                    {meta && (
                      <View style={styles.flagBadge}>
                        <Text style={styles.flagText}>{meta.flag}</Text>
                      </View>
                    )}
                    <View style={styles.levelBadge}>
                      <Text style={styles.levelText}>
                        {item.module.level}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* ═══ BAŞLIQ + AÇIQLAMA ═══ */}
                <Text style={styles.moduleTitle}>
                  {item.module.titleAz}
                </Text>
                <Text style={styles.moduleDesc} numberOfLines={2}>
                  {item.module.description}
                </Text>

                {/* ═══ PROGRESS ═══ */}
                <View style={styles.progressBlock}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>
                      {item.completedCount}/{item.lessonsCount} dərs
                    </Text>
                    <Text style={[styles.progressValue, { color }]}>
                      {item.percent}%
                    </Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${item.percent}%`,
                          backgroundColor: isCompleted ? '#22c55e' : color,
                        },
                      ]}
                    />
                  </View>
                </View>

                {/* ═══ CTA ═══ */}
                <View style={styles.moduleCtaRow}>
                  {isCompleted ? (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedBadgeText}>
                        ✓ Tamamlandı
                      </Text>
                    </View>
                  ) : (
                    <View style={[styles.ctaBadge, { borderColor: color }]}>
                      <Text style={[styles.ctaBadgeText, { color }]}>
                        {item.percent > 0 ? 'Davam et' : 'Başla'} →
                      </Text>
                    </View>
                  )}
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
  content: { padding: 20, paddingTop: 70 },

  // ═══ HEADER ═══
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
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
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  settingsIcon: { fontSize: 22 },

  // ═══ SECTION ═══
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 16,
  },

  // ═══ MODUL KARTI ═══
  moduleCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  moduleTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  moduleIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  moduleIcon: { fontSize: 28 },
  moduleBadges: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  flagBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  flagText: { fontSize: 16 },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  levelText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryLight,
    letterSpacing: 1,
  },

  // ═══ MODUL BAŞLIQ ═══
  moduleTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  moduleDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: 16,
  },

  // ═══ PROGRESS ═══
  progressBlock: { marginBottom: 14 },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },

  // ═══ CTA ═══
  moduleCtaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  completedBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.4)',
  },
  completedBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.success,
    letterSpacing: 0.3,
  },
  ctaBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    borderWidth: 1.5,
  },
  ctaBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
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