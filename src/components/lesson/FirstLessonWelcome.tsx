import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import LessonMascot from './LessonMascot';

// Exact introduction copy approved in the user's reference. Lesson exercises are untouched.
export const firstWelcomeCopy = {
  subtitle: 'İlk görüş bir salamla başlayır.',
  objectives: ['Salam verməyi', 'Salama cavab verməyi', 'Sağollaşmağı məşq edəcəksən'],
};
function GoalIcon({ index }: { index: number }) {
  return <Svg width={34} height={34} viewBox="0 0 36 36" fill="none" stroke="#650DB7" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" accessible={false}>
    {index === 1 ? <><Path d="M9 5h17a7 7 0 0 1 7 7v9a7 7 0 0 1-7 7H16l-9 6v-8a7 7 0 0 1-4-6v-8a7 7 0 0 1 6-7Z" /><Path d="M11 17h.1m7.9 0h.1m7.9 0h.1" strokeWidth={3.7} /></> : <><Path d="m10 17-2-4a2.2 2.2 0 0 0-4 2l5 11a11 11 0 0 0 19 1l5-12a2.2 2.2 0 0 0-4-2l-3 6 4-12a2.2 2.2 0 0 0-4-1l-4 11 3-13a2.2 2.2 0 0 0-4-.9l-4 13 1-11a2.2 2.2 0 0 0-4-.4l-2 13Z" />{index === 2 ? <><Path d="M4 29a10 10 0 0 1-2-5m5 8a14 14 0 0 1-5-3m28-26a10 10 0 0 1 4 6" /></> : null}</>}
  </Svg>;
}
export default function FirstLessonWelcome({ title, onStart, disabled = false, bottomInset = 0, notice }: { title: string; onStart: () => void; disabled?: boolean; bottomInset?: number; notice?: ReactNode }) {
  const { fontScale } = useWindowDimensions();
  const [available, setAvailable] = useState(0);
  const dense = Boolean(available && available < 620) || fontScale > 1.2;
  return <View testID="reference-first-welcome" onLayout={event => setAvailable(event.nativeEvent.layout.height)} style={[s.screen, { paddingBottom: Math.max(14, bottomInset) }]}>
    <View style={s.heading}>
      <Text style={s.badge}>İlk tanışlıq</Text>
      <Text accessibilityRole="header" style={[s.title, dense && s.denseTitle]}>{title}</Text>
      <Text style={[s.subtitle, dense && { fontSize: 16, lineHeight: 22 }]}>{firstWelcomeCopy.subtitle}</Text>
    </View>
    <View testID="welcome-mascot-area" style={s.hero}>
      <View pointerEvents="none" style={s.halo} />
      <View pointerEvents="none" style={s.ground} />
      <LessonMascot style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
      <Svg pointerEvents="none" width={30} height={29} viewBox="0 0 30 29" fill="none" stroke="#8B2CE8" strokeWidth={3.6} strokeLinecap="round" style={s.spark} accessible={false}><Path d="m6 15 3-9m6 13 7-8m-2 15 7-3" /></Svg>
    </View>
    <View style={[s.goals, dense && { paddingVertical: 10 }]}>
      <Text style={[s.goalsTitle, dense && { fontSize: 22, lineHeight: 28 }]}>Bu dərsdə</Text>
      {firstWelcomeCopy.objectives.map((text, index) => <View key={text} style={[s.goalRow, dense && { minHeight: 43, paddingVertical: 6 }, index === 2 && { borderBottomWidth: 0 }]}>
        <View style={s.goalIcon}><GoalIcon index={index} /></View>
        <Text style={[s.goalText, dense && { fontSize: 15, lineHeight: 21 }]}>{text}</Text>
      </View>)}
    </View>
    {notice}
    <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onStart} style={({ pressed }) => [s.start, pressed && { opacity: .9 }, disabled && { opacity: .45 }]}>
      <LinearGradient colors={['#851BFA', '#5900D1']} start={{ x: .15, y: 0 }} end={{ x: .85, y: 1 }} style={[StyleSheet.absoluteFill, { borderRadius: 28 }]} />
      <Text style={s.startLabel}>Dərsə başla</Text>
      <Svg width={27} height={27} viewBox="0 0 28 28" fill="none" stroke="#FFF" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" accessible={false}><Path d="M4 14h19m-8-7 8 7-8 7" /></Svg>
    </Pressable>
  </View>;
}
const s = StyleSheet.create({
  screen: { flex: 1, minHeight: 0, paddingHorizontal: 28, paddingTop: 8, gap: 13 },
  heading: { paddingHorizontal: 8, gap: 7 },
  badge: { alignSelf: 'flex-start', color: '#7422D4', backgroundColor: '#E1C8F7', borderRadius: 20, paddingHorizontal: 13, paddingVertical: 6, fontSize: 16, lineHeight: 20, fontWeight: '800', marginBottom: 1 },
  title: { color: '#290A2E', fontSize: 32, lineHeight: 36, fontWeight: '800', letterSpacing: -.7 },
  denseTitle: { fontSize: 28, lineHeight: 32 },
  subtitle: { color: '#AA73E5', fontSize: 17, lineHeight: 24, fontWeight: '700' },
  hero: { flex: 1, minHeight: 75, alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute', width: 185, height: 185, maxHeight: '95%', maxWidth: '80%', borderRadius: 100, backgroundColor: '#E2C9F4', opacity: .7 },
  ground: { position: 'absolute', bottom: 5, width: 154, height: 17, borderRadius: 100, backgroundColor: '#D8B6F1', opacity: .65 },
  spark: { position: 'absolute', right: '19%', top: '24%' },
  goals: { borderRadius: 23, borderWidth: 1, borderColor: '#BD94E9', paddingHorizontal: 16, paddingVertical: 13, backgroundColor: '#F5EDFF66', shadowColor: '#9164C7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: .08, shadowRadius: 9 },
  goalsTitle: { color: '#290A2E', fontSize: 25, lineHeight: 31, fontWeight: '800', marginBottom: 5, paddingLeft: 3 },
  goalRow: { minHeight: 50, flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#CDB0EA' },
  goalIcon: { width: 44, minHeight: 32, paddingRight: 10, borderRightWidth: 1, borderRightColor: '#C29BE9', justifyContent: 'center', alignItems: 'center' },
  goalText: { flex: 1, color: '#290A2E', fontSize: 16, lineHeight: 23, fontWeight: '700' },
  start: { minHeight: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, borderRadius: 28, marginTop: 2, shadowColor: '#6412C7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: .2, shadowRadius: 7 },
  startLabel: { color: '#FFF', fontSize: 21, lineHeight: 28, fontWeight: '800' },
});
