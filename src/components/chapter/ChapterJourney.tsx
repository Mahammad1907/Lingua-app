import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode, useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo, Animated, Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions,
} from 'react-native';
import Svg, { Circle, Defs, Path, RadialGradient, Stop } from 'react-native-svg';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { chapterReferenceLayout, clampPercent, journeyRoute, type JourneyLesson } from '../../utils/chapterJourney';
import { HomeIcon } from '../home/HomeIcon';
import { ChapterArtwork, ReferenceArtwork } from './ChapterArtwork';

const ORANGE = '#ffad3b';
const MINT = '#65ddba';
const PURPLE = '#ac92f0';
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface ChapterJourneyProps {
  title: string; order: number; level: string; items: JourneyLesson[]; energy: ReactNode;
  topInset: number; bottomInset: number; onBack: () => void; onLessonPress: (id: string) => void; active?: boolean;
}

function ProgressRing({ percent, color, size = 18 }: { percent: number; color: string; size?: number }) {
  const radius = 7; const circumference = 2 * Math.PI * radius;
  return <Svg width={size} height={size} viewBox="0 0 20 20" accessibilityElementsHidden>
    <Circle cx={10} cy={10} r={radius} fill="none" stroke="#4a405d" strokeWidth={2.7} />
    <Circle cx={10} cy={10} r={radius} fill="none" stroke={color} strokeWidth={2.7}
      strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={circumference * (1 - clampPercent(percent) / 100)}
      strokeLinecap="round" rotation={-90} origin="10, 10" />
  </Svg>;
}

function Route({ width, fromRight, percent, done, badgeSize, reduced, active, height, scale }: {
  width: number; fromRight: boolean; percent: number; done: boolean; badgeSize: number; reduced: boolean;
  active: boolean; height: number; scale: number;
}) {
  // Match the short diagonal bridges in the reference; do not draw a full-width
  // necklace across a tall empty separator. Fraction remains true curve length.
  const points = useMemo(() => journeyRoute(width, height, fromRight, badgeSize + 8 * scale, badgeSize + 36 * scale),
    [width, fromRight, badgeSize, height, scale]);
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
  const headX = progress.interpolate({ inputRange: positions, outputRange: points.map((p) => p.x) });
  const headY = progress.interpolate({ inputRange: positions, outputRange: points.map((p) => p.y) });
  const headOpacity = progress.interpolate({ inputRange: [0, 1, 99, 100], outputRange: [0, 1, 1, 0], extrapolate: 'clamp' });
  return <View pointerEvents="none" style={{ height }} accessible={false}>
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} accessibilityElementsHidden>
      {points.map((point, index) => {
        const threshold = Math.max(0.1, point.fraction * 100);
        const opacity = progress.interpolate({ inputRange: [Math.max(0, threshold - 1), threshold], outputRange: [0, 1], extrapolate: 'clamp' });
        return <Dot key={index} x={point.x} y={point.y} color={accent} opacity={opacity} scale={scale} />;
      })}
      <AnimatedCircle cx={headX} cy={headY} r={9 * scale} fill={accent} opacity={Animated.multiply(headOpacity, 0.08)} />
      <AnimatedCircle cx={headX} cy={headY} r={4.5 * scale} fill={accent} opacity={headOpacity} />
    </Svg>
  </View>;
}

function Dot({ x, y, color, opacity, scale }: {
  x: number; y: number; color: string; opacity: Animated.AnimatedInterpolation<number>; scale: number;
}) {
  return <>
    <Circle cx={x} cy={y} r={2.4 * scale} fill="#9676dc" opacity={0.75} />
    <AnimatedCircle cx={x} cy={y} r={8 * scale} fill={color} opacity={Animated.multiply(opacity, 0.035)} />
    <AnimatedCircle cx={x} cy={y} r={5 * scale} fill={color} opacity={Animated.multiply(opacity, 0.075)} />
    <AnimatedCircle cx={x} cy={y} r={2.8 * scale} fill={color} opacity={opacity} />
  </>;
}

function BadgeGlow({ size, color }: { size: number; color: string }) {
  const id = `glow${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const extent = size + 44;
  return <Svg pointerEvents="none" width={extent} height={extent} style={{ position: 'absolute', left: -22, top: -22 }} accessibilityElementsHidden>
    <Defs><RadialGradient id={id} cx="50%" cy="50%" r="50%">
      <Stop offset="40%" stopColor={color} stopOpacity={0.23} />
      <Stop offset="66%" stopColor={color} stopOpacity={0.10} />
      <Stop offset="100%" stopColor={color} stopOpacity={0} />
    </RadialGradient></Defs>
    <Circle cx={extent / 2} cy={extent / 2} r={extent / 2} fill={`url(#${id})`} />
  </Svg>;
}

const displayTitles: Record<string, string> = {
  a1_en_01_d1_1: 'Salamlaşma ifadələri', a1_en_01_d1_2: 'Özünü təqdim etmə',
  a1_en_01_d2_1: 'Təqdimat cümlələrinin quruluşu', a1_en_01_d3_1: 'Hal-əhval soruşma',
  a1_en_01_d4_1: 'Sual və cavab quruluşu', a1_en_01_final: 'BirFox ilə səsli söhbət',
};

function Station({ item, index, width, badgeSize, reduced, tooltip, onPress, largeText }: {
  item: JourneyLesson; index: number; width: number; badgeSize: number; reduced: boolean;
  tooltip: boolean; onPress: () => void; largeText: boolean;
}) {
  const layout = chapterReferenceLayout(width); const unit = layout.scale;
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
  const cardWidth = largeText ? width - 8 * unit : layout.cardWidth(item.artwork, current);
  const stateLabel = done ? 'tamamlanıb' : locked ? 'kilidli' : current ? 'cari dərs' : 'açıq dərs';
  const inset = badgeSize / 2 + 12 * unit;
  return <View style={[s.stationRow, { alignItems: right ? 'flex-end' : 'flex-start', paddingLeft: 8 * unit, paddingRight: 4 * unit }]}>
    <Animated.View style={{ width: cardWidth, transform: [{ scale }] }}>
      <Pressable onPress={onPress} onPressIn={() => pressState(true)} onPressOut={() => pressState(false)}
        accessibilityRole="button" accessibilityLabel={`${index + 1}. ${item.lesson.titleAz}, ${stateLabel}, ${percent}% tamamlanıb`}
        accessibilityHint={locked ? 'Kilidin səbəbini göstər' : done ? 'Dərsi təkrar aç' : 'Dərsi aç'}
        style={[s.station, { minHeight: badgeSize + (current ? 4 : 0) }, locked && s.locked]}>
        <View style={[s.panelBorder, { marginLeft: right ? 0 : badgeSize / 2, marginRight: right ? badgeSize / 2 : 0 }, current && s.currentPanel]}>
          <LinearGradient colors={current ? ['#f4ba5c', '#735137', '#f6a937'] : ['#3c6285', '#302653', '#544078']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.panelGradient}>
            <LinearGradient colors={['#171a32', '#11172c', '#17152e']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={[s.panel, { minHeight: badgeSize * 0.78, paddingLeft: right ? 12 * unit : inset,
                paddingRight: right ? inset : 12 * unit, paddingVertical: 10 * unit }]}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 * unit }}>
                <Text style={{ color: accent, fontSize: 15 * unit, lineHeight: 18 * unit, fontWeight: '700' }}>{index + 1}.</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[s.lessonTitle, { fontSize: layout.lessonSize, lineHeight: 17 * unit }]}>{displayTitles[item.lesson.id] ?? item.lesson.titleAz}</Text>
                  <View style={[s.stationFooter, { marginTop: 5 * unit }]}>
                    <View style={s.percentGroup} accessibilityElementsHidden>
                      <ProgressRing percent={percent} color={accent} size={18 * unit} />
                      <Text style={[s.percent, { color: accent, fontSize: 11.5 * unit }]}>{percent}%</Text>
                    </View>
                    {(current || status === 'available') && <View style={[s.startGlow, pressed && s.startPressed]}>
                      <LinearGradient colors={['#ffbc4d', '#ff9e32']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.start, { minHeight: 30 * unit, paddingHorizontal: 12 * unit }]}>
                        <Text style={[s.startText, { fontSize: 11.5 * unit }]}>{percent > 0 ? 'Davam et' : 'Başla'}</Text>
                        <HomeIcon name="arrow" size={15 * unit} color="#251b24" />
                      </LinearGradient>
                    </View>}
                  </View>
                </View>
              </View>
            </LinearGradient>
          </LinearGradient>
        </View>
        <View pointerEvents="none" style={[s.badgePosition, right ? { right: 0 } : { left: 0 }, { width: badgeSize, height: badgeSize,
          marginTop: -badgeSize / 2, shadowColor: accent, shadowOpacity: current ? 0.4 : done ? 0.3 : 0.15,
          transform: [{ scale: current ? 1.035 : 1 }] }]}>
          <BadgeGlow size={badgeSize} color={accent} />
          <LinearGradient colors={done ? ['#94ffe1', '#38e5ba', '#218c80'] : current ? ['#ffe8a1', '#ffb543', '#af682c'] : ['#c7a5ff', '#9570db', '#49316c']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.badgeBorder, { borderRadius: badgeSize / 2, padding: 3.1 * unit }]}>
            <LinearGradient colors={['#352a44', '#201d34', '#10182b']} style={[s.badgeInside, { borderRadius: badgeSize / 2 }]}>
              <ChapterArtwork name={item.artwork} size={badgeSize - 8 * unit} />
            </LinearGradient>
          </LinearGradient>
          {(done || locked) && <View style={[s.statusBadge, { borderColor: accent, width: 22 * unit, height: 22 * unit }]}>
            <HomeIcon name={done ? 'check' : 'lock'} color={accent} size={(done ? 15 : 12) * unit} />
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
  const [width, setWidth] = useState(Math.max(1, Math.min(480, (screenWidth || 393) - 48)));
  const layout = chapterReferenceLayout(width); const unit = layout.scale;
  const reduced = useReducedMotion();
  const [tooltip, setTooltip] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const completed = items.filter((item) => item.status === 'completed').length;
  const percent = items.length ? Math.round(completed / items.length * 100) : 0;
  const open = (item: JourneyLesson) => {
    if (timer.current) clearTimeout(timer.current);
    if (item.status === 'locked') {
      setTooltip(item.lesson.id); AccessibilityInfo.announceForAccessibility('Əvvəlki dərsi tamamla');
      timer.current = setTimeout(() => setTooltip(null), 2400); return;
    }
    setTooltip(null);
    if (!reduced && Platform.OS !== 'web') void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft).catch(() => {});
    onLessonPress(item.lesson.id);
  };
  const largeText = fontScale > 1.3;
  return <View style={s.screen}>
    <LinearGradient pointerEvents="none" colors={['#0b1020', '#101329', '#0b1020']} style={StyleSheet.absoluteFill} />
    <ScrollView showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="never"
      contentContainerStyle={{ paddingTop: topInset + 4, paddingBottom: bottomInset + 56 * unit }}>
      <View style={s.content} onLayout={(event) => setWidth(Math.max(1, event.nativeEvent.layout.width - 48))}>
        <View style={[s.topBar, largeText && s.topBarLarge]}>
          <View style={s.backAndLabel}>
            <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Geri qayıt" hitSlop={4} style={({ pressed }) => [s.back, pressed && s.backPressed]}>
              <View style={{ transform: [{ rotate: '180deg' }] }}><HomeIcon name="chevron" size={22} color="#d4c3f5" /></View>
            </Pressable>
            <Text style={s.eyebrow}>BÖLMƏ {order} · {level}</Text>
          </View>
          <View style={s.energy}>{energy}</View>
        </View>
        <View style={[s.hero, { minHeight: layout.heroHeight }]}>
          {!largeText && <View pointerEvents="none" style={{ position: 'absolute', right: -8 * unit, top: -6 * unit }}>
            <ReferenceArtwork name="fox" width={layout.foxWidth} height={layout.foxHeight} />
          </View>}
          {!largeText && <Svg pointerEvents="none" width={width} height={48 * unit} viewBox="0 0 345 48" style={{ position: 'absolute', bottom: -16 * unit }} accessibilityElementsHidden>
            <Path d="M0 25 C155 5 240 10 345 40 L345 48 L0 48Z" fill="#101329" />
            <Path d="M45 19 C165 5 245 12 340 37" fill="none" stroke="#39306b" strokeWidth={1} opacity={0.5} />
          </Svg>}
          <View style={{ width: largeText ? '100%' : '60%', zIndex: 1 }}>
            <Text style={[s.title, { fontSize: layout.titleSize, lineHeight: layout.titleLine }]}>{title}</Text>
            <View style={s.summary}>
              <Text style={[s.summaryText, { fontSize: 12.5 * unit, lineHeight: 19 * unit }]}>
                <Text style={{ fontWeight: '800' }}>{completed}/{items.length}</Text> dərs tamamlanıb <Text style={s.summaryDot}>·</Text> <Text style={s.summaryPercent}>{percent}%</Text>
              </Text>
              <View style={[s.progressTrack, { height: 8 * unit }]} accessibilityRole="progressbar" accessibilityLabel="Bölmənin tamamlanması"
                accessibilityValue={{ min: 0, max: 100, now: percent }}>
                <LinearGradient colors={['#ffb441', '#ff9c30']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.progressFill, { width: `${percent}%` }]} />
              </View>
            </View>
          </View>
        </View>
        <View style={s.journey}>
          {items.map((item, index) => <View key={item.lesson.id}>
            <Station item={item} index={index} width={width} badgeSize={layout.badge} reduced={reduced}
              tooltip={tooltip === item.lesson.id} onPress={() => open(item)} largeText={largeText} />
            {index < items.length - 1 && <Route width={width} fromRight={index % 2 === 1} badgeSize={layout.badge}
              percent={item.percent} done={item.status === 'completed'} reduced={reduced} active={active}
              height={layout.gap(item.status === 'current')} scale={unit} />}
          </View>)}
          {!items.length && <Text style={s.empty}>Bu bölmənin dərsləri hələ hazır deyil.</Text>}
        </View>
      </View>
    </ScrollView>
  </View>;
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0c1020' },
  content: { paddingHorizontal: 24, alignSelf: 'center', width: '100%', maxWidth: 528, alignItems: 'stretch' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 0 },
  topBarLarge: { flexWrap: 'wrap', rowGap: 12 },
  backAndLabel: { flexDirection: 'row', alignItems: 'center', gap: 2, flexShrink: 1 },
  back: { minWidth: 29, minHeight: 44, alignItems: 'flex-start', justifyContent: 'center' }, backPressed: { opacity: 0.65 },
  eyebrow: { color: '#9877d6', fontSize: 10.5, fontWeight: '800', letterSpacing: 0.3, flexShrink: 1 },
  energy: { paddingRight: 7, flexShrink: 0 },
  hero: { position: 'relative', justifyContent: 'flex-start', paddingTop: 12 },
  title: { color: '#faf6ff', fontWeight: '800', letterSpacing: -0.8 },
  summary: { marginTop: 11, marginBottom: 12 }, summaryText: { color: '#ded5f2', fontWeight: '500' },
  summaryDot: { color: '#9280af' }, summaryPercent: { color: ORANGE, fontWeight: '800' },
  progressTrack: { borderRadius: 6, backgroundColor: '#2d2554', overflow: 'hidden', marginTop: 6 },
  progressFill: { height: '100%', borderRadius: 6 },
  journey: { paddingTop: 0 }, stationRow: { width: '100%' }, station: { justifyContent: 'center' }, locked: { opacity: 0.88 },
  panelBorder: { borderRadius: 15, overflow: 'hidden' }, panelGradient: { borderRadius: 15, padding: 1 },
  panel: { borderRadius: 14, justifyContent: 'center' },
  currentPanel: { shadowColor: ORANGE, shadowOpacity: 0.2, shadowRadius: 13, shadowOffset: { width: 0, height: 0 }, overflow: 'visible' },
  lessonTitle: { color: '#f6f0ff', fontWeight: '700' },
  stationFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', columnGap: 5, rowGap: 6 },
  percentGroup: { flexDirection: 'row', alignItems: 'center', gap: 5 }, percent: { fontWeight: '600' },
  badgePosition: { position: 'absolute', top: '50%', shadowRadius: 13, shadowOffset: { width: 0, height: 0 } },
  badgeBorder: { flex: 1 }, badgeInside: { flex: 1, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  statusBadge: { position: 'absolute', right: 0, bottom: 0, borderWidth: 1.6, borderRadius: 20, backgroundColor: '#10162b', justifyContent: 'center', alignItems: 'center' },
  startGlow: { borderRadius: 18, shadowColor: ORANGE, shadowOpacity: 0.22, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } },
  startPressed: { shadowOpacity: 0.38, shadowRadius: 11 },
  start: { borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  startText: { color: '#261d25', lineHeight: 17, fontWeight: '800' },
  tooltip: { position: 'absolute', bottom: '100%', marginBottom: 6, borderRadius: 10, borderWidth: 1, borderColor: '#69538e', backgroundColor: '#2b2340', paddingHorizontal: 12, paddingVertical: 8, zIndex: 10, maxWidth: '100%' },
  tooltipText: { color: '#f3edff', fontSize: 12, lineHeight: 18 },
  empty: { color: '#b0a2c8', fontSize: 15, lineHeight: 22, textAlign: 'center', paddingVertical: 30 },
});
