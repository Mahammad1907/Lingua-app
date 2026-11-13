import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import Icon, { type IconName } from './Icons';
import { d, radius, shadow, font } from './theme';

export function Header({ title, progress, onBack, onMenu }: { title: string; progress: number; onBack: () => void; onMenu?: () => void }) {
  const reduced = useReducedMotion();
  const width = useRef(new Animated.Value(progress)).current;
  useEffect(() => {
    if (reduced) width.setValue(progress);
    else Animated.timing(width, { toValue: progress, duration: 450, useNativeDriver: false }).start();
  }, [progress, reduced, width]);
  return <View style={s.header}>
    <Pressable accessibilityRole="button" accessibilityLabel="Geri" onPress={onBack} hitSlop={8} style={s.round}><Icon name="back" size={20} color={d.ink} /></Pressable>
    <Text style={s.headerTitle}>{title}</Text>
    <View style={s.divider} />
    <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }} style={s.track}>
      <Animated.View style={[s.fill, { width: width.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
    </View>
    {onMenu ? <Pressable accessibilityRole="button" accessibilityLabel="Menyu" onPress={onMenu} hitSlop={10} style={s.dots}><Icon name="dots" size={22} color={d.ink} /></Pressable> : <View style={s.dots} />}
  </View>;
}

export function Chip({ label }: { label: string }) {
  return <View style={s.chip}><Text style={s.chipText}>{label}</Text></View>;
}

export function Capsule({ label, icon, onPress, tone = 'soft', disabled, small, accessibilityLabel, align = 'center' }: { label: string; icon?: IconName; onPress: () => void; tone?: 'soft' | 'outline' | 'orange'; disabled?: boolean; small?: boolean; accessibilityLabel?: string; align?: 'center' | 'flex-start' | 'flex-end' }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? label} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} hitSlop={6}
    style={({ pressed }) => [s.capsule, { alignSelf: align }, tone === 'outline' && s.capsuleOutline, tone === 'orange' && s.capsuleOrange, small && s.capsuleSmall, pressed && { opacity: .75 }, disabled && { opacity: .5 }]}>
    {icon ? <View style={tone === 'soft' ? s.capsuleIcon : undefined}><Icon name={icon} size={small ? 17 : 19} color={d.purple} /></View> : null}
    <Text style={[s.capsuleText, small && { fontSize: 14 }]}>{label}</Text>
  </Pressable>;
}

export type ButtonTone = 'purple' | 'green' | 'red';
export function MainButton({ label, onPress, disabled, tone = 'purple', arrow }: { label: string; onPress: () => void; disabled?: boolean; tone?: ButtonTone; arrow?: boolean }) {
  const bg = disabled ? d.purpleDisabled : tone === 'green' ? d.green : tone === 'red' ? d.red : d.purple;
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
    style={({ pressed }) => [s.main, { backgroundColor: bg }, !disabled && shadow, pressed && { opacity: .88, transform: [{ scale: .98 }] }]}>
    <Text style={[s.mainText, disabled && { color: d.purpleDisabledText }]}>{label}</Text>
    {arrow && !disabled ? <Icon name="arrow" size={24} color="#fff" /> : null}
  </Pressable>;
}

export function Sheet({ visible, onClose, children, title, icon, right, tall, dismissible = true, onDismiss }: { visible: boolean; onClose: () => void; children: ReactNode; title?: string; icon?: IconName; right?: ReactNode; tall?: boolean; dismissible?: boolean; onDismiss?: () => void }) {
  const insets = useSafeAreaInsets();
  return <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} onDismiss={onDismiss} statusBarTranslucent>
    {dismissible ? <Pressable accessibilityLabel="Bağla" style={s.backdrop} onPress={onClose} /> : <View style={s.backdrop} />}
    <View style={[s.sheet, { paddingBottom: Math.max(18, insets.bottom + 8) }, tall && { maxHeight: '86%' }]}>
      <View style={s.handle} />
      <View style={s.sheetTop}>
        <View style={s.sheetTitleRow}>
          {icon ? <View style={s.sheetIcon}><Icon name={icon} size={24} color={d.purple} /></View> : null}
          {title ? <Text accessibilityRole="header" style={s.sheetTitle}>{title}</Text> : null}
        </View>
        <View style={s.sheetActions}>{right}<Pressable accessibilityRole="button" accessibilityLabel="Bağla" onPress={onClose} hitSlop={8} style={s.closeBtn}><Icon name="close" size={18} color={d.ink} /></Pressable></View>
      </View>
      <ScrollView bounces={false} contentContainerStyle={{ gap: 10 }}>{children}</ScrollView>
    </View>
  </Modal>;
}

export function SheetOption({ label, icon, note, onPress, highlight }: { label: string; icon: IconName; note?: string; onPress: () => void; highlight?: boolean }) {
  return <View>
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [s.option, highlight && s.optionOrange, pressed && { opacity: .8 }]}>
      <Icon name={icon} size={24} color={d.ink} /><Text style={s.optionText}>{label}</Text>
    </Pressable>
    {note ? <Text style={s.optionNote}>{note}</Text> : null}
  </View>;
}

const BARS = [8, 14, 22, 12, 26, 18, 30, 22, 38, 28, 44, 32, 26, 40, 20, 30, 16, 24, 12, 18, 10, 14, 8];
export function Waveform({ active, height = 44 }: { active?: boolean; height?: number }) {
  const reduced = useReducedMotion();
  const pulse = useRef(new Animated.Value(1)).current;
  // Only as many bars as fit, so the wave never runs under the buttons next to it.
  const [width, setWidth] = useState(0);
  const bars = width ? BARS.slice(0, Math.max(5, Math.min(BARS.length, Math.floor((width + 3) / 6.5)))) : [];
  useEffect(() => {
    if (!active || reduced) { pulse.setValue(1); return; }
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: .55, duration: 260, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 260, useNativeDriver: true }),
    ]));
    loop.start(); return () => loop.stop();
  }, [active, reduced, pulse]);
  const mid = (bars.length - 1) / 2;
  return <View onLayout={e => setWidth(e.nativeEvent.layout.width)} style={[s.wave, { height, overflow: 'hidden' }]}>{bars.map((h, i) => {
    const center = Math.abs(i - mid) < Math.max(2, bars.length / 4.5);
    return <Animated.View key={i} style={{ width: 3.5, borderRadius: 2, height: h * height / 46, backgroundColor: center ? d.orange : d.lavender, opacity: center ? 1 : .8, transform: [{ scaleY: active && i % 2 ? pulse : 1 }] }} />;
  })}</View>;
}

/** Counterpart audio: play, waveform and “Yavaş dinlə” next to it. */
export function AudioPanel({ playing, onPlay, onSlow, avatar }: { playing: boolean; onPlay: () => void; onSlow: () => void; avatar?: ReactNode }) {
  return <View style={[s.audio, shadow]}>
    {avatar ? <><View style={s.avatar}>{avatar}</View><View style={s.vline} /></> : null}
    <Pressable accessibilityRole="button" accessibilityLabel={playing ? 'Dinləmə gedir' : 'Səsi dinlə'} onPress={onPlay} style={({ pressed }) => [s.play, pressed && { opacity: .85 }]}>
      <Icon name="play" size={30} color="#fff" />
    </Pressable>
    <View style={{ flex: 1 }}><Waveform active={playing} /></View>
    <View style={s.vline} />
    <Pressable accessibilityRole="button" accessibilityLabel="Yavaş dinlə" onPress={onSlow} style={s.slow}>
      <View style={s.slowIcon}><Icon name="turtle" size={26} color={d.purple} /></View>
      <Text style={s.slowText}>Yavaş dinlə</Text>
    </Pressable>
  </View>;
}

export function ChoiceOption({ label, selected, state, onPress, disabled }: { label: string; selected: boolean; state?: 'correct' | 'wrong'; onPress: () => void; disabled?: boolean }) {
  const border = state === 'wrong' ? d.red : state === 'correct' ? d.green : selected ? d.purple : d.borderStrong;
  return <Pressable accessibilityRole="radio" accessibilityState={{ selected, disabled }} accessibilityLabel={label} disabled={disabled} onPress={onPress}
    style={[s.choice, { borderColor: border }, selected && !state && { backgroundColor: d.purpleSoft, borderWidth: 2 }, state && { borderWidth: 2 }]}>
    <View style={[s.radio, selected && { borderColor: border }]}>{selected ? <View style={[s.radioDot, { backgroundColor: border }]} /> : null}</View>
    <Text style={s.choiceText}>{label}</Text>
  </Pressable>;
}

export function Field({ value, onChange, placeholder, state, editable = true, label, onSubmit }: { value: string; onChange: (v: string) => void; placeholder: string; state?: 'correct' | 'wrong'; editable?: boolean; label?: string; onSubmit?: () => void }) {
  return <TextInput accessibilityLabel={label ?? placeholder} value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor="#9C8BB8"
    editable={editable} autoCapitalize="none" autoCorrect={false} spellCheck={false} maxLength={200} returnKeyType="done" onSubmitEditing={onSubmit} submitBehavior="blurAndSubmit"
    style={[s.field, state === 'wrong' && { borderColor: d.red }, state === 'correct' && { borderColor: d.green }]} />;
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.card, shadow, style]}>{children}</View>;
}

export const ds = StyleSheet.create({
  title: { color: d.ink, fontSize: 26, lineHeight: 32, ...font.extrabold, letterSpacing: -.3 },
  titleLarge: { color: d.ink, fontSize: 30, lineHeight: 36, ...font.extrabold, letterSpacing: -.5 },
  instruction: { color: d.ink, fontSize: 17, lineHeight: 24, ...font.bold },
  subtitle: { color: '#4B3566', fontSize: 17, lineHeight: 24, ...font.bold },
  body: { color: d.ink, fontSize: 16, ...font.regular, lineHeight: 23 },
  small: { color: d.inkSoft, fontSize: 13, ...font.regular, lineHeight: 19 },
  label: { color: d.lavenderText, fontSize: 14, lineHeight: 19, ...font.bold },
  strong: { color: d.ink, fontSize: 17, lineHeight: 24, ...font.bold },
});

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingTop: 6, paddingBottom: 10 },
  round: { width: 44, height: 44, borderRadius: 22, backgroundColor: d.purpleSoft, alignItems: 'center', justifyContent: 'center', ...shadow },
  headerTitle: { color: d.ink, fontSize: 19, ...font.bold },
  divider: { width: 1.5, height: 26, backgroundColor: d.lavender },
  track: { flex: 1, height: 10, borderRadius: 5, backgroundColor: '#D9CBF4', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 5, backgroundColor: d.purple },
  dots: { width: 28, alignItems: 'center', justifyContent: 'center', minHeight: 44 },
  chip: { alignSelf: 'flex-start', backgroundColor: d.purpleSoft, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 6 },
  chipText: { color: d.purple, fontSize: 15, ...font.bold },
  capsule: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'center', minHeight: 44, paddingHorizontal: 18, borderRadius: radius.pill, borderWidth: 1, borderColor: d.borderStrong, backgroundColor: '#EFE5FD', ...shadow },
  capsuleOutline: { backgroundColor: 'transparent', borderColor: d.purple, shadowOpacity: 0, elevation: 0 },
  capsuleOrange: { backgroundColor: d.orangeSoft, borderColor: d.orange },
  capsuleSmall: { minHeight: 38, paddingHorizontal: 14 },
  capsuleIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: d.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  capsuleText: { color: d.purple, fontSize: 16, ...font.semibold },
  main: { minHeight: 56, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10, paddingHorizontal: 20 },
  mainText: { color: '#fff', fontSize: 20, ...font.bold },
  backdrop: { flex: 1, backgroundColor: 'rgba(42,18,64,.35)' },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#F4EEFD', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 20, paddingTop: 10, gap: 10, maxHeight: '75%', ...shadow },
  handle: { alignSelf: 'center', width: 48, height: 6, borderRadius: 3, backgroundColor: '#C5ADF2' },
  sheetTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  sheetTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, paddingTop: 6 },
  sheetIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: d.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  sheetTitle: { color: d.ink, fontSize: 26, lineHeight: 32, ...font.extrabold, flexShrink: 1 },
  sheetActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: d.purpleSoft, alignItems: 'center', justifyContent: 'center', ...shadow },
  option: { flexDirection: 'row', alignItems: 'center', gap: 18, minHeight: 56, paddingHorizontal: 20, borderRadius: radius.field, borderWidth: 1.5, borderColor: d.borderStrong, backgroundColor: '#F2EAFE' },
  optionOrange: { backgroundColor: d.orangeSoft, borderColor: d.orange },
  optionText: { color: d.ink, fontSize: 19, ...font.bold },
  optionNote: { color: d.purple, fontSize: 13, ...font.regular, textAlign: 'center', marginTop: 4 },
  wave: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3 },
  audio: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: radius.card, borderWidth: 1, borderColor: d.border, backgroundColor: d.surface },
  avatar: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center' },
  vline: { width: 1, alignSelf: 'stretch', backgroundColor: d.border },
  play: { width: 64, height: 64, borderRadius: 32, backgroundColor: d.purple, alignItems: 'center', justifyContent: 'center', paddingLeft: 3, ...shadow },
  slow: { alignItems: 'center', gap: 4, minWidth: 74 },
  slowIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: d.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  slowText: { color: d.ink, fontSize: 13, ...font.semibold },
  choice: { flexDirection: 'row', alignItems: 'center', gap: 16, minHeight: 64, paddingHorizontal: 20, borderRadius: radius.field, borderWidth: 1, backgroundColor: d.surface },
  radio: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: d.borderStrong, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 14, height: 14, borderRadius: 7 },
  choiceText: { color: d.ink, fontSize: 19, ...font.bold, flex: 1 },
  field: { minHeight: 58, borderRadius: radius.field, borderWidth: 1.5, borderColor: d.borderStrong, backgroundColor: d.surface, paddingHorizontal: 18, fontSize: 19, color: d.ink, ...font.semibold },
  card: { borderRadius: radius.card, borderWidth: 1, borderColor: d.border, backgroundColor: d.surface, padding: 16 },
});
