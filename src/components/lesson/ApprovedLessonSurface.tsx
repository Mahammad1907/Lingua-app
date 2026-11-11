import Svg, { Path, Ellipse, Circle } from 'react-native-svg';
import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { lessonPalette as ink } from '../../constants/approvedLessonTheme';
import { LessonIcon as BaseIcon, type LessonIconName } from './LessonSurface';
export { ink };
export function LessonIcon({ name, color = ink.violet, size = 22 }: { name: LessonIconName | 'turtle'; color?: string; size?: number }) { if (name === 'turtle') return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round"><Ellipse cx={10} cy={12} rx={7} ry={5} /><Circle cx={20} cy={11} r={2} /><Path d="m5 16-1 3m10-3 1 3M3 12 1 13m5-5 2-2m4 2 2-2" /></Svg>; return <BaseIcon name={name} color={color} size={size} />; }
export function Surface({ children }: PropsWithChildren<{ accent?: 'violet' | 'orange' | 'mint' }>) { return <View style={s.surface}>{children}</View>; }
export function LessonButton({ label, onPress, disabled = false, tone = 'primary' }: { label: string; onPress: () => void; disabled?: boolean; tone?: 'primary' | 'correct' | 'wrong' }) {
 const color = disabled ? '#DFD2EF' : tone === 'correct' ? ink.mint : tone === 'wrong' ? ink.error : ink.violet;
 return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [s.button, { backgroundColor: color }, pressed && { opacity: .9 }]}><Text style={[s.buttonText, { color: disabled ? '#927DA9' : '#FFF' }]}>{label}</Text></Pressable>;
}
export function SelectionMark({ selected, correct }: { selected: boolean; correct: boolean }) { return <View style={[s.circle, { borderColor: correct ? ink.mint : selected ? ink.violet : ink.border }]}>{correct ? <LessonIcon name="check" color={ink.mint} size={18} /> : selected ? <View style={s.dot} /> : null}</View>; }
const s = StyleSheet.create({ surface: { borderWidth: 1, borderColor: ink.border, borderRadius: 22, padding: 16, gap: 9, backgroundColor: ink.card, shadowColor: '#8861EE', shadowOffset: { width: 0, height: 3 }, shadowOpacity: .08, shadowRadius: 9 }, button: { minHeight: 54, alignItems: 'center', justifyContent: 'center', borderRadius: 27, paddingHorizontal: 20, shadowColor: '#6922BF', shadowOffset: { width: 0, height: 3 }, shadowOpacity: .16, shadowRadius: 7 }, buttonText: { fontSize: 18, fontWeight: '800', textAlign: 'center' }, circle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' }, dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: ink.violet } });
