import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useUserStore } from '../../store/userStore';
import type { HomeCourse } from '../../utils/homeCourse';
import { HomeDashboard as OriginalHomeDashboard } from './HomeDashboard';
import { HomeJourneyProgress } from './HomeJourneyProgress';
import LessonGroupPanel from './LessonGroupPanel';
import HomeSectionProgress from './HomeSectionProgress';
import { buildHomeGroups, resumeGroup } from '../../utils/homeGroups';
import { HomeSymbol, type HomeSymbolName } from './HomeSymbol';

export { HOME_LANGUAGES } from './HomeDashboard';
export type { HomeDestination } from './HomeDashboard';

type Destination = 'learn' | 'review' | 'vocabulary' | 'profile';
// Tile coordinates are measured from the approved design. Only the presentation
// is reconstructed; the existing module callbacks and unlock rules remain intact.
const TILES = [
  { x: 154, y: 507, symbol: 'hand' }, { x: 437, y: 507, symbol: 'identity' },
  { x: 181, y: 657, symbol: 'dialogue' }, { x: 460, y: 722, symbol: 'headphones' },
  { x: 146, y: 852, symbol: 'mic' }, { x: 396, y: 967, symbol: 'puzzle' },
  { x: 220, y: 1037, symbol: 'speech' },
] as const;

export function HomeDashboard({ course, language, level, xp, compact = false, topInset = 0, onSelect, onOpen, onNavigate, onLessonOpen, onSupplement }: {
  course: HomeCourse; language: string; level: string; xp: number; compact?: boolean; topInset?: number;
  onSelect: () => void; onOpen: (id: string) => void; onNavigate?: (destination: Destination) => void; onLessonOpen?: (id: string) => void; onSupplement?: (kind: string) => void;
}) {
  const { width, fontScale = 1 } = useWindowDimensions();
  const streak = useUserStore(s => s.streak);
  const completed = useUserStore(s => s.completedLessons);
  const attempts = useUserStore(s => s.attempts);
  const groups = buildHomeGroups(completed, attempts);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const currentGroup = resumeGroup(completed, attempts);
  const [headerHeight, setHeaderHeight] = useState(80);

  const module = course.items.find(item => item.order === 1 && item.lessonsCount > 0);
  const preview = course.items.find(item => item.order === 2);
  const renderedReference = language === 'en' && level === 'A1' && Boolean(module);
  const pageWidth = Math.min(Math.max(240, width - 24), 480);
  const scale = pageWidth / 682;
  const largeText = fontScale > 1.3;
  const textHeight = Math.max(1, fontScale ** 1.5);

  if (!renderedReference || !module) {
    return <OriginalHomeDashboard course={course} language={language} level={level} xp={xp}
      compact={compact} topInset={topInset} onSelect={onSelect} onOpen={onOpen} />;
  }


  const moduleLocked = module.state === 'locked' || module.state === 'planned';
  const tileSize = Math.max(56, 136 * scale) * textHeight;
  const completedCount = groups.reduce((sum, group) => sum + group.count, 0);
  const lessonCount = groups.reduce((sum, group) => sum + group.lessons.length, 0);
  const percent = Math.round(completedCount / Math.max(1, lessonCount) * 100);
  const groupWidth = pageWidth * .42;
  // Give the existing listening caption extra space at larger system text sizes;
  // later tiles and their route links move together, never underneath the CTA.
  const captionExtra = 0;
  const bodyHeight = 737 * scale * textHeight + captionExtra;

  return <LinearGradient colors={['#FAF5FF', '#F1E4FC', '#F8F0FF']} style={s.screen}>
    <StatusBar style="dark" />
    <ScrollView showsVerticalScrollIndicator={false}
      contentContainerStyle={[s.scroll, { paddingTop: topInset + 8 }]}
      accessibilityLabel="Öyrənmə ana səhifəsi">
      <View style={{ width: pageWidth }}>
        <View style={[s.topRow, largeText && s.wrap]}>
          <Pressable accessibilityRole="button" accessibilityLabel="Dil və səviyyə seç" onPress={onSelect}
            style={({ pressed }) => [s.brand, pressed && s.pressed]}>
            <HomeSymbol name="spark" size={30} />
            <Text style={[s.brandText, { fontSize: pageWidth < 340 ? 25 : 28 }]}>Bir<Text style={s.brandOrange}>Talk</Text></Text>
          </Pressable>
          <View style={s.metrics}>
            <View style={s.metric} accessible accessibilityLabel={`${streak} gün ardıcıllıq`}>
              <HomeSymbol name="flame" size={23} /><Text style={s.metricText}>{streak} gün</Text>
            </View>
            <View style={s.metric} accessible accessibilityLabel={`${xp} təcrübə xalı`}>
              <HomeSymbol name="star" size={23} /><Text style={s.metricText}>{xp}</Text>
            </View>
          </View>
        </View>
        <View style={[s.hero, { minHeight: pageWidth * .23 }]}>
          <Text style={[s.greeting, { fontSize: pageWidth < 340 ? 29 : 32 }, largeText && s.largeGreeting]}>Salam, Leyla!</Text>
          <View pointerEvents="none" style={[s.mascotCrop, { width: pageWidth * .32, height: pageWidth * .34 }]}>
            <Image source={require('../../../assets/onboarding/welcome.png')} accessible={false} resizeMode="contain"
              style={{ width: pageWidth * .32, height: pageWidth * .34 }} />
          </View>
        </View>
        <View style={[s.actions, (largeText || pageWidth < 290) && s.wrap]}>
          <Pressable accessibilityRole="button" accessibilityLabel="Analiz" onPress={() => onNavigate?.('profile')}
            style={({ pressed }) => [s.action, pressed && s.pressed]}>
            <LinearGradient colors={['#FCF7FF', '#E9D1FC']} style={s.actionBody}>
              <HomeSymbol name="analysis" size={36} /><Text style={s.actionText}>Analiz</Text>
            </LinearGradient>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Danışıq dərslərini aç"
            accessibilityState={{ disabled: moduleLocked }} disabled={moduleLocked}
            onPress={() => setSelectedGroup(groups[6].id)} style={({ pressed }) => [s.action, pressed && s.pressed]}>
            <LinearGradient colors={['#FFF4E5', '#FFDCC7']} style={s.actionBody}>
              <HomeSymbol name="robot" size={36} /><Text style={s.actionText}>Danışıq</Text>
            </LinearGradient>
          </Pressable>
        </View>
        <View style={s.map}>
          <HomeJourneyProgress key={module.id} completedCount={groups.findIndex(g => g.count < g.lessons.length) < 0 ? 7 : groups.findIndex(g => g.count < g.lessons.length)}
            percent={percent} scale={scale} verticalScale={textHeight} headerHeight={headerHeight} captionExtra={captionExtra} />
          <View style={s.mapHeading} onLayout={event => setHeaderHeight(event.nativeEvent.layout.height)}>
            <Text style={s.mapTitle}>{module.title}</Text>
            <View style={s.liveProgress} accessible accessibilityRole="progressbar" accessibilityLabel="Bölmədə irəliləyiş"
              accessibilityValue={{ min: 0, max: 100, now: percent,
                text: `${completedCount}/${lessonCount} dərs tamamlanıb · ${percent}%` }}>
              <Text style={s.progressText}>{completedCount}/{lessonCount} dərs tamamlanıb · {percent}%</Text>
            </View>
            <HomeSectionProgress percent={percent} />
          </View>
          <View style={{ height: bodyHeight }}>
            {TILES.map(({ y, symbol }, index) => {
              if (!groups[index]) return null;
              const group = groups[index];
              const blocked = !group;
              const done = group.count === group.lessons.length;
              const listening = group.id === currentGroup;
              return <View key={groups[index].id} style={{ position: 'absolute', left: pageWidth * ([1, 3, 5].includes(index) ? .53 : .05),
                top: (y - 507) * scale * textHeight + (index >= 5 ? captionExtra : 0), width: groupWidth }}>
                <Pressable accessibilityRole="button" disabled={blocked}
                  accessibilityState={{ disabled: blocked, selected: listening, expanded: selectedGroup === group.id }}
                  accessibilityLabel={`${group.title}: ${group.count}/${group.lessons.length} dərs. Qrupu aç`}
                  onPress={() => setSelectedGroup(group.id)}
                  style={({ pressed }) => [s.tile, { width: groupWidth, height: tileSize, borderRadius: tileSize * .25 }, pressed && s.pressed]}>
                  <LinearGradient colors={listening ? ['#FFD56B', '#FFAB37', '#FF8A22']
                    : ['#FFFBFF', '#F1E1FE', '#DFBFF6']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.tileBody, { borderRadius: tileSize * .25 }]}>
                    <HomeSymbol name={symbol} size={Math.min(48, tileSize / textHeight * .48)} />
                    <View style={{ flex: 1 }}><Text style={[s.groupTitle, { fontSize: pageWidth < 330 ? 11 : 13 }]}>{group.title}</Text><Text style={s.groupCount}>{group.count}/{group.lessons.length} dərs</Text>{listening && !done ? <Text style={s.currentAction}>Davam et ›</Text> : null}</View>
                  </LinearGradient>
                  {done && <View pointerEvents="none" style={s.done}><HomeSymbol name="check" size={13} /></View>}
                </Pressable>

              </View>;
            })}
          </View>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingVertical: 14 }}>
          {['Keçid imtahanı', 'Özünü yoxla', 'Hekayə'].map(label => <Pressable key={label} accessibilityRole="button" onPress={() => onSupplement?.(label === 'Keçid imtahanı' ? 'exam' : label === 'Özünü yoxla' ? 'self-check' : 'story')} style={{ padding: 12, borderRadius: 16, backgroundColor: '#EEE0FA', minHeight: 44 }}><Text style={{ color: '#6C3890', fontWeight: '700' }}>{label}</Text></Pressable>)}
        </View>
        {preview && <Pressable disabled={preview.state === 'planned'} accessibilityRole="button"
          accessibilityState={{ disabled: preview.state === 'planned' }}
          accessibilityLabel={`Bölmə ${preview.order}: ${preview.title}`}
          onPress={() => onOpen(preview.id)} style={({ pressed }) => [s.preview, pressed && s.pressed]}>
          <LinearGradient colors={['#F1FCFF', '#D5F1FF', '#C6E6FB']} style={s.previewBody}>
            <Text style={s.mapTitle}>Bölmə {preview.order} · {preview.title}</Text>
            <View style={s.previewLock}><HomeSymbol name="lock" size={28} muted /></View>
          </LinearGradient>
        </Pressable>}
      </View>
    </ScrollView>
    <LessonGroupPanel key={selectedGroup ?? 'closed'} groupId={selectedGroup} onClose={() => setSelectedGroup(null)} onLesson={id => onLessonOpen?.(id)} />
  </LinearGradient>;
}

const NAV: { id: Destination; label: string; symbol: HomeSymbolName }[] = [
  { id: 'learn', label: 'Öyrən', symbol: 'cap' }, { id: 'review', label: 'Təkrar', symbol: 'repeat' },
  { id: 'vocabulary', label: 'Lüğətim', symbol: 'book' }, { id: 'profile', label: 'Profil', symbol: 'person' },
];
export function HomeNavigation({ bottomInset = 0, onNavigate }: {
  bottomInset?: number; onNavigate: (destination: Destination) => void;
}) {
  return <View style={s.navBacking}><View style={[s.nav, { paddingBottom: Math.max(6, bottomInset) }]}>
    {NAV.map(item => <Pressable key={item.id} accessibilityRole="tab"
      accessibilityLabel={item.label} accessibilityState={{ selected: item.id === 'learn' }}
      onPress={() => onNavigate(item.id)} style={({ pressed }) => [s.navItem, pressed && s.pressed]}>
      {item.id === 'learn' && <LinearGradient pointerEvents="none" colors={['#EEDCFF', '#DDB9F7']}
        style={[StyleSheet.absoluteFill, s.navSelected]} />}
      <HomeSymbol name={item.symbol} size={27} />
      <Text style={[s.navLabel, item.id === 'learn' && s.navLabelActive]}>{item.label}</Text>
    </Pressable>)}
  </View></View>;
}

const s = StyleSheet.create({
  screen: { flex: 1 }, scroll: { alignItems: 'center', paddingBottom: 16 },
  topRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  wrap: { flexWrap: 'wrap' }, brand: { flexDirection: 'row', alignItems: 'center', gap: 3, minHeight: 44 },
  brandText: { color: '#2C1048', fontWeight: '900', letterSpacing: -1.3 }, brandOrange: { color: '#F47E1B' },
  metrics: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 },
  metric: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3, minHeight: 34,
    paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#FBF1FF', borderRadius: 24, borderWidth: 1,
    borderColor: '#EBD5F9', shadowColor: '#9F65C6', shadowOpacity: .15, shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  metricText: { color: '#2E124A', fontSize: 16, fontWeight: '800', flexShrink: 1 },
  hero: { flexDirection: 'row', alignItems: 'center', marginTop: 9 },
  greeting: { flex: 1, color: '#2B0D44', fontWeight: '900', letterSpacing: -.9, paddingVertical: 12, zIndex: 1 },
  largeGreeting: { flexBasis: '62%' }, mascotCrop: { overflow: 'hidden', alignSelf: 'flex-end', marginRight: 3 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 3, marginBottom: 13 },
  action: { flex: 1, minWidth: 140, borderRadius: 30, shadowColor: '#AB72CC', shadowOpacity: .2,
    shadowRadius: 4, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  actionBody: { flex: 1, minHeight: 47, borderRadius: 30, borderWidth: 1, borderColor: '#FDF6FF',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 4, paddingHorizontal: 10 },
  actionText: { color: '#301144', fontSize: 18, fontWeight: '800', flexShrink: 1 },
  map: { position: 'relative', marginHorizontal: 0 },
  mapHeading: { alignItems: 'center', paddingTop: 18, paddingBottom: 10, paddingHorizontal: 16, gap: 5 },
  mapTitle: { color: '#2E1048', fontSize: 22, lineHeight: 28, fontWeight: '900', textAlign: 'center', letterSpacing: -.4 },
  liveProgress: { backgroundColor: '#EBD3F9', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 2 },
  progressText: { color: '#7932B7', fontSize: 13, lineHeight: 20, fontWeight: '800', textAlign: 'center' },
  tile: { shadowColor: '#9D66BD', shadowOpacity: .28, shadowRadius: 3, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  currentAction: { fontSize: 10, lineHeight: 14, color: '#592B0D', fontWeight: '800', marginTop: 2 }, groupLabel: { position: 'absolute', left: -12, right: -12, top: '62%', alignItems: 'center' }, groupTitle: { fontSize: 11, lineHeight: 16, fontWeight: '800', color: '#39194D', textAlign: 'left' }, groupCount: { fontSize: 10, lineHeight: 12, color: '#7C39AE', fontWeight: '700' },
  tileBody: { flex: 1, flexDirection: 'row', paddingHorizontal: 6, gap: 4, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#FBF5FF' },
  done: { position: 'absolute', right: -3, bottom: -3, width: 21, height: 21, borderRadius: 11,
    backgroundColor: '#8C3ACE', borderWidth: 2, borderColor: '#FAF1FF', justifyContent: 'center', alignItems: 'center' },
  caption: { marginTop: 4, alignItems: 'center' },
  captionTitle: { color: '#2D1246', fontSize: 16, fontWeight: '800', textAlign: 'center' },
  duration: { backgroundColor: '#E8C3FB', borderRadius: 16, paddingHorizontal: 11, paddingVertical: 1, marginTop: 2 },
  durationText: { color: '#7D30BC', fontSize: 13, fontWeight: '700' },
  start: { marginTop: 4, borderRadius: 22, minWidth: 90, minHeight: 44, justifyContent: 'center' },
  startBody: { borderRadius: 22, paddingHorizontal: 19, paddingVertical: 5, borderWidth: 1, borderColor: '#FFC97A', minHeight: 32, justifyContent: 'center' },
  startText: { color: '#492414', fontSize: 16, fontWeight: '800', textAlign: 'center' },
  preview: { marginTop: 14, borderRadius: 52, shadowColor: '#AC8AC5', shadowOpacity: .15,
    shadowRadius: 4, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  previewBody: { borderRadius: 52, borderWidth: 2, borderColor: '#F7FDFF', alignItems: 'center', paddingTop: 19, paddingHorizontal: 20, paddingBottom: 18, gap: 12 },
  previewLock: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EBF8FF', borderWidth: 1, borderColor: '#FFFFFF' },
  navBacking: { flexShrink: 0, backgroundColor: '#F8F0FF' },
  nav: { flexDirection: 'row', backgroundColor: '#F9F0FF', borderTopLeftRadius: 28,
    borderTopRightRadius: 28, borderTopWidth: 1, borderColor: '#FFFFFF', paddingTop: 5, paddingHorizontal: 7 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 58, paddingVertical: 5, paddingHorizontal: 2, gap: 1 },
  navSelected: { borderRadius: 28 }, navLabel: { color: '#82519E', fontSize: 13, fontWeight: '700', textAlign: 'center', maxWidth: '100%', flexShrink: 1 },
  navLabelActive: { color: '#8F23D2', fontWeight: '800' }, pressed: { opacity: .76 },
});
