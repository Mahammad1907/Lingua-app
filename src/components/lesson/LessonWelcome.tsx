import { StyleSheet, Text, View } from 'react-native';
import type { PacketLesson } from '../../data/b1PacketTypes';
import { lessonIntroduction } from '../../utils/lessonGuide';
import { ink, Surface } from './ApprovedLessonSurface';
import LessonMascot from './LessonMascot';
export default function LessonWelcome({ packet, compact, sceneHeight }: { packet: PacketLesson; compact: boolean; sceneHeight: number }) {
  const intro = lessonIntroduction(packet);
  return <View style={s.welcome}>
    <Text style={s.label}>İlk tanışlıq</Text>
    <Text accessibilityRole="header" style={[s.title, compact && { fontSize: 29, lineHeight: 35 }]}>{packet.title}</Text>
    <Text style={s.subtitle}>{intro.subtitle}</Text>
    <LessonMascot height={Math.max(100, Math.min(sceneHeight, 180))} />
    <Surface><Text style={s.kicker}>Bu dərsdə</Text>{intro.objectives.map((text, index) => <View key={text} style={s.objective}><Text style={s.icon}>{['👋', '💬', '↗'][index]}</Text><Text style={s.objectiveText}>{text}</Text></View>)}</Surface>
  </View>;
}
const s = StyleSheet.create({ welcome: { gap: 12 }, label: { alignSelf: 'flex-start', color: ink.violet, backgroundColor: '#E4D3F9', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, fontSize: 14, fontWeight: '700' }, title: { color: ink.text, fontSize: 33, lineHeight: 39, fontWeight: '800', letterSpacing: -.8 }, subtitle: { color: ink.muted, fontSize: 16, lineHeight: 23 }, kicker: { color: ink.text, fontSize: 22, fontWeight: '800', marginBottom: 3 }, objective: { flexDirection: 'row', gap: 16, alignItems: 'center', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#E0CCF3' }, icon: { fontSize: 22, width: 30, color: ink.violet }, objectiveText: { flex: 1, color: ink.text, fontSize: 16, lineHeight: 22, fontWeight: '600' } });
