import { Pressable, StyleSheet, Text } from 'react-native';
import LessonSheet from './LessonSheet';
import { LessonIcon, ink } from './ApprovedLessonSurface';
export default function LessonHelpSheet({ visible, onClose, hint, audio, speaking, onHint, onText, revealed }: { visible: boolean; onClose: () => void; hint: string; audio: boolean; speaking: boolean; onHint: () => void; onText: () => void; revealed: boolean }) {
  return <LessonSheet visible={visible} onClose={onClose} title="Kömək seç">
    <Text style={s.note}>Necə davam etmək istəyirsən?</Text>
    <Pressable accessibilityRole="button" onPress={onHint} style={s.row}><LessonIcon name="hint" /><Text style={s.label}>İpucu</Text></Pressable>
    {revealed ? <Text style={s.body}>{hint}</Text> : null}
    {audio ? <><Pressable accessibilityRole="button" onPress={onText} style={[s.row, s.orange]}><LessonIcon name="book" /><Text style={s.label}>{speaking ? 'Mətni göstər' : 'Mətnlə davam et'}</Text></Pressable><Text style={s.note}>Mətn açıldıqda bu cəhd dinləmə sübutu sayılmayacaq.</Text></> : null}
  </LessonSheet>;
}
const s = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: ink.border, borderRadius: 18, padding: 15, minHeight: 54 }, orange: { backgroundColor: '#FFF0DD', borderColor: '#EBA34A' }, label: { color: ink.text, fontSize: 17, fontWeight: '700' }, note: { color: ink.muted, fontSize: 14, lineHeight: 21 }, body: { color: ink.text, fontSize: 16, lineHeight: 24 } });
