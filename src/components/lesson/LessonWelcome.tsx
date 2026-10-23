import { StyleSheet, Text, View } from 'react-native';
import type { PacketLesson } from '../../data/b1PacketTypes';
import { lessonIntroduction } from '../../utils/lessonGuide';
import { newLessonWords } from '../../utils/lessonVocabulary';
import { b1Packet } from '../../data/b1Course';
import { ClassroomScene, ink, Surface } from './LessonSurface';

export default function LessonWelcome({ packet, compact, sceneHeight }: { packet: PacketLesson; compact: boolean; sceneHeight: number }) {
  const intro = lessonIntroduction(packet);
  return <View style={s.welcome}>
    <View style={s.label}><Text style={s.labelText}>DƏRS {packet.order}</Text></View>
    <Text accessibilityRole="header" style={[s.title, compact && { fontSize: 28, lineHeight: 34 }]}>{packet.title}</Text>
    <Text style={s.subtitle}>{intro.subtitle}</Text>
    <View style={s.scene}><ClassroomScene text={intro.board} height={sceneHeight} freshWords={newLessonWords(packet, b1Packet)} welcome /></View>
    <Surface accent="violet"><Text style={s.kicker}>BU DƏRSDƏ ÖYRƏNƏCƏKSƏN</Text>
      {intro.objectives.map((text, index) => <View key={text} style={[s.objective, compact && { paddingVertical: 7 }]}><Text style={s.icon}>{['💬', '👋', '🗨️'][index]}</Text><Text style={s.objectiveText}>{text}</Text></View>)}
    </Surface>
    <Text style={s.caption}>Dinlə, məşq et və özün cavab ver.</Text>
  </View>;
}
const s = StyleSheet.create({
  welcome: { gap: 6 }, label: { alignSelf: 'flex-start', paddingHorizontal: 13, paddingVertical: 5, backgroundColor: '#201D57', borderWidth: 1, borderColor: '#3F329C', borderRadius: 16 }, labelText: { color: ink.violet, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  title: { color: ink.text, fontSize: 33, lineHeight: 39, fontWeight: '800', letterSpacing: -.8 }, subtitle: { color: '#BDB0F2', fontSize: 16, lineHeight: 23 }, scene: { marginHorizontal: -20, marginBottom: -7 },
  kicker: { color: '#C2B2FF', fontSize: 11, lineHeight: 16, fontWeight: '800', letterSpacing: 1, marginBottom: 3 }, objective: { flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 15, borderWidth: 1, borderColor: '#4A3C9C', backgroundColor: '#181941' }, icon: { fontSize: 23 }, objectiveText: { flex: 1, color: ink.text, fontSize: 15, lineHeight: 21, fontWeight: '600' }, caption: { textAlign: 'center', color: ink.violet, fontSize: 12, lineHeight: 18, marginTop: 3 },
});

