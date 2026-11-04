import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View, type ViewStyle } from 'react-native';
import { getModuleById } from '../../data/modules';
import { useUserStore } from '../../store/userStore';
import type { HomeCourse } from '../../utils/homeCourse';
import { HomeDashboard as OriginalHomeDashboard } from './HomeDashboard';

export { HOME_LANGUAGES } from './HomeDashboard';
export type { HomeDestination } from './HomeDashboard';

type Destination = 'learn' | 'review' | 'vocabulary' | 'profile';
const ART_WIDTH = 682;
const ART_HEIGHT = 1312;
const LEFT = 43;
const TOP = 83;
const FOOTER_RATIO = 122 / 691;

// Pixel coordinates refer only to the user's approved 768 x 1536 reference image.
// The image is decorative; every tap target below remains a native Pressable.
function hotspot(x: number, y: number, width: number, height: number, scale: number): ViewStyle {
  return { position: 'absolute', left: (x - LEFT) * scale, top: (y - TOP) * scale,
    width: width * scale, height: height * scale };
}

const LESSON_RECTS = [
  [154, 507, 138, 139], [437, 507, 150, 141], [181, 657, 146, 142],
  [460, 722, 157, 143], [146, 852, 145, 148], [396, 967, 137, 131],
  [220, 1037, 145, 130],
] as const;

export function HomeDashboard({ course, language, level, xp, compact = false, topInset = 0, onSelect, onOpen, onNavigate }: {
  course: HomeCourse; language: string; level: string; xp: number; compact?: boolean; topInset?: number;
  onSelect: () => void; onOpen: (id: string) => void; onNavigate?: (destination: Destination) => void;
}) {
  const { width } = useWindowDimensions();
  const streak = useUserStore(s => s.streak);
  const completed = useUserStore(s => s.completedLessons);
  const module = course.items.find(item => item.order === 1 && item.lessonsCount > 0);
  const preview = course.items.find(item => item.order === 2);
  const renderedReference = language === 'en' && level === 'A1' && Boolean(module);
  const imageWidth = Math.min(width, 510);
  const scale = imageWidth / ART_WIDTH;

  // The supplied screenshot is the English first-section reference only. For other
  // selections, preserve the original real-data home instead of faking modules.
  if (!renderedReference || !module) {
    return <OriginalHomeDashboard course={course} language={language} level={level} xp={xp}
      compact={compact} topInset={topInset} onSelect={onSelect} onOpen={onOpen} />;
  }

  const ids = getModuleById(module.id)?.lessonIds ?? [];
  const next = ids.findIndex(id => !completed.includes(id));
  const moduleLocked = module.state === 'locked' || module.state === 'planned';
  return <LinearGradient colors={['#F8F0FF', '#F4EAFE']} style={s.screen}>
    <StatusBar style="dark" />
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[s.scroll, { paddingTop: topInset }]}
      accessibilityLabel="Öyrənmə ana səhifəsi">
      <View style={{ width: imageWidth, height: ART_HEIGHT * scale, position: 'relative' }}>
        <Image source={require('../../../assets/home/approved_reference_body.webp')}
          style={{ width: imageWidth, height: ART_HEIGHT * scale }} resizeMode="stretch" accessible={false} />
        <Pressable accessibilityRole="button" accessibilityLabel="Dil və səviyyə seç"
          onPress={onSelect} style={hotspot(65, 91, 252, 70, scale)} />
        {/* Mask only the mock statistics from the design image, not the real values. */}
        <View style={[s.metric, hotspot(399, 91, 165, 61, scale)]} pointerEvents="none">
          <Text style={[s.metricText, { fontSize: Math.max(12, 24 * scale) }]}>🔥 {streak} gün</Text>
        </View>
        <View style={[s.metric, hotspot(573, 91, 136, 61, scale)]} pointerEvents="none">
          <Text style={[s.metricText, { fontSize: Math.max(12, 24 * scale) }]}>⭐ {xp}</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Analiz" onPress={() => onNavigate?.('profile')}
          style={hotspot(81, 301, 298, 78, scale)} />
        <Pressable accessibilityRole="button" accessibilityLabel="AI söhbət"
          accessibilityState={{ disabled: moduleLocked }} disabled={moduleLocked}
          onPress={() => onOpen(module.id)} style={hotspot(388, 301, 306, 78, scale)} />
        <View style={[s.liveProgress, hotspot(268, 473, 232, 45, scale)]} pointerEvents="none">
          <Text style={[s.progressText, { fontSize: Math.max(12, 26 * scale) }]}>
            {module.completedCount}/{module.lessonsCount} dərs · {module.percent}%
          </Text>
        </View>
        {LESSON_RECTS.map(([x, y, w, h], index) => {
          if (!ids[index]) return null;
          const blocked = moduleLocked || (next >= 0 && index > next);
          return <Pressable key={ids[index]} accessibilityRole="button" disabled={blocked}
            accessibilityState={{ disabled: blocked }}
            accessibilityLabel={`Dərs ${index + 1}: ${blocked ? 'kilidlidir' : 'bölməni aç'}`}
            onPress={() => onOpen(module.id)} style={hotspot(x, y, w, h, scale)} />;
        })}
        <Pressable accessibilityRole="button" accessibilityLabel="Aktiv dərs üçün Başla"
          accessibilityState={{ disabled: moduleLocked }} disabled={moduleLocked}
          onPress={() => onOpen(module.id)} style={hotspot(474, 926, 141, 52, scale)} />
        {preview && <Pressable disabled={preview.state === 'planned'} accessibilityRole="button"
          accessibilityState={{ disabled: preview.state === 'planned' }}
          accessibilityLabel={`Bölmə ${preview.order}: ${preview.title}`}
          onPress={() => onOpen(preview.id)} style={hotspot(54, 1244, 660, 146, scale)} />}
      </View>
    </ScrollView>
  </LinearGradient>;
}

const NAV: { id: Destination; label: string }[] = [
  { id: 'learn', label: 'Öyrən' }, { id: 'review', label: 'Təkrar' },
  { id: 'vocabulary', label: 'Lüğətim' }, { id: 'profile', label: 'Profil' },
];
export function HomeNavigation({ bottomInset = 0, onNavigate }: {
  bottomInset?: number; onNavigate: (destination: Destination) => void;
}) {
  const { width } = useWindowDimensions();
  const height = Math.max(68, width * FOOTER_RATIO);
  return <View style={[s.nav, { height: height + bottomInset, paddingBottom: bottomInset }]}>
    <Image source={require('../../../assets/home/approved_reference_nav.webp')}
      resizeMode="stretch" style={[StyleSheet.absoluteFill, { width: '100%', height: height + bottomInset }]}
      accessible={false} />
    <View style={{ flex: 1, flexDirection: 'row' }}>
      {NAV.map(item => <Pressable key={item.id} accessibilityRole="tab"
        accessibilityLabel={item.label} accessibilityState={{ selected: item.id === 'learn' }}
        onPress={() => onNavigate(item.id)} style={s.navItem} />)}
    </View>
  </View>;
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { alignItems: 'center', paddingBottom: 0 },
  metric: { backgroundColor: '#FAEEFF', borderRadius: 35, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#E8C6FB', shadowColor: '#A76DCB', shadowOpacity: 0.18,
    shadowRadius: 4, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  metricText: { color: '#2B1049', fontWeight: '900' },
  liveProgress: { backgroundColor: '#E6BBFC', borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  progressText: { color: '#8635C4', fontWeight: '900' },
  nav: { backgroundColor: '#F9F2FF', overflow: 'hidden' },
  navItem: { flex: 1, minHeight: 48 },
});
