import type { PropsWithChildren } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ink } from './LessonSurface';

export default function LessonExplanationCard({ visible, onClose, children }: PropsWithChildren<{ visible: boolean; onClose: () => void }>) {
  const insets = useSafeAreaInsets(), reduced = useReducedMotion();
  return <Modal visible={visible} transparent animationType={reduced ? 'none' : 'fade'} onRequestClose={onClose}>
    <View style={[s.overlay, { paddingTop: Math.max(24, insets.top), paddingBottom: Math.max(24, insets.bottom) }]}>
      <Pressable accessible={false} style={StyleSheet.absoluteFill} onPress={onClose} />
      <View accessibilityViewIsModal style={s.card}>
        <View style={s.header}><Text accessibilityRole="header" style={s.title}>Mənə başa sal</Text><Pressable accessibilityRole="button" accessibilityLabel="İzahı bağla" onPress={onClose} style={s.close}><Text style={s.cross}>×</Text></Pressable></View>
        <ScrollView style={s.scroll} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">{children}</ScrollView>
        <Pressable accessibilityRole="button" onPress={onClose} style={s.done}><Text style={s.doneText}>Başa düşdüm</Text></Pressable>
      </View>
    </View>
  </Modal>;
}
const s = StyleSheet.create({ overlay: { flex: 1, backgroundColor: '#040617CF', justifyContent: 'center', paddingHorizontal: 22 }, card: { width: '100%', maxWidth: 500, maxHeight: '85%', alignSelf: 'center', borderRadius: 24, borderWidth: 1, borderColor: '#8570BA', backgroundColor: '#1A1934', overflow: 'hidden' }, header: { flexDirection: 'row', alignItems: 'center', paddingLeft: 18, paddingRight: 8, borderBottomWidth: 1, borderBottomColor: ink.border }, title: { flex: 1, color: ink.text, fontSize: 18, lineHeight: 25, fontWeight: '800' }, close: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }, cross: { color: ink.violet, fontSize: 28 }, scroll: { flexGrow: 0 }, content: { padding: 18, gap: 14 }, done: { minHeight: 48, alignItems: 'center', justifyContent: 'center', margin: 14, borderRadius: 15, backgroundColor: '#35294F' }, doneText: { color: ink.violet, fontSize: 14, fontWeight: '700' } });
