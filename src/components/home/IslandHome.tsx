// Home as an island (user's concept; layout A5 approved 13 Nov 2026; redesigned 25 Nov 2026).
// 25 Nov 2026 design: canvas #F6F7FB; top brand bar; a sticky unit header that follows the section on screen; the
// dark gradient “Gündəlik təkrar” card; wavy islands in a faint tint of the section's own colour (dark when done);
// lessons are solid icon circles in the section colour that darken with their %, on a dotted path that leaves each
// circle below and enters the next one above, so the name + % labels stay clear; the current lesson is a larger
// orange node with a breathing halo; the AI zəng card sits on the path in the middle; between two islands only the
// section-exam trophy (no bridge, no text); tapping a lesson opens a bottom sheet with its parts.
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState, type ReactNode, type Ref } from 'react';
import { AccessibilityInfo, Animated, Easing, Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Reanimated, { Easing as REasing, FadeIn, SlideInDown, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, ClipPath, Defs, G, Path, Text as SvgText } from 'react-native-svg';
import Icon from '../design/Icons';
import { Pop, tapHaptic } from '../design/parts';
import { d, font, shadow } from '../design/theme';
import { HomeIcon } from './HomeIcon';
import LessonIcon, { type LessonIconName } from './LessonIcon';
import { APP_NAME } from '../../utils/onboarding';

export interface IslandLesson { id: string; number: number; title: string; phrases?: string; parts?: { id: string; title: string }[]; minutes?: number; icon?: LessonIconName }
/** Section exam button under the map (flag). Opens when every lesson of the section is done. */
export interface IslandExam { id: string; percent: number | null; passed: boolean }

const mascotHead = require('../../../assets/mascot/hood_head.png');

// The user's wavy, cloud-like island outline, drawn for a 350 × 800 box.
const OUTLINE = 'M70 30 C110 6 150 22 176 14 C206 4 238 18 268 22 C312 28 334 70 330 110 C326 150 346 178 340 222 C334 268 312 290 320 336 C328 384 346 410 338 456 C330 500 306 520 314 566 C322 612 342 640 330 686 C318 736 280 770 228 782 C188 792 150 778 116 786 C74 796 34 770 22 728 C10 686 28 650 20 606 C12 560 -2 530 10 486 C22 442 44 420 34 374 C24 328 4 298 14 254 C24 210 48 186 40 142 C32 98 34 54 70 30 Z';
const NODE = 56, HOT = 70, TROPHY = 72;
// Percentage ring around a circle: one teal-green on every section (mockup), not the section colour.
const RING = '#2BA68C', RING_TEXT = '#2F8F7B';
/** Water body under a gently waving surface at `top`. */
const waterPath = (w: number, top: number, bottom: number, phase: number) => {
  const n = 6, seg = w / n; let dd = `M0 ${bottom} L0 ${top}`;
  for (let i = 0; i < n; i++) dd += ` Q${seg * i + seg / 2} ${top + (i % 2 === phase % 2 ? -7 : 7)} ${seg * (i + 1)} ${top}`;
  return dd + ` L${w} ${bottom} Z`;
};

// Every section has its own colour, different from the app colours (user, 20 Nov 2026; restored 25 Nov 2026).
// Lesson circles darken with their percentage, the dotted path deepens towards the end, a finished island turns dark.
const SECTION_COLORS = [
  { base: '#14A3A3', dark: '#0B6E70', soft: '#D4F2F1' }, { base: '#3B7DF0', dark: '#1F4FB0', soft: '#DCE8FD' },
  { base: '#3DA35D', dark: '#226B3A', soft: '#DDF2E3' }, { base: '#E0567A', dark: '#A12E50', soft: '#FBDDE6' },
  { base: '#E0A21B', dark: '#9A6A07', soft: '#FBEFCF' }, { base: '#5C6BC0', dark: '#38458F', soft: '#E1E4F6' },
  { base: '#D9623B', dark: '#963A1C', soft: '#FADFD5' }, { base: '#8E5BC9', dark: '#5E3391', soft: '#EADFF7' },
  { base: '#1E9BD7', dark: '#11668F', soft: '#D6EEF9' }, { base: '#7A9A1F', dark: '#4F6610', soft: '#ECF2D4' },
];
const toneOf = (section: number) => SECTION_COLORS[(section - 1 + SECTION_COLORS.length) % SECTION_COLORS.length];
const hex = (c: string) => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * Math.min(1, Math.max(0, t))).toString(16).padStart(2, '0')).join('');

type Pt = { x: number; y: number };
const lerp = (a: Pt, b: Pt, t: number) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
/** First part (0…t) of a cubic curve, so the coloured dots can stop part-way. */
function splitCubic(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number) {
  const a = lerp(p0, p1, t), b = lerp(p1, p2, t), c = lerp(p2, p3, t), ab = lerp(a, b, t), bc = lerp(b, c, t), e = lerp(ab, bc, t);
  return `M${p0.x} ${p0.y} C${a.x} ${a.y} ${ab.x} ${ab.y} ${e.x} ${e.y}`;
}
export function IslandHome({ section, sectionTitle, lessons, completed, partial, locked, streak, xp, languageLabel, topInset, bottomSpace, review,
  onSelectLanguage, onOpenLesson, onAnalysis, onReview, exam, allOpen = false, bare = false, after, scrollRef, onActiveY, focusId, sticky, sectionTops }: {
  section: number; sectionTitle: string; lessons: IslandLesson[]; completed: string[]; partial: Record<string, number>; locked: boolean;
  nextSection?: { title: string; available: boolean };
  exam?: IslandExam; onPrevSection?: () => void;
  /** Temporary test access: every lesson, part and the exam open in any order (src/config/testAccess.ts). */
  allOpen?: boolean;
  /** Stacked page: `bare` = only the island; `after` = the next sections under the first one. */
  bare?: boolean; after?: ReactNode; scrollRef?: Ref<ScrollView>;
  /** y of the current lesson inside this island (for opening the map where the learner is). */
  onActiveY?: (y: number) => void;
  /** Lesson (or part) last opened from the map: the page scrolls to it and it is drawn as the orange “current” node. */
  focusId?: string;
  /** A next section follows (kept for callers; the bridge was removed 25 Nov 2026). */
  hasNext?: boolean;
  /** Sticky header data for every section (first island only) and where each section starts on the page. */
  sticky?: { section: number; title: string; done: number; count: number }[]; sectionTops?: { current: Record<number, number> };
  streak: number; xp: number; languageLabel: string; topInset: number; bottomSpace: number; review: { count: number };
  onSelectLanguage: () => void; onOpenLesson: (id: string) => void; onAnalysis: () => void; onReview: () => void; onNextSection?: () => void;
}) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState<IslandLesson | null>(null);
  const count = lessons.length;
  const partPct = (id: string) => completed.includes(id) ? 100 : partial[id] ?? 0;
  const isDone = (l: IslandLesson) => l.parts ? l.parts.every(p => completed.includes(p.id)) : completed.includes(l.id);
  const doneCount = lessons.filter(isDone).length;
  const active = locked ? -1 : lessons.findIndex(l => !isDone(l));
  const finished = count > 0 && doneCount === count;
  const examOpen = finished || allOpen;
  const percentOf = (l: IslandLesson) => l.parts ? Math.round(l.parts.reduce((a, p) => a + partPct(p.id), 0) / l.parts.length) : partPct(l.id);
  const activePart = active >= 0 ? percentOf(lessons[active]) / 100 : 0;
  // Soft pulsing light on the part of the path being filled; still when the system asks for reduced motion.
  const glow = useRef(new Animated.Value(.45)).current;
  useEffect(() => {
    let loop: Animated.CompositeAnimation | undefined; let alive = true;
    void AccessibilityInfo.isReduceMotionEnabled().then(reduce => {
      if (!alive || reduce) return;
      loop = Animated.loop(Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(glow, { toValue: .3, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]));
      loop.start();
    });
    return () => { alive = false; loop?.stop(); };
  }, [glow]);

  const W = Math.min(width - 28, 400);
  // The AI zəng card sits on the path after the middle lesson (lesson 4 of 8); that gap is a little taller.
  const aiAt = count >= 2 ? Math.ceil(count / 2) - 1 : -1;
  const AI_GAP = aiAt >= 0 ? 64 : 0;
  // The whole section fits on one screen under the sticky header and the daily-review card (user, 25 Nov 2026).
  // Neighbours sit on opposite sides, so the circles may be closer than their size.
  const H = Math.max(470, height - Math.max(topInset, insets.top) - 4 - 114 - REVIEW_H - bottomSpace - 12);
  const step = (H - 76 - AI_GAP) / Math.max(count - 1, 1);
  const pts: Pt[] = lessons.map((_, i) => ({ x: W * (i % 2 ? .82 : .18), y: 40 + i * step + (aiAt >= 0 && i > aiAt ? AI_GAP : 0) }));
  const aiPt: Pt | null = aiAt >= 0 ? { x: (pts[aiAt].x + pts[aiAt + 1].x) / 2, y: (pts[aiAt].y + pts[aiAt + 1].y) / 2 } : null;
  // No bridge (user, 25 Nov 2026): the islands stand apart and only the trophy sits in the gap between them.
  const EXTRA = exam ? 130 : 20;
  const trophyPt: Pt = { x: W / 2, y: H + 62 };
  const tone = toneOf(section);
  // Section progress = how high the water stands; the deeper it is, the darker the colour.
  const level = count ? lessons.reduce((a, l) => a + percentOf(l), 0) / (count * 100) : 0;
  const waterTop = H * (1 - level) - (level >= 1 ? 30 : 0);
  const water = mix(mix(tone.soft, tone.base, .35), tone.dark, level);
  const shade = (pct: number) => pct >= 100 ? tone.dark : mix(mix('#FFFFFF', tone.soft, .7), tone.dark, Math.pow(pct / 100, .8) * .85);
  const focused = focusId ? lessons.findIndex(l => l.id === focusId || l.parts?.some(p => p.id === focusId)) : -1;
  const focus = focused >= 0 ? focused : active;
  // The orange “current lesson” node: the lesson last opened, else the first unfinished one.
  const hot = locked ? -1 : focus;
  const layoutY = useRef<number | null>(null);
  const focusY = focus >= 0 ? pts[focus].y : null;
  useEffect(() => { if (layoutY.current !== null && focusY !== null) onActiveY?.(layoutY.current + focusY); }, [focusY]); // eslint-disable-line react-hooks/exhaustive-deps
  const sx = W / 350, sy = H / 800;
  // Path between two lessons (user, 25 Nov 2026, like the mockup): leaves the circle at its lower side, runs almost
  // level between the two rows and enters the next circle from its upper side — the name + % labels stay clear.
  const sizeOf = (i: number) => i === hot ? HOT : NODE;
  const edge = (i: number) => {
    const a = pts[i], b = pts[i + 1], dir = b.x > a.x ? 1 : -1, ra = sizeOf(i) / 2, rb = sizeOf(i + 1) / 2;
    // Soft swoop (mockup): it dips out of the lower side, runs level, and curves up into the next circle.
    const p0 = { x: a.x + dir * ra * .78, y: a.y + ra * .62 }, p3 = { x: b.x - dir * rb * .78, y: b.y - rb * .62 };
    return { p0, c1: { x: p0.x + dir * 26, y: p0.y + 20 }, c2: { x: p3.x - dir * 26, y: p3.y - 20 }, p3 };
  };
  const pathOf = (e: ReturnType<typeof edge>) => `M${e.p0.x} ${e.p0.y} C${e.c1.x} ${e.c1.y} ${e.c2.x} ${e.c2.y} ${e.p3.x} ${e.p3.y}`;

  // Sticky unit header (first island only): follows the section on screen.
  const [shown, setShown] = useState(sticky?.[0]?.section ?? section);
  const onScroll = (y: number) => {
    if (!sticky || !sectionTops) return;
    let at = sticky[0].section;
    for (const it of sticky) { const t0 = sectionTops.current[it.section]; if (t0 !== undefined && it.section !== sticky[0].section && t0 <= y + 40) at = it.section; }
    if (at !== shown) setShown(at);
  };
  const head = sticky?.find(x => x.section === shown) ?? { section, title: sectionTitle, done: doneCount, count };
  const headLevel = head.count ? head.done / head.count : 0;

  const map = <View style={{ width: W, height: H + EXTRA, alignSelf: 'center' }} onLayout={e => { layoutY.current = e.nativeEvent.layout.y; if (focus >= 0) onActiveY?.(layoutY.current + pts[focus].y); }}>
    <Svg width={W} height={H + EXTRA} style={StyleSheet.absoluteFill}>
      {/* Whisper-soft shadow, then the island in a faint tint of the section colour (dark once the section is done). */}
      <Path d={OUTLINE} transform={`translate(0 7) scale(${sx} ${sy})`} fill="rgba(91,75,154,.07)" />
      <Path d={OUTLINE} transform={`translate(0 3) scale(${sx} ${sy})`} fill="rgba(91,75,154,.05)" />
      <Path d={OUTLINE} transform={`scale(${sx} ${sy})`} fill={mix('#FFFFFF', tone.soft, .45)} />
      {/* Water (user, 25 Nov 2026): the island fills from the bottom with the section's progress; light at first,
          much darker as it rises, the full dark colour when the section is done. Gentle waves on the surface. */}
      {level > 0 ? <>
        <Defs><ClipPath id={`isl${section}`}><Path d={OUTLINE} transform={`scale(${sx} ${sy})`} /></ClipPath></Defs>
        <G clipPath={`url(#isl${section})`}>
          <Path d={waterPath(W, waterTop, H + 4, 0)} fill={mix(tone.soft, tone.base, .6)} opacity={.55} />
          <Path d={waterPath(W, waterTop + 6, H + 4, 1)} fill={water} />
        </G>
      </> : null}
      {/* Path: colourless dashes; the part a lesson has covered glows towards the next circle (user, 25 Nov 2026). */}
      {pts.slice(0, -1).map((_, i) => {
        const e = edge(i), full = pathOf(e);
        const k = Math.min(1, percentOf(lessons[i]) / 100);
        const lit = k >= 1 ? full : k > 0 ? splitCubic(e.p0, e.c1, e.c2, e.p3, k) : '';
        return <G key={i}>
          <Path d={full} fill="none" stroke="#D9D6E6" strokeWidth={7} strokeLinecap="round" strokeDasharray="4 11" />
          {lit ? <>
            <Path d={lit} fill="none" stroke={tone.base} strokeWidth={15} strokeLinecap="round" opacity={.18} />
            <Path d={lit} fill="none" stroke="#FFFFFF" strokeWidth={7} strokeLinecap="round" strokeDasharray="4 11" />
            <Path d={lit} fill="none" stroke={mix(tone.base, '#FFFFFF', .35)} strokeWidth={5} strokeLinecap="round" strokeDasharray="4 11" />
          </> : null}
        </G>;
      })}
    </Svg>
    {active >= 0 && active < count - 1 && activePart > 0 ? <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: glow }]}>
      <Svg width={W} height={H}>{(() => {
        const e = edge(active);
        const part = splitCubic(e.p0, e.c1, e.c2, e.p3, activePart);
        return <Path d={part} fill="none" stroke={tone.base} strokeWidth={18} strokeLinecap="round" opacity={.22} />;
      })()}</Svg>
    </Animated.View> : null}

    {lessons.map((lesson, i) => {
      const p = pts[i], done = isDone(lesson), isHot = i === hot;
      const size = isHot ? HOT : NODE, pct = percentOf(lesson);
      const r = size / 2 - 3, c = 2 * Math.PI * r;
      const reachable = !locked && (done || i === active || allOpen);
      const right = p.x > W / 2;
      const avail = Math.min(190, right ? p.x - size / 2 - 14 : W - p.x - size / 2 - 14);
      const side = right ? { right: W - (p.x - size / 2 - 10), alignItems: 'flex-end' as const } : { left: p.x + size / 2 + 10 };
      return <View key={lesson.id} pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        {isHot ? <Breath x={p.x} y={p.y} size={size} /> : pct > 0 ? <View pointerEvents="none" style={{ position: 'absolute', left: p.x - size / 2 - 3, top: p.y - size / 2 - 3, width: size + 6, height: size + 6, borderRadius: size / 2 + 3,
          backgroundColor: 'rgba(43,166,140,.10)', shadowColor: RING, shadowOpacity: .15 + .45 * pct / 100, shadowRadius: 4 + 8 * pct / 100, shadowOffset: { width: 0, height: 0 } }} /> : null}
        <Pop to={.93} accessibilityRole="button" accessibilityLabel={`Dərs ${lesson.number}: ${lesson.title}, ${pct} faiz${reachable ? '' : ', kilidlidir'}`}
          onPress={() => { tapHaptic(); setOpen(lesson); }}
          style={[s.node, { left: p.x - size / 2, top: p.y - size / 2, width: size, height: size, borderRadius: size / 2 }, isHot && s.nodeHot]}>
          {isHot ? <LinearGradient colors={['#F97316', '#EA580C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[StyleSheet.absoluteFill, { borderRadius: size / 2 }]} /> : null}
          <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
            {lesson.parts ? lesson.parts.map((part, k) => {
              const gap = 7, half = c / lesson.parts!.length, len = half - gap, fill = len * partPct(part.id) / 100;
              const at = `rotate(${-90 + k * 360 / lesson.parts!.length} ${size / 2} ${size / 2})`;
              return <G key={part.id}>
                <Circle cx={size / 2} cy={size / 2} r={r} stroke={isHot ? 'rgba(255,255,255,.35)' : 'rgba(255,255,255,0)'} strokeWidth={4} fill="none" strokeDasharray={`${len} ${c}`} strokeDashoffset={-gap / 2} transform={at} />
                {fill > 0 ? <Circle cx={size / 2} cy={size / 2} r={r} stroke={isHot ? '#fff' : RING} strokeWidth={4} fill="none" strokeLinecap="round"
                  strokeDasharray={`${fill} ${c}`} strokeDashoffset={-gap / 2} transform={at} /> : null}
              </G>;
            }) : pct > 0 ? <Circle cx={size / 2} cy={size / 2} r={r} stroke={isHot ? '#fff' : RING} strokeWidth={4} fill="none" strokeLinecap="round"
              strokeDasharray={`${c * pct / 100} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} /> : null}
          </Svg>
          {/* The circle darkens strongly with its % (0% very light … 100% the section's dark colour, white icon). */}
          <View style={[s.nodeInner, { width: size - 14, height: size - 14, borderRadius: (size - 14) / 2 }, isHot ? null : { backgroundColor: shade(pct) }, !reachable && !isHot && { opacity: .55 }]}>
            <LessonIcon name={lesson.icon ?? 'chats'} size={isHot ? 38 : 32} white={isHot || pct >= 50} color={tone.dark} bg={isHot ? '#EA580C' : shade(pct)} />
          </View>
        </Pop>
        {/* Name + % beside the circle, no card (25 Nov 2026); parts: “17% · 2 hissə”. */}
        <View pointerEvents="none" style={[s.label, side, { width: avail, top: p.y - 18 }]}>
          <Text style={[s.labelTitle, right && { textAlign: 'right' }, !reachable && { color: '#8E93A6' }, p.y > waterTop + 10 && level > .45 && s.onWater]} numberOfLines={1}>{lesson.title}</Text>
          <Text style={[s.labelPct, right && { textAlign: 'right' }, { color: RING_TEXT }, p.y > waterTop + 10 && level > .45 && s.onWater]}>{pct}%{lesson.parts ? ` · ${lesson.parts.length} hissə` : ''}</Text>
        </View>
      </View>;
    })}
    {aiPt ? (() => {
      const cw = Math.min(W * .66, 240);
      return <View accessible accessibilityLabel="AI zəng, tezliklə, gündə 1 zəng, 3 dəqiqə" accessibilityState={{ disabled: true }}
        style={[s.ai, { left: aiPt.x - cw / 2, top: aiPt.y - AI_CARD_H / 2, width: cw }]}>
        <View style={s.aiIcon}><Icon name="phone" size={18} color="#fff" /></View>
        <View style={{ flex: 1 }}>
          <Text style={s.aiTitle} numberOfLines={1}>AI zəng</Text>
          <Text style={s.aiSub} numberOfLines={1}>gündə 1 · 3 dəq</Text>
        </View>
        <Text style={s.aiSoon}>tezliklə</Text>
      </View>;
    })() : null}
    {exam ? <Pop to={.93} accessibilityRole="button" disabled={!examOpen || locked} onPress={() => { tapHaptic(); onOpenLesson(exam.id); }}
      accessibilityLabel={`Bölmə ${section} imtahanı${exam.passed ? `, keçdin ${exam.percent} faiz` : ''}${examOpen ? ', keçid 70 faiz' : ', bütün dərsləri bitirəndə açılır'}`}
      style={[s.trophy, { left: trophyPt.x - TROPHY / 2, top: trophyPt.y - TROPHY / 2 }, (!examOpen || locked) && { opacity: .6 }]}>
      <Svg width={38} height={38} viewBox="0 0 24 24">
        <Path d="M7 4h10v5a5 5 0 0 1-10 0z" fill={exam.passed ? '#E9B949' : 'none'} stroke="#C99A3E" strokeWidth={1.7} strokeLinejoin="round" />
        <Path d="M7 6H4.5a2.5 2.5 0 0 0 3 3.4M17 6h2.5a2.5 2.5 0 0 1-3 3.4M12 14v3.5M8.5 20.5h7l-.8-3h-5.4z" fill="none" stroke="#C99A3E" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </Pop> : null}
  </View>;

  const sheet = <LessonSheet open={open} onClose={() => setOpen(null)} lessons={lessons} active={active} locked={locked} allOpen={allOpen}
    completed={completed} partPct={partPct} percentOf={percentOf} isDone={isDone} onOpenLesson={id => { setOpen(null); onOpenLesson(id); }} />;

  // Following sections: only the island (the trophy of the previous section sits in the gap above it).
  if (bare) return <View>{map}{sheet}</View>;
  return <View style={s.screen}>
    <StatusBar style="dark" />
    <View style={{ paddingTop: Math.max(topInset, insets.top) + 4 }}>
      <View style={s.topBar}>
        <Pressable accessibilityRole="button" accessibilityLabel={`Dil və səviyyə: ${languageLabel}`} onPress={onSelectLanguage} style={s.brandRow}>
          <Text style={s.brand}>{APP_NAME}</Text>
          <View style={s.langChip}><Text style={s.langText}>{languageLabel}</Text><HomeIcon name="down" color={d.purple} size={13} /></View>
        </Pressable>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <Pressable accessibilityRole="button" accessibilityLabel="Analiz" onPress={onAnalysis} style={s.pill}><Icon name="chart" size={17} color={d.purple} /></Pressable>
          <View style={s.pill} accessibilityLabel={`${streak} gün ardıcıl`}><HomeIcon name="bolt" color="#F97316" size={15} /><Text style={s.pillText}>{streak}</Text></View>
          <View style={s.pill} accessibilityLabel={`${xp} xal`}><Text style={[s.pillText, { color: '#E0A21B' }]}>★</Text><Text style={s.pillText}>{xp}</Text></View>
        </View>
      </View>
      <View style={s.head}>
        <View style={{ flex: 1 }}>
          <Text style={[s.sectionNo, { color: toneOf(head.section).dark }]}>BÖLMƏ {head.section}</Text>
          <Text accessibilityRole="header" style={s.sectionTitle} numberOfLines={1}>{head.title}</Text>
        </View>
        <View style={s.progress} accessibilityLabel={`${head.done} dərs bitib, ${Math.round(headLevel * 100)} faiz`}>
          <Svg width={30} height={30}><Circle cx={15} cy={15} r={12} stroke={toneOf(head.section).soft} strokeWidth={4} fill="none" />
            {headLevel > 0 ? <Circle cx={15} cy={15} r={12} stroke={toneOf(head.section).base} strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 12 * headLevel} 80`} transform="rotate(-90 15 15)" /> : null}</Svg>
          <View><Text style={s.progressPct}>{Math.round(headLevel * 100)}%</Text><Text style={s.progressSub}>{head.done}/{head.count} dərs</Text></View>
        </View>
        <Image source={mascotHead} style={{ width: 44, height: 40 }} contentFit="contain" accessibilityLabel="Maskot" />
      </View>
    </View>
    <ScrollView ref={scrollRef} contentContainerStyle={{ paddingTop: 4, paddingBottom: bottomSpace + 8 }} showsVerticalScrollIndicator={false}
      onScroll={e => onScroll(e.nativeEvent.contentOffset.y)} scrollEventThrottle={48}>
      {/* Daily review: dark gradient hero (25 Nov 2026). */}
      <View style={s.reviewWrap}>
        <LinearGradient colors={['#1E1B4B', '#3B1E7A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.review}>
          <View style={s.reviewIcon}><HomeIcon name="repeat" color="#F97316" size={22} /></View>
          <View style={{ flex: 1 }}>
            <Text style={s.reviewTitle}>Gündəlik təkrar</Text>
            <Text style={s.reviewSub} numberOfLines={1}>{review.count ? `Bu gün ${review.count} ifadə` : 'Səhvlərin burada toplanacaq'}</Text>
          </View>
          <Pop accessibilityRole="button" accessibilityLabel="Gündəlik təkrara başla" onPress={() => { tapHaptic(); onReview(); }} style={s.reviewBtn}>
            <LinearGradient colors={['#F97316', '#EA580C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[StyleSheet.absoluteFill, { borderRadius: 18 }]} />
            <Text style={s.reviewBtnText}>Başla</Text>
          </Pop>
        </LinearGradient>
      </View>
      {map}
      {after}
    </ScrollView>
    {sheet}
  </View>;
}

/** Breathing halo behind the current lesson node (still under Reduce Motion). */
function Breath({ x, y, size }: { x: number; y: number; size: number }) {
  const k = useSharedValue(0);
  useEffect(() => {
    let alive = true;
    void AccessibilityInfo.isReduceMotionEnabled().then(reduce => { if (alive && !reduce) k.value = withRepeat(withTiming(1, { duration: 1600, easing: REasing.inOut(REasing.sin) }), -1, true); });
    return () => { alive = false; };
  }, [k]);
  const a = useAnimatedStyle(() => ({ opacity: .32 - .2 * k.value, transform: [{ scale: 1.08 + .2 * k.value }] }));
  return <Reanimated.View pointerEvents="none" style={[{ position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: size / 2, backgroundColor: '#F97316' }, a]} />;
}

/** Lesson bottom sheet (25 Nov 2026): rises from the bottom over a dimmed page, covers the tab bar. Header with the
 *  lesson icon, “DƏRS n · k HİSSƏ”, title, ✕; an orange progress bar; then one card per part — the current part white
 *  with an orange focus border and an orange “Davam →”, the others soft grey with a lavender “Başla”. No word list. */
function LessonSheet({ open, onClose, lessons, active, locked, allOpen, completed, partPct, percentOf, isDone, onOpenLesson }: {
  open: IslandLesson | null; onClose: () => void; lessons: IslandLesson[]; active: number; locked: boolean; allOpen: boolean; completed: string[];
  partPct: (id: string) => number; percentOf: (l: IslandLesson) => number; isDone: (l: IslandLesson) => boolean; onOpenLesson: (id: string) => void;
}) {
  const insets = useSafeAreaInsets();
  if (!open) return null;
  const pct = percentOf(open), done = isDone(open), isActive = lessons[active]?.id === open.id;
  const reachable = !locked && (done || isActive || allOpen);
  const parts = open.parts ?? [{ id: open.id, title: open.title }];
  const multi = parts.length > 1;
  const current = parts.findIndex(p => !completed.includes(p.id));
  const go = (id: string) => { tapHaptic(); onOpenLesson(id); };
  return <Modal visible transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
    <Reanimated.View entering={FadeIn.duration(180)} style={StyleSheet.absoluteFill}><Pressable accessibilityLabel="Bağla" style={s.backdrop} onPress={onClose} /></Reanimated.View>
    <Reanimated.View entering={SlideInDown.duration(260)} style={[s.sheet, { paddingBottom: Math.max(20, insets.bottom + 10) }]}>
      <View style={s.handle} />
      <View style={s.sheetHead}>
        <View style={s.sheetIcon}><LessonIcon name={open.icon ?? 'chats'} size={28} /></View>
        <View style={{ flex: 1, gap: 4 }}>
          <View style={s.sheetChip}><Text style={s.sheetChipText}>DƏRS {open.number}{multi ? ` · ${parts.length} HİSSƏ` : ''}</Text></View>
          <Text style={s.sheetTitle} numberOfLines={2}>{open.title}</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Bağla" onPress={onClose} hitSlop={10} style={s.close}><Icon name="close" size={16} color={d.inkSoft} /></Pressable>
      </View>
      <View style={{ gap: 6 }}>
        <Text style={s.sheetPct}>{pct}%</Text>
        <View style={s.track}><LinearGradient colors={['#F97316', '#EA580C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: `${Math.max(pct, pct ? 4 : 0)}%`, height: '100%', borderRadius: 4 }} /></View>
      </View>
      {!reachable ? <Text style={s.sheetLocked}>Bu dərs əvvəlki dərsi bitirəndə açılacaq.</Text>
        // One-part lesson (user, 25 Nov 2026): no part card repeating the title — one orange button.
        : !multi ? <Pop accessibilityRole="button" accessibilityLabel={done ? 'Yenidən keç' : pct ? 'Davam et' : 'Başla'} onPress={() => go(open.id)} style={s.goWide}>
          <LinearGradient colors={['#F97316', '#EA580C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[StyleSheet.absoluteFill, { borderRadius: 28 }]} />
          <Text style={s.goWideText}>{done ? 'Yenidən keç' : pct ? 'Davam et' : 'Başla'}</Text><Icon name="arrow" size={18} color="#fff" />
        </Pop>
        : parts.map((part, k) => {
        const pp = partPct(part.id), partDone = pp === 100;
        const partOpen = allOpen || k === 0 || completed.includes(parts[k - 1].id);
        const now = k === (current < 0 ? -1 : current) && partOpen;
        const label = partDone ? 'Yenidən' : pp ? 'Davam' : 'Başla';
        const r = 20, c = 2 * Math.PI * r;
        const nth = `${k + 1}-${k === 2 ? 'cü' : 'ci'} hissə`;
        return <View key={part.id} style={[s.partCard, now ? s.partNow : s.partNext]}>
          <Svg width={48} height={48}>
            <Circle cx={24} cy={24} r={r} stroke={now ? '#FED7AA' : '#E5E7EB'} strokeWidth={4} fill="none" />
            {pp > 0 ? <Circle cx={24} cy={24} r={r} stroke={now ? '#EA580C' : d.purple} strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray={`${c * pp / 100} ${c}`} transform="rotate(-90 24 24)" /> : null}
            <SvgText x={24} y={30} fontSize={17} fontWeight="800" fill={now ? '#C2410C' : '#9CA3AF'} textAnchor="middle">{k + 1}</SvgText>
          </Svg>
          <View style={{ flex: 1 }}>
            <Text style={s.partTitle} numberOfLines={2}>{part.title}</Text>
            <Text style={[s.partSub, now && { color: '#C2410C' }]}>{multi ? `${nth} · ` : ''}{pp}%</Text>
          </View>
          {!partOpen ? <Text style={s.partLocked}>{k}-ci hissədən sonra</Text>
            : now ? <Pop accessibilityRole="button" accessibilityLabel={`${multi ? nth + ': ' : ''}${label}`} onPress={() => go(part.id)} style={s.goHot}>
              <LinearGradient colors={['#F97316', '#EA580C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[StyleSheet.absoluteFill, { borderRadius: 22 }]} />
              <Text style={s.goHotText}>{label}</Text><Icon name="arrow" size={16} color="#fff" />
            </Pop>
            : <Pop accessibilityRole="button" accessibilityLabel={`${multi ? nth + ': ' : ''}${label}`} onPress={() => go(part.id)} style={s.goSoft}><Text style={s.goSoftText}>{label}</Text></Pop>}
        </View>;
      })}
    </Reanimated.View>
  </Modal>;
}

const NAV = [
  // Menu (user, 21 Nov 2026): Təkrar lives on the map now; Qaydalar is a tab; the AI tab is “AI müəllim”.
  { id: 'learn', label: 'Öyrən' }, { id: 'rules', label: 'Qaydalar' }, { id: 'chat', label: 'AI müəllim' },
  { id: 'vocabulary', label: 'Lüğətim' }, { id: 'profile', label: 'Profil' },
] as const;
const NAV_ICON = { learn: 'home', rules: 'rules', vocabulary: 'book', profile: 'person' } as const;
export type IslandDestination = typeof NAV[number]['id'];

/** Floating bottom menu drawn in code. AI söhbət is a tab of its own (empty for now). */
export function IslandNavigation({ bottomInset, onNavigate, active = 'learn' }: { bottomInset: number; onNavigate: (id: IslandDestination) => void; active?: IslandDestination }) {
  return <View style={[s.navWrap, { paddingBottom: Math.max(bottomInset, 10) }]}>
    <View style={[s.nav, shadow]} accessibilityRole="tablist">
      {NAV.map(item => {
        const on = item.id === active;
        return <Pressable key={item.id} accessibilityRole="tab" accessibilityLabel={item.label} accessibilityState={{ selected: on }}
          onPress={() => onNavigate(item.id)} style={[s.navItem, on && s.navOn]}>
          {item.id === 'chat' ? <Icon name="chat" size={22} color={on ? d.purple : '#9A8DB5'} /> : <HomeIcon name={NAV_ICON[item.id]} color={on ? d.purple : '#9A8DB5'} size={22} filled={on} />}
          <Text style={[s.navText, on && { color: d.purple }]}>{item.label}</Text>
          {item.id === 'chat' ? <Text style={s.soon}>tezliklə</Text> : null}
        </Pressable>;
      })}
    </View>
  </View>;
}
/** Height the floating menu takes above the safe area. */
export const NAV_HEIGHT = 74;

/** Height of the daily-review card plus its margins (taken from the island's height so the map still fits). */
const REVIEW_H = 84;
const AI_CARD_H = 52;

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F6F7FB' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 48 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44 },
  brand: { color: d.purple, fontSize: 24, letterSpacing: -.3, ...font.extrabold },
  langChip: { flexDirection: 'row', alignItems: 'center', gap: 3, height: 28, paddingHorizontal: 10, borderRadius: 14, backgroundColor: '#EDE9FE' },
  langText: { color: d.purple, fontSize: 12, ...font.extrabold },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 34, minWidth: 38, justifyContent: 'center', paddingHorizontal: 11, borderRadius: 17, backgroundColor: '#fff',
    shadowColor: '#5B4B9A', shadowOpacity: .1, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  pillText: { color: d.title, fontSize: 14, ...font.extrabold },
  head: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, height: 66 },
  sectionNo: { color: d.purple, fontSize: 12, letterSpacing: .8, ...font.extrabold },
  sectionTitle: { color: d.title, fontSize: 22, ...font.extrabold },
  progress: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 6, paddingRight: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: '#fff',
    shadowColor: '#5B4B9A', shadowOpacity: .08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  progressPct: { color: d.title, fontSize: 13, lineHeight: 15, ...font.extrabold },
  progressSub: { color: d.inkSoft, fontSize: 12, lineHeight: 15, ...font.bold },
  reviewWrap: { marginHorizontal: 16, marginBottom: 14, borderRadius: 24, shadowColor: '#1E1B4B', shadowOpacity: .25, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 5 },
  review: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 70, paddingHorizontal: 14, borderRadius: 24 },
  reviewIcon: { width: 42, height: 42, borderRadius: 13, backgroundColor: 'rgba(255,255,255,.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,.18)', alignItems: 'center', justifyContent: 'center' },
  reviewTitle: { color: '#fff', fontSize: 17, ...font.extrabold },
  reviewSub: { color: '#C7C2E8', fontSize: 13, ...font.bold },
  reviewBtn: { height: 38, paddingHorizontal: 18, borderRadius: 19, justifyContent: 'center', overflow: 'hidden' },
  reviewBtnText: { color: '#fff', fontSize: 15, ...font.extrabold },
  ai: { position: 'absolute', height: AI_CARD_H, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 8, borderRadius: 16, backgroundColor: '#F5F3FF', borderWidth: 1.5, borderColor: '#C4B5FD', borderStyle: 'dashed' },
  aiIcon: { width: 36, height: 36, borderRadius: 11, backgroundColor: d.purple, alignItems: 'center', justifyContent: 'center' },
  aiTitle: { color: d.title, fontSize: 14, ...font.extrabold },
  aiSub: { color: d.inkSoft, fontSize: 12, ...font.bold },
  aiSoon: { fontSize: 11, color: '#A84A08', backgroundColor: '#FFE3C7', borderRadius: 6, paddingHorizontal: 5, paddingVertical: 1, overflow: 'hidden', ...font.extrabold },
  node: { position: 'absolute', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
    shadowColor: '#5B4B9A', shadowOpacity: .14, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  nodeHot: { shadowColor: '#F97316', shadowOpacity: .45, shadowRadius: 16 },
  nodeInner: { alignItems: 'center', justifyContent: 'center' },
  label: { position: 'absolute', gap: 1 },
  labelTitle: { color: d.title, fontSize: 15, lineHeight: 18, ...font.extrabold },
  onWater: { color: '#FFFFFF', textShadowColor: 'rgba(0,0,0,.25)', textShadowRadius: 3 },
  labelPct: { color: d.inkSoft, fontSize: 12, lineHeight: 15, ...font.bold },
  trophy: { position: 'absolute', width: TROPHY, height: TROPHY, borderRadius: TROPHY / 2, backgroundColor: '#FFFBF2', borderWidth: 1, borderColor: '#E9C98B', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#E0A21B', shadowOpacity: .35, shadowRadius: 12, shadowOffset: { width: 0, height: 2 }, elevation: 4 },
  backdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,.25)' },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, gap: 14, paddingHorizontal: 20, paddingTop: 8, backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    shadowColor: '#0F172A', shadowOpacity: .12, shadowRadius: 18, shadowOffset: { width: 0, height: -4 }, elevation: 12 },
  handle: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: '#D9DCE5' },
  sheetHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sheetIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F3F0FF', alignItems: 'center', justifyContent: 'center' },
  sheetChip: { alignSelf: 'flex-start', backgroundColor: '#EDE9FE', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  sheetChipText: { color: d.purple, fontSize: 12, letterSpacing: .6, ...font.extrabold },
  sheetTitle: { color: d.title, fontSize: 24, lineHeight: 29, ...font.extrabold },
  close: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F2F6', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' },
  sheetPct: { alignSelf: 'flex-end', color: d.inkSoft, fontSize: 13, ...font.bold },
  track: { height: 8, borderRadius: 4, backgroundColor: '#EEF0F4', overflow: 'hidden' },
  sheetLocked: { color: d.inkSoft, fontSize: 15, ...font.bold, paddingVertical: 8 },
  partCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 20 },
  partNow: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#FDBA74', ...shadow },
  partNext: { backgroundColor: '#F6F7FB' },
  partTitle: { color: d.title, fontSize: 17, ...font.extrabold },
  partSub: { color: d.inkSoft, fontSize: 13, ...font.bold },
  partLocked: { color: d.inkSoft, fontSize: 12, ...font.bold, maxWidth: 96, textAlign: 'right' },
  goHot: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 44, paddingHorizontal: 18, borderRadius: 22, overflow: 'hidden' },
  goHotText: { color: '#fff', fontSize: 16, ...font.extrabold },
  goWide: { flexDirection: 'row', gap: 8, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  goWideText: { color: '#fff', fontSize: 18, ...font.extrabold },
  goSoft: { height: 44, paddingHorizontal: 18, borderRadius: 22, backgroundColor: '#EDE9FE', justifyContent: 'center' },
  goSoftText: { color: d.purple, fontSize: 16, ...font.extrabold },
  navWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 12 },
  nav: { flexDirection: 'row', gap: 2, padding: 5, borderRadius: 24, backgroundColor: 'rgba(255,255,255,.96)', borderWidth: 1, borderColor: '#EEF0F5' },
  navItem: { flex: 1, alignItems: 'center', gap: 2, paddingVertical: 6, borderRadius: 16 },
  navOn: { backgroundColor: '#EDE9FE' },
  navText: { color: '#5E5275', fontSize: 12, ...font.bold },
  soon: { position: 'absolute', top: -9, alignSelf: 'center', fontSize: 10, color: '#A84A08', backgroundColor: '#FFE3C7', borderRadius: 5, paddingHorizontal: 3, overflow: 'hidden', ...font.extrabold },
});
