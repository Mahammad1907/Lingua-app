import { View, Text, StyleSheet } from 'react-native';
import { approvedSceneIds, approvedSceneLabels } from '../../utils/approvedLessonScenes';
import ApprovedLessonScene from './ApprovedLessonScene';
import LessonMascot from './LessonMascot';
import LessonSheet from './LessonSheet';
import { ink } from './ApprovedLessonSurface';
export default function LessonArtworkGallery({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return <LessonSheet visible={visible} onClose={onClose} title="Vizual dəsti">
    <Text style={s.note}>Bunlar tətbiqə qoşulmuş şəkillərdir. Səhnə yalnız uyğun kartda görünür; hər tapşırığa yerləşdirilmir.</Text>
    <View style={s.poses}>{(['welcome', 'teaching', 'listening', 'complete'] as const).map(pose => <View key={pose} style={s.pose}><LessonMascot pose={pose} height={110} /></View>)}</View>
    {approvedSceneIds.map(id => <View key={id} style={s.card}><ApprovedLessonScene ids={[id]} height={190} /><Text style={s.label}>{approvedSceneLabels[id]}</Text></View>)}
  </LessonSheet>;
}
const s = StyleSheet.create({ note: { color: ink.muted, fontSize: 15, lineHeight: 22 }, poses: { flexDirection: 'row', gap: 5 }, pose: { flex: 1 }, card: { gap: 7, paddingBottom: 8 }, label: { color: ink.text, fontSize: 15, fontWeight: '600' } });
