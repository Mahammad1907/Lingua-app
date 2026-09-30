import { useMemo } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors } from '../constants/colors';
import { Lesson } from '../data/types';
import { useUserStore } from '../store/userStore';

// ═══════════════════════════════════════
// HƏR DƏRS ÜÇÜN STATUS
// ═══════════════════════════════════════
type LessonStatus = 'completed' | 'current' | 'available' | 'locked';

interface LessonWithStatus {
  lesson: Lesson;
  status: LessonStatus;
  progressPercent: number;
}

interface LearningPathProps {
  lessons: Lesson[];
  onLessonPress: (lessonId: string) => void;
}

export default function LearningPath({
  lessons,
  onLessonPress,
}: LearningPathProps) {
  const completedLessons = useUserStore((s) => s.completedLessons);
  const lessonProgress = useUserStore((s) => s.lessonProgress);

  // ═══ Hər dərs üçün status hesabla ═══
  const lessonsWithStatus: LessonWithStatus[] = useMemo(() => {
    return lessons.map((lesson, index) => {
      const completed = completedLessons.includes(lesson.id);
      const progress = lessonProgress.find((p) => p.lessonId === lesson.id);
      const progressPercent = progress?.score || 0;

      let status: LessonStatus;

      if (completed) {
        status = 'completed';
      } else {
        const previousCompleted =
          index === 0 ||
          completedLessons.includes(lessons[index - 1].id);

        if (previousCompleted) {
          const firstIncompleteIndex = lessons.findIndex(
            (l) => !completedLessons.includes(l.id)
          );
          status = index === firstIncompleteIndex ? 'current' : 'available';
        } else {
          status = 'locked';
        }
      }

      return { lesson, status, progressPercent };
    });
  }, [lessons, completedLessons, lessonProgress]);

  return (
    <View style={styles.pathContainer}>
      {lessonsWithStatus.map((item, index) => {
        const isLast = index === lessonsWithStatus.length - 1;
        const alignment = index % 2 === 0 ? 'flex-start' : 'flex-end';

        return (
          <View key={item.lesson.id} style={styles.pathRow}>
            {index > 0 && (
              <View
                style={[
                  styles.connector,
                  {
                    alignSelf:
                      alignment === 'flex-start' ? 'flex-start' : 'flex-end',
                  },
                ]}
              >
                <View
                  style={[
                    styles.connectorLine,
                    item.status === 'completed' && styles.connectorLineDone,
                    item.status === 'locked' && styles.connectorLineLocked,
                  ]}
                />
              </View>
            )}

            <View style={[styles.cardWrapper, { alignSelf: alignment }]}>
              <LessonCard
                item={item}
                index={index}
                onPress={() => {
                  if (item.status === 'locked') return;
                  onLessonPress(item.lesson.id);
                }}
              />
            </View>

            {isLast && <View style={{ height: 20 }} />}
          </View>
        );
      })}
    </View>
  );
}

// ═══════════════════════════════════════
// DƏRS KARTI
// ═══════════════════════════════════════
interface LessonCardProps {
  item: LessonWithStatus;
  index: number;
  onPress: () => void;
}

function LessonCard({ item, index, onPress }: LessonCardProps) {
  const { lesson, status, progressPercent } = item;

  const isCompleted = status === 'completed';
  const isCurrent = status === 'current';
  const isAvailable = status === 'available';
  const isLocked = status === 'locked';

  const accentColor = isCompleted
    ? colors.success
    : isCurrent
    ? colors.primary
    : isAvailable
    ? colors.primaryLight
    : colors.textMuted;

  const borderColor = isCompleted
    ? 'rgba(34, 197, 94, 0.5)'
    : isCurrent
    ? 'rgba(139, 92, 246, 0.7)'
    : isAvailable
    ? 'rgba(139, 92, 246, 0.35)'
    : 'rgba(82, 82, 91, 0.4)';

  const cardStyle = [
    styles.card,
    { borderColor },
    isCurrent && styles.cardCurrent,
    isLocked && styles.cardLocked,
  ];

  return (
    <TouchableOpacity
      style={cardStyle}
      onPress={onPress}
      activeOpacity={isLocked ? 1 : 0.85}
      disabled={isLocked}
    >
      {/* Status ikonu */}
      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor: `${accentColor}22`,
            borderColor: accentColor,
          },
        ]}
      >
        {isCompleted ? (
          <Text style={[styles.statusIcon, { color: accentColor }]}>✓</Text>
        ) : isLocked ? (
          <Text style={[styles.statusIcon, { color: accentColor }]}>🔒</Text>
        ) : (
          <Text style={[styles.statusIcon, { color: accentColor }]}>
            {String(index + 1).padStart(2, '0')}
          </Text>
        )}
      </View>

      {/* Başlıq və açıqlama */}
      <View style={styles.cardContent}>
        <Text
          style={[styles.cardTitle, isLocked && styles.cardTitleLocked]}
          numberOfLines={1}
        >
          {lesson.titleAz}
        </Text>
        <Text
          style={[styles.cardDesc, isLocked && styles.cardDescLocked]}
          numberOfLines={2}
        >
          {lesson.description}
        </Text>
      </View>

      {/* Progress bar */}
      {!isLocked && (
        <View style={styles.progressRow}>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${progressPercent}%`,
                  backgroundColor: accentColor,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: accentColor }]}>
            {progressPercent}%
          </Text>
        </View>
      )}

      {/* CTA düyməsi */}
      <View style={styles.ctaRow}>
        {isCompleted && (
          <View
            style={[
              styles.ctaButton,
              {
                backgroundColor: `${accentColor}22`,
                borderColor: accentColor,
              },
            ]}
          >
            <Text style={[styles.ctaText, { color: accentColor }]}>
              ✓ Tamamlandı
            </Text>
          </View>
        )}
        {isCurrent && (
          <View style={[styles.ctaButton, styles.ctaButtonPrimary]}>
            <Text style={[styles.ctaText, { color: '#ffffff' }]}>
              {progressPercent > 0 ? 'Davam et' : 'Başla'} →
            </Text>
          </View>
        )}
        {isAvailable && (
          <View
            style={[
              styles.ctaButton,
              {
                backgroundColor: `${accentColor}18`,
                borderColor: accentColor,
              },
            ]}
          >
            <Text style={[styles.ctaText, { color: accentColor }]}>
              Başla →
            </Text>
          </View>
        )}
        {isLocked && (
          <View style={[styles.ctaButton, styles.ctaButtonLocked]}>
            <Text style={[styles.ctaText, { color: colors.textMuted }]}>
              🔒 Kilidli
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pathContainer: {
    paddingHorizontal: 4,
  },
  pathRow: {
    width: '100%',
  },
  connector: {
    height: 24,
    width: '100%',
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  connectorLine: {
    width: 3,
    height: 24,
    borderRadius: 2,
    backgroundColor: 'rgba(139, 92, 246, 0.25)',
  },
  connectorLineDone: {
    backgroundColor: 'rgba(34, 197, 94, 0.6)',
  },
  connectorLineLocked: {
    backgroundColor: 'rgba(82, 82, 91, 0.4)',
  },
  cardWrapper: {
    width: '92%',
    marginVertical: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  cardCurrent: {
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 10,
  },
  cardLocked: {
    opacity: 0.6,
  },
  statusBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusIcon: {
    fontSize: 16,
    fontWeight: '800',
  },
  cardContent: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  cardTitleLocked: {
    color: colors.textMuted,
  },
  cardDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  cardDescLocked: {
    color: colors.textMuted,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '800',
    minWidth: 36,
    textAlign: 'right',
  },
  ctaRow: {
    flexDirection: 'row',
  },
  ctaButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  ctaButtonPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonLocked: {
    backgroundColor: 'rgba(82, 82, 91, 0.15)',
    borderColor: 'rgba(82, 82, 91, 0.3)',
  },
  ctaText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});