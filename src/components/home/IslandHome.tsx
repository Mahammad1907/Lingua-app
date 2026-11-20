// Home as an island (user's concept; layout A5 approved 13 noyabr 2026).
// The whole section fits on one screen. Lessons run top → bottom as round nodes with a progress ring and
// a name + % label. The island fills with water from the top as lessons are completed and turns deep purple
// when the section is done. The path between lessons is dotted and coloured as far as you have got.
// Every lesson has a small name + % card beside its circle. After the last lesson the dotted path continues down to
// AI zəng, Təkrar and the section-exam trophy (user, 20 Nov 2026). The mascot sits in the top-right corner.
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState, type ReactNode, type Ref } from 'react';
import { AccessibilityInfo, Animated, Easing, Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import Icon from '../design/Icons';
import { d, font, shadow } from '../design/theme';
import { HomeIcon } from './HomeIcon';

/** A map lesson. With `parts` (Bölmə 2: lessons 1, 3, 7) the node stands for both parts: the ring is split in two
 *  and the card lets you open each part; the node is done when both parts are done. */
export interface IslandLesson { id: string; number: number; title: string; phrases?: string; parts?: { id: string; title: string }[]; minutes?: number }
/** Section exam button under the map (flag). Opens when every lesson of the section is done. */
export interface IslandExam { id: string; percent: number | null; passed: boolean }

const mascotHead = require('../../../assets/mascot/hood_head.png');

// The user's wavy, cloud-like island outline, drawn for a 350 × 800 box.
const OUTLINE = 'M70 30 C110 6 150 22 176 14 C206 4 238 18 268 22 C312 28 334 70 330 110 C326 150 346 178 340 222 C334 268 312 290 320 336 C328 384 346 410 338 456 C330 500 306 520 314 566 C322 612 342 640 330 686 C318 736 280 770 228 782 C188 792 150 778 116 786 C74 796 34 770 22 728 C10 686 28 650 20 606 C12 560 -2 530 10 486 C22 442 44 420 34 374 C24 328 4 298 14 254 C24 210 48 186 40 142 C32 98 34 54 70 30 Z';
const NODE = 56, ACTIVE = 72;

// Every section has its own colour, different from the app colours (user, 20 Nov 2026).
// Lesson circles darken with their percentage; the dotted path to the next lesson glows as it fills.
const SECTION_COLORS = [
  { base: '#14A3A3', dark: '#0B6E70', soft: '#D4F2F1' }, { base: '#3B7DF0', dark: '#1F4FB0', soft: '#DCE8FD' },
  { base: '#3DA35D', dark: '#226B3A', soft: '#DDF2E3' }, { base: '#E0567A', dark: '#A12E50', soft: '#FBDDE6' },
  { base: '#E0A21B', dark: '#9A6A07', soft: '#FBEFCF' }, { base: '#5C6BC0', dark: '#38458F', soft: '#E1E4F6' },
  { base: '#D9623B', dark: '#963A1C', soft: '#FADFD5' }, { base: '#8E5BC9', dark: '#5E3391', soft: '#EADFF7' },
  { base: '#1E9BD7', dark: '#11668F', soft: '#D6EEF9' }, { base: '#7A9A1F', dark: '#4F6610', soft: '#ECF2D4' },
];
const hex = (c: string) => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * Math.min(1, Math.max(0, t))).toString(16).padStart(2, '0')).join('');

type Pt = { x: number; y: number };
const lerp = (a: Pt, b: Pt, t: number) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
/** First part (0…t) of a cubic curve, so the coloured dots can stop part-way. */
function splitCubic(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number) {
  const a = lerp(p0, p1, t), b = lerp(p1, p2, t), c = lerp(p2, p3, t), ab = lerp(a, b, t), bc = lerp(b, c, t), e = lerp(ab, bc, t);
  return `M${p0.x} ${p0.y} C${a.x} ${a.y} ${ab.x} ${ab.y} ${e.x} ${e.y}`;
}
/** Link colour: pale at the start of the section, deeper towards the end. */
function water(w: number, h: number, level: number) {
  if (level <= 0) return { body: '', edge: '' };
  if (level >= 1) return { body: `M0 0 H${w} V${h} H0 Z`, edge: '' };
  const y = 10 + level * (h - 20);
  const pts: string[] = [];
  for (let x = w; x >= 0; x -= 10) pts.push(`${x} ${(y + Math.sin(x / 26) * 5).toFixed(1)}`);
  return { body: `M0 0 L${w} 0 L${pts.join(' L')} Z`, edge: `M${pts.join(' L')}` };
}

export function IslandHome({ section, sectionTitle, lessons, completed, partial, locked, nextSection, streak, xp, languageLabel, topInset, bottomSpace, review,
  onSelectLanguage, onOpenLesson, onAnalysis, onReview, onNextSection, exam, onPrevSection, allOpen = false, bare = false, after, scrollRef, onActiveY, focusId }: {
  section: number; sectionTitle: string; lessons: IslandLesson[]; completed: string[]; partial: Record<string, number>; locked: boolean;
  nextSection?: { title: string; available: boolean };
  exam?: IslandExam; onPrevSection?: () => void;
  /** Temporary test access: every lesson, part and the exam open in any order (src/config/testAccess.ts). */
  allOpen?: boolean;
  /** Stacked page: `bare` = only head, map and exam; `after` = the next sections under the first one. */
  bare?: boolean; after?: ReactNode; scrollRef?: Ref<ScrollView>;
  /** y of the current lesson inside this island (for opening the map where the learner is). */
  onActiveY?: (y: number) => void;
  /** Lesson (or part) last opened from the map: the page scrolls to it instead of the first unfinished one. */
  focusId?: string;
  streak: number; xp: number; languageLabel: string; topInset: number; bottomSpace: number; review: { count: number };
  onSelectLanguage: () => void; onOpenLesson: (id: string) => void; onAnalysis: () => void; onReview: () => void; onNextSection?: () => void;
}) {
  const { width, height } = useWindowDimensions();
  const [open, setOpen] = useState<IslandLesson | null>(null);
  const count = lessons.length;
  const partPct = (id: string) => completed.includes(id) ? 100 : partial[id] ?? 0;
  const isDone = (l: IslandLesson) => l.parts ? l.parts.every(p => completed.includes(p.id)) : completed.includes(l.id);
  const doneCount = lessons.filter(isDone).length;
  const active = locked ? -1 : lessons.findIndex(l => !isDone(l));
  const finished = count > 0 && doneCount === count;
  const level = count ? doneCount / count : 0;
  const examOpen = finished || allOpen;
  const percentOf = (l: IslandLesson) => l.parts ? Math.round(l.parts.reduce((a, p) => a + partPct(p.id), 0) / l.parts.length) : partPct(l.id);
  const activePart = active >= 0 ? percentOf(lessons[active]) / 100 : 0;
  const tone = SECTION_COLORS[(section - 1 + SECTION_COLORS.length) % SECTION_COLORS.length];
  const shade = (pct: number, isActive: boolean) => isActive ? mix(tone.base, tone.dark, pct / 100) : mix(tone.soft, tone.dark, .3 + .7 * pct / 100);
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

  // Size the island to the space left under the header; AI zəng, Təkrar and the trophy continue below it.
  const W = Math.min(width - 28, 400);
  const H = Math.max(420, height - topInset - 132 - bottomSpace - 16 - 216);
  // Circles near the left / right edge, so the labels have the middle to themselves (user, 20 Nov 2026).
  const pts: Pt[] = lessons.map((_, i) => ({ x: W * (i % 2 ? .83 : .17), y: 34 + i * (H - 68) / Math.max(count - 1, 1) }));
  const last = pts[count - 1];
  // Under the island: AI zəng, Təkrar, then the exam trophy in the middle, all on the same dotted path.
  const extraN = exam ? 3 : 2;
  const extraY = (k: number) => H + 52 + k * 86;
  const callPt: Pt = { x: W * (count % 2 ? .83 : .17), y: extraY(0) };
  const reviewPt: Pt = { x: W * ((count + 1) % 2 ? .83 : .17), y: extraY(1) };
  const trophyPt: Pt = { x: W / 2, y: extraY(2) };
  const EXTRA = extraY(extraN - 1) - H + (exam ? 78 : 40);
  const focused = focusId ? lessons.findIndex(l => l.id === focusId || l.parts?.some(p => p.id === focusId)) : -1;
  const focus = focused >= 0 ? focused : active;
  // The saved lesson loads after the first layout: report its place again when it arrives.
  const layoutY = useRef<number | null>(null);
  const focusY = focus >= 0 ? pts[focus].y : null;
  useEffect(() => { if (layoutY.current !== null && focusY !== null) onActiveY?.(layoutY.current + (bare ? 28 : 0) + focusY); }, [focusY]); // eslint-disable-line react-hooks/exhaustive-deps
  const w = water(W, H, level);
  const sx = W / 350, sy = H / 800;

  const body = <>
    {bare ? null : <StatusBar style="dark" />}
    {bare ? null : <View style={s.topBar}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Dil və səviyyə: ${languageLabel}`} onPress={onSelectLanguage} style={s.brandRow}>
        <Text style={s.brand}>BirTalk</Text>
        <View style={s.langChip}><Text style={s.langText}>{languageLabel}</Text><HomeIcon name="down" color={d.purple} size={13} /></View>
      </Pressable>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Analiz" onPress={onAnalysis} style={s.iconChip}><Icon name="chart" size={18} color={d.purple} /></Pressable>
        <View style={s.stat} accessibilityLabel={`${streak} gün ardıcıl`}><HomeIcon name="bolt" color={d.orange} size={15} /><Text style={s.statText}>{streak}</Text></View>
        <View style={s.stat} accessibilityLabel={`${xp} xal`}><Text style={[s.statText, { color: '#C99A00' }]}>★</Text><Text style={s.statText}>{xp}</Text></View>
      </View>
    </View>}

    <View style={s.head}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {onPrevSection ? <Pressable accessibilityRole="button" accessibilityLabel={`Bölmə ${section - 1}-ə qayıt`} onPress={onPrevSection} hitSlop={8} style={s.prev}>
            <Icon name="back" size={13} color={d.purple} /><Text style={s.prevText}>Bölmə {section - 1}</Text></Pressable> : null}
          <Text style={s.sectionNo}>BÖLMƏ {section}</Text>
        </View>
        <Text accessibilityRole="header" style={s.sectionTitle}>{sectionTitle}</Text>
      </View>
      <View style={s.progress} accessibilityLabel={`${doneCount} dərs bitib, ${Math.round(level * 100)} faiz`}>
        <Svg width={30} height={30}><Circle cx={15} cy={15} r={12} stroke="#E6DAFB" strokeWidth={4} fill="none" />
          <Circle cx={15} cy={15} r={12} stroke={d.purple} strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 12 * level} 80`} transform="rotate(-90 15 15)" /></Svg>
        <View><Text style={s.progressPct}>{Math.round(level * 100)}%</Text><Text style={s.progressSub}>{doneCount}/{count} dərs</Text></View>
      </View>
      <Image source={mascotHead} style={{ width: 44, height: 40 }} contentFit="contain" accessibilityLabel="Maskot" />
    </View>

    <View style={{ width: W, height: H + EXTRA, alignSelf: 'center' }} onLayout={e => { layoutY.current = e.nativeEvent.layout.y; if (focus >= 0) onActiveY?.(layoutY.current + (bare ? 28 : 0) + pts[focus].y); }}>
      <Svg width={W} height={H + EXTRA} style={StyleSheet.absoluteFill}>
        {(() => {
          const chain = [last, callPt, reviewPt, ...(exam ? [trophyPt] : [])].filter(Boolean) as Pt[];
          return chain.slice(0, -1).map((a, i) => {
            const b = chain[i + 1], m = (a.y + b.y) / 2;
            const trophyLeg = exam && i === chain.length - 2;
            return <Path key={i} d={`M${a.x} ${a.y} C${a.x} ${m} ${b.x} ${m} ${b.x} ${b.y}`} fill="none"
              stroke={trophyLeg && finished ? tone.base : '#DCCFF6'} strokeWidth={8} strokeLinecap="round" strokeDasharray="0.1 13" />;
          });
        })()}
        <Defs><ClipPath id="island"><Path d={OUTLINE} transform={`scale(${sx} ${sy})`} /></ClipPath></Defs>
        <Path d={OUTLINE} transform={`translate(0 8) scale(${sx} ${sy})`} fill={mix(tone.soft, tone.base, .25)} />
        <Path d={OUTLINE} transform={`scale(${sx} ${sy})`} fill={finished ? tone.soft : '#FBF8FF'} stroke={finished ? tone.dark : mix(tone.soft, tone.base, .4)} strokeWidth={finished ? 3 : 2} />
        <G clipPath="url(#island)">
          {w.body ? <Path d={w.body} fill={finished ? tone.dark : tone.base} opacity={.45} /> : null}
          {w.edge ? <Path d={w.edge} fill="none" stroke="#fff" strokeWidth={2.5} opacity={.8} /> : null}
        </G>
        {pts.slice(0, -1).map((a, i) => {
          const b = pts[i + 1], m = (a.y + b.y) / 2;
          const c1 = { x: a.x, y: m }, c2 = { x: b.x, y: m };
          const full = `M${a.x} ${a.y} C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${b.x} ${b.y}`;
          const done = active < 0 ? (finished || i < doneCount - 1) : i < active;
          const part = i === active && activePart > 0 ? splitCubic(a, c1, c2, b, activePart) : '';
          return <G key={i}>
            <Path d={full} fill="none" stroke="#DCCFF6" strokeWidth={8} strokeLinecap="round" strokeDasharray="0.1 13" />
            {done ? <Path d={full} fill="none" stroke={tone.base} strokeWidth={8} strokeLinecap="round" strokeDasharray="0.1 13" /> : null}
            {part ? <Path d={part} fill="none" stroke={tone.base} strokeWidth={8} strokeLinecap="round" strokeDasharray="0.1 13" /> : null}
          </G>;
        })}
      </Svg>
      {active >= 0 && active < count - 1 && activePart > 0 ? <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: glow }]}>
        <Svg width={W} height={H}>{(() => {
          const a = pts[active], b = pts[active + 1], m = (a.y + b.y) / 2;
          const part = splitCubic(a, { x: a.x, y: m }, { x: b.x, y: m }, b, activePart);
          return <><Path d={part} fill="none" stroke={tone.base} strokeWidth={18} strokeLinecap="round" opacity={.25} />
            <Path d={part} fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" strokeDasharray="0.1 13" /></>;
        })()}</Svg>
      </Animated.View> : null}

      {lessons.map((lesson, i) => {
        const p = pts[i], done = isDone(lesson), isActive = i === active;
        const size = isActive ? ACTIVE : NODE, pct = percentOf(lesson);
        const r = size / 2 - 3, c = 2 * Math.PI * r;
        const reachable = !locked && (done || isActive);
        const right = p.x > W / 2;
        return <View key={lesson.id} pointerEvents="box-none" style={StyleSheet.absoluteFill}>
          <Pressable accessibilityRole="button" accessibilityLabel={`Dərs ${lesson.number}: ${lesson.title}, ${pct} faiz${reachable ? '' : ', kilidlidir'}`}
            onPress={() => setOpen(lesson)}
            style={({ pressed }) => [s.node, { left: p.x - size / 2, top: p.y - size / 2, width: size, height: size, borderRadius: size / 2 },
              isActive && [s.nodeActiveShadow, { shadowColor: tone.base }], pressed && { transform: [{ scale: .95 }] }]}>
            <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
              <Circle cx={size / 2} cy={size / 2} r={r} stroke={isActive ? mix(tone.soft, tone.base, .5) : '#E6DAFB'} strokeWidth={4} fill="none" />
              {lesson.parts ? lesson.parts.map((part, k) => {
                // Two halves with a small gap at the top and bottom; each half fills with its own part.
                const gap = 7, half = c / lesson.parts!.length, len = half - gap, fill = len * partPct(part.id) / 100;
                const at = `rotate(${-90 + k * 360 / lesson.parts!.length} ${size / 2} ${size / 2})`;
                return <G key={part.id}>
                  <Circle cx={size / 2} cy={size / 2} r={r} stroke="#fff" strokeWidth={5} fill="none" strokeDasharray={`${gap} ${c}`} strokeDashoffset={gap / 2} transform={at} />
                  {fill > 0 && !done ? <Circle cx={size / 2} cy={size / 2} r={r} stroke={partPct(part.id) === 100 ? tone.dark : tone.base} strokeWidth={4} fill="none"
                    strokeDasharray={`${fill} ${c}`} strokeDashoffset={-gap / 2} transform={at} /> : null}
                </G>;
              }) : pct > 0 && pct < 100 ? <Circle cx={size / 2} cy={size / 2} r={r} stroke={tone.dark} strokeWidth={4} fill="none" strokeLinecap="round"
                strokeDasharray={`${c * pct / 100} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} /> : null}
            </Svg>
            <View style={[s.nodeInner, { width: size - 14, height: size - 14, borderRadius: (size - 14) / 2 },
              done ? { backgroundColor: tone.dark } : isActive || (reachable && pct > 0) ? { backgroundColor: shade(pct, isActive) } : s.nodeLocked]}>
              {done ? <HomeIcon name="check" color="#fff" size={22} /> : <Text style={[s.nodeText, (isActive || pct >= 50) && { color: '#fff' }, !isActive && pct > 0 && pct < 50 && { color: tone.dark }, isActive && { fontSize: 24 }]}>{lesson.number}</Text>}
            </View>
          </Pressable>
          {/* Every lesson: a small card with the name and % beside its circle (user, 20 Nov 2026). */}
          {(() => {
            const avail = Math.min(176, right ? p.x - size / 2 - 14 : W - p.x - size / 2 - 14);
            const side = right ? { right: W - (p.x - size / 2 - 8), alignItems: 'flex-end' as const } : { left: p.x + size / 2 + 8 };
            return <View pointerEvents="none" style={[s.card, side, { width: avail, top: p.y - 22 }, isActive && { borderColor: tone.base, borderWidth: 1.5 }]}>
              <Text style={[s.cardTitle, right && { textAlign: 'right' }]} numberOfLines={1}>{lesson.title}</Text>
              <Text style={[s.cardPct, { color: done ? d.greenText : tone.dark }, right && { textAlign: 'right' }]}>{pct}%</Text>
            </View>;
          })()}
        </View>;
      })}
      {([
        { key: 'call', pt: callPt, title: 'AI zəng', sub: 'tezliklə · gündə 1 · 3 dəq', icon: <Icon name="phone" size={26} color={d.purple} />, off: true, press: undefined as (() => void) | undefined },
        { key: 'review', pt: reviewPt, title: 'Təkrar', sub: review.count ? `${review.count} ifadə` : 'Hələ yoxdur', icon: <HomeIcon name="repeat" color={d.orange} size={26} />, off: false, press: onReview },
      ]).map(item => {
        const right = item.pt.x > W / 2, avail = Math.min(176, right ? item.pt.x - NODE / 2 - 14 : W - item.pt.x - NODE / 2 - 14);
        const side = right ? { right: W - (item.pt.x - NODE / 2 - 8), alignItems: 'flex-end' as const } : { left: item.pt.x + NODE / 2 + 8 };
        return <View key={item.key} pointerEvents="box-none" style={StyleSheet.absoluteFill}>
          <Pressable accessibilityRole="button" accessibilityState={{ disabled: item.off }} accessibilityLabel={`${item.title}, ${item.sub}`} disabled={item.off} onPress={item.press}
            style={({ pressed }) => [s.node, { left: item.pt.x - NODE / 2, top: item.pt.y - NODE / 2, width: NODE, height: NODE, borderRadius: NODE / 2, borderWidth: 3, borderColor: '#E6DAFB' }, item.off && { opacity: .75 }, pressed && { transform: [{ scale: .95 }] }]}>
            {item.icon}
          </Pressable>
          <View pointerEvents="none" style={[s.card, side, { width: avail, top: item.pt.y - 22 }]}>
            <Text style={[s.cardTitle, right && { textAlign: 'right' }]} numberOfLines={1}>{item.title}</Text>
            <Text style={[s.cardPct, { color: '#6E6188' }, right && { textAlign: 'right' }]} numberOfLines={1}>{item.sub}</Text>
          </View>
        </View>;
      })}
      {exam ? <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        <Pressable accessibilityRole="button" disabled={!examOpen || locked} onPress={() => onOpenLesson(exam.id)}
          accessibilityLabel={`Bölmə ${section} imtahanı${examOpen ? '' : ', bütün dərsləri bitirəndə açılır'}`}
          style={({ pressed }) => [s.trophy, { left: trophyPt.x - 32, top: trophyPt.y - 32 }, exam.passed && { backgroundColor: '#FFE7A3' }, (!examOpen || locked) && { opacity: .65 }, pressed && { transform: [{ scale: .95 }] }]}>
          <Svg width={34} height={34} viewBox="0 0 34 34">
            <Path d="M9 5 h16 v8 a8 8 0 0 1 -16 0 z" fill="#E0A21B" />
            <Path d="M9 7 h-4 a4 4 0 0 0 4 6 M25 7 h4 a4 4 0 0 1 -4 6" fill="none" stroke="#E0A21B" strokeWidth={2.2} />
            <Rect x={15} y={21} width={4} height={5} fill="#E0A21B" /><Rect x={10} y={26} width={14} height={4} rx={1.5} fill="#9A6A07" />
          </Svg>
        </Pressable>
        <View pointerEvents="none" style={[s.plain, { left: trophyPt.x - 110, width: 220, top: trophyPt.y + 38, alignItems: 'center' }]}>
          <Text style={[s.cardTitle, { flex: 0, textAlign: 'center' }]} numberOfLines={1}>{exam.passed ? `Keçdin · ${exam.percent}%` : 'Bölmə imtahanı'}</Text>
          <Text style={[s.plainSub, { textAlign: 'center' }]} numberOfLines={2}>{!examOpen ? 'Dərslərdən sonra açılır · keçid 70%' : exam.percent !== null && !exam.passed ? `Son nəticə ${exam.percent}% · keçid 70%` : 'Kömək yoxdur · keçid 70%'}</Text>
        </View>
      </View> : null}
    </View>

    {!after && nextSection && (finished || nextSection.available) ? <Pressable accessibilityRole="button" disabled={!nextSection.available} onPress={onNextSection} style={s.next}>
      <Text style={s.nextText}>Bölmə {section + 1} · {nextSection.title}</Text>
    </Pressable> : null}

    <Modal visible={Boolean(open)} transparent animationType="fade" onRequestClose={() => setOpen(null)}>
      <Pressable accessibilityLabel="Bağla" style={s.backdrop} onPress={() => setOpen(null)}>
        {open ? (() => {
          const pct = percentOf(open), done = isDone(open), isActive = lessons[active]?.id === open.id;
          const reachable = !locked && (done || isActive || allOpen);
          const go = (id: string) => { setOpen(null); onOpenLesson(id); };
          return <Pressable style={[s.sheet, shadow]} onPress={() => {}}>
            <View style={s.sheetHead}><Text style={s.sheetTitle}>Dərs {open.number} · {open.title}</Text><Text style={[s.sheetPct, { color: pct === 100 ? d.green : d.orange }]}>{pct}%</Text></View>
            {open.phrases ? <Text style={s.sheetPhrases}>{open.phrases}</Text> : null}
            <View style={s.sheetTrack}><View style={[s.sheetFill, { width: `${pct}%`, backgroundColor: pct === 100 ? d.green : d.orange }]} /></View>
            {reachable && open.parts ? open.parts.map((part, k) => {
              const pp = partPct(part.id), partDone = pp === 100, partOpen = allOpen || k === 0 || completed.includes(open.parts![k - 1].id);
              return <View key={part.id} style={s.partRow}>
                <View style={{ flex: 1 }}><Text style={s.partTitle}>{k + 1}-{k === 2 ? 'cü' : 'ci'} hissə · {part.title}</Text><Text style={[s.partPct, { color: partDone ? d.greenText : pp ? d.orangeText : d.inkSoft }]}>{pp}%</Text></View>
                {partOpen ? <Pressable accessibilityRole="button" accessibilityLabel={`${k + 1}-${k === 2 ? 'cü' : 'ci'} hissə: ${partDone ? 'yenidən keç' : pp ? 'davam et' : 'başla'}`} onPress={() => go(part.id)}
                  style={({ pressed }) => [s.partBtn, partDone && { backgroundColor: d.purple }, pressed && { opacity: .9 }]}>
                  <Text style={s.partBtnText}>{partDone ? 'Yenidən' : pp ? 'Davam' : 'Başla'}</Text></Pressable>
                  : <Text style={s.partLocked}>{k}-ci hissədən sonra</Text>}
              </View>;
            }) : reachable ? <Pressable accessibilityRole="button" onPress={() => go(open.id)} style={({ pressed }) => [s.sheetBtn, done && { backgroundColor: d.purple }, pressed && { opacity: .9 }]}>
              <Text style={s.sheetBtnText}>{done ? 'Yenidən keç' : pct ? 'Davam et' : 'Başla'}</Text><Icon name="arrow" size={16} color="#fff" />
            </Pressable> : <Text style={s.sheetLocked}>Bu dərs əvvəlki dərsi bitirəndə açılacaq.</Text>}
          </Pressable>;
        })() : null}
      </Pressable>
    </Modal>
  </>;
  // Sections are stacked on one scrolling page (15 Nov 2026): the first section renders the whole page and the
  // following sections are passed in `after` as bare islands (head + map + exam).
  if (bare) return <View style={{ marginTop: 28 }}>{body}</View>;
  return <View style={s.screen}>
    <ScrollView ref={scrollRef} contentContainerStyle={{ paddingTop: topInset + 6, paddingBottom: bottomSpace + 8 }} showsVerticalScrollIndicator={false}>
      {body}
      {after}
    </ScrollView>
  </View>;
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

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F3ECFC' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 46 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44 },
  brand: { color: d.purple, fontSize: 22, ...font.extrabold },
  langChip: { flexDirection: 'row', alignItems: 'center', gap: 3, height: 26, paddingHorizontal: 8, borderRadius: 13, backgroundColor: d.purpleSoft },
  langText: { color: d.purple, fontSize: 12, ...font.extrabold },
  iconChip: { width: 38, height: 32, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: d.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 32, paddingHorizontal: 10, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: d.purpleSoft },
  statText: { color: d.inkSoft, fontSize: 14, ...font.extrabold },
  head: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, height: 70 },
  sectionNo: { color: d.lavenderText, fontSize: 12, letterSpacing: .4, ...font.extrabold },
  sectionTitle: { color: d.ink, fontSize: 20, ...font.extrabold },
  progress: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 6, paddingRight: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: '#fff', borderWidth: 1, borderColor: d.purpleSoft },
  progressPct: { color: d.ink, fontSize: 13, lineHeight: 15, ...font.extrabold },
  progressSub: { color: d.inkSoft, fontSize: 12, lineHeight: 15, ...font.bold },
  node: { position: 'absolute', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', ...shadow },
  nodeActiveShadow: { shadowColor: d.orange, shadowOpacity: .35, shadowRadius: 14 },
  nodeInner: { alignItems: 'center', justifyContent: 'center' },
  nodeLocked: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E6DAFB' },
  nodeText: { color: '#8C7FA6', fontSize: 18, ...font.extrabold },
  plain: { position: 'absolute', gap: 1 },
  plainSub: { color: '#9A8DB5', fontSize: 12, lineHeight: 15, ...font.bold },
  card: { position: 'absolute', gap: 1, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E6DAFB' },
  cardTitle: { color: d.ink, fontSize: 14, lineHeight: 18, ...font.extrabold },
  cardPct: { fontSize: 12, ...font.extrabold },
  trophy: { position: 'absolute', width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFF6DD', borderWidth: 3, borderColor: '#E0A21B', alignItems: 'center', justifyContent: 'center', ...shadow },
  prev: { flexDirection: 'row', alignItems: 'center', gap: 2, height: 22, paddingHorizontal: 8, borderRadius: 11, backgroundColor: d.purpleSoft },
  prevText: { color: d.purple, fontSize: 11, ...font.extrabold },
  partRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6, borderTopWidth: 1, borderTopColor: '#F0E8FC' },
  partTitle: { color: d.ink, fontSize: 15, ...font.extrabold },
  partPct: { fontSize: 13, ...font.extrabold },
  partBtn: { height: 40, paddingHorizontal: 16, borderRadius: 20, backgroundColor: d.orange, justifyContent: 'center' },
  partBtnText: { color: '#fff', fontSize: 15, ...font.extrabold },
  partLocked: { color: d.inkSoft, fontSize: 13, ...font.bold },
  next: { alignSelf: 'center', marginTop: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: d.borderStrong },
  nextText: { color: d.ink, fontSize: 15, ...font.extrabold },
  backdrop: { flex: 1, backgroundColor: 'rgba(42,18,64,.32)', justifyContent: 'center', padding: 24 },
  sheet: { gap: 12, padding: 18, borderRadius: 24, backgroundColor: '#fff' },
  sheetHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 },
  sheetTitle: { flex: 1, color: d.ink, fontSize: 18, ...font.extrabold },
  sheetPct: { fontSize: 16, ...font.extrabold },
  sheetPhrases: { color: d.inkSoft, fontSize: 14, lineHeight: 20, ...font.semibold },
  sheetTrack: { height: 8, borderRadius: 4, backgroundColor: '#F3ECFC', overflow: 'hidden' },
  sheetFill: { height: '100%', borderRadius: 4 },
  sheetBtn: { flexDirection: 'row', gap: 8, height: 50, borderRadius: 25, backgroundColor: d.orange, alignItems: 'center', justifyContent: 'center' },
  sheetBtnText: { color: '#fff', fontSize: 17, ...font.extrabold },
  sheetLocked: { color: d.inkSoft, fontSize: 14, ...font.bold },
  navWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 12 },
  nav: { flexDirection: 'row', gap: 2, padding: 5, borderRadius: 22, backgroundColor: '#fff' },
  navItem: { flex: 1, alignItems: 'center', gap: 2, paddingVertical: 6, borderRadius: 16 },
  navOn: { backgroundColor: '#EFE6FB' },
  navText: { color: '#5E5275', fontSize: 12, ...font.bold },
  soon: { position: 'absolute', top: -6, right: 0, fontSize: 11, color: '#A84A08', backgroundColor: '#FFE3C7', borderRadius: 5, paddingHorizontal: 3, overflow: 'hidden', ...font.extrabold },
});
