// Home as an island (user's concept, 13 noyabr 2026).
// Each section is an island drawn in code. Lessons run from the top down; the island fills with
// water from the top as lessons are completed and turns deep purple when the section is done.
// Links between lessons are thick and fill like a percentage: pale first, darker as you go.
// Lesson icons are not ready yet, so the nodes show numbers.
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';
import { d, font, shadow } from '../design/theme';
import Icon from '../design/Icons';
import { HomeIcon } from './HomeIcon';

export interface IslandLesson { id: string; number: number; title: string }

const mascotHead = require('../../../assets/mascot/hood_head.png');
const mascotFull = require('../../../assets/mascot/hood_full.png');

// The user's wavy, cloud-like island outline, drawn for a 350 × 800 box.
const OUTLINE = 'M70 30 C110 6 150 22 176 14 C206 4 238 18 268 22 C312 28 334 70 330 110 C326 150 346 178 340 222 C334 268 312 290 320 336 C328 384 346 410 338 456 C330 500 306 520 314 566 C322 612 342 640 330 686 C318 736 280 770 228 782 C188 792 150 778 116 786 C74 796 34 770 22 728 C10 686 28 650 20 606 C12 560 -2 530 10 486 C22 442 44 420 34 374 C24 328 4 298 14 254 C24 210 48 186 40 142 C32 98 34 54 70 30 Z';
const BOX_W = 350, BOX_H = 800, TOP = 82, STEP = 92;
const LEFT_X = 116, RIGHT_X = 238, LAST_X = 178;

/** Node centre in the 350 × 800 box: zigzag, the last lesson (section conversation) in the middle. */
function nodeAt(i: number, count: number) {
  const x = i === count - 1 && count > 2 ? LAST_X : i % 2 ? RIGHT_X : LEFT_X;
  return { x, y: TOP + i * STEP * (8 - 1) / Math.max(count - 1, 1) };
}

/** Link colour: pale at the start, deeper towards the end of the section. */
function linkColor(i: number, count: number) {
  const t = count > 2 ? i / (count - 2) : 0;
  const mix = (a: number, b: number) => Math.round(a + (b - a) * t);
  return `rgb(${mix(0xC9, 0x6A)},${mix(0xB6, 0x3A)},${mix(0xF5, 0xD8)})`;
}

/** Water surface from the top of the island down to `level` (0–1), with a soft wave on its edge. */
function waveEdge(level: number) {
  const y = 14 + level * (BOX_H - 28);
  const points: string[] = [];
  for (let x = BOX_W; x >= 0; x -= 10) points.push(`${x} ${(y + Math.sin(x / 26) * 6).toFixed(1)}`);
  return points;
}
function waterPath(level: number) {
  if (level <= 0) return '';
  if (level >= 1) return `M0 0 H${BOX_W} V${BOX_H} H0 Z`;
  return `M0 0 L${BOX_W} 0 L${waveEdge(level).join(' L')} Z`;
}
const surfacePath = (level: number) => `M${waveEdge(level).join(' L')}`;

export function IslandHome({ section, sectionTitle, lessons, completed, locked, nextSection, streak, xp, languageLabel, topInset, onSelectLanguage, onOpenLesson, onAnalysis, onChat, onNextSection }: {
  section: number; sectionTitle: string; lessons: IslandLesson[]; completed: string[]; locked: boolean;
  nextSection?: { title: string; available: boolean };
  streak: number; xp: number; languageLabel: string; topInset: number;
  onSelectLanguage: () => void; onOpenLesson: (id: string) => void; onAnalysis: () => void; onChat: () => void; onNextSection: () => void;
}) {
  const { width } = useWindowDimensions();
  const boxW = Math.min(width - 40, 390);
  const k = boxW / BOX_W;
  const count = lessons.length;
  const doneCount = lessons.filter(l => completed.includes(l.id)).length;
  const active = locked ? -1 : lessons.findIndex(l => !completed.includes(l.id));
  const finished = count > 0 && doneCount === count;
  const level = count ? doneCount / count : 0;
  const percent = Math.round(level * 100);

  const nodes = lessons.map((_, i) => nodeAt(i, count));
  const activeNode = active >= 0 ? nodes[active] : undefined;

  return <View style={s.screen}>
    <StatusBar style="dark" />
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[s.scroll, { paddingTop: topInset + 8 }]} accessibilityLabel="Öyrənmə ana səhifəsi">
      <View style={s.topBar}>
        <Pressable accessibilityRole="button" accessibilityLabel={`Dil və səviyyə: ${languageLabel}. Dəyişmək üçün toxun`} onPress={onSelectLanguage} style={s.brandRow}>
          <Text style={s.brand}>BirTalk</Text>
          <View style={s.langChip}><Text style={s.langText}>{languageLabel}</Text><HomeIcon name="down" color={d.purple} size={14} /></View>
        </Pressable>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <View style={s.stat} accessibilityLabel={`${streak} gün ardıcıl`}><HomeIcon name="bolt" color={d.orange} size={15} /><Text style={s.statText}>{streak}</Text></View>
          <View style={s.stat} accessibilityLabel={`${xp} xal`}><Text style={[s.statText, { color: '#C99A00' }]}>★</Text><Text style={s.statText}>{xp}</Text></View>
        </View>
      </View>

      <View style={s.hello}>
        <Text style={s.helloText}>Salam!</Text>
        <Image source={mascotFull} style={{ width: 84, height: 104 }} contentFit="contain" accessibilityLabel="Maskot" />
      </View>

      <View style={s.quick}>
        <Pressable accessibilityRole="button" onPress={onAnalysis} style={({ pressed }) => [s.quickBtn, pressed && s.pressed]}>
          <Icon name="chart" size={20} color={d.purple} /><Text style={s.quickText}>Analiz</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityState={{ disabled: locked }} disabled={locked} onPress={onChat}
          style={({ pressed }) => [s.quickBtn, s.quickChat, pressed && s.pressed, locked && { opacity: .5 }]}>
          <Icon name="chat" size={20} color={d.orange} /><Text style={s.quickText}>AI söhbət</Text>
        </Pressable>
      </View>

      <Text accessibilityRole="header" style={s.sectionTitle}>Bölmə {section} · {sectionTitle}</Text>
      <View style={s.progressChip}><Text style={s.progressText}>{doneCount}/{count} dərs · {percent}%</Text></View>

      <View style={{ width: boxW, height: BOX_H * k, alignSelf: 'center' }}>
        <Svg width={boxW} height={BOX_H * k} viewBox={`0 0 ${BOX_W} ${BOX_H}`} style={StyleSheet.absoluteFill}>
          <Defs><ClipPath id="island"><Path d={OUTLINE} /></ClipPath></Defs>
          <Path d={OUTLINE} fill={finished ? '#B497F2' : '#EFE6FC'} stroke={finished ? d.purple : '#D9C8F6'} strokeWidth={finished ? 3.5 : 2.5} />
          <G clipPath="url(#island)">
            <Path d={waterPath(level)} fill={finished ? '#5B1FD1' : '#A98BF0'} opacity={finished ? .55 : .45} />
            {level > 0 && level < 1 ? <Path d={surfacePath(level)} fill="none" stroke="#fff" strokeWidth={2.5} opacity={.75} /> : null}
          </G>
          {nodes.slice(0, -1).map((a, i) => {
            const b = nodes[i + 1], mid = (a.y + b.y) / 2;
            const p = `M${a.x} ${a.y} C${a.x} ${mid} ${b.x} ${mid} ${b.x} ${b.y}`;
            // Fully filled up to the lesson in progress; the link after it is partly filled.
            const fill = active < 0 ? (finished || i < doneCount - 1 ? 100 : 0) : i < active ? 100 : i === active ? 35 : 0;
            return <G key={i}>
              <Path d={p} fill="none" stroke="#E2D6F6" strokeWidth={12} strokeLinecap="round" />
              {fill ? <Path d={p} fill="none" stroke={linkColor(i, count)} strokeWidth={12} strokeLinecap="round" pathLength={100} strokeDasharray={fill === 100 ? undefined : `${fill} 100`} /> : null}
            </G>;
          })}
        </Svg>

        {lessons.map((lesson, i) => {
          const n = nodes[i], done = completed.includes(lesson.id), isActive = i === active, last = i === count - 1;
          const open = !locked && (done || isActive);
          const size = isActive ? 72 : last ? 70 : 58;
          const right = n.x > BOX_W / 2 + 10, centre = last && count > 2;
          return <View key={lesson.id} pointerEvents="box-none" style={StyleSheet.absoluteFill}>
            <Pressable accessibilityRole="button" accessibilityLabel={`Dərs ${lesson.number}: ${lesson.title}${done ? ', keçilib' : isActive ? ', növbəti' : ', kilidlidir'}`}
              accessibilityState={{ disabled: !open }} disabled={!open} onPress={() => onOpenLesson(lesson.id)}
              style={({ pressed }) => [s.node, { width: size, height: size, borderRadius: size / 2, left: n.x * k - size / 2, top: n.y * k - size / 2 },
                done ? s.nodeDone : isActive ? s.nodeActive : s.nodeLocked, pressed && s.pressed]}>
              <Text style={[s.nodeText, isActive && { color: '#fff', fontSize: 24 }, !done && !isActive && { color: '#A99BC4' }]}>{lesson.number}</Text>
            </Pressable>
            {done ? <View pointerEvents="none" style={[s.badge, { left: n.x * k + size / 2 - 18, top: n.y * k + size / 2 - 18 }]}><HomeIcon name="check" color="#fff" size={12} /></View> : null}
            <Text pointerEvents="none" numberOfLines={2} style={[s.nodeLabel, !done && !isActive && { color: '#7C6F95' },
              centre ? { left: n.x * k - 60, top: n.y * k + size / 2 + 4, width: 120, textAlign: 'center' }
                : right ? { left: n.x * k - size / 2 - 8 - 120, top: n.y * k - 10, width: 120, textAlign: 'right' }
                  : { left: n.x * k + size / 2 + 8, top: n.y * k - 10, width: 120 }]}>{lesson.title}</Text>
          </View>;
        })}

        {activeNode ? <>
          <View pointerEvents="none" style={{ position: 'absolute', left: activeNode.x * k + (activeNode.x > BOX_W / 2 ? -100 : 44), top: activeNode.y * k - 64 }}>
            <Image source={mascotHead} accessibilityLabel="Maskot burada" style={{ width: 56, height: 46 }} contentFit="contain" />
          </View>
          <View style={[s.startCard, shadow, { top: active === count - 1 ? activeNode.y * k - 170 : activeNode.y * k + 44 }, activeNode.x > BOX_W / 2 ? { left: 0 } : { right: 0 }]}>
            <Text style={s.startTitle}>Dərs {lessons[active].number} · {lessons[active].title}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel={`Dərs ${lessons[active].number}-ə başla`} onPress={() => onOpenLesson(lessons[active].id)}
              style={({ pressed }) => [s.startBtn, pressed && s.pressed]}>
              <Text style={s.startBtnText}>{doneCount ? 'Davam et' : 'Başla'}</Text>
            </Pressable>
          </View>
        </> : null}
      </View>

      {nextSection ? <View style={{ alignItems: 'center' }}>
        <View style={s.bridge} />
        <Pressable accessibilityRole="button" accessibilityState={{ disabled: !nextSection.available }} disabled={!nextSection.available} onPress={onNextSection}
          style={[s.nextIsland, nextSection.available && { borderStyle: 'solid', borderColor: d.borderStrong, backgroundColor: '#fff' }]}>
          {!nextSection.available ? <HomeIcon name="lock" color="#9A8DB5" size={16} /> : null}
          <Text style={s.nextText}>Bölmə {section + 1} · {nextSection.title}</Text>
        </Pressable>
      </View> : null}
    </ScrollView>
  </View>;
}

const NAV = [
  { id: 'learn', label: 'Öyrən', icon: 'home' }, { id: 'review', label: 'Təkrar', icon: 'repeat' },
  { id: 'vocabulary', label: 'Lüğətim', icon: 'book' }, { id: 'profile', label: 'Profil', icon: 'person' },
] as const;
export type IslandDestination = typeof NAV[number]['id'];

/** Bottom navigation drawn in code (replaces the old image strip). */
export function IslandNavigation({ bottomInset, onNavigate }: { bottomInset: number; onNavigate: (id: IslandDestination) => void }) {
  return <View style={[s.nav, { paddingBottom: Math.max(bottomInset, 10) }]} accessibilityRole="tablist">
    {NAV.map(item => {
      const on = item.id === 'learn';
      return <Pressable key={item.id} accessibilityRole="tab" accessibilityLabel={item.label} accessibilityState={{ selected: on }}
        onPress={() => onNavigate(item.id)} style={s.navItem}>
        <HomeIcon name={item.icon} color={on ? d.purple : '#9A8DB5'} size={24} filled={on} />
        <Text style={[s.navText, on && { color: d.purple }]}>{item.label}</Text>
      </Pressable>;
    })}
  </View>;
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F3ECFC' },
  scroll: { paddingHorizontal: 20, paddingBottom: 28, gap: 14 },
  pressed: { opacity: .85, transform: [{ scale: .97 }] },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44 },
  brand: { color: d.purple, fontSize: 24, ...font.extrabold },
  langChip: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 28, paddingHorizontal: 10, borderRadius: 14, backgroundColor: d.purpleSoft },
  langText: { color: d.purple, fontSize: 13, ...font.extrabold },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 32, paddingHorizontal: 10, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: d.purpleSoft },
  statText: { color: d.inkSoft, fontSize: 14, ...font.extrabold },
  hello: { flexDirection: 'row', alignItems: 'center' },
  helloText: { flex: 1, color: d.ink, fontSize: 32, ...font.extrabold },
  quick: { flexDirection: 'row', gap: 10 },
  quickBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 50, borderRadius: 25, backgroundColor: '#F4EEFD', borderWidth: 1, borderColor: d.border },
  quickChat: { backgroundColor: '#FFF0E2', borderColor: '#F7CFA6' },
  quickText: { color: d.ink, fontSize: 17, ...font.extrabold },
  sectionTitle: { alignSelf: 'center', color: d.ink, fontSize: 22, marginTop: 4, ...font.extrabold },
  progressChip: { alignSelf: 'center', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, backgroundColor: d.purpleSoft, marginTop: -6 },
  progressText: { color: d.purple, fontSize: 14, ...font.extrabold },
  node: { position: 'absolute', alignItems: 'center', justifyContent: 'center', ...shadow },
  nodeDone: { backgroundColor: '#fff', borderWidth: 3, borderColor: d.purple },
  nodeActive: { backgroundColor: d.orange, borderWidth: 4, borderColor: '#fff', shadowColor: d.orange, shadowOpacity: .35, shadowRadius: 12 },
  nodeLocked: { backgroundColor: '#F7F3FC', borderWidth: 2.5, borderColor: '#DCD0F0' },
  nodeText: { color: d.purple, fontSize: 21, ...font.extrabold },
  badge: { position: 'absolute', width: 22, height: 22, borderRadius: 11, backgroundColor: d.purple, borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  nodeLabel: { position: 'absolute', color: d.ink, fontSize: 14, ...font.extrabold },
  startCard: { position: 'absolute', width: 180, gap: 8, padding: 12, borderRadius: 16, backgroundColor: '#fff', borderWidth: 2, borderColor: d.orange, zIndex: 2 },
  startTitle: { color: d.ink, fontSize: 15, ...font.extrabold },
  startBtn: { height: 40, borderRadius: 20, backgroundColor: d.orange, alignItems: 'center', justifyContent: 'center' },
  startBtnText: { color: '#fff', fontSize: 15, ...font.extrabold },
  bridge: { width: 0, height: 34, borderLeftWidth: 3, borderStyle: 'dashed', borderColor: '#CDBDEB' },
  nextIsland: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 18, paddingVertical: 14, borderRadius: 40, backgroundColor: '#F1ECF8', borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#CDBDEB' },
  nextText: { color: '#6E6188', fontSize: 16, ...font.extrabold },
  nav: { flexDirection: 'row', paddingTop: 8, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: d.purpleSoft },
  navItem: { flex: 1, alignItems: 'center', gap: 2, minHeight: 48, justifyContent: 'center' },
  navText: { color: '#7C6F95', fontSize: 12, ...font.bold },
});
