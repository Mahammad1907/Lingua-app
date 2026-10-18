import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { HomeCourse, HomeModuleItem } from '../../utils/homeCourse';
import { HomeArtwork } from './HomeArtwork';
import { HomeIcon, type HomeIconName } from './HomeIcon';

export const HOME_LANGUAGES = [
  { code: 'en', flag: '🇬🇧', name: 'İngilis dili' },
  { code: 'de', flag: '🇩🇪', name: 'Alman dili' },
  { code: 'ru', flag: '🇷🇺', name: 'Rus dili' },
] as const;
const PURPLE = '#ac92f0';
const ORANGE = '#ff9b35';

function ProgressBar({ percent, purple = false }: { percent: number; purple?: boolean }) {
  const value = Math.max(0, Math.min(100, percent));
  return <View style={s.track} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: value }}>
    <LinearGradient colors={purple ? ['#a78cf0', '#bda2ff'] : ['#ffae41', '#ff922f']}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.fill, { width: `${value}%` }]} />
  </View>;
}

function ModuleCard({ item, compact, onOpen }: { item: HomeModuleItem; compact: boolean; onOpen: (id: string) => void }) {
  const current = item.state === 'current';
  const disabled = item.state === 'planned' || item.state === 'locked';
  const done = item.state === 'completed';
  return <View style={s.cardSpace}>
    <Pressable disabled={disabled} onPress={() => onOpen(item.id)} accessibilityRole="button"
      accessibilityState={{ disabled }} accessibilityLabel={`${item.title}, ${disabled ? item.state === 'planned' ? 'tezliklə' : 'kilidli' : `${item.percent}% tamamlanıb, bölməni aç`}`}
      style={({ pressed }) => [s.card, current && s.currentCard, pressed && s.pressed]}>
      <LinearGradient colors={current ? ['#1a1a2e', '#1d2035', '#27202b'] : ['#171b34', '#14172d']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.cardBody, current && s.currentBody, compact && s.compactBody]}>
        {current && <View style={s.activeRail} />}
        <HomeArtwork name={item.artwork} style={[s.cardArt, current && s.currentArt, compact && s.compactArt]} />
        <View style={[s.cardText, compact && s.compactText]}>
          <Text style={[s.moduleLabel, current && s.orange]}>BÖLMƏ {item.order}</Text>
          <Text style={[s.cardTitle, compact && s.compactTitle]}>{item.title}</Text>
          {current ? <>
            <View style={s.percentLine}><Text style={s.progressLabel}>Bölmə</Text><Text style={s.modulePercent}>{item.percent}%</Text></View>
            <Text style={s.lessonCount}>{item.completedCount} / {item.lessonsCount} dərs</Text>
            <ProgressBar percent={item.percent} />
            {item.examPercent !== null && <View style={s.examBlock}>
              <Text style={s.examText}>Keçid imtahanı  {item.examPercent}%</Text>
              <ProgressBar percent={item.examPercent} purple />
            </View>}
            <LinearGradient colors={['#ffac3c', '#ff982e']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.continue}>
              <Text style={s.continueText}>Davam et</Text><HomeIcon name="arrow" color="#231b23" size={24} />
            </LinearGradient>
          </> : done ? <View style={s.completionLine}>
            <View style={s.check}><HomeIcon name="check" color="#07372e" size={18} /></View>
            <View style={s.statusText}><Text style={s.completeText}>Bölmə 100%</Text>
              <Text style={s.statusDetail}>{item.examPassed ? 'Keçid imtahanı ✓' : `${item.completedCount}/${item.lessonsCount} dərs tamamlandı`}</Text></View>
          </View> : disabled ? <View style={s.lockLine}>
            <HomeIcon name="lock" color={PURPLE} size={18} /><Text style={s.lockText}>{item.state === 'planned' ? 'Tezliklə' : 'Kilidli'}</Text><Text style={s.lockPercent}>{item.percent}%</Text>
          </View> : <View style={s.availableLine}><Text style={s.statusDetail}>{item.examPassed ? 'Keçid imtahanı ✓' : 'Dərslərə qayıt'}</Text><Text style={s.lockPercent}>{item.percent}%</Text></View>}
        </View>
        {!current && <View style={s.cardArrow}><HomeIcon name="chevron" size={20} /></View>}
      </LinearGradient>
    </Pressable>
    {current && <View pointerEvents="none" style={s.floatingBolt}><HomeIcon name="bolt" size={25} color="#ffb13f" /></View>}
  </View>;
}

export function HomeDashboard({ course, language, level, energy, compact = false, topInset = 0, onSelect, onOpen }: {
  course: HomeCourse; language: string; level: string; energy: number; compact?: boolean; topInset?: number;
  onSelect: () => void; onOpen: (id: string) => void;
}) {
  const meta = HOME_LANGUAGES.find((l) => l.code === language) ?? HOME_LANGUAGES[0];
  const safeEnergy = Number.isFinite(energy) ? Math.max(0, Math.min(100, energy)) : 0;
  return <LinearGradient colors={['#0c1020', '#0f1225', '#0c1020']} style={s.screen}>
    <ScrollView contentContainerStyle={[s.scroll, { paddingTop: topInset + 19 }]} showsVerticalScrollIndicator={false}>
      <View style={s.page}>
        <View style={s.topRow}>
          <Pressable accessibilityRole="button" accessibilityLabel={`Dil və səviyyə seç: ${meta.name}, ${level}`} onPress={onSelect}
            style={({ pressed }) => [s.languagePill, compact && s.compactPill, pressed && s.pressed]}>
            <Text style={[s.flag, compact && s.compactFlag]}>{meta.flag}</Text>
            <Text style={[s.languageName, compact && s.compactLanguage]} numberOfLines={1}>{meta.name}</Text>
            <HomeIcon name="down" size={14} /><Text style={[s.level, compact && s.compactLanguage]}>{level}</Text>
          </Pressable>
          <Text style={[s.logo, compact && s.compactLogo]}>Bir<Text style={s.orange}>Talk</Text></Text>
          <View style={s.energy} accessibilityLabel={`Enerji ${Math.round(safeEnergy)} faiz`}>
            <Text style={[s.energyLabel, compact && s.compactEnergyLabel]}>Enerji</Text>
            <View style={[s.battery, compact && s.compactBattery]}>
              <View style={s.batteryInner}><LinearGradient colors={['#ffb24d', '#ff9535']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.batteryFill, { width: `${safeEnergy}%` }]} /></View>
              <View style={s.batteryIcon}><HomeIcon name="bolt" size={12} color={safeEnergy > 50 ? '#171320' : ORANGE} /></View>
              <View style={s.batteryCap} />
            </View>
          </View>
        </View>
        <View style={s.hero}>
          <View style={s.heroCopy}><Text style={s.heading}>Bölmələr</Text><Text style={s.subtitle}>{meta.name} · {level}</Text></View>
          <HomeArtwork name="fox" style={s.heroFox} />
          <View style={s.helloMarks}><View style={[s.helloDash, { transform: [{ rotate: '33deg' }] }]} /><View style={s.helloDash} /><View style={[s.helloDash, { transform: [{ rotate: '-33deg' }] }]} /></View>
        </View>
        <View style={s.courseLine}>
          <Text style={s.coursePercent}>{level} · <Text style={s.orange}>{course.percent}%</Text></Text>
          <View style={s.courseTrack}><ProgressBar percent={course.percent} /></View>
          <Text style={s.courseCaption}>Dərslərin tamamlanması</Text>
        </View>
        {course.items.length ? <View style={s.list}>
          <View style={s.dots} pointerEvents="none">{Array.from({ length: Math.min(95, course.items.length * 12) }, (_, i) => <View key={i} style={s.dot} />)}</View>
          {course.items.map((item) => <ModuleCard key={item.id} item={item} compact={compact} onOpen={onOpen} />)}
        </View> : <View style={s.empty}>
          <HomeArtwork name="headphones" style={s.emptyArt} /><Text style={s.emptyTitle}>Bölmələr hazırlanır</Text>
          <Text style={s.emptyText}>{meta.name} · {level} dərsləri əlavə ediləndə burada görünəcək.</Text>
          <Pressable onPress={onSelect} accessibilityRole="button" style={s.emptyButton}><Text style={s.emptyButtonText}>Dil və səviyyə seç</Text></Pressable>
        </View>}
        <View style={s.scrollHint} />
      </View>
    </ScrollView>
  </LinearGradient>;
}

export type HomeDestination = 'learn' | 'review' | 'vocabulary' | 'profile';
const DESTINATIONS: { id: HomeDestination; title: string; icon: HomeIconName }[] = [
  { id: 'learn', title: 'Öyrən', icon: 'home' }, { id: 'review', title: 'Təkrar', icon: 'repeat' },
  { id: 'vocabulary', title: 'Lüğətim', icon: 'book' }, { id: 'profile', title: 'Profil', icon: 'person' },
];
export function HomeNavigation({ bottomInset = 0, onNavigate }: { bottomInset?: number; onNavigate: (destination: HomeDestination) => void }) {
  return <View style={[s.nav, { paddingBottom: Math.max(8, bottomInset) }]}>
    {DESTINATIONS.map((item) => <Pressable key={item.id} accessibilityRole="tab" accessibilityState={{ selected: item.id === 'learn' }} accessibilityLabel={item.title}
      onPress={() => onNavigate(item.id)} style={({ pressed }) => [s.navItem, pressed && s.pressed]}>
      <HomeIcon name={item.icon} size={27} color={item.id === 'learn' ? ORANGE : PURPLE} filled={item.id === 'learn'} />
      <Text style={[s.navLabel, item.id === 'learn' && s.orange]}>{item.title}</Text>
      {item.id === 'learn' && <View style={s.navUnderline} />}
    </Pressable>)}
  </View>;
}

const s = StyleSheet.create({
  screen: { flex: 1 }, scroll: { paddingHorizontal: 15, paddingBottom: 7 }, page: { width: '100%', maxWidth: 540, alignSelf: 'center' },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  languagePill: { minHeight: 30, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 7, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: '#38305e', backgroundColor: '#16182d' },
  flag: { fontSize: 19 }, languageName: { color: '#f8f5ff', fontSize: 10.5, fontWeight: '700', maxWidth: 80 }, level: { color: PURPLE, fontSize: 11, fontWeight: '700' },
  logo: { color: '#fffaff', fontSize: 27, fontWeight: '800', letterSpacing: -1 }, orange: { color: ORANGE },
  energy: { flexDirection: 'row', alignItems: 'center', gap: 6 }, energyLabel: { color: PURPLE, fontSize: 10.5, fontWeight: '700' },
  battery: { width: 81, height: 15, borderRadius: 6, borderWidth: 1, borderColor: '#ae91f0', padding: 1 },
  batteryInner: { flex: 1, overflow: 'hidden', borderRadius: 4 }, batteryFill: { height: '100%', borderRadius: 4 },
  batteryIcon: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  batteryCap: { position: 'absolute', right: -6, top: 3, height: 8, width: 4, borderRadius: 2, backgroundColor: '#a38ade' },
  hero: { height: 82, marginTop: 10, position: 'relative' }, heroCopy: { paddingLeft: 6, paddingTop: 11 },
  heading: { color: '#fcf9ff', fontSize: 34, fontWeight: '800', letterSpacing: -.8, lineHeight: 41 },
  subtitle: { color: PURPLE, fontSize: 16, fontWeight: '700', marginTop: 1 },
  heroFox: { position: 'absolute', right: 5, top: -10, width: 133, height: 111 },
  helloMarks: { position: 'absolute', right: 129, top: 43, gap: 6 }, helloDash: { height: 2, width: 10, borderRadius: 2, backgroundColor: ORANGE },
  courseLine: { flexDirection: 'row', gap: 9, alignItems: 'center', marginTop: 3, marginBottom: 12, paddingHorizontal: 4 },
  coursePercent: { color: PURPLE, fontSize: 12, fontWeight: '700' }, courseTrack: { flex: 1 },
  courseCaption: { fontSize: 8.2, color: PURPLE, fontWeight: '500' },
  track: { height: 7, borderRadius: 5, backgroundColor: '#2b2b48', overflow: 'hidden' }, fill: { height: '100%', borderRadius: 5 },
  list: { position: 'relative' }, dots: { position: 'absolute', top: 50, left: 25, bottom: 18, overflow: 'hidden', gap: 4 }, dot: { height: 3, width: 3, borderRadius: 2, backgroundColor: '#695293' },
  cardSpace: { position: 'relative', marginBottom: 10 },
  card: { borderWidth: 1, borderColor: '#22253e', borderRadius: 13, backgroundColor: '#17192f' },
  currentCard: { borderColor: '#d18b47', shadowColor: '#ff9c36', shadowOffset: { width: 0, height: 0 }, shadowOpacity: .32, shadowRadius: 13, elevation: 5 },
  cardBody: { flexDirection: 'row', alignItems: 'center', minHeight: 86, borderRadius: 12, paddingVertical: 11, paddingRight: 23, position: 'relative', overflow: 'hidden' },
  currentBody: { minHeight: 164, alignItems: 'flex-start', paddingTop: 13, paddingBottom: 10, paddingRight: 12 },
  activeRail: { position: 'absolute', top: 0, bottom: 0, left: 0, width: 4, borderTopLeftRadius: 13, borderBottomLeftRadius: 13, backgroundColor: '#ffa039' },
  cardArt: { width: 101, height: 78, position: 'absolute', left: 2, top: 4 }, currentArt: { width: 111, height: 107, top: 16, left: 1 },
  cardText: { flex: 1, marginLeft: 117 }, moduleLabel: { color: PURPLE, fontSize: 9.8, fontWeight: '800', marginBottom: 3 },
  cardTitle: { color: '#f9f6ff', fontSize: 16, fontWeight: '800', lineHeight: 20, letterSpacing: -.2 },
  cardArrow: { position: 'absolute', right: 9, top: 31 },
  completionLine: { flexDirection: 'row', alignItems: 'center', marginTop: 7, gap: 7 }, check: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#32e3bc', alignItems: 'center', justifyContent: 'center' },
  statusText: { flex: 1 }, completeText: { color: '#31e3bb', fontSize: 12.5, fontWeight: '700' }, statusDetail: { color: '#a290d1', fontSize: 9.5, marginTop: 1 },
  lockLine: { flexDirection: 'row', alignItems: 'center', marginTop: 9, gap: 7 }, lockText: { color: PURPLE, fontSize: 11 }, lockPercent: { color: PURPLE, marginLeft: 'auto', fontSize: 11 },
  availableLine: { flexDirection: 'row', marginTop: 8, alignItems: 'center' },
  percentLine: { flexDirection: 'row', alignItems: 'center', marginTop: 7, gap: 10 }, progressLabel: { color: PURPLE, fontSize: 12, fontWeight: '600' }, modulePercent: { color: ORANGE, fontSize: 20, fontWeight: '800', lineHeight: 24 },
  lessonCount: { color: '#e4ddfa', fontSize: 11.5, marginBottom: 5 }, examBlock: { marginTop: 8 }, examText: { color: PURPLE, fontSize: 11, marginBottom: 4 },
  continue: { minHeight: 31, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 11, marginTop: 11, paddingHorizontal: 7, shadowColor: '#ff9d35', shadowOffset: { width: 0, height: 0 }, shadowOpacity: .3, shadowRadius: 8 },
  continueText: { color: '#211822', fontSize: 16, fontWeight: '800' }, floatingBolt: { position: 'absolute', left: 18, top: -10 },
  scrollHint: { width: 25, height: 3, borderRadius: 2, backgroundColor: '#6958aa', alignSelf: 'center', marginTop: -4, marginBottom: 2 },
  nav: { flexDirection: 'row', backgroundColor: '#0d1021', borderTopWidth: 1, borderTopColor: '#29223f', borderTopLeftRadius: 13, borderTopRightRadius: 13, paddingTop: 8, paddingHorizontal: 8 },
  navItem: { flex: 1, alignItems: 'center', minHeight: 53, paddingBottom: 6, gap: 4, position: 'relative' }, navLabel: { color: PURPLE, fontSize: 11.5, fontWeight: '600' },
  navUnderline: { position: 'absolute', left: 14, right: 14, bottom: 0, height: 3, borderRadius: 2, backgroundColor: ORANGE },
  compactPill: { gap: 3, paddingHorizontal: 5 }, compactFlag: { fontSize: 16 }, compactLanguage: { fontSize: 9 }, compactLogo: { fontSize: 22 }, compactBattery: { width: 62 }, compactEnergyLabel: { fontSize: 9 },
  compactBody: { paddingRight: 22 }, compactArt: { width: 87, height: 75 }, compactText: { marginLeft: 96 }, compactTitle: { fontSize: 14, lineHeight: 18 },
  pressed: { opacity: .78 }, empty: { alignItems: 'center', paddingVertical: 45, paddingHorizontal: 20 }, emptyArt: { width: 120, height: 105 }, emptyTitle: { color: '#f9f4ff', fontSize: 20, fontWeight: '700', marginTop: 15 },
  emptyText: { color: '#b4a8cc', textAlign: 'center', lineHeight: 22, marginTop: 9 }, emptyButton: { borderRadius: 10, padding: 13, backgroundColor: '#26203b', marginTop: 20 }, emptyButtonText: { color: PURPLE, fontWeight: '700' },
});
