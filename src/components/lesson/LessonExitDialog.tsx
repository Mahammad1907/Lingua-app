import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { LessonButton, LessonIcon, Surface, ink } from './LessonSurface';
export default function LessonExitDialog({ visible, onContinue, onExit, busy }: { visible: boolean; onContinue: () => void; onExit: () => void; busy: boolean }) {
  return <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onContinue}>
    <View style={s.overlay}><View accessibilityViewIsModal style={s.dialog}><Surface accent="orange"><LessonIcon name="back" size={30} color={ink.orange} /><Text accessibilityRole="header" style={s.title}>Dərsdən çıxmaq istəyirsən?</Text><Text style={s.body}>Çıxsan, bu dərsdəki cari irəliləyişin silinəcək. Əvvəl tamamladığın dərslər saxlanacaq.</Text><LessonButton label="Dərsə davam et" onPress={onContinue} disabled={busy} /><Pressable accessibilityRole="button" disabled={busy} onPress={onExit} style={s.exit}><Text style={s.exitText}>Çıx</Text></Pressable></Surface></View></View>
  </Modal>;
}
const s = StyleSheet.create({ overlay: { flex: 1, backgroundColor: '#030615D9', justifyContent: 'center', padding: 24 }, dialog: { maxWidth: 420, alignSelf: 'center', width: '100%' }, title: { color: ink.text, fontSize: 22, lineHeight: 29, fontWeight: '800' }, body: { color: ink.muted, fontSize: 15, lineHeight: 23, marginBottom: 12 }, exit: { padding: 14, alignItems: 'center' }, exitText: { color: '#FFB59F', fontSize: 15, fontWeight: '700' } });
