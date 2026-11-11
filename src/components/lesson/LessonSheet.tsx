import type { PropsWithChildren, ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { lessonPalette as c } from '../../constants/approvedLessonTheme';

export default function LessonSheet({ visible, onClose, title, children, footer, action }: PropsWithChildren<{
  visible: boolean; onClose: () => void; title: string; footer?: ReactNode; action?: ReactNode;
}>) {
  const insets = useSafeAreaInsets(), reduced = useReducedMotion();
  return <Modal visible={visible} transparent animationType={reduced ? 'none' : 'slide'} onRequestClose={onClose}>
    <KeyboardAvoidingView style={s.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Pressable accessible={false} style={StyleSheet.absoluteFill} onPress={onClose} />
      <View accessibilityViewIsModal style={[s.sheet, { paddingBottom: Math.max(16, insets.bottom), marginTop: insets.top + 20 }]}>
        <View style={s.handle} />
        <View style={s.tools}>{action}<Pressable accessibilityRole="button" accessibilityLabel={`${title} panelini bağla`} onPress={onClose} style={s.close}><Text style={s.cross}>×</Text></Pressable></View>
        <Text accessibilityRole="header" style={s.title}>{title}</Text>
        <ScrollView style={s.scroll} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">{children}</ScrollView>
        {footer ? <View style={s.footer}>{footer}</View> : null}
      </View>
    </KeyboardAvoidingView>
  </Modal>;
}
const s = StyleSheet.create({ overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#24103966' }, sheet: { maxHeight: '92%', width: '100%', maxWidth: 600, alignSelf: 'center', backgroundColor: c.bg, borderTopLeftRadius: 30, borderTopRightRadius: 30, borderWidth: 1, borderColor: c.border, paddingHorizontal: 20 }, handle: { width: 48, height: 5, backgroundColor: '#BE9CE9', borderRadius: 4, alignSelf: 'center', marginTop: 10, marginBottom: 4 }, tools: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8, minHeight: 44 }, close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22, backgroundColor: c.soft }, cross: { color: c.text, fontSize: 28 }, title: { color: c.text, fontSize: 25, lineHeight: 32, fontWeight: '800', marginBottom: 12 }, scroll: { flexGrow: 0 }, content: { paddingBottom: 18, gap: 12 }, footer: { paddingTop: 8 } });
