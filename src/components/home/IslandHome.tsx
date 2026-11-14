// Home as an island (user's concept; layout A5 approved 13 noyabr 2026).
// The whole section fits on one screen. Lessons run top → bottom as round nodes with a progress ring and
// a name + % label. The island fills with water from the top as lessons are completed and turns deep purple
// when the section is done. The path between lessons is dotted and coloured as far as you have got.
// Tapping a lesson opens its card (no card takes space on the map). The mascot sits in the top-right corner.
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, ClipPath, Defs, G, Path } from 'react-native-svg';
import Icon from '../design/Icons';
import { d, font, shadow } from '../design/theme';
import { HomeIcon } from './HomeIcon';

export interface IslandLesson { id: string; number: number; title: string; phrases?: string }

const mascotHead = require('../../../assets/mascot/hood_head.png');

// The user's wavy, cloud-like island outline, drawn for a 350 × 800 box.
const OUTLINE = 'M70 30 C110 6 150 22 176 14 C206 4 238 18 268 22 C312 28 334 70 330 110 C326 150 346 178 340 222 C334 268 312 290 320 336 C328 384 346 410 338 456 C330 500 306 520 314 566 C322 612 342 640 330 686 C318 736 280 770 228 782 C188 792 150 778 116 786 C74 796 34 770 22 728 C10 686 28 650 20 606 C12 560 -2 530 10 486 C22 442 44 420 34 374 C24 328 4 298 14 254 C24 210 48 186 40 142 C32 98 34 54 70 30 Z';
const NODE = 56, ACTIVE = 72;

type Pt = { x: number; y: number };
const lerp = (a: Pt, b: Pt, t: number) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
/** First part (0…t) of a cubic curve, so the coloured dots can stop part-way. */
function splitCubic(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number) {
  const a = lerp(p0, p1, t), b = lerp(p1, p2, t), c = lerp(p2, p3, t), ab = lerp(a, b, t), bc = lerp(b, c, t), e = lerp(ab, bc, t);
  return `M${p0.x} ${p0.y} C${a.x} ${a.y} ${ab.x} ${ab.y} ${e.x} ${e.y}`;
}
/** Link colour: pale at the start of the section, deeper towards the end. */
function linkColor(i: number, count: number) {
  const t = count > 2 ? i / (count - 2) : 0;
  const mix = (a: number, b: number) => Math.round(a + (b - a) * t);
  return `rgb(${mix(0xB9, 0x5B)},${mix(0xA2, 0x1F)},${mix(0xF0, 0xD1)})`;
}
function water(w: number, h: number, level: number) {
  if (level <= 0) return { body: '', edge: '' };
  if (level >= 1) return { body: `M0 0 H${w} V${h} H0 Z`, edge: '' };
  const y = 10 + level * (h - 20);
  const pts: string[] = [];
  for (let x = w; x >= 0; x -= 10) pts.push(`${x} ${(y + Math.sin(x / 26) * 5).toFixed(1)}`);
  return { body: `M0 0 L${w} 0 L${pts.join(' L')} Z`, edge: `M${pts.join(' L')}` };
}

export function IslandHome({ section, sectionTitle, lessons, completed, partial, locked, nextSection, streak, xp, languageLabel, topInset, bottomSpace, review,
  onSelectLanguage, onOpenLesson, onAnalysis, onReview, onNextSection }: {
  section: number; sectionTitle: string; lessons: IslandLesson[]; completed: string[]; partial: Record<string, number>; locked: boolean;
  nextSection?: { title: string; available: boolean };
  streak: number; xp: number; languageLabel: string; topInset: number; bottomSpace: number; review: { count: number };
  onSelectLanguage: () => void; onOpenLesson: (id: string) => void; onAnalysis: () => void; onReview: () => void; onNextSection: () => void;
}) {
  const { width, height } = useWindowDimensions();
  const [open, setOpen] = useState<IslandLesson | null>(null);
  const count = lessons.length;
  const doneCount = lessons.filter(l => completed.includes(l.id)).length;
  const active = locked ? -1 : lessons.findIndex(l => !completed.includes(l.id));
  const finished = count > 0 && doneCount === count;
  const level = count ? doneCount / count : 0;
  const percentOf = (l: IslandLesson) => completed.includes(l.id) ? 100 : partial[l.id] ?? 0;
  const activePart = active >= 0 ? percentOf(lessons[active]) / 100 : 0;

  // Size the island to the space left between the header and the review card + menu.
  const W = Math.min(width - 28, 400);
  const H = Math.max(360, height - topInset - 132 - 92 - bottomSpace - 16);
  const pts: Pt[] = lessons.map((_, i) => ({ x: W * (i % 2 ? .72 : .28), y: 34 + i * (H - 68) / Math.max(count - 1, 1) }));
  const w = water(W, H, level);
  const sx = W / 350, sy = H / 800;

  return <View style={[s.screen, { paddingTop: topInset + 6 }]}>
    <StatusBar style="dark" />
    <View style={s.topBar}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Dil və səviyyə: ${languageLabel}`} onPress={onSelectLanguage} style={s.brandRow}>
        <Text style={s.brand}>BirTalk</Text>
        <View style={s.langChip}><Text style={s.langText}>{languageLabel}</Text><HomeIcon name="down" color={d.purple} size={13} /></View>
      </Pressable>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Analiz" onPress={onAnalysis} style={s.iconChip}><Icon name="chart" size={18} color={d.purple} /></Pressable>
        <View style={s.stat} accessibilityLabel={`${streak} gün ardıcıl`}><HomeIcon name="bolt" color={d.orange} size={15} /><Text style={s.statText}>{streak}</Text></View>
        <View style={s.stat} accessibilityLabel={`${xp} xal`}><Text style={[s.statText, { color: '#C99A00' }]}>★</Text><Text style={s.statText}>{xp}</Text></View>
      </View>
    </View>

    <View style={s.head}>
      <View style={{ flex: 1 }}>
        <Text style={s.sectionNo}>BÖLMƏ {section}</Text>
        <Text accessibilityRole="header" style={s.sectionTitle}>{sectionTitle}</Text>
      </View>
      <View style={s.progress} accessibilityLabel={`${doneCount} dərs bitib, ${Math.round(level * 100)} faiz`}>
        <Svg width={30} height={30}><Circle cx={15} cy={15} r={12} stroke="#E6DAFB" strokeWidth={4} fill="none" />
          <Circle cx={15} cy={15} r={12} stroke={d.purple} strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 12 * level} 80`} transform="rotate(-90 15 15)" /></Svg>
        <View><Text style={s.progressPct}>{Math.round(level * 100)}%</Text><Text style={s.progressSub}>{doneCount}/{count} dərs</Text></View>
      </View>
      <Image source={mascotHead} style={{ width: 44, height: 40 }} contentFit="contain" accessibilityLabel="Maskot" />
    </View>

    <View style={{ width: W, height: H, alignSelf: 'center' }}>
      <Svg width={W} height={H} style={StyleSheet.absoluteFill}>
        <Defs><ClipPath id="island"><Path d={OUTLINE} transform={`scale(${sx} ${sy})`} /></ClipPath></Defs>
        <Path d={OUTLINE} transform={`translate(0 8) scale(${sx} ${sy})`} fill="#E3D3FA" />
        <Path d={OUTLINE} transform={`scale(${sx} ${sy})`} fill={finished ? '#C9B3F7' : '#FBF8FF'} stroke={finished ? d.purple : '#D9C8F6'} strokeWidth={finished ? 3 : 2} />
        <G clipPath="url(#island)">
          {w.body ? <Path d={w.body} fill={finished ? '#5B1FD1' : '#9C7BEE'} opacity={.5} /> : null}
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
            {done ? <Path d={full} fill="none" stroke={linkColor(i, count)} strokeWidth={8} strokeLinecap="round" strokeDasharray="0.1 13" /> : null}
            {part ? <Path d={part} fill="none" stroke={linkColor(i, count)} strokeWidth={8} strokeLinecap="round" strokeDasharray="0.1 13" /> : null}
          </G>;
        })}
      </Svg>

      {lessons.map((lesson, i) => {
        const p = pts[i], done = completed.includes(lesson.id), isActive = i === active;
        const size = isActive ? ACTIVE : NODE, pct = percentOf(lesson);
        const r = size / 2 - 3, c = 2 * Math.PI * r;
        const reachable = !locked && (done || isActive);
        const right = p.x > W / 2;
        const pc = pct === 100 ? d.green : pct ? d.orange : '#8C7FA6';
        return <View key={lesson.id} pointerEvents="box-none" style={StyleSheet.absoluteFill}>
          <Pressable accessibilityRole="button" accessibilityLabel={`Dərs ${lesson.number}: ${lesson.title}, ${pct} faiz${reachable ? '' : ', kilidlidir'}`}
            onPress={() => setOpen(lesson)}
            style={({ pressed }) => [s.node, { left: p.x - size / 2, top: p.y - size / 2, width: size, height: size, borderRadius: size / 2 },
              isActive && s.nodeActiveShadow, pressed && { transform: [{ scale: .95 }] }]}>
            <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
              <Circle cx={size / 2} cy={size / 2} r={r} stroke={isActive ? 'rgba(242,122,18,.25)' : '#E6DAFB'} strokeWidth={4} fill="none" />
              {pct > 0 && pct < 100 ? <Circle cx={size / 2} cy={size / 2} r={r} stroke={d.orange} strokeWidth={4} fill="none" strokeLinecap="round"
                strokeDasharray={`${c * pct / 100} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} /> : null}
            </Svg>
            <View style={[s.nodeInner, { width: size - 14, height: size - 14, borderRadius: (size - 14) / 2 },
              done ? { backgroundColor: d.purple } : isActive ? { backgroundColor: d.orange } : s.nodeLocked]}>
              {done ? <HomeIcon name="check" color="#fff" size={22} /> : <Text style={[s.nodeText, isActive && { color: '#fff', fontSize: 24 }]}>{lesson.number}</Text>}
            </View>
          </Pressable>
          <View pointerEvents="none" style={[s.label, isActive && { borderColor: '#F7CFA6' }, right ? { right: W - (p.x - size / 2 - 8), alignItems: 'flex-end' } : { left: p.x + size / 2 + 8 },
            { top: p.y - 22 }]}>
            <Text style={[s.labelTitle, !reachable && { color: '#6E6188' }]} numberOfLines={1}>{lesson.title}</Text>
            <Text style={[s.labelPct, { color: pc }]}>{pct}%</Text>
          </View>
        </View>;
      })}
    </View>

    <Pressable accessibilityRole="button" onPress={onReview} style={({ pressed }) => [s.review, pressed && { opacity: .9 }]}>
      <View style={s.reviewIcon}><HomeIcon name="repeat" color="#FFB46B" size={20} /></View>
      <View style={{ flex: 1 }}>
        <Text style={s.reviewTitle}>Gündəlik təkrar</Text>
        <Text style={s.reviewSub}>{review.count ? `Səhv etdiyin ${review.count} ifadə · təxminən ${Math.max(1, Math.ceil(review.count / 2))} dəq` : 'Səhvlərin burada toplanacaq'}</Text>
      </View>
      <View style={s.reviewBtn}><Text style={s.reviewBtnText}>Başla</Text></View>
    </Pressable>

    {nextSection && finished ? <Pressable accessibilityRole="button" disabled={!nextSection.available} onPress={onNextSection} style={s.next}>
      <Text style={s.nextText}>Bölmə {section + 1} · {nextSection.title}</Text>
    </Pressable> : null}

    <Modal visible={Boolean(open)} transparent animationType="fade" onRequestClose={() => setOpen(null)}>
      <Pressable accessibilityLabel="Bağla" style={s.backdrop} onPress={() => setOpen(null)}>
        {open ? (() => {
          const pct = percentOf(open), done = completed.includes(open.id), isActive = lessons[active]?.id === open.id;
          const reachable = !locked && (done || isActive);
          return <Pressable style={[s.sheet, shadow]} onPress={() => {}}>
            <View style={s.sheetHead}><Text style={s.sheetTitle}>Dərs {open.number} · {open.title}</Text><Text style={[s.sheetPct, { color: pct === 100 ? d.green : d.orange }]}>{pct}%</Text></View>
            {open.phrases ? <Text style={s.sheetPhrases}>{open.phrases}</Text> : null}
            <View style={s.sheetTrack}><View style={[s.sheetFill, { width: `${pct}%`, backgroundColor: pct === 100 ? d.green : d.orange }]} /></View>
            {reachable ? <Pressable accessibilityRole="button" onPress={() => { const id = open.id; setOpen(null); onOpenLesson(id); }} style={({ pressed }) => [s.sheetBtn, done && { backgroundColor: d.purple }, pressed && { opacity: .9 }]}>
              <Text style={s.sheetBtnText}>{done ? 'Yenidən keç' : pct ? 'Davam et' : 'Başla'}</Text><Icon name="arrow" size={16} color="#fff" />
            </Pressable> : <Text style={s.sheetLocked}>Bu dərs əvvəlki dərsi bitirəndə açılacaq.</Text>}
          </Pressable>;
        })() : null}
      </Pressable>
    </Modal>
  </View>;
}

const NAV = [
  { id: 'learn', label: 'Öyrən' }, { id: 'review', label: 'Təkrar' }, { id: 'chat', label: 'AI söhbət' },
  { id: 'vocabulary', label: 'Lüğətim' }, { id: 'profile', label: 'Profil' },
] as const;
const NAV_ICON = { learn: 'home', review: 'repeat', vocabulary: 'book', profile: 'person' } as const;
export type IslandDestination = typeof NAV[number]['id'];

/** Floating bottom menu drawn in code. AI söhbət is a tab of its own (empty for now). */
export function IslandNavigation({ bottomInset, onNavigate }: { bottomInset: number; onNavigate: (id: IslandDestination) => void }) {
  return <View style={[s.navWrap, { paddingBottom: Math.max(bottomInset, 10) }]}>
    <View style={[s.nav, shadow]} accessibilityRole="tablist">
      {NAV.map(item => {
        const on = item.id === 'learn';
        return <Pressable key={item.id} accessibilityRole="tab" accessibilityLabel={item.label} accessibilityState={{ selected: on }}
          onPress={() => onNavigate(item.id)} style={[s.navItem, on && s.navOn]}>
          {item.id === 'chat' ? <Icon name="chat" size={22} color="#9A8DB5" /> : <HomeIcon name={NAV_ICON[item.id]} color={on ? d.purple : '#9A8DB5'} size={22} filled={on} />}
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
  label: { position: 'absolute', maxWidth: 150, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E6DAFB' },
  labelTitle: { color: d.ink, fontSize: 15, lineHeight: 19, ...font.extrabold },
  labelPct: { fontSize: 13, lineHeight: 16, ...font.extrabold },
  review: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 16, marginTop: 10, padding: 10, borderRadius: 20, backgroundColor: '#2A1240' },
  reviewIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: 'rgba(255,255,255,.12)', alignItems: 'center', justifyContent: 'center' },
  reviewTitle: { color: '#fff', fontSize: 15, ...font.extrabold },
  reviewSub: { color: '#CDBDEB', fontSize: 12, ...font.bold },
  reviewBtn: { height: 34, paddingHorizontal: 14, borderRadius: 17, backgroundColor: d.orange, justifyContent: 'center' },
  reviewBtnText: { color: '#fff', fontSize: 14, ...font.extrabold },
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
