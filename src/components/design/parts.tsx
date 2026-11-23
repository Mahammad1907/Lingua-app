import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { resolveNames } from '../../config/characters';
import Icon, { type IconName } from './Icons';
import { d, radius, shadow, font } from './theme';

/** “…” standing alone in an English line is the name slot: it is shown as [ad] (earlier item 10). “Slowly…” keeps its dots. */
export const nameSlot = (text: string) => text.replace(/(^|[\s,(“"])…/g, '$1[ad]');

export function Header({ progress, onBack, onMenu }: { title?: string; progress: number; onBack: () => void; onMenu?: () => void }) {
  const reduced = useReducedMotion();
  const width = useRef(new Animated.Value(progress)).current;
  useEffect(() => {
    if (reduced) width.setValue(progress);
    else Animated.timing(width, { toValue: progress, duration: 450, useNativeDriver: false }).start();
  }, [progress, reduced, width]);
  // New style (23 Nov 2026): round white back button, full-width purple progress bar, no counter; the lesson label moved above the title.
  return <View style={s.header}>
    <Pressable accessibilityRole="button" accessibilityLabel="Geri" onPress={onBack} hitSlop={8} style={s.round}><Icon name="back" size={20} color={d.ink} /></Pressable>
    <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }} style={s.track}>
      <Animated.View style={[s.fill, { width: width.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
    </View>
    {onMenu ? <Pressable accessibilityRole="button" accessibilityLabel="Menyu" onPress={onMenu} hitSlop={10} style={s.dots}><Icon name="dots" size={22} color={d.inkSoft} /></Pressable> : <View style={s.dots} />}
  </View>;
}

export function Chip({ label }: { label: string }) {
  return <View style={s.chip}><Text style={s.chipText}>{label}</Text></View>;
}

export function Capsule({ label, icon, onPress, tone = 'soft', disabled, small, accessibilityLabel, align = 'center' }: { label: string; icon?: IconName; onPress: () => void; tone?: 'soft' | 'ghost' | 'outline' | 'orange'; disabled?: boolean; small?: boolean; accessibilityLabel?: string; align?: 'center' | 'flex-start' | 'flex-end' }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? label} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} hitSlop={6}
    style={({ pressed }) => [s.capsule, { alignSelf: align }, tone === 'outline' && s.capsuleOutline, tone === 'ghost' && s.capsuleGhost, tone === 'orange' && s.capsuleOrange, small && s.capsuleSmall, pressed && { opacity: .75 }, disabled && { opacity: .5 }]}>
    {icon ? <View style={tone === 'soft' ? s.capsuleIcon : undefined}><Icon name={icon} size={small ? 17 : 19} color={tone === 'ghost' ? d.inkSoft : d.purple} /></View> : null}
    <Text style={[s.capsuleText, small && { fontSize: 14 }, tone === 'ghost' && { color: d.inkSoft }]}>{label}</Text>
  </Pressable>;
}

export type ButtonTone = 'purple' | 'green' | 'red';
export function MainButton({ label, onPress, disabled, tone = 'purple', arrow }: { label: string; onPress: () => void; disabled?: boolean; tone?: ButtonTone; arrow?: boolean }) {
  const bg = disabled ? d.purpleDisabled : tone === 'green' ? d.green : tone === 'red' ? d.red : d.action;
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
    style={({ pressed }) => [s.main, { backgroundColor: bg }, !disabled && { ...shadow, shadowColor: bg, shadowOpacity: .28, shadowRadius: 14, shadowOffset: { width: 0, height: 6 } }, pressed && { opacity: .88, transform: [{ scale: .98 }] }]}>
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
export function Waveform({ active, height = 44, progress }: { active?: boolean; height?: number; progress?: number }) {
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
    return <Animated.View key={i} style={{ width: 3.5, borderRadius: 2, height: h * height / 46, backgroundColor: progress === undefined ? (center ? d.orange : d.lavender) : (i / Math.max(1, bars.length) < progress ? d.purple : d.border), opacity: center ? 1 : .8, transform: [{ scaleY: active && i % 2 ? pulse : 1 }] }} />;
  })}</View>;
}

/** “Səsli mesaj” card (23 Nov 2026): who + label + length on top; round play, wave (played part purple) and the 0.75x pill below. */
export function AudioPanel({ playing, onPlay, onSlow, avatar, name, seconds }: { playing: boolean; onPlay: () => void; onSlow: () => void; avatar?: ReactNode; name?: string; seconds?: number }) {
  const total = Math.max(2, seconds ?? 2);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!playing) { setProgress(0); return; }
    const t0 = Date.now();
    const id = setInterval(() => setProgress(Math.min(1, (Date.now() - t0) / (total * 1000))), 120);
    return () => clearInterval(id);
  }, [playing, total]);
  const mm = `0:${String(Math.round(total)).padStart(2, '0')}`;
  return <View style={[s.audio, shadow]}>
    <View style={s.audioTop}>
      {avatar ? <View style={s.avatar}>{avatar}</View> : null}
      <View style={{ flex: 1 }}>
        {name ? <Text style={s.audioName}>{resolveNames(name)}</Text> : null}
        <Text style={name ? s.audioSub : s.audioName}>Səsli mesaj</Text>
      </View>
      <Text accessibilityLabel={`Uzunluq ${Math.round(total)} saniyə`} style={s.audioTime}>{mm}</Text>
    </View>
    <View style={s.audioBottom}>
      <Pressable accessibilityRole="button" accessibilityLabel={playing ? 'Dinləmə gedir' : 'Səsi dinlə'} onPress={onPlay} style={({ pressed }) => [s.play, pressed && { opacity: .85 }]}>
        <Icon name="play" size={26} color="#fff" />
      </Pressable>
      <View style={{ flex: 1 }}><Waveform active={playing} progress={progress} height={40} /></View>
      <Pressable accessibilityRole="button" accessibilityLabel="Yavaş dinlə, 0.75 sürət" onPress={onSlow} hitSlop={6} style={({ pressed }) => [s.slowPill, pressed && { opacity: .8 }]}>
        <Text style={s.slowPillText}>0.75x</Text>
      </Pressable>
    </View>
  </View>;
}

export function ChoiceOption({ label, selected, state, onPress, disabled }: { label: string; selected: boolean; state?: 'correct' | 'wrong'; onPress: () => void; disabled?: boolean }) {
  const border = state === 'wrong' ? d.red : state === 'correct' ? d.green : selected ? d.purple : d.borderStrong;
  return <Pressable accessibilityRole="radio" accessibilityState={{ selected, disabled }} accessibilityLabel={label} disabled={disabled} onPress={onPress}
    style={[s.choice, { borderColor: border }, selected && !state && { backgroundColor: d.purpleSoft, borderWidth: 2 }, state && { borderWidth: 2 }]}>
    <View style={[s.radio, selected && { borderColor: border }]}>{selected ? <View style={[s.radioDot, { backgroundColor: border }]} /> : null}</View>
    <Text style={s.choiceText}>{nameSlot(label)}</Text>
  </Pressable>;
}

export function Field({ value, onChange, placeholder, state, editable = true, label, onSubmit }: { value: string; onChange: (v: string) => void; placeholder: string; state?: 'correct' | 'wrong'; editable?: boolean; label?: string; onSubmit?: () => void }) {
  const [focused, setFocused] = useState(false);
  return <TextInput accessibilityLabel={label ?? placeholder} value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor="#9A9FB2" onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    editable={editable} autoCapitalize="none" autoCorrect={false} spellCheck={false} maxLength={200} returnKeyType="done" onSubmitEditing={onSubmit} submitBehavior="blurAndSubmit"
    style={[s.field, focused && s.fieldFocus, state === 'wrong' && { borderColor: d.red }, state === 'correct' && { borderColor: d.green }]} />;
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.card, shadow, style]}>{children}</View>;
}

export const ds = StyleSheet.create({
  title: { color: d.ink, fontSize: 32, lineHeight: 38, ...font.extrabold, letterSpacing: -.5 },
  titleLarge: { color: d.ink, fontSize: 30, lineHeight: 36, ...font.extrabold, letterSpacing: -.5 },
  // Situation + task lines must read clearly (user, repeated): strong purple and dark ink, extra bold, larger.
  instruction: { color: d.ink, fontSize: 19, lineHeight: 26, ...font.extrabold },
  subtitle: { color: d.purple, fontSize: 18, lineHeight: 25, ...font.extrabold },
  body: { color: d.ink, fontSize: 16, ...font.regular, lineHeight: 23 },
  small: { color: d.ink, fontSize: 14, ...font.semibold, lineHeight: 20 },
  label: { color: d.lavenderText, fontSize: 14, lineHeight: 19, ...font.bold },
  strong: { color: d.ink, fontSize: 17, lineHeight: 24, ...font.bold },
});

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingTop: 6, paddingBottom: 10 },
  round: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#FFFFFF', borderWidth: 0, alignItems: 'center', justifyContent: 'center', ...shadow },
  track: { flex: 1, height: 10, borderRadius: 5, backgroundColor: d.border, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 5, backgroundColor: d.action },
  dots: { width: 28, alignItems: 'center', justifyContent: 'center', minHeight: 44 },
  chip: { alignSelf: 'flex-start', backgroundColor: d.purpleSoft, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 6 },
  chipText: { color: d.purple, fontSize: 15, ...font.bold },
  capsule: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'center', minHeight: 44, paddingHorizontal: 18, borderRadius: radius.pill, borderWidth: 1, borderColor: d.border, backgroundColor: d.purpleSoft, ...shadow },
  capsuleGhost: { backgroundColor: 'transparent', borderWidth: 0, shadowOpacity: 0, elevation: 0 },
  capsuleOutline: { backgroundColor: 'transparent', borderColor: d.purple, shadowOpacity: 0, elevation: 0 },
  capsuleOrange: { backgroundColor: d.orangeSoft, borderColor: d.orange },
  capsuleSmall: { minHeight: 38, paddingHorizontal: 14 },
  capsuleIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: d.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  capsuleText: { color: d.purple, fontSize: 16, ...font.semibold },
  main: { minHeight: 60, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10, paddingHorizontal: 20 },
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
  audio: { gap: 18, padding: 18, borderRadius: 24, borderWidth: 1, borderColor: d.border, backgroundColor: '#FFFFFF' },
  audioTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  audioBottom: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  audioName: { color: d.ink, fontSize: 20, lineHeight: 26, ...font.extrabold },
  audioSub: { color: d.inkSoft, fontSize: 15, lineHeight: 20, ...font.regular },
  audioTime: { color: '#9A9FB2', fontSize: 16, ...font.semibold, alignSelf: 'flex-start' },
  slowPill: { minHeight: 46, minWidth: 76, paddingHorizontal: 16, borderRadius: radius.pill, backgroundColor: d.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  slowPillText: { color: d.purple, fontSize: 18, ...font.extrabold },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#F1F2F6', alignItems: 'center', justifyContent: 'center' },
  vline: { width: 1, alignSelf: 'stretch', backgroundColor: d.border },
  play: { width: 60, height: 60, borderRadius: 30, backgroundColor: d.action, alignItems: 'center', justifyContent: 'center', paddingLeft: 3, ...shadow },
  slowIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: d.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  choice: { flexDirection: 'row', alignItems: 'center', gap: 16, minHeight: 64, paddingHorizontal: 20, borderRadius: radius.field, borderWidth: 1, backgroundColor: d.surface },
  radio: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: d.borderStrong, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 14, height: 14, borderRadius: 7 },
  choiceText: { color: d.ink, fontSize: 19, ...font.bold, flex: 1 },
  fieldFocus: { borderWidth: 1.5, borderColor: d.purple, shadowColor: d.purple, shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 0 }, elevation: 2 },
  field: { minHeight: 64, borderRadius: 20, borderWidth: 1, borderColor: d.border, backgroundColor: '#FFFFFF', paddingHorizontal: 20, fontSize: 20, color: d.ink, ...font.semibold },
  card: { borderRadius: radius.card, borderWidth: 1, borderColor: d.border, backgroundColor: d.surface, padding: 16 },
});
