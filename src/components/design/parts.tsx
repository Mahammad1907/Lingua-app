import { createContext, useContext, useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import GlowLine from './GlowLine';
import * as Haptics from 'expo-haptics';
import Reanimated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { useReducedMotion } from '../../hooks/useReducedMotion';
import { resolveNames } from '../../config/characters';
import Icon, { type IconName } from './Icons';
import { d, radius, shadow, font } from './theme';

/** Light tap feedback (25 Nov 2026): selections, ▶, speed, Kömək, ↑ send. Never throws. */
export const tapHaptic = () => { void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}); };

const APressable = Reanimated.createAnimatedComponent(Pressable);
/** A pressable that springs to `to` (0.94 by default) while pressed — used by every ▶ button. */
export function Pop({ to = .94, style, children, onPressIn, onPressOut, ...rest }: Omit<ComponentProps<typeof Pressable>, 'style'> & { to?: number; style?: StyleProp<ViewStyle> }) {
  const k = useSharedValue(1);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: k.value }] }));
  return <APressable {...rest} style={[style, a]}
    onPressIn={e => { k.value = withSpring(to, { damping: 15, stiffness: 400 }); onPressIn?.(e); }}
    onPressOut={e => { k.value = withSpring(1, { damping: 12, stiffness: 300 }); onPressOut?.(e); }}>{children as ReactNode}</APressable>;
}

/** “…” standing alone in an English line is the name slot: it is shown as [ad] (earlier item 10). “Slowly…” keeps its dots. */
export const nameSlot = (text: string) => text.replace(/(^|[\s,(“"])…/g, '$1[ad]');

export function Header({ progress, onBack, onMenu, streak = 0 }: { title?: string; progress: number; onBack: () => void; onMenu?: () => void; streak?: number }) {
  const reduced = useReducedMotion();
  const width = useRef(new Animated.Value(progress)).current;
  const bump = useRef(new Animated.Value(1)).current;
  const shine = useRef(new Animated.Value(0)).current;
  const last = useRef(progress);
  useEffect(() => {
    const grew = progress > last.current; last.current = progress;
    if (reduced) { width.setValue(progress); return; }
    Animated.spring(width, { toValue: progress, friction: 9, tension: 60, useNativeDriver: false }).start();
    if (!grew) return;
    // Filling feels alive (23 Nov 2026): a short bounce of the bar and a glint at its tip.
    Animated.sequence([
      Animated.timing(bump, { toValue: 1.35, duration: 140, useNativeDriver: false }),
      Animated.spring(bump, { toValue: 1, friction: 4, useNativeDriver: false }),
    ]).start();
    shine.setValue(0);
    Animated.sequence([
      Animated.delay(250),
      Animated.timing(shine, { toValue: 1, duration: 180, useNativeDriver: false }),
      Animated.timing(shine, { toValue: 0, duration: 420, useNativeDriver: false }),
    ]).start();
  }, [progress, reduced, width, bump, shine]);
  // 3+ correct answers in a row: the bar turns bright mascot orange.
  const hot = streak >= 3;
  return <View style={s.header}>
    <Pressable accessibilityRole="button" accessibilityLabel="Geri" onPress={onBack} hitSlop={8} style={s.round}><Icon name="back" size={20} color={d.ink} /></Pressable>
    <Animated.View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }} style={[s.track, { transform: [{ scaleY: bump }] }]}>
      <Animated.View style={[s.fill, { width: width.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]}>
        <LinearGradient colors={hot ? [d.actionHot, d.actionLight] : [d.actionLight, d.action]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
        <Animated.View pointerEvents="none" style={[s.glint, { opacity: shine }]} />
      </Animated.View>
    </Animated.View>
    {onMenu ? <Pressable accessibilityRole="button" accessibilityLabel="Menyu" onPress={onMenu} hitSlop={10} style={s.dots}><Icon name="dots" size={22} color={d.inkSoft} /></Pressable> : <View style={s.dots} />}
  </View>;
}

/** The lesson's own label (“Dərs 1”, “Bölmə imtahanı” …), given once by the lesson screen to every card. */
export const LessonCaption = createContext('');
const upAz = (v: string) => v.replace(/i/g, 'İ').toUpperCase();
/** THE screen-type label, the same on every lesson screen (rule G7, 24 Nov 2026): icon + “DƏRS 1 · NÖV”. */
export function KindChip({ kind, icon }: { kind: string; icon: IconName }) {
  const caption = useContext(LessonCaption);
  return <View style={s.kind} accessibilityLabel={caption ? `${caption}, ${kind}` : kind}>
    <Icon name={icon} size={16} color={d.purple} />
    <Text style={s.kindText} numberOfLines={1}>{caption ? `${upAz(caption)} · ` : ''}{upAz(kind)}</Text>
  </View>;
}
export function Chip({ label }: { label: string }) {
  return <View style={s.chip}><Text style={s.chipText}>{label}</Text></View>;
}

export function Capsule({ label, icon, onPress, tone = 'soft', disabled, small, accessibilityLabel, align = 'center' }: { label: string; icon?: IconName; onPress: () => void; tone?: 'soft' | 'ghost' | 'outline' | 'orange'; disabled?: boolean; small?: boolean; accessibilityLabel?: string; align?: 'center' | 'flex-start' | 'flex-end' }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? label} accessibilityState={{ disabled }} disabled={disabled} onPress={() => { tapHaptic(); onPress(); }} hitSlop={6}
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
    {/* Forward buttons: subtle warm-orange gradient (25 Nov 2026). Green/red after a check stay flat. */}
    {!disabled && tone === 'purple' ? <LinearGradient colors={[d.actionLight, d.action]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[StyleSheet.absoluteFill, { borderRadius: radius.pill }]} /> : null}
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

/** THE sound visualizer (25 Nov 2026): the Glow Line, everywhere a wave is shown. It never fills left to right. */
export function Waveform({ active, height = 44, rate = 1 }: { active?: boolean; height?: number; progress?: number; rate?: number }) {
  return <GlowLine active={active} height={height} rate={rate} />;
}

/** THE audio card (25 Nov 2026 design system), shared by every listening / speaking screen: avatar badge, bold title +
 *  muted subtitle, length on the right; purple ▶/⏸, the Glow Line and the speed pill (1x → 0.75x → 0.5x → 1.25x) below. */
export function AudioPanel({ playing, onPlay, avatar, name, title, sub, seconds, rate = 1, onRate }: { playing: boolean; onPlay: () => void; avatar?: ReactNode; name?: string;
  /** Replaces the name line, e.g. the spoken sentence with tappable words. */ title?: ReactNode; sub?: string; seconds?: number; rate?: number; onRate: () => void }) {
  const total = Math.max(1, Math.round((seconds ?? 2) / rate));
  const mm = `0:${String(total).padStart(2, '0')}`;
  const subtitle = sub ?? 'Səsli mesaj';
  return <View style={[s.audio, shadow]}>
    <View style={s.audioTop}>
      {avatar ? <View style={s.avatar}>{avatar}</View> : null}
      <View style={{ flex: 1, gap: 2 }}>
        {title ?? (name ? <Text style={s.audioName}>{resolveNames(name)}</Text> : null)}
        <Text style={title || name ? s.audioSub : s.audioName}>{resolveNames(subtitle)}</Text>
      </View>
      <Text accessibilityLabel={`Uzunluq ${total} saniyə`} style={s.audioTime}>{mm}</Text>
    </View>
    <View style={s.audioBottom}>
      <Pop accessibilityRole="button" accessibilityLabel={playing ? 'Dinləmə gedir' : 'Səsi dinlə'} onPress={() => { tapHaptic(); onPlay(); }} style={[s.play, !playing && { paddingLeft: 3 }]}>
        <Icon name={playing ? 'pause' : 'play'} size={26} color="#fff" />
      </Pop>
      <View style={{ flex: 1 }}><GlowLine active={playing} rate={rate} height={44} /></View>
      <Pressable accessibilityRole="button" accessibilityLabel={`Sürət ${rate}x. Dəyişmək üçün toxun`} onPress={() => { tapHaptic(); onRate(); }} hitSlop={6} style={({ pressed }) => [s.slowPill, pressed && { opacity: .8 }]}>
        <Text style={s.slowPillText}>{rate}x</Text>
      </Pressable>
    </View>
  </View>;
}

export function ChoiceOption({ label, selected, state, onPress, disabled }: { label: string; selected: boolean; state?: 'correct' | 'wrong'; onPress: () => void; disabled?: boolean }) {
  const border = state === 'wrong' ? d.red : state === 'correct' ? d.green : selected ? d.purple : d.borderStrong;
  // Selecting springs the card 0.98 → 1 and fades the purple border/tint in (25 Nov 2026).
  const k = useSharedValue(1), tint = useSharedValue(selected ? 1 : 0);
  useEffect(() => {
    tint.value = withTiming(selected ? 1 : 0, { duration: 180 });
    if (selected) k.value = withSequence(withTiming(.98, { duration: 70 }), withSpring(1, { damping: 10, stiffness: 260 }));
  }, [selected, k, tint]);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: k.value }] }));
  const glow = useAnimatedStyle(() => ({ opacity: tint.value }));
  return <APressable accessibilityRole="radio" accessibilityState={{ selected, disabled }} accessibilityLabel={label} disabled={disabled} onPress={() => { tapHaptic(); onPress(); }}
    style={[s.choice, { borderColor: border }, state && { borderWidth: 2 }, selected && !state && { borderWidth: 2 }, a]}>
    {!state ? <Reanimated.View pointerEvents="none" style={[s.choiceTint, glow]} /> : null}
    <View style={[s.radio, selected && { borderColor: border }]}>{selected ? <View style={[s.radioDot, { backgroundColor: border }]} /> : null}</View>
    <Text style={s.choiceText}>{nameSlot(label)}</Text>
  </APressable>;
}

export function Field({ value, onChange, placeholder, state, editable = true, label, onSubmit, onSend, sendDisabled }: { value: string; onChange: (v: string) => void; placeholder: string; state?: 'correct' | 'wrong'; editable?: boolean; label?: string; onSubmit?: () => void;
  /** Chat screens: a round purple ↑ inside the right edge sends the message. */ onSend?: () => void; sendDisabled?: boolean }) {
  const [focused, setFocused] = useState(false);
  const input = <TextInput accessibilityLabel={label ?? placeholder} value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor="#9A9FB2" onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    editable={editable} autoCapitalize="none" autoCorrect={false} spellCheck={false} maxLength={200} returnKeyType={onSend ? 'send' : 'done'} onSubmitEditing={onSend ?? onSubmit} submitBehavior={onSend ? 'submit' : 'blurAndSubmit'}
    style={[s.field, onSend && { paddingRight: 64 }, focused && s.fieldFocus, state === 'wrong' && { borderColor: d.red }, state === 'correct' && { borderColor: d.green }]} />;
  if (!onSend) return input;
  const off = sendDisabled || !editable || !value.trim();
  return <View>{input}
    <Pop accessibilityRole="button" accessibilityLabel="Göndər" accessibilityState={{ disabled: off }} disabled={off} onPress={() => { tapHaptic(); onSend(); }} hitSlop={6}
      style={[s.send, off && { backgroundColor: d.purpleDisabled }]}><Icon name="up" size={22} color={off ? d.purpleDisabledText : '#fff'} stroke={2.4} /></Pop>
  </View>;
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.card, shadow, style]}>{children}</View>;
}

/** Task title (25 Nov 2026): the first word in ink, the action words after it in royal purple — no underline. */
export function accentTitle(title: string): ReactNode {
  const i = title.indexOf(' ');
  if (i < 0) return title;
  return <>{title.slice(0, i + 1)}<Text style={{ color: d.purple }}>{title.slice(i + 1)}</Text></>;
}

export const ds = StyleSheet.create({
  title: { color: d.title, fontSize: 32, lineHeight: 38, ...font.extrabold, letterSpacing: -.5 },
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
  kind: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: d.purpleSoft, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 },
  kindText: { flexShrink: 1, color: d.purple, fontSize: 14, letterSpacing: .6, ...font.extrabold },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingTop: 6, paddingBottom: 10 },
  round: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#FFFFFF', borderWidth: 0, alignItems: 'center', justifyContent: 'center', ...shadow },
  track: { flex: 1, height: 10, borderRadius: 5, backgroundColor: d.track, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 5, backgroundColor: d.action, overflow: 'hidden' },
  glint: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 22, borderRadius: 5, backgroundColor: 'rgba(255,255,255,.75)' },
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
  audio: { gap: 14, padding: 18, borderRadius: 24, borderWidth: 1, borderColor: '#EEF0F5', backgroundColor: '#FFFFFF' },
  audioTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  audioBottom: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  audioName: { color: d.ink, fontSize: 20, lineHeight: 26, ...font.extrabold },
  audioSub: { color: d.inkSoft, fontSize: 15, lineHeight: 20, ...font.regular },
  audioTime: { color: d.inkSoft, fontSize: 16, ...font.semibold, alignSelf: 'flex-start' },
  slowPill: { minHeight: 46, minWidth: 76, paddingHorizontal: 16, borderRadius: radius.pill, backgroundColor: d.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  slowPillText: { color: d.purple, fontSize: 18, ...font.extrabold },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#F3F0FB', alignItems: 'center', justifyContent: 'center' },
  vline: { width: 1, alignSelf: 'stretch', backgroundColor: d.border },
  play: { width: 60, height: 60, borderRadius: 30, backgroundColor: d.purple, alignItems: 'center', justifyContent: 'center', ...shadow, shadowColor: d.purple, shadowOpacity: .25 },
  slowIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: d.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  choiceTint: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: radius.field - 1, backgroundColor: d.purpleTint },
  send: { position: 'absolute', right: 8, top: 8, bottom: 8, aspectRatio: 1, borderRadius: 999, backgroundColor: d.purple, alignItems: 'center', justifyContent: 'center' },
  choice: { flexDirection: 'row', alignItems: 'center', gap: 16, minHeight: 64, paddingHorizontal: 20, borderRadius: radius.field, borderWidth: 1, backgroundColor: d.surface, overflow: 'hidden' },
  radio: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: d.borderStrong, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 14, height: 14, borderRadius: 7 },
  choiceText: { color: d.ink, fontSize: 19, ...font.bold, flex: 1 },
  fieldFocus: { borderWidth: 2, borderColor: d.purple, shadowColor: d.violetLight, shadowOpacity: 0.22, shadowRadius: 10, shadowOffset: { width: 0, height: 0 }, elevation: 2 },
  field: { minHeight: 60, borderRadius: 18, borderWidth: 1, borderColor: d.border, backgroundColor: '#FFFFFF', paddingHorizontal: 20, fontSize: 20, color: d.ink, ...font.semibold },
  card: { borderRadius: radius.card, borderWidth: 1, borderColor: d.border, backgroundColor: d.surface, padding: 16 },
});
