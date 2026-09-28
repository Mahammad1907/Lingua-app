import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { getLessonById } from '../../data/lessons';
import { useUserStore } from '../../store/userStore';

function Counter({ to, duration = 600 }: { to: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    setValue(0);
    const steps = 30;
    const stepValue = to / steps;
    const stepTime = duration / steps;
    let current = 0;

    timerRef.current = setInterval(() => {
      current += stepValue;
      if (current >= to) {
        setValue(to);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setValue(Math.floor(current));
      }
    }, stepTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [to, duration]);

  return <>{value}</>;
}

function ProgressRing({
  progress,
  size = 85,
}: {
  progress: number;
  size?: number;
}) {
  const strokeWidth = 7;
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
          stroke="rgba(139, 92, 246, 0.15)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#8b5cf6"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </View>
  );
}

export default function CompleteScreen() {
  const params = useLocalSearchParams<{
    id: string;
    correct: string;
    total: string;
    time: string;
  }>();
  const id = params.id;
  const correct = parseInt(params.correct || '0');
  const total = parseInt(params.total || '10');
  const time = parseInt(params.time || '5');
  const router = useRouter();
  const lesson = getLessonById(id || '');

  const xp = useUserStore((s) => s.xp);
  const streak = useUserStore((s) => s.streak);

  const mascotFade = useRef(new Animated.Value(0)).current;
  const messageFade = useRef(new Animated.Value(0)).current;

  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const xpReward = lesson?.xpReward || 0;

  const getMascot = () => {
    if (accuracy >= 80) return require('../../../assets/mascot/fox_happy.png');
    if (accuracy >= 60) return require('../../../assets/mascot/fox_normal.png');
    return require('../../../assets/mascot/fox_sad.png');
  };

  const getTitle = () => 'Dərs tamamlandı';

  const getSubtitle = () => {
    if (accuracy >= 60) return 'Bugünkü məşqini uğurla bitirdin!';
    return 'Bir az da məşq et və yaxşılaşdır.';
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(mascotFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(messageFade, {
        toValue: 1,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
      <LinearGradient
        colors={['#0a0a1a', '#1e1b4b', '#0a0a1a']}
        style={styles.background}
      >
        <View style={styles.container}>
          <Animated.View
            style={[styles.mascotWrapper, { opacity: mascotFade }]}
          >
            <Image
              source={getMascot()}
              style={styles.mascot}
              resizeMode="contain"
            />
          </Animated.View>

          <Animated.View
            style={[styles.messageWrapper, { opacity: messageFade }]}
          >
            <Text style={styles.title}>{getTitle()}</Text>
            <Text style={styles.subtitle}>{getSubtitle()}</Text>
          </Animated.View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.statIconCircle}>
                <Text style={styles.statIcon}>⭐</Text>
              </View>
              <View style={styles.statInfo}>
                <Text style={styles.statValue}>+{xpReward} XP</Text>
                <Text style={styles.statLabel}>Qazandın</Text>
              </View>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <View
                style={[
                  styles.statIconCircle,
                  { backgroundColor: 'rgba(234, 88, 12, 0.2)' },
                ]}
              >
                <Text style={styles.statIcon}>🔥</Text>
              </View>
              <View style={styles.statInfo}>
                <Text style={styles.statValue}>{streak} gün</Text>
                <Text style={styles.statLabel}>Gündəlik giriş</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.topRow}>
              <View style={styles.ringWrapper}>
                <ProgressRing progress={accuracy} size={85} />
                <View style={styles.ringCenter}>
                  <Text style={styles.ringValue}>
                    {correct}/{total}
                  </Text>
                </View>
              </View>

              <View style={styles.rightInfo}>
                <Text style={styles.rightTitle}>Düzgün cavablar</Text>
                <Text style={styles.rightSubtitle}>
                  {total} sualdan {correct}-ü
                </Text>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${accuracy}%` },
                    ]}
                  />
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.rowItem}>
              <View style={styles.rowIconCircle}>
                <Text style={styles.rowIcon}>🎯</Text>
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>Dəqiqlik</Text>
                <Text style={styles.rowSubLabel}>{getSubtitle()}</Text>
              </View>
              <Text style={styles.rowValue}>{accuracy}%</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.rowItem}>
              <View style={styles.rowIconCircle}>
                <Text style={styles.rowIcon}>⏱️</Text>
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>Vaxt</Text>
              </View>
              <Text style={styles.rowValue}>{time} dəq</Text>
            </View>
          </View>

          <View style={styles.buttonsWrapper}>
            <TouchableOpacity
              style={styles.primaryButtonWrapper}
              onPress={() => router.back()}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#8b5cf6', '#06b6d4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>→</Text>
                <View style={styles.primaryButtonContent}>
                  <Text style={styles.primaryButtonTitle}>Növbəti dərs</Text>
                  <Text style={styles.primaryButtonSubtitle}>
                    Dərs 4 · 5 dəq
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.replace('/(tabs)')}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonIcon}>🏠</Text>
              <Text style={styles.secondaryButtonText}>Ana səhifə</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  mascotWrapper: {
    alignItems: 'center',
    marginBottom: -60,
  },
  mascot: {
    width: 380,
    height: 380,
  },
  messageWrapper: {
    alignItems: 'center',
    marginTop: -30,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#c4b5fd',
    fontWeight: '500',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 27, 75, 0.6)',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  statIcon: { fontSize: 18 },
  statInfo: { flex: 1 },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#a1a1aa',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    marginHorizontal: 8,
  },
  detailsCard: {
    backgroundColor: 'rgba(20, 18, 45, 0.7)',
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ringWrapper: {
    position: 'relative',
    marginRight: 14,
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
  ringValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
  },
  rightInfo: { flex: 1 },
  rightTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 3,
  },
  rightSubtitle: {
    fontSize: 11,
    color: '#a1a1aa',
    marginBottom: 8,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 3,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    marginVertical: 6,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rowIcon: { fontSize: 16 },
  rowInfo: { flex: 1 },
  rowLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  rowSubLabel: {
    fontSize: 10,
    color: '#a1a1aa',
  },
  rowValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  buttonsWrapper: { gap: 10 },
  primaryButtonWrapper: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  primaryButtonContent: {
    alignItems: 'flex-start',
  },
  primaryButtonTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  primaryButtonSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  secondaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    backgroundColor: 'transparent',
    gap: 8,
  },
  secondaryButtonIcon: { fontSize: 18 },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});