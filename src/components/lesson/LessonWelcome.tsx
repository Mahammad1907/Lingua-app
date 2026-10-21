import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { PacketLesson } from '../../data/b1PacketTypes';
import { lessonIntroduction } from '../../utils/lessonGuide';
import { welcomeSceneHeight } from '../../utils/lessonPresentation';
import { ClassroomScene, ink, Surface } from './LessonSurface';

export default function LessonWelcome({ packet, compact, availableHeight }: { packet: PacketLesson; compact: boolean; availableHeight: number }) {
  const intro = lessonIntroduction(packet);
  const [topHeight, setTopHeight] = useState(145), [goalsHeight, setGoalsHeight] = useState(180);
  const sceneHeight = welcomeSceneHeight(availableHeight, topHeight, goalsHeight);
  const title = packet.order === 1 ? packet.title.replace(' və ', ' və\n') : packet.title;
  return <View style={s.welcome}>
    <View onLayout={event => setTopHeight(event.nativeEvent.layout.height)} style={s.top}>
      <View style={s.label}><Text style={s.labelText}>DƏRS {packet.order}</Text></View>
      <Text accessibilityRole="header" style={[s.title, compact && { fontSize: 29, lineHeight: 35 }]}>{title}</Text>
      <Text style={s.subtitle}>{intro.subtitle}</Text>
    </View>
    <View style={s.scene}><ClassroomScene text={intro.board} height={sceneHeight} welcome fit="contain" /></View>
    <View onLayout={event => setGoalsHeight(event.nativeEvent.layout.height)}>
      <Surface accent="violet"><Text style={s.kicker}>BU DƏRSDƏ ÖYRƏNƏCƏKSƏN</Text>
        {intro.objectives.map((text, index) => <View key={text} style={[s.objective, compact && { paddingVertical: 8 }]}><Text style={s.icon}>{['💬', '👋', '🗨️'][index]}</Text><Text style={s.objectiveText}>{text}</Text></View>)}
      </Surface>
    </View>
    <Text style={s.caption}>Dinlə, məşq et və özün cavab ver.</Text>
  </View>;
}
const s = StyleSheet.create({
  welcome: { gap: 12 }, top: { gap: 9 }, label: { alignSelf: 'flex-start', paddingHorizontal: 13, paddingVertical: 5, backgroundColor: '#201D57', borderWidth: 1, borderColor: '#3F329C', borderRadius: 16 }, labelText: { color: ink.violet, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  title: { color: ink.text, fontSize: 33, lineHeight: 39, fontWeight: '800', letterSpacing: -.5, flexShrink: 1 }, subtitle: { color: '#BDB0F2', fontSize: 15, lineHeight: 22 }, scene: { marginHorizontal: -20 },
  kicker: { color: '#C2B2FF', fontSize: 10, lineHeight: 16, fontWeight: '800', letterSpacing: 1, marginBottom: 3 }, objective: { flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 11, paddingHorizontal: 12, borderRadius: 15, borderWidth: 1, borderColor: '#4A3C9C', backgroundColor: '#181941' }, icon: { fontSize: 22 }, objectiveText: { flex: 1, color: ink.text, fontSize: 14, lineHeight: 20, fontWeight: '600' }, caption: { textAlign: 'center', color: ink.violet, fontSize: 12, lineHeight: 18 },
});
