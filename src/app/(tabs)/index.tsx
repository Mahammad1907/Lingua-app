import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Circle, Svg } from 'react-native-svg';
import { lessons } from '../../data/lessons';
import { Language, Level } from '../../data/types';
import { useUserStore } from '../../store/userStore';

// ═══════════════════════════════════════
// DİL KONFİQURASİYASI
// Yeni dil əlavə etmək üçün yalnız buraya 1 sətir əlavə et
// ═══════════════════════════════════════
const LANGUAGE_META: Record<Language, { flag: string; name: string }> = {
  en: { flag: '🇬🇧', name: 'İngilis' },
  de: { flag: '🇩🇪', name: 'Alman' },
  ru: { flag: '🇷🇺', name: 'Rus' },
};

// ═══════════════════════════════════════
// SƏVİYYƏ KONFİQURASİYASI
// ═══════════════════════════════════════
const LEVEL_ORDER: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

// ═══════════════════════════════════════
// DƏRS RƏNGLƏRİ (index-ə görə dövr edir)
// ═══════════════════════════════════════
const LESSON_COLORS = ['#a855f7', '#06b6d4', '#22c55e', '#ef4444'];

// ═══════════════════════════════════════
// PROGRESS RING
// ═══════════════════════════════════════
function ProgressRing({
  progress,
  number,
  color,
  size = 70,
}: {
  progress: number;
  number: number;
  color: string;
  size?: number;
}) {
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.ringCenter}>
        <Text style={[styles.ringNumber, { color }]}>{number}</Text>
      </View>
    </View>
  );
}

export default function Home() {
  const router = useRouter();
  const completedLessons = useUserStore((s) => s.completedLessons);
  const lessonProgress = useUserStore((s) => s.lessonProgress);
  const isLessonCompleted = useUserStore((s) => s.isLessonCompleted);

  // ═══ FİLTRLƏR ═══
  // Default: birinci əlçatan dil
  const availableLanguages = Array.from(
    new Set(lessons.map((l) => l.language))
  ) as Language[];

  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    availableLanguages[0] || 'en'
  );

  // Seçilmiş dil üçün əlçatan səviyyələr
  const availableLevels = LEVEL_ORDER.filter((level) =>
    lessons.some(
      (l) => l.language === selectedLanguage && l.level === level
    )
  );

  const [selectedLevel, setSelectedLevel] = useState<Level>(
    availableLevels[0] || 'A1'
  );

  // ═══ DƏRSLƏRİ FİLTRLƏ ═══
  const filteredLessons = lessons
    .filter(
      (l) => l.language === selectedLanguage && l.level === selectedLevel
    )
    .sort((a, b) => {
      // moduleId → order strukturuna görə
      if (a.moduleId === b.moduleId) {
        return a.order - b.order;
      }
      return a.moduleId.localeCompare(b.moduleId);
    });

  // ═══ DİL DƏYİŞƏNDƏ — səviyyəni sıfırla ═══
  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
    const firstLevel = LEVEL_ORDER.find((level) =>
      lessons.some((l) => l.language === lang && l.level === level)
    );
    if (firstLevel) setSelectedLevel(firstLevel);
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
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Salam 👋</Text>
            <Text style={styles.title}>Dərslər</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Dil filtri */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {availableLanguages.map((lang) => {
            const meta = LANGUAGE_META[lang];
            if (!meta) return null;
            const isActive = lang === selectedLanguage;
            return (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.filterChip,
                  isActive && styles.filterChipActive,
                ]}
                onPress={() => handleLanguageChange(lang)}
                activeOpacity={0.85}
              >
                <Text style={styles.filterFlag}>{meta.flag}</Text>
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.filterTextActive,
                  ]}
                >
                  {meta.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Səviyyə filtri */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.levelRow}
        >
          {availableLevels.map((level) => {
            const isActive = level === selectedLevel;
            return (
              <TouchableOpacity
                key={level}
                style={[
                  styles.levelChip,
                  isActive && styles.levelChipActive,
                ]}
                onPress={() => setSelectedLevel(level)}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.levelText,
                    isActive && styles.levelTextActive,
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Dərslər */}
        <Text style={styles.sectionTitle}>Dərslər</Text>

        {filteredLessons.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>📚</Text>
            <Text style={styles.emptyTitle}>Hələ dərs yoxdur</Text>
            <Text style={styles.emptySubtitle}>
              Bu səviyyə üçün dərslər tezliklə əlavə olunacaq
            </Text>
          </View>
        ) : (
          filteredLessons.map((lesson, index) => {
            const color = LESSON_COLORS[index % LESSON_COLORS.length];
            const completed = isLessonCompleted(lesson.id);
            const progress = lessonProgress.find(
              (p) => p.lessonId === lesson.id
            );
            const progressPercent = progress?.score || 0;

            return (
              <TouchableOpacity
                key={lesson.id}
                style={[
                  styles.lessonCard,
                  {
                    borderColor: completed ? color : 'rgba(139,92,246,0.3)',
                    shadowColor: color,
                  },
                ]}
                onPress={() =>
                  router.push(`/lesson/vocabulary?id=${lesson.id}`)
                }
                activeOpacity={0.85}
              >
                <View style={styles.lessonRow}>
                  <ProgressRing
                    progress={progressPercent}
                    number={index + 1}
                    color={color}
                  />

                  <View style={styles.lessonInfo}>
                    <View style={styles.lessonTitleRow}>
                      <Text style={styles.lessonTitle}>
                        {lesson.titleAz}
                      </Text>
                      {completed && (
                        <View style={styles.completedBadge}>
                          <Text style={styles.completedBadgeText}>
                            ✓ Keçildi
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.lessonDesc} numberOfLines={1}>
                      {lesson.description}
                    </Text>

                    <View style={styles.lessonMeta}>
                      <Text style={styles.metaText}>
                        {lesson.exercises.length} məşq
                      </Text>
                      <View style={styles.metaDot} />
                      <Text style={styles.metaText}>
                        {lesson.estimatedTime} dəq
                      </Text>
                      <View style={styles.metaDot} />
                      <Text style={styles.metaXp}>
                        +{lesson.xpReward} XP
                      </Text>
                    </View>

                    {/* Progress nəticəsi */}
                    {completed && progress && (
                      <View style={styles.progressInfo}>
                        <Text style={styles.progressInfoText}>
                          ✓ {progress.correctCount}/
                          {progress.correctCount + progress.wrongCount}{' '}
                          · {progress.score}%
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.arrowBox}>
                    <Text style={styles.arrow}>→</Text>
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
  content: { padding: 20, paddingTop: 70 },

  // HEADER
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 15,
    color: '#a1a1aa',
    marginBottom: 4,
    fontWeight: '500',
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -1.2,
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

  // DİL FİLTRİ
  filterRow: {
    gap: 8,
    paddingRight: 20,
    marginBottom: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#13132b',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    gap: 6,
  },
  filterChipActive: {
    borderColor: '#8b5cf6',
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  filterFlag: { fontSize: 18 },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#a1a1aa',
  },
  filterTextActive: { color: '#ffffff' },

  // SƏVİYYƏ FİLTRİ
  levelRow: {
    gap: 8,
    paddingRight: 20,
    marginBottom: 24,
  },
  levelChip: {
    backgroundColor: '#13132b',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  levelChipActive: {
    borderColor: '#8b5cf6',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  levelText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#a1a1aa',
    letterSpacing: 0.5,
  },
  levelTextActive: { color: '#ffffff' },

  // SECTION
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.3,
    marginBottom: 16,
  },

  // LESSON CARD
  lessonCard: {
    backgroundColor: '#13132b',
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ringCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringNumber: { fontSize: 22, fontWeight: '800' },
  lessonInfo: { flex: 1, marginLeft: 14, marginRight: 10 },
  lessonTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
    gap: 8,
  },
  lessonTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.2,
  },
  completedBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.4)',
  },
  completedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#22c55e',
  },
  lessonDesc: {
    fontSize: 12,
    color: '#a1a1aa',
    marginBottom: 8,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 11,
    color: '#52525b',
    fontWeight: '600',
  },
  metaXp: {
    fontSize: 11,
    color: '#fbbf24',
    fontWeight: '800',
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#52525b',
    marginHorizontal: 6,
  },
  progressInfo: {
    marginTop: 8,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  progressInfoText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#22c55e',
  },
  arrowBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  arrow: {
    fontSize: 18,
    color: '#a78bfa',
    fontWeight: '700',
  },

  // EMPTY
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: { fontSize: 60, marginBottom: 16 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#a1a1aa',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});