import { Animated, StyleSheet, Text, View } from 'react-native';
import { useLessonTextMotion } from './LessonTextMotion';
import { ink } from './LessonSurface';

export default function LessonReviewNotice() {
  const motion = useLessonTextMotion('reveal');
  return <Animated.View accessibilityLiveRegion="polite" style={[s.box, { opacity: motion.opacity(0, 1) }]}>
    <Text accessible={false} style={s.icon}>↻</Text><View style={s.copy}><Text accessibilityRole="header" style={s.title}>Etdiyin səhvlərin təkrarı</Text><Text style={s.note}>Bu hissədə çətinlik oldu. İndi başqa vəziyyətdə yenidən yoxlayaq.</Text></View>
  </Animated.View>;
}
const s = StyleSheet.create({ box: { flexDirection: 'row', gap: 10, padding: 12, borderWidth: 1, borderColor: '#7960B4', backgroundColor: '#211B40', borderRadius: 17 }, icon: { fontSize: 26, color: ink.orange, alignSelf: 'center' }, copy: { flex: 1, gap: 3 }, title: { fontSize: 15, lineHeight: 21, fontWeight: '800', color: ink.text }, note: { fontSize: 12, lineHeight: 17, color: '#C5BBE3' } });
