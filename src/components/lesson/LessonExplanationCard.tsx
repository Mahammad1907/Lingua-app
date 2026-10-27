import { useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function LessonExplanationCard({ visible, onClose, children, title = 'Səhv cavabın izahı' }: PropsWithChildren<{ visible: boolean; onClose: () => void; title?: string }>) {
  const insets = useSafeAreaInsets(), reduced = useReducedMotion();
  const [shine] = useState(() => new Animated.Value(0)), [exit] = useState(() => new Animated.Value(0));
  const [width, setWidth] = useState(300);
  const pending = useRef(false), animation = useRef<Animated.CompositeAnimation | null>(null);
  useEffect(() => { pending.current = false; shine.setValue(0); exit.setValue(0); return () => { pending.current = false; animation.current?.stop(); }; }, [visible, shine, exit]);
  const close = () => { pending.current = false; animation.current?.stop(); onClose(); };
  const acknowledge = () => {
    if (pending.current) return;
    if (reduced) { onClose(); return; }
    pending.current = true;
    animation.current = Animated.sequence([
      Animated.timing(shine, { toValue: 1, duration: 280, useNativeDriver: true, isInteraction: false }),
      Animated.timing(exit, { toValue: 1, duration: 180, useNativeDriver: true, isInteraction: false }),
    ]);
    animation.current.start(({ finished }) => { if (finished && pending.current) { pending.current = false; onClose(); } });
  };
  return <Modal visible={visible} transparent animationType={reduced ? 'none' : 'fade'} onRequestClose={close}>
    <View style={[s.overlay, { paddingTop: Math.max(24, insets.top), paddingBottom: Math.max(24, insets.bottom) }]}>
      <Pressable accessible={false} style={StyleSheet.absoluteFill} onPress={close} />
      <Animated.View accessibilityViewIsModal style={[s.card, { opacity: exit.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }), transform: [{ scale: exit.interpolate({ inputRange: [0, 1], outputRange: [1, .98] }) }] }]}>
        <View style={s.header}><Text accessibilityRole="header" style={s.title}>{title}</Text><Pressable accessibilityRole="button" accessibilityLabel="İzahı bağla" onPress={close} style={s.close}><Text style={s.cross}>×</Text></Pressable></View>
        <ScrollView style={s.scroll} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">{children}</ScrollView>
        <Pressable accessibilityRole="button" onPress={acknowledge} onLayout={e => setWidth(e.nativeEvent.layout.width)} style={s.done}>
          <LinearGradient colors={['#FFC45C', '#FF9C38']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.doneFill}><Text style={s.doneText}>Başa düşdüm</Text></LinearGradient>
          {!reduced ? <Animated.View pointerEvents="none" style={[s.shine, { opacity: shine.interpolate({ inputRange: [0, .1, .9, 1], outputRange: [0, .6, .6, 0] }), transform: [{ translateX: shine.interpolate({ inputRange: [0, 1], outputRange: [-70, width + 70] }) }, { skewX: '-18deg' }] }]} /> : null}
        </Pressable>
      </Animated.View>
    </View>
  </Modal>;
}
const s = StyleSheet.create({ overlay: { flex: 1, backgroundColor: '#040617BD', justifyContent: 'center', paddingHorizontal: 22 }, card: { width: '100%', maxWidth: 500, maxHeight: '85%', alignSelf: 'center', borderRadius: 24, borderWidth: 1, borderColor: '#AC94E4', backgroundColor: '#24213D', overflow: 'hidden' }, header: { flexDirection: 'row', alignItems: 'center', paddingLeft: 18, paddingRight: 8, borderBottomWidth: 1, borderBottomColor: '#6A588F', backgroundColor: '#302948' }, title: { flex: 1, color: '#FFF', fontSize: 18, lineHeight: 25, fontWeight: '800' }, close: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }, cross: { color: '#D6C5FF', fontSize: 28 }, scroll: { flexGrow: 0 }, content: { padding: 18, gap: 14 }, done: { minHeight: 50, margin: 14, borderRadius: 15, overflow: 'hidden' }, doneFill: { minHeight: 50, alignItems: 'center', justifyContent: 'center' }, doneText: { color: '#291D2B', fontSize: 16, fontWeight: '800' }, shine: { position: 'absolute', top: 0, bottom: 0, width: 55, backgroundColor: '#FFF8D8' } });
