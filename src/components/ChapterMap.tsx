import { Stack, useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Lesson } from '../data/types';
import { useUserStore } from '../store/userStore';
import { lessonTheme as t } from '../constants/lessonTheme';
import { BirFoxPortrait } from './BirTalkArtwork';
import EnergyMeter from './EnergyMeter';
export default function ChapterMap({ lessons }: { lessons: Lesson[] }) {
  const router = useRouter(); const insets = useSafeAreaInsets();
  const completed = useUserStore(s => s.completedLessons);
  const passed = useUserStore(s => s.placementResults.some(p => p.moduleId === 'module_1' && p.passed));
  const { width } = useWindowDimensions(); const available = width - 32;
  const compact = width < 360; const rowHeight = 166;
  const nodes = lessons.map((lesson, index) => ({ lesson, x: index % 2 ? available * .14 : 0, y: 40 + index * rowHeight }));
  const path = nodes.map((node, i) => { const x = node.x + 39; const y = node.y + 45; if (!i) return `M ${x} ${y}`; const prev = nodes[i - 1]; const mid = (prev.y + node.y) / 2 + 45; return `C ${prev.x + 39} ${mid}, ${x} ${mid}, ${x} ${y}`; }).join(' ');
  const done = lessons.filter(l => completed.includes(l.id)).length;
  const open = (lesson: Lesson) => router.push({ pathname: '/lesson/session', params: { id: lesson.id } });
  return <View style={[styles.screen, { paddingTop: insets.top }]}><Stack.Screen options={{ headerShown: false }} />
    <View style={styles.header}><TouchableOpacity onPress={() => router.back()} accessibilityLabel="Geri" style={styles.back}><Text style={styles.backText}>‹</Text></TouchableOpacity><View style={{ flex: 1 }}><Text style={styles.eyebrow}>BİRTALK · A1</Text><Text style={styles.title}>İlk tanışlıq</Text></View><EnergyMeter /></View>
    <ScrollView contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 20) }} showsVerticalScrollIndicator={false}>
      <View style={styles.intro}><BirFoxPortrait size={46} /><View style={{ flex: 1 }}><Text style={styles.introTitle}>BirFox ilə ilk söhbətin</Text><Text style={styles.subtitle}>{done}/{lessons.length} dərs · Dinlə, öyrən, danış</Text></View></View>
      <TouchableOpacity style={styles.test} onPress={() => router.push('/module/check')}><Text style={styles.testText}>Bunları artıq bilirəm · Sınaqdan keç  ↗</Text></TouchableOpacity>
      <View style={{ marginHorizontal: 16, height: nodes.length * rowHeight + 50 }}>
        <Image source={require('../../assets/birtalk/chapter-world.png')} resizeMode="stretch" style={StyleSheet.absoluteFill} />
        <Svg width={available} height={nodes.length * rowHeight + 50} style={StyleSheet.absoluteFill} pointerEvents="none"><Path d={path} fill="none" stroke="#8674DC" strokeWidth={3} strokeDasharray="5 10" strokeLinecap="round" /></Svg>
        {nodes.map(({ lesson, x, y }, i) => {
          const isDone = completed.includes(lesson.id);
          const unlocked = i === 0 || completed.includes(lessons[i - 1].id) || isDone || (passed && i === lessons.length - 1);
          return <TouchableOpacity key={lesson.id} disabled={!unlocked} accessibilityRole="button" accessibilityState={{ disabled: !unlocked }} onPress={() => open(lesson)} activeOpacity={.85} style={[styles.node, { left: x, top: y, width: available * .86, borderColor: isDone ? '#5AC99E' : unlocked ? '#EE914A' : '#43375D' }]}>
            <View style={[styles.portrait, { borderColor: isDone ? '#5AC99E' : unlocked ? '#EE914A' : '#43375D' }]}><BirFoxPortrait size={68} variant={[0, 1, 2, 3, 4, 5][i % 6]} /><View style={styles.badge}><Text style={{ color: isDone ? t.success : t.orange }}>{isDone ? '✓' : unlocked ? '▶' : '⌑'}</Text></View></View>
            <View style={{ flex: 1, marginLeft: 10 }}><Text style={[styles.nodeTitle, { fontSize: compact ? 13 : 15, color: unlocked ? t.text : t.muted }]} numberOfLines={2}>{i + 1}. {lesson.titleAz}</Text><Text style={styles.subtitle}>{isDone ? 'Tamamlandı · Təkrar et' : unlocked ? `${lesson.estimatedTime || 7} dəq · Başla` : 'Əvvəlki dərsdən sonra açılır'}</Text></View>
          </TouchableOpacity>;
        })}
      </View>
    </ScrollView>
  </View>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#100E22' }, header: { padding: 16, flexDirection: 'row', alignItems: 'center', gap: 10 }, back: { width: 30, minHeight: 44, justifyContent: 'center' }, backText: { fontSize: 36, color: t.text }, eyebrow: { color: t.orange, fontSize: 10, letterSpacing: 1.5 }, title: { color: t.text, fontSize: 26, fontWeight: '800', marginTop: 4 }, intro: { flexDirection: 'row', gap: 12, alignItems: 'center', margin: 16, padding: 16, backgroundColor: '#211B36', borderRadius: 22, borderWidth: 1, borderColor: '#3B3154' }, introTitle: { color: t.text, fontSize: 15, fontWeight: '700' }, subtitle: { color: t.muted, fontSize: 10, lineHeight: 15, marginTop: 6 }, test: { alignSelf: 'center', padding: 12 }, testText: { color: t.orange, fontSize: 12, fontWeight: '600' }, node: { position: 'absolute', height: 98, backgroundColor: '#19152DEB', borderRadius: 49, borderWidth: 1.5, flexDirection: 'row', alignItems: 'center', paddingLeft: 5, paddingRight: 14 }, portrait: { width: 76, height: 76, borderWidth: 2, borderRadius: 38, justifyContent: 'center', alignItems: 'center' }, badge: { position: 'absolute', right: -3, bottom: -3, backgroundColor: '#211B36', borderRadius: 13, width: 25, height: 25, alignItems: 'center', justifyContent: 'center' }, nodeTitle: { fontWeight: '800', lineHeight: 21 } });
