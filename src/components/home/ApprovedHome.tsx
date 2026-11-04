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
  { left: '8%', top: 18 }, { left: '55%', top: 28 },
  { left: '22%', top: 123 }, { left: '56%', top: 207 },
  { left: '9%', top: 271 }, { left: '55%', top: 355 }, { left: '28%', top: 420 },
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
    <Svg pointerEvents="none" width="100%" height="100%" viewBox="0 0 360 650" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
      <Path d="M80 15 C210 -5 345 7 340 105 C345 155 355 184 340 224 C380 318 338 343 342 410 C369 505 327 620 217 627 C128 660 37 626 22 559 C1 480 34 438 15 373 C-8 325 29 285 18 226 C-10 180 17 122 50 91 C47 58 60 30 80 15Z" fill="#F0E1FF" stroke="#E2BFFF" strokeWidth="5" />
    </Svg>
    <View style={s.topicHeading}>
      <Text style={s.topicTitle}>Bölmə {item.order} · {item.title}</Text>
      <View style={s.progressPill}><Text style={s.progressText}>{item.completedCount}/{item.lessonsCount} dərs · {item.percent}%</Text></View>
    </View>
    <View style={s.nodeCanvas}>
      <Svg pointerEvents="none" width="100%" height="100%" viewBox="0 0 330 545" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
        <Path d="M78 65 C143 65 177 68 222 74 C265 96 164 137 110 162 C49 199 181 203 234 248 C300 296 97 306 64 332 C23 390 187 381 225 416 C256 453 112 473 135 495" fill="none" stroke="#D8A5ED" strokeWidth="2.5" strokeDasharray="4 6" strokeLinecap="round" />
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
          <Text style={[s.greeting, narrow && { fontSize: 31 }]}>Salam!</Text>
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
  screen: { flex: 1 }, scroll: { paddingHorizontal: 14, paddingBottom: 14 }, content: { alignSelf: 'center', width: '100%', maxWidth: 510 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, logo: { color: INK, fontSize: 29, fontWeight: '900', letterSpacing: -1.4 }, spark: { color: PURPLE }, orange: { color: ORANGE },
  badges: { flexDirection: 'row', gap: 6 }, badge: { backgroundColor: '#FFF9FF', borderRadius: 24, borderWidth: 1, borderColor: '#E6D2FC', paddingVertical: 8, paddingHorizontal: 9, shadowColor: '#B98BE8', shadowOpacity: 0.14, shadowRadius: 5, elevation: 2 }, badgeText: { fontSize: 12, color: INK, fontWeight: '800' },
  greetingRow: { height: 116, marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, greeting: { fontSize: 37, fontWeight: '900', letterSpacing: -1.2, color: INK }, mascot: { width: 150, height: 135, marginRight: 5, marginTop: 6 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 4, marginBottom: 17 }, action: { flex: 1, minHeight: 58, borderRadius: 28, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6, borderWidth: 1, shadowColor: '#8C46C1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.16, shadowRadius: 8, elevation: 3 },
  analysisAction: { backgroundColor: '#F5E9FF', borderColor: '#E3C5FF' }, aiAction: { backgroundColor: '#FFF0E6', borderColor: '#FFD2BB' }, actionEmoji: { fontSize: 23 }, actionLabel: { fontSize: 17, fontWeight: '800', color: INK },
  topicPanel: { minHeight: 640, borderRadius: 67, position: 'relative', paddingTop: 30, marginBottom: 14, marginHorizontal: 0, shadowColor: '#B675D9', shadowOpacity: 0.1, shadowRadius: 7 },
  topicHeading: { alignItems: 'center', paddingHorizontal: 14 }, topicTitle: { fontSize: 22, fontWeight: '900', color: INK, textAlign: 'center' }, progressPill: { backgroundColor: '#E5C5FF', borderRadius: 30, paddingVertical: 4, paddingHorizontal: 19, marginTop: 10 }, progressText: { color: '#7731BC', fontSize: 15, fontWeight: '800' },
  nodeCanvas: { height: 545, width: '100%', position: 'relative', marginTop: 9 }, nodeWrap: { position: 'absolute', alignItems: 'center', width: 118 }, node: { width: 97, height: 92, borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FDFBFF', borderColor: '#E4D4FB', borderWidth: 2, shadowColor: '#874DBB', shadowOpacity: 0.17, shadowRadius: 7, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  activeNode: { backgroundColor: '#FFAB40', borderColor: '#FFD67C', shadowColor: '#F58D24', shadowOpacity: 0.3, elevation: 5 }, doneNode: { backgroundColor: '#FBF7FF' }, lockedNode: { backgroundColor: '#F4F1F7', borderColor: '#E4DBEA', opacity: 0.76 }, nodeEmoji: { fontSize: 44 }, lockedEmoji: { opacity: 0.3 },
  smallCheck: { position: 'absolute', right: -3, top: -7, backgroundColor: '#42BF7F', width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, checkText: { color: '#FFF', fontSize: 17, fontWeight: '900' },
  activeCaption: { width: 140, alignItems: 'center', marginTop: 4 }, activeTitle: { color: INK, fontSize: 13, fontWeight: '800', textAlign: 'center' }, activeCTA: { backgroundColor: '#FF972F', color: '#FFFFFF', fontWeight: '800', overflow: 'hidden', borderRadius: 20, paddingVertical: 5, paddingHorizontal: 18, marginTop: 4 },
  preview: { alignItems: 'center', backgroundColor: '#DFF4FF', borderColor: '#B9E5FF', borderWidth: 2, borderRadius: 47, minHeight: 130, justifyContent: 'center', paddingHorizontal: 16, marginBottom: 6 }, previewTitle: { fontSize: 20, fontWeight: '800', color: INK, textAlign: 'center' }, previewLock: { marginTop: 8, color: '#8A86A6', fontSize: 14, fontWeight: '700' },
  empty: { marginTop: 30, borderRadius: 30, padding: 35, backgroundColor: '#F7EDFF' }, emptyText: { color: INK, fontWeight: '700', textAlign: 'center' }, pressed: { opacity: .82 },
  nav: { flexDirection: 'row', backgroundColor: '#FAF5FF', borderTopLeftRadius: 36, borderTopRightRadius: 36, borderWidth: 1, borderColor: '#E9D8FC', paddingHorizontal: 8, paddingTop: 8, shadowColor: '#B27CE1', shadowOpacity: .14, shadowRadius: 8, elevation: 7 },
  navItem: { flex: 1, minHeight: 60, alignItems: 'center', justifyContent: 'center', gap: 4, borderRadius: 28 }, navActive: { backgroundColor: '#EAD1FF' }, navText: { color: '#7B579D', fontSize: 13, fontWeight: '700' }, navTextActive: { color: '#7E25C7', fontWeight: '900' },
});
