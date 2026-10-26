import type { PropsWithChildren } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ink } from './LessonSurface';

// Long optional explanations live outside the fixed lesson card.
export default function LessonSheet({ visible, title, onClose, children }: PropsWithChildren<{ visible: boolean; title: string; onClose: () => void }>) {
  const insets = useSafeAreaInsets();
  const reduced = useReducedMotion();
  return <Modal visible={visible} transparent animationType={reduced ? 'none' : 'fade'} onRequestClose={onClose}>
    <View style={[s.overlay, { paddingTop: Math.max(20, insets.top), paddingBottom: Math.max(20, insets.bottom) }]}>
      <View accessibilityViewIsModal style={s.sheet}>
        <View style={s.header}><Text accessibilityRole="header" style={s.title}>{title}</Text><Pressable accessibilityRole="button" accessibilityLabel="İzahı bağla" onPress={onClose} style={s.close}><Text style={s.closeText}>Bağla</Text></Pressable></View>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.content}>{children}</ScrollView>
      </View>
    </View>
  </Modal>;
}
const s = StyleSheet.create({ overlay: { flex: 1, backgroundColor: '#030615E8', justifyContent: 'center', paddingHorizontal: 20 }, sheet: { maxHeight: '90%', width: '100%', maxWidth: 520, alignSelf: 'center', borderRadius: 22, borderWidth: 1, borderColor: ink.border, backgroundColor: ink.card, overflow: 'hidden' }, header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: ink.border }, title: { flex: 1, fontSize: 18, lineHeight: 25, fontWeight: '700', color: ink.text }, close: { minWidth: 54, minHeight: 48, justifyContent: 'center', alignItems: 'center' }, closeText: { color: ink.violet, fontSize: 14 }, content: { padding: 16, gap: 12 } });
