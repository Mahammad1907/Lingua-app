import { StyleSheet, Text, View } from 'react-native';
import type { PacketLesson } from '../../data/b1PacketTypes';
import { lessonIntroduction } from '../../utils/lessonGuide';
import { ink, Surface, LessonIcon } from './ApprovedLessonSurface';
import LessonMascot from './LessonMascot';
export default function LessonWelcome({ packet, compact, sceneHeight }: { packet: PacketLesson; compact: boolean; sceneHeight: number }) {
  const intro = lessonIntroduction(packet);
  return <View style={s.welcome}>
    <Text style={s.label}>İlk tanışlıq</Text>
    <Text accessibilityRole="header" style={[s.title, compact && { fontSize: 29, lineHeight: 35 }]}>{packet.title}</Text>
    <Text style={s.subtitle}>{intro.subtitle}</Text>
    <LessonMascot height={Math.max(100, Math.min(sceneHeight, 180))} />
    <Surface><Text style={s.kicker}>Bu dərsdə</Text>{intro.objectives.map((text, index) => <View key={text} style={[s.objective, index === intro.objectives.length - 1 && { borderBottomWidth: 0 }]}><View style={s.icon}><LessonIcon name={(['check', 'book', 'check'] as const)[index % 3]} size={27} /></View><Text style={s.objectiveText}>{text}</Text></View>)}</Surface>
  </View>;
}
const s = StyleSheet.create({ welcome: { gap: 12 }, label: { alignSelf: 'flex-start', color: ink.violet, backgroundColor: '#E4D3F9', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, fontSize: 14, fontWeight: '700' }, title: { color: ink.text, fontSize: 33, lineHeight: 39, fontWeight: '800', letterSpacing: -.8 }, subtitle: { color: ink.muted, fontSize: 16, lineHeight: 23 }, kicker: { color: ink.text, fontSize: 22, fontWeight: '800', marginBottom: 3 }, objective: { flexDirection: 'row', gap: 16, alignItems: 'center', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#E0CCF3' }, icon: { width: 42, borderRightWidth: 1, borderColor: ink.border, alignItems: 'flex-start' }, objectiveText: { flex: 1, color: ink.text, fontSize: 16, lineHeight: 22, fontWeight: '600' } });
