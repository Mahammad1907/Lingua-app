import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { getLessonById } from '../../data/lessons';
import { getModuleById } from '../../data/modules';
import { useUserStore } from '../../store/userStore';
import type { HomeCourse, HomeModuleItem } from '../../utils/homeCourse';
import { HomeIcon } from './HomeIcon';

export { HOME_LANGUAGES } from './HomeDashboard';
export type { HomeDestination } from './HomeDashboard';

type Destination = 'learn' | 'review' | 'vocabulary' | 'profile';
const INK = '#2B1049';
const PURPLE = '#7D34C9';
const ORANGE = '#FF9636';
const POSITIONS = [
  { left: '10%', top: 8 }, { left: '58%', top: 8 },
  { left: '20%', top: 116 }, { left: '59%', top: 178 },
  { left: '10%', top: 265 }, { left: '58%', top: 337 }, { left: '29%', top: 410 },
] as const;
const LESSON_ICONS = ['👋', '🪪', '💬', '🎧', '🎙️', '🧩', '💭'];

function LearningNode({ index, title, completed, active, locked, onPress }: {
  index: number; title: string; completed: boolean; active: boolean; locked: boolean; onPress: () => void;
}) {
  const pos = POSITIONS[index];
  return <View style={[s.nodeWrap, { left: pos.left, top: pos.top }]}>
    <Pressable accessibilityRole="button" accessibilityLabel={title + ': ' + (completed ? 'tamamlanıb' : active ? 'davam et' : locked ? 'hələ açılmayıb' : 'aç')}
      accessibilityState={{ disabled: locked }} disabled={locked} onPress={onPress}
      style={({ pressed }) => [s.node, active && s.activeNode, completed && s.doneNode, locked && s.lockedNode, pressed && s.pressed]}>
      <Text style={[s.nodeEmoji, locked && s.lockedEmoji]}>{LESSON_ICONS[index]}</Text>
      {completed && <View style={s.smallCheck}><Text style={s.checkText}>✓</Text></View>}
    </Pressable>
    {active && <View style={s.activeCaption}>
      <Text style={s.activeTitle} numberOfLines={2}>{title}</Text>
      <Text style={s.activeCTA}>Başla ›</Text>
    </View>}
  </View>;
}

function TopicPanel({ item, completedIds, onOpen }: {
  item: HomeModuleItem; completedIds: readonly string[]; onOpen: (id: string) => void;
}) {
  const ids = getModuleById(item.id)?.lessonIds ?? [];
  const titles = ids.map(id => getLessonById(id)?.titleAz ?? 'Dərs');
  const completed = new Set(completedIds);
  const next = ids.findIndex(id => !completed.has(id));
  const disabled = item.state === 'locked' || item.state === 'planned';
  return <View style={s.topicPanel}>
    <Svg pointerEvents="none" width="100%" height="100%" viewBox="0 0 360 570" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
      <Path d="M95 13 C165 -5 223 20 282 11 C341 18 341 81 346 118 C375 171 342 214 351 255 C370 300 335 333 345 375 C358 434 325 493 273 528 C217 568 145 552 103 540 C40 524 17 472 20 419 C7 382 31 335 16 292 C-4 249 19 210 17 169 C5 112 34 85 57 55 C65 31 77 19 95 13Z" fill="#F0E1FF" stroke="#E2BFFF" strokeWidth="5" />
    </Svg>
    <View style={s.topicHeading}>
      <Text style={s.topicTitle}>Bölmə {item.order} · {item.title}</Text>
      <View style={s.progressPill}><Text style={s.progressText}>{item.completedCount}/{item.lessonsCount} dərs · {item.percent}%</Text></View>
    </View>
    <View style={s.nodeCanvas}>
      <Svg pointerEvents="none" width="100%" height="100%" viewBox="0 0 330 480" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
        <Path d="M76 43 C147 45 181 47 228 47 C269 70 150 104 100 149 C58 178 178 197 233 210 C285 243 97 282 75 302 C23 351 183 360 233 379 C250 411 132 436 133 453" fill="none" stroke="#D8A5ED" strokeWidth="2.5" strokeDasharray="4 6" strokeLinecap="round" />
      </Svg>
      {titles.slice(0, 7).map((title, index) => <LearningNode key={item.id + '-' + ids[index]} index={index} title={title}
        completed={completed.has(ids[index])} active={!disabled && index === next}
        locked={disabled || (next >= 0 && index > next)} onPress={() => onOpen(item.id)} />)}
    </View>
  </View>;
}

export function HomeDashboard({ course, xp, compact = false, topInset = 0, onSelect, onOpen, onNavigate }: {
  course: HomeCourse; language: string; level: string; xp: number; compact?: boolean; topInset?: number;
  onSelect: () => void; onOpen: (id: string) => void; onNavigate?: (destination: Destination) => void;
}) {
  const streak = useUserStore(s => s.streak);
  const completedIds = useUserStore(s => s.completedLessons);
  const topic = course.items.find(item => item.lessonsCount > 0 && item.state === 'current')
    ?? course.items.find(item => item.lessonsCount > 0 && item.state !== 'locked')
    ?? course.items.find(item => item.lessonsCount > 0);
  const preview = course.items.find(item => item.id !== topic?.id);
  const { width } = useWindowDimensions();
  const narrow = compact || width < 370;
  return <LinearGradient colors={['#FAF6FF', '#F4ECFF', '#F1E6FB']} style={s.screen}>
    <StatusBar style="dark" />
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[s.scroll, { paddingTop: topInset + 14 }]}>
      <View style={s.content}>
        <View style={s.topRow}>
          <Pressable accessibilityRole="button" accessibilityLabel="Dil və səviyyə seç" onPress={onSelect}>
            <Text style={[s.logo, narrow && { fontSize: 25 }]}><Text style={s.spark}>✦ </Text>Bir<Text style={s.orange}>Talk</Text></Text>
          </Pressable>
          <View style={s.badges}>
            <View style={s.badge}><Text style={s.badgeText}>🔥 {streak} gün</Text></View>
            <View style={s.badge}><Text style={s.badgeText}>⭐ {xp}</Text></View>
          </View>
        </View>
        <View style={s.greetingRow}>
          <Text style={[s.greeting, narrow && { fontSize: 31 }]}>Salam, Leyla!</Text>
          <Image source={require('../../../assets/onboarding/welcome.png')} style={s.mascot} resizeMode="contain" accessible={false} />
        </View>
        <View style={s.actions}>
          <Pressable accessibilityRole="button" onPress={() => onNavigate?.('profile')} style={[s.action, s.analysisAction]}>
            <Text style={s.actionEmoji}>📊</Text><Text style={s.actionLabel}>Analiz</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityState={{ disabled: !topic || topic.state === 'locked' }} disabled={!topic || topic.state === 'locked'}
            onPress={() => topic && onOpen(topic.id)} style={[s.action, s.aiAction]}>
            <Text style={s.actionEmoji}>🤖</Text><Text style={s.actionLabel}>AI söhbət</Text>
          </Pressable>
        </View>
        {topic ? <TopicPanel item={topic} completedIds={completedIds} onOpen={onOpen} />
          : <View style={s.empty}><Text style={s.emptyText}>Bu seçim üçün mövzular hələ hazırlanır.</Text></View>}
        {preview && <Pressable disabled={preview.state === 'planned'} onPress={() => onOpen(preview.id)} accessibilityRole="button"
          accessibilityState={{ disabled: preview.state === 'planned' }} style={s.preview}>
          <Text style={s.previewTitle}>Bölmə {preview.order} · {preview.title}</Text>
          <Text style={s.previewLock}>{preview.state === 'planned' ? '🔒 Tezliklə' : preview.state === 'locked' ? '🔒 Kilidli' : 'Dərslərə bax ›'}</Text>
        </Pressable>}
      </View>
    </ScrollView>
  </LinearGradient>;
}

const NAV: { id: Destination; label: string; icon: 'home' | 'repeat' | 'book' | 'person' }[] = [
  { id: 'learn', label: 'Öyrən', icon: 'home' },
  { id: 'review', label: 'Təkrar', icon: 'repeat' },
  { id: 'vocabulary', label: 'Lüğətim', icon: 'book' },
  { id: 'profile', label: 'Profil', icon: 'person' },
];
export function HomeNavigation({ bottomInset = 0, onNavigate }: {
  bottomInset?: number; onNavigate: (destination: Destination) => void;
}) {
  return <View style={[s.nav, { paddingBottom: Math.max(10, bottomInset) }]}>
    {NAV.map(item => <Pressable key={item.id} accessibilityRole="tab" accessibilityState={{ selected: item.id === 'learn' }} onPress={() => onNavigate(item.id)}
      style={[s.navItem, item.id === 'learn' && s.navActive]}>
      <HomeIcon name={item.icon} size={27} color={item.id === 'learn' ? '#8B22D8' : '#75529D'} filled={item.id === 'learn'} />
      <Text style={[s.navText, item.id === 'learn' && s.navTextActive]}>{item.label}</Text>
    </Pressable>)}
  </View>;
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { paddingHorizontal: 14, paddingBottom: 12 },
  content: { alignSelf: 'center', width: '100%', maxWidth: 510 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logo: { color: INK, fontSize: 29, fontWeight: '900', letterSpacing: -1.4 },
  spark: { color: PURPLE }, orange: { color: ORANGE },
  badges: { flexDirection: 'row', gap: 6 },
  badge: { backgroundColor: '#FFF9FF', borderRadius: 24, borderWidth: 1, borderColor: '#E6D2FC', paddingVertical: 8, paddingHorizontal: 9, shadowColor: '#B98BE8', shadowOpacity: 0.14, shadowRadius: 5, elevation: 2 },
  badgeText: { fontSize: 12, color: INK, fontWeight: '800' },
  greetingRow: { height: 94, marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 31, fontWeight: '900', letterSpacing: -1, color: INK, flexShrink: 1 },
  mascot: { width: 108, height: 105, marginRight: 2, marginTop: 0 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 2, marginBottom: 12 },
  action: { flex: 1, minHeight: 51, borderRadius: 27, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6, borderWidth: 1, shadowColor: '#8C46C1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.16, shadowRadius: 8, elevation: 3 },
  analysisAction: { backgroundColor: '#F5E9FF', borderColor: '#E3C5FF' },
  aiAction: { backgroundColor: '#FFF0E6', borderColor: '#FFD2BB' },
  actionEmoji: { fontSize: 23 },
  actionLabel: { fontSize: 15, fontWeight: '800', color: INK },
  topicPanel: { height: 560, borderRadius: 62, position: 'relative', paddingTop: 24, marginBottom: 12, marginHorizontal: 0, shadowColor: '#B675D9', shadowOpacity: 0.1, shadowRadius: 7 },
  topicHeading: { alignItems: 'center', paddingHorizontal: 14, zIndex: 1 },
  topicTitle: { fontSize: 19, fontWeight: '900', color: INK, textAlign: 'center' },
  progressPill: { backgroundColor: '#E5C5FF', borderRadius: 30, paddingVertical: 4, paddingHorizontal: 16, marginTop: 7 },
  progressText: { color: '#7731BC', fontSize: 13, fontWeight: '800' },
  nodeCanvas: { height: 480, width: '100%', position: 'relative', marginTop: 7 },
  nodeWrap: { position: 'absolute', alignItems: 'center', width: 88 },
  node: { width: 70, height: 68, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FDFBFF', borderColor: '#E4D4FB', borderWidth: 2, shadowColor: '#874DBB', shadowOpacity: 0.17, shadowRadius: 7, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  activeNode: { backgroundColor: '#FFAB40', borderColor: '#FFD67C', shadowColor: '#F58D24', shadowOpacity: 0.3, elevation: 5 },
  doneNode: { backgroundColor: '#FBF7FF' },
  lockedNode: { backgroundColor: '#F8F5FC', borderColor: '#E9DDED', opacity: 0.88 },
  nodeEmoji: { fontSize: 33 },
  lockedEmoji: { opacity: 0.48 },
  smallCheck: { position: 'absolute', right: -3, top: -7, backgroundColor: '#42BF7F', width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  checkText: { color: '#FFF', fontSize: 17, fontWeight: '900' },
  activeCaption: { width: 126, alignItems: 'center', marginTop: 5 },
  activeTitle: { color: INK, fontSize: 12, fontWeight: '800', textAlign: 'center' },
  activeCTA: { backgroundColor: '#FF972F', color: '#FFFFFF', fontWeight: '800', overflow: 'hidden', borderRadius: 20, paddingVertical: 4, paddingHorizontal: 16, marginTop: 4 },
  preview: { alignItems: 'center', backgroundColor: '#DFF4FF', borderColor: '#B9E5FF', borderWidth: 2, borderRadius: 43, minHeight: 108, justifyContent: 'center', paddingHorizontal: 16, marginBottom: 6 },
  previewTitle: { fontSize: 18, fontWeight: '800', color: INK, textAlign: 'center' },
  previewLock: { marginTop: 8, color: '#8A86A6', fontSize: 14, fontWeight: '700' },
  empty: { marginTop: 30, borderRadius: 30, padding: 35, backgroundColor: '#F7EDFF' },
  emptyText: { color: INK, fontWeight: '700', textAlign: 'center' },
  pressed: { opacity: .82 },
  nav: { flexDirection: 'row', backgroundColor: '#FAF5FF', borderTopLeftRadius: 36, borderTopRightRadius: 36, borderWidth: 1, borderColor: '#E9D8FC', paddingHorizontal: 8, paddingTop: 8, shadowColor: '#B27CE1', shadowOpacity: .14, shadowRadius: 8, elevation: 7 },
  navItem: { flex: 1, minHeight: 60, alignItems: 'center', justifyContent: 'center', gap: 4, borderRadius: 28 },
  navActive: { backgroundColor: '#EAD1FF' },
  navText: { color: '#7B579D', fontSize: 13, fontWeight: '700' },
  navTextActive: { color: '#7E25C7', fontWeight: '900' },
});
