import LessonImage from './LessonImage';
import { classroomSource } from '../../utils/lessonAssets';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, type PropsWithChildren } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useUserStore } from '../../store/userStore';
import { MAX_ENERGY } from '../../utils/rewards';
import { vocabularyParts } from '../../utils/lessonVocabulary';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

export const ink = { bg: '#090C20', card: '#15162F', border: '#39315E', text: '#F6F3FF', muted: '#ADA5CC', violet: '#B597F7', orange: '#FFAB38', mint: '#58E4C1' };
export type LessonIconName = 'bolt' | 'back' | 'arrow' | 'play' | 'pause' | 'mic' | 'check' | 'hint' | 'keyboard' | 'sound' | 'book';
export function LessonIcon({ name, color = ink.violet, size = 22 }: { name: LessonIconName; color?: string; size?: number }) {
  const paths: Record<LessonIconName, string> = {
    bolt: 'm13 2-8 12h6l-1 8 9-13h-7Z', back: 'M15 5 8 12l7 7', arrow: 'M4 12h16m-7-7 7 7-7 7', play: 'm9 5 10 7-10 7Z', pause: 'M8 5v14M16 5v14',
    mic: 'M8 11V6a4 4 0 0 1 8 0v5a4 4 0 0 1-8 0Zm-3-1v1a7 7 0 0 0 14 0v-1M12 18v4m-4 0h8',
    check: 'm5 12 4 4L19 6', hint: 'M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0l-1 2H9Z',
    keyboard: 'M4 8h1m3 0h1m3 0h1m3 0h1M4 12h1m3 0h1m3 0h1m3 0h1M7 16h10',
    sound: 'M3 9h4l5-4v14l-5-4H3ZM16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14',
    book: 'M12 5v16M2 4c4-1 7-1 10 1 3-2 6-2 10-1v15c-4-1-7-1-10 1-3-2-6-2-10-1Z',
  };
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">{name === 'keyboard' && <Rect x={1} y={3} width={22} height={18} rx={3} />}<Path d={paths[name]} /></Svg>;
}
export function Surface({ children, accent = 'violet' }: PropsWithChildren<{ accent?: 'violet' | 'orange' | 'mint' }>) {
  return <LinearGradient colors={accent === 'mint' ? ['#173939', '#131B30'] : ['#1C1D3C', '#111329']} style={[ui.surface, { borderColor: accent === 'mint' ? ink.mint : accent === 'orange' ? '#9A652F' : '#554681' }]}>{children}</LinearGradient>;
}
export function LessonEnergy() {
  const hearts = useUserStore(state => state.hearts);
  const percent = Math.round(hearts / MAX_ENERGY * 100);
  return <View accessibilityLabel={`Enerji ${percent} faiz`} style={ui.energy}><LessonIcon name="bolt" color="#AE71F9" size={25} /><View style={{ gap: 4 }}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><Text style={ui.energyLabel}>Enerji</Text><Text style={ui.energyPercent}>{percent}%</Text></View><View style={ui.energyTrack}><View style={{ width: `${percent}%`, height: '100%', backgroundColor: ink.orange, borderRadius: 4 }} /></View></View></View>;
}
export function LessonButton({ label, onPress, disabled = false }: { label: string; onPress: () => void; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [ui.buttonGlow, disabled && { opacity: .48 }, pressed && { transform: [{ scale: .98 }] }]}><LinearGradient colors={['#FFC04F', '#FF8A2B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={ui.button}><Text style={ui.buttonText}>{label}</Text><LessonIcon name="arrow" color="#251624" /></LinearGradient></Pressable>;
}
export function ClassroomScene({ text, height, welcome = false, fit = 'cover', freshWords }: { text: string; height: number; welcome?: boolean; fit?: 'cover' | 'contain'; freshWords?: ReadonlySet<string> }) {
  const [width, setWidth] = useState(350);
  const scale = (fit === 'contain' ? Math.min : Math.max)(width / 1200, height / 800);
  const imageWidth = 1200 * scale, imageHeight = 800 * scale;
  const board = { left: (width - imageWidth) / 2 + imageWidth * .44, top: (height - imageHeight) / 2 + imageHeight * .24, width: imageWidth * .45, height: imageHeight * .43 };
  return <View onLayout={e => setWidth(e.nativeEvent.layout.width)} style={{ width: '100%', height, overflow: 'hidden', borderRadius: welcome ? 0 : 20 }}><LessonImage source={classroomSource} fit={fit} style={StyleSheet.absoluteFill} />
    <View style={[ui.board, board]}>{!welcome ? <Text numberOfLines={1} style={ui.boardLabel}>BİRFOX İLƏ MƏŞQ</Text> : null}<Text adjustsFontSizeToFit minimumFontScale={.7} numberOfLines={4} style={[ui.boardText, welcome && { fontSize: 35, lineHeight: 43, fontStyle: 'italic', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' }]}>{freshWords ? vocabularyParts(text, freshWords).map((part, i) => part.fresh ? <Text key={i} style={{ color: ink.orange }}>{part.text}</Text> : part.text) : text}</Text><View style={ui.chalk} /></View>
  </View>;
}
// An honest level history: every column is a measured microphone sample, never a timer loop.
export function InputLevelWave({ levels, active }: { levels: number[]; active: boolean }) {
  const values = [...Array(Math.max(0, 25 - levels.length)).fill(0), ...levels.slice(-25)];
  return <View accessible accessibilityLabel={active ? 'Mikrofonun canlı səs səviyyəsi' : 'Mikrofon hazırdır'} style={ui.wave}>{values.map((v, i) => <View key={i} style={{ width: 4, borderRadius: 4, height: 4 + Math.min(1, Math.max(0, v)) * 48, backgroundColor: active ? ink.orange : '#62578A' }} />)}</View>;
}
export function SoundMark({ active = false }: { active?: boolean }) {
  return <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={ui.wave}>{[8, 16, 26, 38, 24, 42, 30, 16, 26, 12, 6].map((h, i) => <View key={i} style={{ width: 3, height: h, borderRadius: 4, backgroundColor: active ? ink.orange : '#716495' }} />)}</View>;
}
export function SelectionMark({ selected, correct }: { selected: boolean; correct: boolean }) {
  return <View style={[ui.selection, { borderColor: correct ? ink.mint : selected ? ink.orange : '#736491', backgroundColor: correct ? ink.mint : 'transparent' }]}>{correct ? <LessonIcon name="check" size={16} color={ink.bg} /> : selected ? <Svg width={12} height={12}><Circle cx={6} cy={6} r={5} fill={ink.orange} /></Svg> : null}</View>;
}
export const ui = StyleSheet.create({
  energy: { flexDirection: 'row', gap: 7, alignItems: 'center', borderWidth: 1, borderColor: '#372C79', borderRadius: 22, backgroundColor: '#15143F', paddingHorizontal: 11, paddingVertical: 8 }, energyLabel: { color: ink.violet, fontSize: 10, fontWeight: '600' }, energyPercent: { color: ink.text, fontSize: 11, fontWeight: '800' }, energyTrack: { height: 5, width: 62, borderRadius: 4, backgroundColor: '#312557', overflow: 'hidden' },
  surface: { borderWidth: 1, borderRadius: 22, padding: 16, gap: 9, shadowColor: '#8861EE', shadowOffset: { width: 0, height: 0 }, shadowOpacity: .12, shadowRadius: 13 },
  buttonGlow: { borderRadius: 24, shadowColor: '#FF922B', shadowOffset: { width: 0, height: 3 }, shadowOpacity: .2, shadowRadius: 14 },
  button: { minHeight: 54, borderRadius: 24, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, buttonText: { fontSize: 17, fontWeight: '800', color: '#241728' },
  board: { position: 'absolute', left: '44%', top: '24%', width: '45%', height: '43%', alignItems: 'center', justifyContent: 'center', padding: 7, gap: 8 }, boardLabel: { color: '#BEB3EC', fontSize: 7, fontWeight: '700', letterSpacing: 1 }, boardText: { fontSize: 21, lineHeight: 27, fontWeight: '800', color: '#F6F5E9', textAlign: 'center' }, chalk: { width: 43, height: 2, backgroundColor: ink.orange, transform: [{ rotate: '-4deg' }] },
  wave: { height: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }, selection: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
