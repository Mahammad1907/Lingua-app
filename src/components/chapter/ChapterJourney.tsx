import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo, Animated, Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { clampPercent, journeyRoute, type JourneyLesson } from '../../utils/chapterJourney';
import { HomeArtwork } from '../home/HomeArtwork';
import { HomeIcon } from '../home/HomeIcon';
import { ChapterArtwork } from './ChapterArtwork';

const ORANGE = '#ffad3b';
const MINT = '#65ddba';
const PURPLE = '#ac92f0';
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const ROUTE_HEIGHT = 70;

export interface ChapterJourneyProps {
  title: string;
  order: number;
  level: string;
  items: JourneyLesson[];
  energy: ReactNode;
  topInset: number;
  bottomInset: number;
  onBack: () => void;
  onLessonPress: (id: string) => void;
  active?: boolean;
}

function ProgressRing({ percent, color }: { percent: number; color: string }) {
  const radius = 7; const circumference = 2 * Math.PI * radius;
  return <Svg width={20} height={20} viewBox="0 0 20 20" accessibilityElementsHidden>
    <Circle cx={10} cy={10} r={radius} fill="none" stroke="#3b3454" strokeWidth={2.5} />
    <Circle cx={10} cy={10} r={radius} fill="none" stroke={color} strokeWidth={2.5}
      strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={circumference * (1 - clampPercent(percent) / 100)}
      strokeLinecap="round" rotation={-90} origin="10, 10" />
  </Svg>;
}

function Route({ width, fromRight, percent, done, badgeSize, reduced, active }: {
  width: number; fromRight: boolean; percent: number; done: boolean; badgeSize: number; reduced: boolean; active: boolean;
}) {
  const points = useMemo(() => journeyRoute(width, ROUTE_HEIGHT, fromRight, badgeSize / 2), [width, fromRight, badgeSize]);
  const value = clampPercent(percent);
  const [progress] = useState(() => new Animated.Value(value));
  useEffect(() => {
    progress.stopAnimation();
    if (!active) return;
    if (reduced) { progress.setValue(value); return; }
    const animation = Animated.timing(progress, { toValue: value, duration: 450, useNativeDriver: false });
    animation.start(); return () => animation.stop();
  }, [value, reduced, progress, active]);
  const accent = done ? MINT : ORANGE;
  const positions = points.map((point) => point.fraction * 100);
  return <View pointerEvents="none" style={{ height: ROUTE_HEIGHT }} accessible={false}>
    <Svg width={width} height={ROUTE_HEIGHT} viewBox={`0 0 ${width} ${ROUTE_HEIGHT}`} accessibilityElementsHidden>
      {points.map((point, index) => {
        const threshold = Math.max(0.1, point.fraction * 100);
        const opacity = progress.interpolate({ inputRange: [Math.max(0, threshold - 1), threshold], outputRange: [0, 1], extrapolate: 'clamp' });
        return <ViewlessDot key={index} x={point.x} y={point.y} color={accent} opacity={opacity} />;
      })}
      <AnimatedCircle cx={progress.interpolate({ inputRange: positions, outputRange: points.map((p) => p.x) })}
        cy={progress.interpolate({ inputRange: positions, outputRange: points.map((p) => p.y) })}
        r={5.3} fill={accent} opacity={progress.interpolate({ inputRange: [0, 1, 99, 100], outputRange: [0, 0.95, 0.95, 0], extrapolate: 'clamp' })} />
    </Svg>
  </View>;
}

function ViewlessDot({ x, y, color, opacity }: {
  x: number; y: number; color: string; opacity: Animated.AnimatedInterpolation<number>;
}) {
  return <>
    <Circle cx={x} cy={y} r={2.8} fill="#645285" />
    <AnimatedCircle cx={x} cy={y} r={5.5} fill={color} opacity={Animated.multiply(opacity, 0.10)} />
    <AnimatedCircle cx={x} cy={y} r={2.9} fill={color} opacity={opacity} />
  </>;
}

function Station({ item, index, width, badgeSize, reduced, tooltip, onPress }: {
  item: JourneyLesson; index: number; width: number; badgeSize: number; reduced: boolean;
  tooltip: boolean; onPress: () => void;
}) {
  const { status, percent } = item;
  const current = status === 'current'; const done = status === 'completed'; const locked = status === 'locked';
  const right = index % 2 === 1;
  const [scale] = useState(() => new Animated.Value(1));
  const [pressed, setPressed] = useState(false);
  const accent = done ? MINT : current ? ORANGE : PURPLE;
  useEffect(() => () => scale.stopAnimation(), [scale]);
  useEffect(() => { if (reduced) { scale.stopAnimation(); scale.setValue(1); } }, [reduced, scale]);
  const pressState = (down: boolean) => {
    setPressed(down); scale.stopAnimation();
    if (reduced) { scale.setValue(1); return; }
    Animated.timing(scale, { toValue: down ? 0.98 : 1, duration: down ? 90 : 140, useNativeDriver: true }).start();
  };
  const inset = badgeSize / 2 + 9;
  const stateLabel = done ? 'tamamlanıb' : locked ? 'kilidli' : current ? 'cari dərs' : 'açıq dərs';
  return <View style={[s.stationRow, { alignItems: right ? 'flex-end' : 'flex-start' }]}>
    <Animated.View style={{ width: current ? width : Math.round(width * 0.90), transform: [{ scale }] }}>
      <Pressable onPress={onPress} onPressIn={() => pressState(true)} onPressOut={() => pressState(false)}
        accessibilityRole="button" accessibilityLabel={`${index + 1}. ${item.lesson.titleAz}, ${stateLabel}, ${percent}% tamamlanıb`}
        accessibilityHint={locked ? 'Kilidin səbəbini göstər' : done ? 'Dərsi təkrar aç' : 'Dərsi aç'}
        style={[s.station, { minHeight: badgeSize + 10 }, locked && s.locked]}>
        <View style={[s.panel, { minHeight: badgeSize - 4, borderColor: current ? '#ba813e' : done ? '#355971' : '#453866',
          marginLeft: right ? 0 : badgeSize / 2, marginRight: right ? badgeSize / 2 : 0,
          paddingLeft: right ? 13 : inset, paddingRight: right ? inset : 13 }, current && s.currentPanel]}>
          <Text style={[s.lessonTitle, width < 325 && s.smallLessonTitle]}>
            <Text style={{ color: accent }}>{index + 1}. </Text>{item.lesson.titleAz}
          </Text>
          <View style={s.stationFooter}>
            <View style={s.percentGroup} accessibilityElementsHidden>
              <ProgressRing percent={percent} color={accent} />
              <Text style={s.percent}>{percent}%</Text>
            </View>
            {(current || status === 'available') && <View style={[s.startGlow, pressed && s.startPressed]}>
              <LinearGradient colors={['#ffb644', '#ff9b30']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.start}>
                <Text style={s.startText}>{percent > 0 ? 'Davam et' : 'Başla'}</Text>
                <HomeIcon name="arrow" size={17} color="#251b24" />
              </LinearGradient>
            </View>}
          </View>
        </View>
        <View pointerEvents="none" style={[s.badgePosition, right ? { right: 0 } : { left: 0 }, { width: badgeSize, height: badgeSize,
          shadowColor: accent, shadowOpacity: current ? 0.25 : done ? 0.18 : 0.09,
          transform: [{ scale: current ? 1.035 : 1 }] }]}>
          <LinearGradient colors={done ? ['#8bf5d6', '#4edab5', '#246f69'] : current ? ['#ffdc87', '#ffac38', '#ad622b'] : ['#ba9bf2', '#7c60b5', '#423359']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.badgeBorder, { borderRadius: badgeSize / 2 }]}>
            <LinearGradient colors={['#30263c', '#191a30', '#12182b']} style={[s.badgeInside, { borderRadius: badgeSize / 2 }]}>
              <ChapterArtwork name={item.artwork} size={badgeSize - 10} />
            </LinearGradient>
          </LinearGradient>
          {(done || locked) && <View style={[s.statusBadge, { borderColor: accent }]}>
            <HomeIcon name={done ? 'check' : 'lock'} color={accent} size={done ? 16 : 13} />
          </View>}
        </View>
      </Pressable>
      {tooltip && <View pointerEvents="none" style={[s.tooltip, right ? { right: 0 } : { left: 0 }]} accessibilityLiveRegion="polite">
        <Text style={s.tooltipText}>Əvvəlki dərsi tamamla</Text>
      </View>}
    </Animated.View>
  </View>;
}

export default function ChapterJourney({ title, order, level, items, energy, topInset, bottomInset, onBack, onLessonPress, active = true }: ChapterJourneyProps) {
  const { width: screenWidth, fontScale } = useWindowDimensions();
  const [width, setWidth] = useState(Math.max(1, Math.min(480, (screenWidth || 390) - 32)));
  const reduced = useReducedMotion();
  const [tooltip, setTooltip] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const completed = items.filter((item) => item.status === 'completed').length;
  const percent = items.length ? Math.round(completed / items.length * 100) : 0;
  const badgeSize = width < 330 ? 82 : 94;
  const open = (item: JourneyLesson) => {
    if (timer.current) clearTimeout(timer.current);
    if (item.status === 'locked') {
      setTooltip(item.lesson.id);
      AccessibilityInfo.announceForAccessibility('Əvvəlki dərsi tamamla');
      timer.current = setTimeout(() => setTooltip(null), 2400);
      return;
    }
    setTooltip(null);
    if (!reduced && Platform.OS !== 'web') void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft).catch(() => {});
    onLessonPress(item.lesson.id);
  };
  const largeText = fontScale > 1.3;
  return <View style={s.screen}>
    <ScrollView showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="never"
      contentContainerStyle={{ paddingTop: topInset + 8, paddingBottom: bottomInset + 72 }}>
      <View style={s.content} onLayout={(event) => setWidth(Math.max(1, event.nativeEvent.layout.width - 32))}>
        <View style={[s.topBar, largeText && s.topBarLarge]}>
          <View style={s.backAndLabel}>
            <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Geri qayıt" hitSlop={4} style={({ pressed }) => [s.back, pressed && s.backPressed]}>
              <View style={{ transform: [{ rotate: '180deg' }] }}><HomeIcon name="chevron" size={25} color="#e6dcff" /></View>
            </Pressable>
            <Text style={s.eyebrow}>BÖLMƏ {order} · {level}</Text>
          </View>
          <View style={s.energy}>{energy}</View>
        </View>
        <View style={[s.hero, largeText && { minHeight: 160 }]}>
          <Text style={[s.title, width < 330 && s.smallTitle, { maxWidth: largeText ? '100%' : '70%' }]}>{title}</Text>
          {!largeText && <HomeArtwork name="fox" style={s.fox} />}
        </View>
        <View style={s.summary}>
          <Text style={s.summaryText}>{completed}/{items.length} dərs tamamlanıb <Text style={s.summaryDot}>·</Text> <Text style={s.summaryPercent}>{percent}%</Text></Text>
          <View style={s.progressTrack} accessibilityRole="progressbar" accessibilityLabel="Bölmənin tamamlanması"
            accessibilityValue={{ min: 0, max: 100, now: percent }}>
            <LinearGradient colors={['#ffae41', '#ff9632']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.progressFill, { width: `${percent}%` }]} />
          </View>
        </View>
        <View style={s.journey}>
          {items.map((item, index) => <View key={item.lesson.id}>
            <Station item={item} index={index} width={width} badgeSize={badgeSize} reduced={reduced} tooltip={tooltip === item.lesson.id} onPress={() => open(item)} />
            {index < items.length - 1 && <Route width={width} fromRight={index % 2 === 1} badgeSize={badgeSize}
              percent={item.percent} done={item.status === 'completed'} reduced={reduced} active={active} />}
          </View>)}
          {!items.length && <Text style={s.empty}>Bu bölmənin dərsləri hələ hazır deyil.</Text>}
        </View>
      </View>
    </ScrollView>
  </View>;
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0c1020' },
  content: { paddingHorizontal: 16, alignSelf: 'center', width: '100%', maxWidth: 512, alignItems: 'stretch' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 16 },
  topBarLarge: { flexWrap: 'wrap', rowGap: 12 },
  backAndLabel: { flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 1 },
  back: { minWidth: 40, minHeight: 44, alignItems: 'flex-start', justifyContent: 'center' },
  backPressed: { opacity: 0.65 },
  eyebrow: { color: '#a88cde', fontSize: 11, fontWeight: '800', letterSpacing: 0.5, flexShrink: 1 },
  energy: { paddingRight: 7, flexShrink: 0 },
  hero: { minHeight: 119, position: 'relative', justifyContent: 'flex-start', paddingTop: 10 },
  title: { color: '#f9f5ff', fontSize: 36, lineHeight: 42, fontWeight: '800', letterSpacing: -0.8, zIndex: 1 },
  smallTitle: { fontSize: 31, lineHeight: 38 },
  fox: { position: 'absolute', width: 120, height: 132, right: -2, top: -9 },
  summary: { marginTop: 10, marginBottom: 38 },
  summaryText: { color: '#e0d9f4', fontSize: 14, lineHeight: 22, fontWeight: '600' },
  summaryDot: { color: '#8b78ae' }, summaryPercent: { color: ORANGE, fontWeight: '800' },
  progressTrack: { height: 9, borderRadius: 6, backgroundColor: '#2c264b', overflow: 'hidden', marginTop: 10 },
  progressFill: { height: '100%', borderRadius: 6 },
  journey: { paddingTop: 4 }, stationRow: { width: '100%' },
  station: { justifyContent: 'center' }, locked: { opacity: 0.76 },
  panel: { backgroundColor: '#16192e', borderWidth: 1, borderRadius: 17, paddingTop: 12, paddingBottom: 12, justifyContent: 'center' },
  currentPanel: { shadowColor: ORANGE, shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 0 } },
  lessonTitle: { color: '#f4f0ff', fontSize: 15.5, lineHeight: 21, fontWeight: '700', flexShrink: 1 },
  smallLessonTitle: { fontSize: 14, lineHeight: 19 },
  stationFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', columnGap: 5, rowGap: 8, marginTop: 8 },
  percentGroup: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  percent: { color: '#a99cc0', fontSize: 12, fontWeight: '600' },
  badgePosition: { position: 'absolute', top: 5, shadowRadius: 11, shadowOffset: { width: 0, height: 0 } },
  badgeBorder: { flex: 1, padding: 2.8 }, badgeInside: { flex: 1, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  statusBadge: { position: 'absolute', width: 25, height: 25, right: 0, bottom: -1, borderWidth: 1.8, borderRadius: 14, backgroundColor: '#12162b', justifyContent: 'center', alignItems: 'center' },
  startGlow: { borderRadius: 18, shadowColor: ORANGE, shadowOpacity: 0.17, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } },
  startPressed: { shadowOpacity: 0.32, shadowRadius: 11 },
  start: { minHeight: 34, borderRadius: 18, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  startText: { color: '#261d25', fontSize: 12, lineHeight: 18, fontWeight: '800' },
  tooltip: { position: 'absolute', bottom: '100%', marginBottom: 6, borderRadius: 10, borderWidth: 1, borderColor: '#69538e', backgroundColor: '#2b2340', paddingHorizontal: 12, paddingVertical: 8, zIndex: 10, maxWidth: '100%' },
  tooltipText: { color: '#f3edff', fontSize: 12, lineHeight: 18 },
  empty: { color: '#b0a2c8', fontSize: 15, lineHeight: 22, textAlign: 'center', paddingVertical: 30 },
});
